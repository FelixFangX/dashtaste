import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { check, summarize } from '../dist/index.js';
import { extractInPage } from '../dist/extract.js';
import { dashboards } from './data.mjs';
await mkdir('gallery/vendor', { recursive: true });
await copyFile('node_modules/echarts/dist/echarts.min.js', 'gallery/vendor/echarts.min.js');
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  args: ['--allow-file-access-from-files'],
});
const results = [];
try {
  for (const dashboard of dashboards)
    for (const variant of ['before', 'after']) {
      const page = await browser.newPage({
        viewport: { width: dashboard.width, height: dashboard.height },
        deviceScaleFactor: 1,
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
