import { beforeAll, afterAll, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { copyFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { copyFonts } from '../gallery/fonts.mjs';
import { check, summarize } from '../src/engine.js';
import { extractInPage } from '../src/extract-in-page.js';
import type { Browser } from 'playwright-core';
// @ts-expect-error Gallery fixtures are native browser modules.
import { data } from '../gallery/data.mjs';
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
  await copyFonts();
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
          if (variant === 'after') {
            expect(result).toMatchObject({ score: 100, errors: 0, warnings: 0 });
            const observed = await page.evaluate(
              ({ name, d }) => {
                const sum = (a: number[]) => a.reduce((a, b) => a + b, 0);
                const expected =
                  name === 'store'
                    ? sum(d.revenue)
                    : name === 'finance'
                      ? d.cash.at(-1)
                      : d.revenue.at(-1);
                const hero = document.querySelector('.hero')!.textContent;
                const cn = name === 'store' || name === 'live';
                const formatted =
                  (cn ? '¥' : '$') +
                  (cn
                    ? (expected / 10000).toFixed(1) + '万'
                    : expected >= 1e6
                      ? (expected / 1e6).toFixed(2) + 'M'
                      : (expected / 1000).toFixed(1) + 'K');
                const values =
                  name === 'saas'
                    ? d.plans
                    : name === 'finance'
                      ? d.ranks
                      : name === 'store'
                        ? d.ranks
                        : d.regions;
                const total = name === 'finance' ? d.expense.at(-1) : expected;
                return {
                  hero,
                  formatted,
                  total,
                  sum: sum(values),
                  shares: Array.from(
                    document.querySelectorAll(
                      '.ranking .share-inline>span:last-child,table:not(.ranking) td.share .share-inline>span:last-child',
                    ),
                  ).reduce((a, el) => a + parseFloat(el.textContent!), 0),
                };
              },
              { name, d: data[name] },
            );
            expect(observed.hero).toBe(observed.formatted);
            expect(observed.sum).toBe(observed.total);
            expect(Math.abs(observed.shares - 100)).toBeLessThanOrEqual(0.1000001);
            const metricChecks = await page.evaluate(
              ({ name, d }) => {
                const last = (a: number[]) => a.at(-1)!;
                const prev = (a: number[]) => a.at(-2)!;
                const sum = (a: number[]) => a.reduce((a, b) => a + b, 0);
                const cn = name === 'store' || name === 'live';
                const compact = (v: number) =>
                  cn
                    ? v >= 1e4
                      ? (v / 1e4).toFixed(1) + '万'
                      : v.toLocaleString('en-US', { maximumFractionDigits: 1 })
                    : v >= 1e6
                      ? (v / 1e6).toFixed(2) + 'M'
                      : v >= 1e4
                        ? (v / 1000).toFixed(1) + 'K'
                        : v.toLocaleString('en-US', { maximumFractionDigits: 0 });
                let metrics: [string, number, number, string][] = [];
                if (name === 'saas')
                  metrics = [
                    ['MRR', last(d.revenue), prev(d.revenue), 'money'],
                    [
                      'Net new MRR',
                      last(d.added) + last(d.expansion) - last(d.churned),
                      prev(d.added) + prev(d.expansion) - prev(d.churned),
                      'money',
                    ],
                    [
                      'Churn',
                      last(d.churned) / last(d.revenue),
                      prev(d.churned) / prev(d.revenue),
                      'percent',
                    ],
                    ['Active accounts', last(d.accounts), prev(d.accounts), 'number'],
                    [
                      'ARPA',
                      last(d.revenue) / last(d.accounts),
                      prev(d.revenue) / prev(d.accounts),
                      'money',
                    ],
                  ];
                if (name === 'finance')
                  metrics = [
                    ['Cash', last(d.cash), prev(d.cash), 'money'],
                    ['Operating expense', last(d.expense), prev(d.expense), 'money'],
                    ['Revenue', last(d.revenue), prev(d.revenue), 'money'],
                    ['Gross margin', last(d.margin) / 100, prev(d.margin) / 100, 'margin'],
                  ];
                if (name === 'store') {
                  const values = (a: any) => [
                    sum(a.revenue),
                    sum(a.visitors),
                    sum(a.orders) / sum(a.visitors),
                    sum(a.revenue) / sum(a.orders),
                  ];
                  const a = values(d),
                    b = values(d.yearAgo);
                  metrics = [
                    ['成交金额', a[0], b[0], 'money'],
                    ['访客数', a[1], b[1], 'number'],
                    ['支付转化率', a[2], b[2], 'percent'],
                    ['客单价', a[3], b[3], 'average'],
                    ['退款率', last(d.refundRate), last(d.yearAgoRefundRate), 'percent'],
                  ];
                }
                if (name === 'live')
                  metrics = [
                    ['实时成交额', last(d.revenue), last(d.yesterday), 'money'],
                    ['支付订单', last(d.orders), last(d.previousOrders), 'number'],
                    ['实时访客', last(d.visitors), last(d.previousVisitors), 'number'],
                    [
                      '支付转化率',
                      last(d.orders) / last(d.visitors),
                      last(d.previousOrders) / last(d.previousVisitors),
                      'percent',
                    ],
                    [
                      '客单价',
                      last(d.revenue) / last(d.orders),
                      last(d.yesterday) / last(d.previousOrders),
                      'average',
                    ],
                    ['退款金额', last(d.refunds), last(d.previousRefunds), 'money'],
                  ];
                return metrics.map(([label, value, previous, type]) => {
                  const row = Array.from(document.querySelectorAll('.kpi')).find(
                    (el) => el.querySelector('label')?.textContent === label,
                  )!;
                  const expected =
                    type === 'money'
                      ? (cn ? '¥' : '$') + compact(value)
                      : type === 'average'
                        ? '¥' + value.toFixed(2)
                        : type === 'percent'
                          ? (value * 100).toFixed(2) + '%'
                          : type === 'margin'
                            ? (value * 100).toFixed(1) + '%'
                            : compact(value);
                  return {
                    actual: row.querySelector('[data-kpi]')!.textContent,
                    expected,
                    delta: row.querySelector('[data-delta]')!.textContent!.trim(),
                    expectedDelta:
                      (value > previous ? '▲ ' : value < previous ? '▼ ' : '') +
                      (Math.abs((value - previous) / previous) * 100).toFixed(1) +
                      '%',
                  };
                });
              },
              { name, d: data[name] },
            );
            for (const m of metricChecks) {
              expect(m.actual).toBe(m.expected);
              expect(m.delta).toBe(m.expectedDelta);
            }
            if (name === 'finance') {
              const d = data.finance;
              const burn =
                d.expense
                  .slice(-3)
                  .reduce(
                    (a: number, v: number, i: number) =>
                      a + v - d.revenue[d.revenue.length - 3 + i],
                    0,
                  ) / 3;
              expect(await page.locator('.ruler .value').textContent()).toBe(
                (d.cash.at(-1) / burn).toFixed(1) + ' months',
              );
            }
            if (name === 'store') {
              const totals = await page
                .locator('.week-total')
                .evaluateAll((cells) =>
                  cells.map((cell) => Number((cell as HTMLElement).dataset.total)),
                );
              expect(totals).toEqual(
                Array.from({ length: 5 }, (_, week) =>
                  Array.from(
                    { length: 7 },
                    (_, day) => data.store.revenue[week * 7 + day - 1] || 0,
                  ).reduce((a, b) => a + b, 0),
                ),
              );
              const sum = (a: number[]) => a.reduce((a, b) => a + b, 0);
              const change = sum(data.store.revenue) / sum(data.store.previous.revenue) - 1;
              expect(await page.locator('.top>section [data-delta]').nth(1).textContent()).toBe(
                (change > 0 ? '▲ ' : '▼ ') + (Math.abs(change) * 100).toFixed(1) + '%',
              );
            }
            const amounts = await page.locator('.ranking .amount').allTextContents();
            if (name === 'store' || name === 'live') expect(amounts.length).toBeGreaterThan(0);
            expect(amounts.every((amount) => /^[¥$][\d,]+\.\d{2}[KMB万亿]?$/.test(amount))).toBe(
              true,
            );
            if (name === 'saas' || name === 'live') {
              expect(facts.deltas?.some((delta) => delta.polarity === 'lower-is-better')).toBe(
                true,
              );
            }
            if (name === 'store' || name === 'live') {
              const average = page
                .locator('.kpi')
                .filter({ has: page.locator('label', { hasText: '客单价' }) });
              expect(await average.locator('.value').textContent()).toMatch(/^¥[\d,]+\.\d{2}$/);
            }
          } else expect(result.score).toBeLessThan(60);
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
