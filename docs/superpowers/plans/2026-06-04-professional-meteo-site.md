# Professional Meteo Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the three static weather tools into a cohesive professional meteorological operations site while preserving GitHub Pages paths and the no-build static HTML architecture.

**Architecture:** Keep the current `index.html`, `index2.html`, and `index3.html` standalone. Add consistent in-page navigation, professional page positioning, unified disclaimer/source language, and static regression assertions without introducing shared external JS/CSS files in phase one.

**Tech Stack:** Static HTML/CSS/JavaScript, Apache ECharts, SunCalc, Open-Meteo APIs, mwgg/Airports JSON, Node.js regression script.

---

## File Structure

- Modify `tests/site-regression.test.js`: add static assertions for professional navigation, unified disclaimer, page roles, and public path preservation.
- Modify `index.html`: upgrade the homepage into a professional refined airport forecast workbench with site navigation, page role, unified disclaimer, and cross-tool links.
- Modify `index2.html`: upgrade page positioning to multi-scale trend analysis, keep the five-source status panel, and add concise business interpretation.
- Modify `index3.html`: add the same site navigation and professional positioning while preserving algorithm/update/source panels.
- Modify `README.md`: document the professional site positioning and phase-one static architecture.

No new build step, framework, backend, login, or required public route will be added.

## Task 1: Regression Coverage For Professional Site Requirements

**Files:**
- Modify: `tests/site-regression.test.js`

- [ ] **Step 1: Add failing assertions for professional site structure**

Add these constants after `const pages = ['index.html', 'index2.html', 'index3.html'];`:

```js
const unifiedDisclaimer = '仅供气象值班、趋势研判和运行参考';
const siteBrand = 'SF AOC METEO';
const pageRoles = {
  'index.html': '精细化机场预报工作台',
  'index2.html': '多尺度趋势研判',
  'index3.html': '机场日照与昼夜节律参考',
};
```

Inside the existing `for (const page of pages)` loop, after the current `assert(/数据来源/.test(html)` line, add:

```js
  assert(html.includes(siteBrand), `${page} should show the unified site brand`);
  assert(html.includes(pageRoles[page]), `${page} should show its professional page role`);
  assert(html.includes(unifiedDisclaimer), `${page} should show the unified professional disclaimer`);
  assert(/data-site-nav/.test(html), `${page} should include professional site navigation`);
```

After the loop, add:

```js
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
```

- [ ] **Step 2: Run regression test to verify it fails**

Run:

```bash
node tests/site-regression.test.js
```

Expected: FAIL on `index.html should show the unified site brand` or another newly added professional-site assertion.

- [ ] **Step 3: Commit only if the failing test is confirmed**

Do not commit yet. Keep the failing test as the guard for the following implementation tasks.

## Task 2: Upgrade Homepage Into Refined Airport Forecast Workbench

**Files:**
- Modify: `index.html`
- Test: `tests/site-regression.test.js`

- [ ] **Step 1: Add professional navigation CSS**

In the `<style>` block, after the existing `.navbar` block and before `.brand`, add:

```css
        .site-nav {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 10px;
            background: rgba(15, 23, 42, 0.92);
            border-right: 1px solid #334155;
            border-radius: 6px;
            white-space: nowrap;
        }
        .site-nav-label {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .08em;
            color: #e2e8f0;
        }
        .site-nav-link {
            color: #94a3b8;
            font-size: 12px;
            text-decoration: none;
            padding: 5px 8px;
            border-radius: 5px;
            border: 1px solid transparent;
        }
        .site-nav-link:hover {
            color: #f8fafc;
            background: rgba(51, 65, 85, 0.78);
        }
        .site-nav-link.active {
            color: #38bdf8;
            border-color: rgba(56, 189, 248, 0.35);
            background: rgba(14, 165, 233, 0.12);
        }
        .page-role {
            font-size: 12px;
            color: #cbd5e1;
            margin-left: 10px;
            padding-left: 10px;
            border-left: 1px solid #334155;
        }
        .ops-note {
            position: absolute;
            top: 44px;
            left: 18px;
            z-index: 10;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            max-width: calc(100vw - 36px);
        }
        .ops-pill {
            background: rgba(15, 23, 42, 0.82);
            border: 1px solid rgba(148, 163, 184, 0.28);
            color: #cbd5e1;
            border-radius: 6px;
            padding: 7px 10px;
            font-size: 12px;
            line-height: 1.4;
        }
        .ops-pill strong { color: #f8fafc; }
        .ops-pill a { color: #38bdf8; text-decoration: none; }
        .ops-pill a:hover { text-decoration: underline; }
```

