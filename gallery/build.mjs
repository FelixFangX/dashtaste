import { copyFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { check, summarize } from '../dist/index.js';
import { extractInPage } from '../dist/extract.js';
import { copyFonts } from './fonts.mjs';
import { dashboards } from './data.mjs';
await mkdir('gallery/vendor', { recursive: true });
await copyFile('node_modules/echarts/dist/echarts.min.js', 'gallery/vendor/echarts.min.js');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--allow-file-access-from-files'],
});
const results = [];
async function verifyLayout(page, name) {
  const issues = await page.evaluate((name) => {
    const issues = [],
      texts = [];
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode,
        el = node.parentElement;
      if (!node.textContent.trim() || el.closest('script,style') || !el.getClientRects().length)
        continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const box of range.getClientRects())
        texts.push({ el, box, text: node.textContent.trim() });
      if (
        name === 'live' &&
        /[\u3400-\u9fff]/.test(node.textContent) &&
        parseFloat(getComputedStyle(el).fontSize) < 16
      )
        issues.push('CJK below 16px: ' + node.textContent);
    }
    const overlap = (a, b) =>
      Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
    for (const row of document.querySelectorAll('[data-kpi-row], [data-kpi]')) {
      const own = texts.filter((t) => row.contains(t.el));
      for (let i = 0; i < own.length; i++)
        for (let j = i + 1; j < own.length; j++)
          if (overlap(own[i].box, own[j].box))
            issues.push('KPI overlap: ' + own[i].text + ' / ' + own[j].text);
    }
    for (const el of document.querySelectorAll('main *')) {
      const style = getComputedStyle(el),
        b = el.getBoundingClientRect();
      for (const edge of ['Top', 'Bottom'])
        if (parseFloat(style['border' + edge + 'Width']) > 0) {
          const y = edge === 'Top' ? b.top : b.bottom;
          for (const t of texts)
            if (
              t.box.left < b.right &&
              t.box.right > b.left &&
              t.box.top < y - 0.5 &&
              t.box.bottom > y + 0.5
            )
              issues.push('Text crosses divider: ' + t.text);
        }
    }
    for (const row of document.querySelectorAll('.rail-row')) {
      const b = row.getBoundingClientRect();
      for (const t of texts)
        if (
          t.box.left < b.right &&
          t.box.right > b.left &&
          t.box.top < b.bottom + 6 &&
          t.box.bottom > b.bottom - 6
        )
          issues.push('Text within 6px of row divider: ' + t.text);
    }
    if (name === 'live') {
      for (const el of document.querySelectorAll('[_echarts_instance_]')) {
        const c = echarts.getInstanceByDom(el);
        for (const item of c.getZr().storage.getDisplayList())
          if (item.type === 'text' || item.type === 'tspan') {
            const text = item.style.text || '',
              font = item.style.font || '';
            const size = item.style.fontSize || Number(font.match(/([\d.]+)px/)?.[1]);
            if (/[\u3400-\u9fff]/.test(text) && size < 16)
              issues.push('Canvas CJK below 16px: ' + text);
          }
      }
      if (parseFloat(getComputedStyle(document.querySelector('.hero')).fontSize) < 112)
        issues.push('Live hero below 112px');
      const c = echarts.getInstanceByDom(document.getElementById('cumulative'));
      if (c.getModel().getComponent('grid').coordinateSystem.getRect().height < 300)
        issues.push('Cumulative plot below 300px');
    }
    return [...new Set(issues)];
  }, name);
  if (issues.length) throw new Error(name + ': ' + issues.join('\n'));
}
await copyFonts();
try {
  for (const dashboard of dashboards)
    for (const variant of ['before', 'after']) {
      const page = await browser.newPage({
        viewport: { width: dashboard.width, height: dashboard.height },
        deviceScaleFactor: 2,
      });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route(/^https?:/, (route) => route.abort());
      await page.goto(
        pathToFileURL(resolve(`gallery/pages/${dashboard.name}/${variant}.html`)).href,
      );
      await page.waitForFunction(() => window.galleryReady === true);
      await page.waitForTimeout(100);
      if (errors.length) throw new Error(errors.join('\n'));
      if (variant === 'after') await verifyLayout(page, dashboard.name);
      const facts = await page.evaluate(extractInPage);
      if (!facts.charts.length) throw new Error('No charts rendered');
      const findings = check(facts, dashboard);
      const result = {
        page: dashboard.name,
        variant,
        pack: dashboard.pack,
        mode: dashboard.mode,
        ...summarize(findings),
        ruleIds: [...new Set(findings.map((f) => f.ruleId))],
      };
      results.push(result);
      await page.screenshot({ path: `gallery/${dashboard.name}-${variant}.png` });
      const overflow = await page.evaluate(() => ({
        x: document.documentElement.scrollWidth > innerWidth,
        y: document.documentElement.scrollHeight > innerHeight,
      }));
      if (overflow.x || overflow.y)
        throw new Error(`${dashboard.name}/${variant} overflows: ${JSON.stringify(overflow)}`);
      if (variant === 'after' && result.score !== 100) console.error(dashboard.name, findings);
      await page.close();
    }
  await mkdir('gallery/compare', { recursive: true });
  for (const d of dashboards) {
    const { readFile } = await import('node:fs/promises');
    const shots = await Promise.all(
      ['before', 'after'].map(async (v) =>
        (await readFile(`gallery/${d.name}-${v}.png`)).toString('base64'),
      ),
    );
    for (const format of ['wide', 'tall']) {
      const wide = format === 'wide',
        width = wide ? 1600 : 1080;
      const boardWidth = wide ? (width - 48 - 16) / 2 : width - 48;
      const height = wide ? Math.ceil(48 + 26 + (boardWidth * d.height) / d.width) : 1440;
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
      await page.setContent(
        `<style>*{box-sizing:border-box}body{margin:0;background:${d.name === 'live' ? '#0B0B0C' : '#EDEDEA'};font:12px sans-serif;color:${d.name === 'live' ? '#959590' : '#636261'}}main{display:flex;flex-direction:${wide ? 'row' : 'column'};gap:16px;padding:24px}section{width:${boardWidth}px}p{margin:0 0 12px;line-height:14px}img{width:100%;display:block}</style><main>${shots.map((s, i) => `<section><p>${i ? 'dashtaste ' + d.pack : 'Default'}</p><img src="data:image/png;base64,${s}"></section>`).join('')}</main>`,
      );
      await page.screenshot({ path: `gallery/compare/${d.name}-${format}.png` });
      await page.close();
    }
    await rm(`gallery/compare/${d.name}.png`, { force: true });
  }
} finally {
  await browser.close();
}
await writeFile('gallery/results.json', JSON.stringify(results, null, 2) + '\n');
console.table(
  results.map(({ page, variant, score, errors, warnings }) => ({
    page,
    variant,
    score,
    errors,
    warnings,
  })),
);
if (results.some((r) => (r.variant === 'after' ? r.score !== 100 : r.score >= 60)))
  process.exitCode = 1;

for (const id of ['DT009', 'DT024', 'DT025', 'DT026', 'DT027', 'DT028']) {
  if (!results.some((r) => r.variant === 'before' && r.ruleIds.includes(id)))
    throw new Error(`${id} needs a failing default example`);
  if (results.some((r) => r.variant === 'after' && r.ruleIds.includes(id)))
    throw new Error(`${id} flags a redesigned board`);
}
