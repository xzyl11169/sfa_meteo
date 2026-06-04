const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const toolPages = ['index1.html', 'index2.html', 'index3.html'];

function read(page) {
  return fs.readFileSync(path.join(root, page), 'utf8');
}

function scriptOf(html, page) {
  const match = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
  assert(match, `${page} should include an inline main script before </body>`);
  return match[1];
}

for (const page of toolPages) {
  const html = read(page);
  const script = scriptOf(html, page);

  new Function(script);

  assert(!/user-scalable=no/.test(html), `${page} should allow mobile zoom`);
  assert(/DATABASE_TIMEOUT_MS/.test(script), `${page} should define database timeout`);
  assert(/AbortController/.test(script), `${page} should use AbortController for timeout`);
  assert(/localStorage\.getItem\(DB_CACHE_KEY\)/.test(script), `${page} should read airport DB cache`);
  assert(/localStorage\.setItem\(DB_CACHE_KEY/.test(script), `${page} should write airport DB cache`);
  assert(/function\s+fetchJsonWithTimeout\s*\(/.test(script), `${page} should provide fetchJsonWithTimeout`);
  assert(!/class="source-note"/.test(html), `${page} should not show the old source note overlay`);
}

const home = read('index.html');
assert(/SF AOC Meteo 气象业务工具站/.test(home), 'homepage should show the site title');
assert(/气象业务工具入口/.test(home), 'homepage should use concise entry heading');
assert(/href="\.\/index1"/.test(home), 'homepage should link to refined forecast page');
assert(/href="\.\/index2"/.test(home), 'homepage should link to multi-scale forecast page');
assert(/href="\.\/index3"/.test(home), 'homepage should link to sunlight page');
assert(/tool-tile/.test(home), 'homepage should use tile entry layout');
assert(!/<script[\s>]/.test(home), 'homepage should stay lightweight without business scripts');
assert(!/GitHub Pages 静态部署|Open-Meteo 数据源|机场库缓存兜底/.test(home), 'homepage should not show deployment/source status pills');

assert(/typeof echarts === 'undefined'/.test(scriptOf(read('index1.html'), 'index1.html')), 'index1.html should check ECharts');
assert(/typeof echarts === 'undefined'/.test(scriptOf(read('index2.html'), 'index2.html')), 'index2.html should check ECharts');
assert(/window\.SunCalc/.test(scriptOf(read('index3.html'), 'index3.html')), 'index3.html should check SunCalc');

const index3 = read('index3.html');
assert(index3.indexOf('id="calendarRoot"') < index3.indexOf('class="info-panels"'), 'index3 should place explanation panels below the calendar');
assert(/算法与来源/.test(index3), 'index3 should merge algorithm and source explanation');
assert(!/sourceInfoPanel/.test(index3), 'index3 should not show a separate source panel');
assert(!/数据来源：Open-Meteo \/ mwgg Airports \/ ECharts/.test(read('index1.html') + read('index2.html') + index3), 'tool pages should not show the old source note text');

const index2 = read('index2.html');
assert(!/id="sourceStatusPanel"/.test(index2), 'index2 should not show source status chips');
assert(!/data-source-status/.test(index2), 'index2 should not render per-source status chips');

const readme = read('README.md');
assert(/稳定性优化说明/.test(readme), 'README should document stability improvements');
assert(/外部依赖访问要求/.test(readme), 'README should document external dependency requirements');
assert(/index1/.test(readme), 'README should document the refined forecast page path');

console.log('site regression checks passed');
