const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'index2.html', 'index3.html'];

function read(page) {
  return fs.readFileSync(path.join(root, page), 'utf8');
}

function scriptOf(html, page) {
  const match = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
  assert(match, `${page} should include an inline main script before </body>`);
  return match[1];
}

for (const page of pages) {
  const html = read(page);
  const script = scriptOf(html, page);

  new Function(script);

  assert(!/user-scalable=no/.test(html), `${page} should allow mobile zoom`);
  assert(/DATABASE_TIMEOUT_MS/.test(script), `${page} should define database timeout`);
  assert(/AbortController/.test(script), `${page} should use AbortController for timeout`);
  assert(/localStorage\.getItem\(DB_CACHE_KEY\)/.test(script), `${page} should read airport DB cache`);
  assert(/localStorage\.setItem\(DB_CACHE_KEY/.test(script), `${page} should write airport DB cache`);
  assert(/function\s+fetchJsonWithTimeout\s*\(/.test(script), `${page} should provide fetchJsonWithTimeout`);
  assert(/数据来源/.test(html), `${page} should show data source notice`);
}

assert(/typeof echarts === 'undefined'/.test(scriptOf(read('index.html'), 'index.html')), 'index.html should check ECharts');
assert(/typeof echarts === 'undefined'/.test(scriptOf(read('index2.html'), 'index2.html')), 'index2.html should check ECharts');
assert(/window\.SunCalc/.test(scriptOf(read('index3.html'), 'index3.html')), 'index3.html should check SunCalc');

const index2 = read('index2.html');
assert(/id="sourceStatusPanel"/.test(index2), 'index2 should include source status panel');
for (const key of ['hourly', 'ensemble', 'weekly', 'monthly', 'climate']) {
  assert(new RegExp(`data-source-status="${key}"`).test(index2), `index2 should show ${key} source status`);
}

const readme = read('README.md');
assert(/稳定性优化说明/.test(readme), 'README should document stability improvements');
assert(/外部依赖访问要求/.test(readme), 'README should document external dependency requirements');

console.log('site regression checks passed');
