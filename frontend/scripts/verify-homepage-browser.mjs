import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.HOME_TEST_ORIGIN || 'http://127.0.0.1:8080';
const api = process.env.HOME_TEST_API || 'http://127.0.0.1:8000';
const output = process.env.HOME_TEST_OUTPUT || '/tmp/dca-homepage-verification';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const page = await browser.newPage();
const evidence = { api: {}, viewports: [], navigation: [], errors: [] };
page.on('pageerror', error => evidence.errors.push(error.message));
const check = (ok, message) => { if (!ok) throw new Error(message); };
try {
  for (const path of ['/api/academics/programs/', '/api/core/prototypes/', '/api/research/projects/', '/api/communications/news/', '/api/core/site-settings/']) {
    const response = await page.request.get(api + path);
    check(response.ok(), `API failed: ${path}`);
    evidence.api[path] = await response.json();
  }
  await page.goto(origin);
  await page.locator('.home-page .home-contact-details a').waitFor();
  const student = evidence.api['/api/core/prototypes/'].find(item => item.kind === 'SENSING') || evidence.api['/api/core/prototypes/'][0];
  const research = evidence.api['/api/research/projects/'].find(item => item.slug === 'aphids-detection' && item.plain_language_summary?.trim()) || evidence.api['/api/research/projects/'].find(item => item.plain_language_summary?.trim());
  if (student) await page.getByRole('heading', { name: student.title, exact: true }).waitFor();
  if (research) await page.getByRole('heading', { name: research.title, exact: true }).waitFor();
  check(await page.locator('.home-page > section').count() === 7, 'Seven sections missing');
  check(await page.locator('main h1').count() === 1, 'Expected one primary H1');
  check(await page.locator('.home-page article').count() <= 3, 'News exceeds three posts');
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => {
      const closed = document.documentElement.scrollWidth;
      document.querySelectorAll('.home-page details').forEach(item => item.open = true);
      const expanded = document.documentElement.scrollWidth;
      return { width: innerWidth, closed, expanded, sections: Array.from(document.querySelectorAll('.home-page > section')).map(s => s.querySelector('h1,h2').textContent) };
    });
    check(layout.closed <= width && layout.expanded <= width, `Horizontal overflow at ${width}`);
    if (process.env.AXE_SOURCE) {
      await page.addScriptTag({ content: readFileSync(process.env.AXE_SOURCE, 'utf8') });
      layout.accessibility = await page.evaluate(async () => {
        const result = await window.axe.run('.home-page', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return { violations: result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), incomplete: result.incomplete.map(v => v.id) };
      });
      check(layout.accessibility.violations.length === 0, `Accessibility violations at ${width}: ${JSON.stringify(layout.accessibility)}`);
    }
    await page.screenshot({ path: `${output}/home-${width}-opening.png` });
    await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
    await page.locator('.home-page details').evaluateAll(items => items.forEach(item => item.open = false));
    evidence.viewports.push(layout);
  }
  const summary = page.locator('.home-page summary');
  await summary.focus();
  await page.keyboard.press('Space');
  check(await page.locator('.home-page details').evaluate(el => el.open), 'Keyboard disclosure did not expand');
  evidence.focus = await summary.evaluate(el => ({ style: getComputedStyle(el).outlineStyle, width: getComputedStyle(el).outlineWidth }));
  check(evidence.focus.style !== 'none' && evidence.focus.width !== '0px', 'Focus indicator missing');
  const links = await page.locator('.home-page a[href^="/"]').evaluateAll(items => [...new Set(items.map(a => a.getAttribute('href')))]);
  for (const href of links) {
    await page.goto(origin + href);
    await page.locator('main h1').waitFor();
    check(!(await page.locator('main h1').textContent()).includes('not found'), `Missing route ${href}`);
    if (href.includes('#')) {
      await page.locator(`[id="${href.split('#')[1]}"]`).waitFor();
    }
    evidence.navigation.push(href);
  }
  check(!evidence.errors.length, `Browser errors: ${evidence.errors.join('; ')}`);
  // Store counts and selected evidence, not complete institutional records.
  evidence.api = Object.fromEntries(Object.entries(evidence.api).map(([path, data]) => [path, Array.isArray(data) ? { publishedRecords: data.length } : { loaded: true }]));
  writeFileSync(`${output}/results.json`, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally { await browser.close(); }