Inside the existing mobile media query, add:

```css
            .site-nav { width: 100%; overflow-x: auto; }
            .ops-note { position: static; padding: 8px 10px 0; background: #020617; }
```

- [ ] **Step 2: Replace the navbar opening content**

Inside `<div class="navbar">`, insert the site navigation before the existing `<div class="brand">`:

```html
        <nav class="site-nav" data-site-nav aria-label="SF AOC METEO 专业工具导航">
            <span class="site-nav-label">SF AOC METEO</span>
            <a class="site-nav-link active" href="./">精细化预报</a>
            <a class="site-nav-link" href="./index2">多尺度研判</a>
            <a class="site-nav-link" href="./index3">日照参考</a>
        </nav>
```

Then change the brand text block to:

```html
            <span>精细化机场预报工作台</span>
            <span class="brand-tag">0-7D ECMWF</span>
            <span class="page-role">逐小时要素 · 值班参考</span>
            <span class="disclaimer">本工具基于公开数值预报、机场基础资料和理论计算结果生成，仅供气象值班、趋势研判和运行参考，不作为放行、签派或运行标准的唯一依据。</span>
```

- [ ] **Step 3: Add concise cross-tool operation notes**

Inside `<div class="main-view">`, before the existing `.source-note`, add:

```html
        <div class="ops-note" aria-label="专业气象工具入口">
            <div class="ops-pill"><strong>短期值班：</strong>查看未来 7 天逐小时温度、风、云量、降水和气压。</div>
            <div class="ops-pill"><strong>趋势补充：</strong><a href="./index2">进入多尺度研判</a> 查看集合、延伸期、季节和气候参考。</div>
            <div class="ops-pill"><strong>日照参考：</strong><a href="./index3">进入日照工具</a> 查看机场当地日出日落和昼长变化。</div>
        </div>
```

- [ ] **Step 4: Run regression test**

Run:

```bash
node tests/site-regression.test.js
```

Expected: still FAIL for `index2.html` or `index3.html` professional-site assertions, while `index.html` assertions pass.

## Task 3: Upgrade Multi-Scale Forecast Page Positioning

**Files:**
- Modify: `index2.html`
- Test: `tests/site-regression.test.js`

- [ ] **Step 1: Add professional navigation and interpretation CSS**

In the `<style>` block, after the existing `.navbar` block and before `.brand`, add the same `.site-nav`, `.site-nav-label`, `.site-nav-link`, `.site-nav-link:hover`, `.site-nav-link.active`, and `.page-role` CSS from Task 2.

After the existing `.source-status-panel` CSS, add:

```css
        .scale-guide {
            position: absolute;
            top: 82px;
            left: 12px;
            right: 12px;
            z-index: 9;
            display: grid;
            grid-template-columns: repeat(5, minmax(120px, 1fr));
            gap: 8px;
            pointer-events: none;
        }
        .scale-guide-item {
            background: rgba(15, 23, 42, 0.72);
            border: 1px solid rgba(148, 163, 184, 0.24);
            border-radius: 6px;
            padding: 7px 9px;
            color: #cbd5e1;
            font-size: 11px;
            line-height: 1.35;
        }
        .scale-guide-item strong {
            display: block;
            color: #f8fafc;
            font-size: 12px;
            margin-bottom: 2px;
        }
```

Inside the existing mobile media query, add:

