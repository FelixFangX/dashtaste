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
  expect(sum(data.live.ranks)).toBe(data.live.revenue.at(-1));
});

it('event periods, burn and hourly regional values reconcile', () => {
  const s = data.saas,
    f = data.finance,
    l = data.live;
  expect(s.expansion[9]).toBeGreaterThan(s.expansion[8] * 5);
  expect(s.churned[10]).toBeGreaterThan(s.churned[9] * 2);
  f.cash.forEach((v, i) =>
    expect(v - (i ? f.cash[i - 1] : 3300000)).toBe(f.funding[i] - f.burn[i]),
  );
  f.runway.forEach((v, i) =>
    expect(v).toBeCloseTo(
      f.cash[i] /
        (f.burn.slice(Math.max(0, i - 2), i + 1).reduce((a, b) => a + b, 0) / Math.min(3, i + 1)),
    ),
  );
  l.revenue.forEach((v, h) =>
    expect(l.regionHourly.reduce((a, r) => a + r[h], 0)).toBe(v - (h ? l.revenue[h - 1] : 0)),
  );
});

it('November changes reconcile to the MRR rail', () => {
  const d = data.saas;
  expect(d.added.at(-1) + d.expansion.at(-1) - d.churned.at(-1)).toBe(d.netNew.at(-1));
  expect(kpisFor('saas')[1][1]).toBe(d.netNew.at(-1));
});

it('calendar weekly totals include each daily observation exactly once', () => {
  const weeks = Array.from({ length: 5 }, (_, week) =>
    Array.from(
      { length: 7 },
      (_, weekday) => data.store.revenue[week * 7 + weekday - 1] || 0,
    ).reduce((sum, value) => sum + value, 0),
  );
  expect(weeks.reduce((sum, value) => sum + value, 0)).toBe(kpisFor('store')[0][1]);
});
