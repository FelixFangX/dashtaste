import { expect, it } from 'vitest';
import { data, dashboards, kpisFor } from '../gallery/data.mjs';

for (const { name } of dashboards) {
  it(`${name} uses finite, distinct observed KPI comparisons`, () => {
    const kpis = kpisFor(name);
    const deltas = kpis.map(([, value, , previous, yearAgo]) => {
      expect(value).toBeGreaterThan(0);
      expect(previous).toBeGreaterThan(0);
      expect(Number.isFinite(value)).toBe(true);
      if (name === 'store') expect(yearAgo).toBeGreaterThan(0);
      return ((value / previous - 1) * 100).toFixed(1);
    });
    expect(new Set(deltas).size).toBe(kpis.length);
    if (name === 'saas' || name === 'finance') {
      expect(kpis[0][1]).toBe(data[name].revenue.at(-1));
      expect(kpis[0][3]).toBe(data[name].revenue.at(-2));
    }
    if (name === 'store') {
      expect(kpis[0][1]).toBe(data.store.revenue.reduce((a, b) => a + b, 0));
      expect(kpis[2][1] * kpis[1][1] * kpis[3][1]).toBeCloseTo(kpis[0][1]);
    }
    if (name === 'live') {
      expect(kpis[0][1]).toBe(data.live.revenue.at(-1));
      expect(kpis[0][3]).toBe(data.live.yesterday.at(-1));
      expect(kpis[1][1] * kpis[4][1]).toBeCloseTo(kpis[0][1]);
    }
  });
}

it('MRR rolls forward by net additions', () => {
  data.saas.revenue.slice(1).forEach((value, i) => {
    expect(value - data.saas.revenue[i]).toBe(data.saas.netNew[i + 1]);
  });
});

it('categorical breakdowns reconcile to their series totals', () => {
  const sum = (values) => values.reduce((a, b) => a + b, 0);
  expect(sum(data.saas.plans)).toBe(data.saas.revenue.at(-1));
  expect(sum(data.finance.ranks)).toBe(data.finance.expense.at(-1));
  expect(sum(data.live.regions)).toBe(data.live.revenue.at(-1));
  expect(sum(data.live.ranks)).toBeLessThan(data.live.revenue.at(-1));
});