```css
            .site-nav { width: 100%; overflow-x: auto; }
            .scale-guide { position: static; grid-template-columns: 1fr; padding: 8px 10px 0; background: #020617; }
```

- [ ] **Step 2: Insert unified navigation and role text**

Inside `<div class="navbar">`, insert this before the existing `<div class="brand">`:

```html
        <nav class="site-nav" data-site-nav aria-label="SF AOC METEO 专业工具导航">
            <span class="site-nav-label">SF AOC METEO</span>
            <a class="site-nav-link" href="./">精细化预报</a>
            <a class="site-nav-link active" href="./index2">多尺度研判</a>
            <a class="site-nav-link" href="./index3">日照参考</a>
        </nav>
```

Change the brand text block to:

```html
            <span>多尺度趋势研判</span>
            <span class="brand-tag">METEO</span>
            <span class="page-role">0-7D / 15D / 45D / 6M / Climate</span>
            <span class="disclaimer">本工具基于公开数值预报、机场基础资料和理论计算结果生成，仅供气象值班、趋势研判和运行参考，不作为放行、签派或运行标准的唯一依据。</span>
```

- [ ] **Step 3: Add scale interpretation panel**

Inside `<div class="main-view">`, after the existing `sourceStatusPanel` block and before `.source-note`, add:

```html
        <div class="scale-guide" aria-label="多尺度产品适用范围">
            <div class="scale-guide-item"><strong>精细化</strong>0-7 天逐小时要素，适合短期值班查看。</div>
            <div class="scale-guide-item"><strong>集合</strong>0-15 天不确定性，适合趋势和风险范围判断。</div>
            <div class="scale-guide-item"><strong>延伸期</strong>15-45 天背景趋势，只作中期形势参考。</div>
            <div class="scale-guide-item"><strong>季节</strong>1-6 个月距平趋势，不直接用于单日运行判断。</div>
            <div class="scale-guide-item"><strong>气候</strong>历史与未来气候背景，适合对比和长期参考。</div>
        </div>
```

- [ ] **Step 4: Run regression test**

Run:

```bash
node tests/site-regression.test.js
```

Expected: still FAIL for `index3.html` professional-site assertions, while `index.html` and `index2.html` professional assertions pass.

## Task 4: Upgrade Sunlight Reference Page Positioning

**Files:**
- Modify: `index3.html`
- Test: `tests/site-regression.test.js`

- [ ] **Step 1: Add professional navigation CSS**

In the `<style>` block, before `.toolbar-header`, add:

```css
        .site-nav {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            white-space: nowrap;
        }
        .site-nav-label {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .08em;
            color: #0f172a;
        }
        .site-nav-link {
            color: #64748b;
            font-size: 12px;
            text-decoration: none;
            padding: 5px 8px;
            border-radius: 5px;
            border: 1px solid transparent;
        }
        .site-nav-link:hover {
            color: #0f172a;
            background: #e2e8f0;
        }
        .site-nav-link.active {
            color: #0369a1;
            border-color: #bae6fd;
            background: #e0f2fe;
        }
        .page-role {
            font-size: 12px;
            color: #64748b;
            display: block;
            margin-top: 2px;
        }
```

Inside the existing max-width `768px` media query, add:

```css
            .site-nav { width: 100%; overflow-x: auto; }
```

- [ ] **Step 2: Insert unified navigation**

Inside `<header class="toolbar-header">`, insert this as the first child:

```html
        <nav class="site-nav" data-site-nav aria-label="SF AOC METEO 专业工具导航">
            <span class="site-nav-label">SF AOC METEO</span>
            <a class="site-nav-link" href="./">精细化预报</a>
            <a class="site-nav-link" href="./index2">多尺度研判</a>
            <a class="site-nav-link active" href="./index3">日照参考</a>
        </nav>
```

Change the left title block to include the page role:

```html
            <h1>机场日照与昼夜节律参考</h1>
            <span id="dbStatusBadge" class="status-badge">连接数据库...</span>
            <span class="page-role">UTC/LT · 日出日落 · 昼长变化</span>
```

