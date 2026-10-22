import { beforeAll, afterAll, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { copyFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { check, summarize } from '../src/engine.js';
import { extractInPage } from '../src/extract-in-page.js';
import type { Browser } from 'playwright-core';
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
let available = false;
try {
  const { chromium } = await import('playwright-core');
  if (existsSync(executablePath)) {
    const probe = await chromium.launch({ executablePath });
    await probe.close();
    available = true;
  }
} catch {}
let browser: Browser;
beforeAll(async () => {
  if (!available) return;
  execFileSync(process.execPath, ['node_modules/typescript/bin/tsc']);
  await mkdir('gallery/vendor', { recursive: true });
  await copyFile('node_modules/echarts/dist/echarts.min.js', 'gallery/vendor/echarts.min.js');
  const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath, args: ['--allow-file-access-from-files'] });
}, 30000);
afterAll(async () => {
  await browser?.close();
});
for (const name of ['saas', 'finance', 'store', 'live']) {
  for (const variant of ['before', 'after']) {
    it.skipIf(!available)(
      `extracts ${name}/${variant} and checks its score`,
      async () => {
        const page = await browser.newPage({
          viewport: { width: name === 'live' ? 1920 : 1440, height: name === 'live' ? 1080 : 900 },
        });
        try {
          await page.route(/^https?:/, (route) => route.abort());
          await page.goto(pathToFileURL(resolve(`gallery/pages/${name}/${variant}.html`)).href);
          await page.waitForFunction(
            () => (window as unknown as { galleryReady: boolean }).galleryReady,
          );
          const facts = await page.evaluate(extractInPage);
          expect(facts.charts.length).toBeGreaterThan(0);
          const result = summarize(
            check(facts, {
              pack: ['store', 'live'].includes(name) ? 'cn' : 'global',
              mode: ['finance', 'live'].includes(name) ? 'dark' : 'light',
            }),
          );
          if (variant === 'after')
            expect(result).toMatchObject({ score: 100, errors: 0, warnings: 0 });
          else expect(result.score).toBeLessThan(60);
          expect(
            await page.evaluate(
              () =>
                document.documentElement.scrollWidth <= innerWidth &&
                document.documentElement.scrollHeight <= innerHeight,
            ),
          ).toBe(true);
        } finally {
          await page.close();
        }
      },
      30000,
    );
  }
}
