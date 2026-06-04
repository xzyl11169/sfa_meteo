const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'index2.html', 'index3.html'];
const unifiedDisclaimer = '仅供气象值班、趋势研判和运行参考';
const siteBrand = 'SF AOC METEO';
const pageRoles = {
  'index.html': '精细化机场预报工作台',
  'index2.html': '多尺度趋势研判',
  'index3.html': '机场日照与昼夜节律参考',
};

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
  assert(html.includes(siteBrand), `${page} should show the unified site brand`);
  assert(html.includes(pageRoles[page]), `${page} should show its professional page role`);
  assert(html.includes(unifiedDisclaimer), `${page} should show the unified professional disclaimer`);
  assert(/data-site-nav/.test(html), `${page} should include professional site navigation`);
}

const navTargets = {
  'index.html': ['href="./"', 'href="./index2"', 'href="./index3"'],
  'index2.html': ['href="./"', 'href="./index2"', 'href="./index3"'],
  'index3.html': ['href="./"', 'href="./index2"', 'href="./index3"'],
};

for (const [page, targets] of Object.entries(navTargets)) {
  const html = read(page);
  for (const target of targets) {
    assert(html.includes(target), `${page} should keep public navigation target ${target}`);
  }
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
assert(/专业网站定位/.test(readme), 'README should document professional site positioning');
assert(/专业静态气象工具站/.test(readme), 'README should describe the static professional site architecture');
assert(/docs\/professional-meteo-site-design\.md/.test(readme), 'README should link the professional site design spec');

console.log('site regression checks passed');
