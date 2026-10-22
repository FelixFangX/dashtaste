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
      if (c.getModel().getComponent('grid').coordinateSystem.getRect().height < 320)
        issues.push('Cumulative plot below 320px');
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
      const height = wide ? 900 : 1440;
      const margin = 24,
        gap = 16,
        caption = 30;
      // Use source CSS pixels; screenshots contain two device pixels per CSS pixel.
      const beforeWidth = wide ? 592 : 1032;
      const beforeHeight = (beforeWidth * d.height) / d.width;
      const afterWidth = wide ? 920 : 1032;
      const scale = wide ? 0.9 : afterWidth / 1280;
      const cropWidth = afterWidth / scale;
      const cropHeight = wide
        ? (height - 2 * margin - caption) / scale
        : (height - 2 * margin - 2 * caption - gap - beforeHeight) / scale;
      const afterHeight = cropHeight * scale;
      const bottomBand =
        height -
        (margin +
          caption +
          (wide
            ? Math.max(beforeHeight, afterHeight)
            : beforeHeight + gap + caption + afterHeight));
      if (wide && scale < 0.85) throw new Error('After crop scale below 0.85');
      if (bottomBand > 40 || bottomBand < 0)
        throw new Error('Invalid comparison bottom band: ' + bottomBand);
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
      let afterShot = shots[1];
      {
        const focus = await browser.newPage({
          viewport: { width: Math.ceil(cropWidth), height: Math.ceil(cropHeight) },
          deviceScaleFactor: 2,
        });
        await focus.goto(pathToFileURL(resolve(`gallery/pages/${d.name}/after.html`)).href);
        await focus.waitForFunction(() => window.galleryReady === true);
        await focus.addStyleTag({
          content: `main{margin:16px!important;padding:12px!important;height:auto!important}header{margin-bottom:12px!important}.top{display:block!important}.top>aside,.bottom,.strip,main>section{display:none!important}.hero-band{gap:12px}.pace{width:280px}.top>section{height:auto!important}body[data-dashboard=store] .bottom{display:block!important;border:0;margin:8px 0!important;padding:0!important}body[data-dashboard=store] .bottom>section:first-child{display:none!important}body[data-dashboard=store] .bottom>.rail{border:0;padding:0}body[data-dashboard=store] .calendar>div{height:34px}.bridge>div,.bridge h2,label{font-size:12px!important}.ruler{max-width:460px}`,
        });
        await focus.evaluate((name) => {
          const id = { saas: 'mrr', finance: 'cash', store: 'sales', live: 'cumulative' }[name];
          const el = document.getElementById(id);
          el.style.height = { saas: 460, finance: 360, store: 300, live: 550 }[name] + 'px';
          const last =
            name === 'store'
              ? document.querySelector('.calendar')
              : name === 'finance'
                ? document.getElementById('burn')
                : el;
          const bottom = last.getBoundingClientRect().bottom;
          el.style.height = parseFloat(el.style.height) + innerHeight - bottom + 'px';
          if (innerHeight - last.getBoundingClientRect().bottom > 40)
            throw new Error('Focused crop bottom band exceeds 40px');
          for (const node of document.querySelectorAll('[_echarts_instance_]'))
            echarts.getInstanceByDom(node).resize();
        }, d.name);
        // Rebuild event leaders after chart resize; pixel graphics follow the new coordinates.
        await focus.evaluate((name) => {
          const id = { saas: 'mrr', finance: 'cash', store: 'sales', live: 'cumulative' }[name];
          const c = echarts.getInstanceByDom(document.getElementById(id));
          const index = { saas: 9, finance: 5, store: 8, live: 1 }[name];
          let previousY = -Infinity;
          c.getOption().series.forEach((item, i) => {
            if (item.type !== 'line' || !item.name) return;
            const [x, y] = c.convertToPixel({ gridIndex: 0 }, [
              item.data.length - 1,
              item.data.at(-1),
            ]);
            const labelY =
              Math.abs(y - previousY) < 24 ? previousY + (y < previousY ? -24 : 24) : y;
            previousY = labelY;
            c.setOption({
              graphic: [
                { id: 'leader-' + i, shape: { x1: x + 5, y1: y, x2: x + 22, y2: labelY } },
                { id: 'annotation-' + i, x: x + 28, y: labelY },
              ],
            });
          });
          const value = c.getOption().series[0].data[index];
          const [x, y] = c.convertToPixel({ gridIndex: 0 }, [index, value]);
          const dy = name === 'finance' ? 80 : name === 'saas' ? -65 : -35;
          const dx = name === 'saas' ? -100 : 32;
          c.setOption({
            graphic: [
              { id: 'event-dot', shape: { cx: x, cy: y } },
              {
                id: 'event-leader',
                shape: {
                  points: [
                    [x, y],
                    [x + dx, y + dy],
                    [x + dx + 16, y + dy],
                  ],
                },
              },
              { id: 'event-label', x: x + dx + 20, y: y + dy },
            ],
          });
        }, d.name);
        afterShot = (await focus.screenshot()).toString('base64');
        await focus.close();
      }
      await page.setContent(
        `<style>*{box-sizing:border-box}body{margin:0;background:${d.name === 'live' ? '#0B0B0C' : '#EDEDEA'};font:14px sans-serif;color:${d.name === 'live' ? '#959590' : '#636261'}}main{display:flex;flex-direction:${wide ? 'row' : 'column'};gap:${gap}px;padding:${margin}px}section{flex-shrink:0}p{margin:0;height:${caption}px;line-height:18px}.crop{overflow:hidden;position:relative}img{display:block;max-width:none}</style><main><section style="width:${beforeWidth}px"><p>Default</p><img style="width:${beforeWidth}px;height:${beforeHeight}px" src="data:image/png;base64,${shots[0]}"></section><section style="width:${afterWidth}px"><p>dashtaste ${d.pack}</p><div class="crop" data-scale="${scale}" style="width:${afterWidth}px;height:${afterHeight}px"><img style="width:${Math.ceil(cropWidth) * scale}px;height:${Math.ceil(cropHeight) * scale}px" src="data:image/png;base64,${afterShot}"></div></section></main>`,
      );
      await page
        .locator('img')
        .last()
        .evaluate(async (img) => {
          if (!img.complete) await new Promise((resolve) => (img.onload = resolve));
        });
      const measured = await page.evaluate(() => {
        const crop = document.querySelector('.crop'),
          img = crop.querySelector('img');
        return {
          scale: img.getBoundingClientRect().width / (img.naturalWidth / 2),
          bottom: innerHeight - crop.getBoundingClientRect().bottom,
        };
      });
      if (wide && measured.scale < 0.85) throw new Error('Measured comparison scale below 0.85');
      if (measured.bottom > 40) throw new Error('Measured comparison bottom band exceeds 40px');
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