- [ ] **Step 3: Add unified disclaimer to the info banner**

Inside `<div class="info-sub">`, after the existing `bannerMethod` span, add:

```html
            <span class="method-note">本工具基于公开数值预报、机场基础资料和理论计算结果生成，仅供气象值班、趋势研判和运行参考，不作为放行、签派或运行标准的唯一依据。</span>
```

- [ ] **Step 4: Run regression test**

Run:

```bash
node tests/site-regression.test.js
```

Expected: PASS with `site regression checks passed`.

## Task 5: README And Verification

**Files:**
- Modify: `README.md`
- Test: `tests/site-regression.test.js`

- [ ] **Step 1: Update README positioning**

After the online access list, add:

```markdown
## 专业网站定位

本项目第一阶段按“专业静态气象工具站”改造，面向机场气象值班、趋势研判和运行参考。三个公开入口保持不变：

- `/`：精细化机场预报工作台。
- `/index2`：多尺度趋势研判。
- `/index3`：机场日照与昼夜节律参考。

站点保持纯静态 GitHub Pages 架构，不引入后台、账号系统或构建工具。
```

Update the three headings in “功能概览” to match:

```markdown
### `index.html` 精细化机场预报工作台
### `index2.html` 多尺度趋势研判
### `index3.html` 机场日照与昼夜节律参考
```

Add this bullet to “维护说明”:

```markdown
- 第一阶段专业化改造规格见 `docs/professional-meteo-site-design.md`。
```

- [ ] **Step 2: Add README regression assertions**

In `tests/site-regression.test.js`, after the existing README assertions, add:

```js
assert(/专业网站定位/.test(readme), 'README should document professional site positioning');
assert(/专业静态气象工具站/.test(readme), 'README should describe the static professional site architecture');
assert(/docs\/professional-meteo-site-design\.md/.test(readme), 'README should link the professional site design spec');
```

- [ ] **Step 3: Run full static regression**

Run:

```bash
node tests/site-regression.test.js
```

Expected: PASS with `site regression checks passed`.

- [ ] **Step 4: Run whitespace check**

Run:

```bash
git diff --check
```

Expected: no output and exit code 0.

- [ ] **Step 5: Inspect final diff**

Run:

```bash
git diff --stat
git status --short --branch
```

Expected: modified `README.md`, `index.html`, `index2.html`, `index3.html`, and `tests/site-regression.test.js`; docs spec and this plan are already committed or staged according to execution progress.

## Task 6: Commit And Publish

**Files:**
- Modify: `README.md`
- Modify: `index.html`
- Modify: `index2.html`
- Modify: `index3.html`
- Modify: `tests/site-regression.test.js`
- Create: `docs/superpowers/plans/2026-06-04-professional-meteo-site.md`

- [ ] **Step 1: Commit implementation changes**

Run:

```bash
git add README.md index.html index2.html index3.html tests/site-regression.test.js docs/superpowers/plans/2026-06-04-professional-meteo-site.md
git commit -m "Upgrade static pages into professional meteo site"
```

Expected: commit succeeds.

- [ ] **Step 2: Verify clean branch status**

Run:

```bash
git status --short --branch
```

Expected: branch is ahead of `origin/main` with no uncommitted changes.

- [ ] **Step 3: Push to GitHub**

Run:

```bash
git push origin main
```

Expected: push updates `main`.

- [ ] **Step 4: Report verification evidence**

Final report should include:

- latest commit hash,
- regression command output,
- whitespace check result,
- push status,
- note that GitHub Pages may need several minutes to refresh.

## Self-Review

- Spec coverage: Tasks cover professional navigation, three page roles, unified disclaimer, data source preservation, README documentation, regression tests, and publication.
- Placeholder scan: no `TBD`, `TODO`, or unresolved implementation placeholders remain.
- Scope check: plan preserves static HTML architecture and does not introduce backend, login, build tools, or route changes.
