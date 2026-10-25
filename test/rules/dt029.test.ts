import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';

describe('DT029', () => {
  it('flags KPI helper facts', () => {
    expect(
      check(
        {
          charts: [],
          helpers: [{ selector: '.kpi p', text: 'Trending up this month' }],
        },
        { pack: 'global', only: ['DT029'] },
      ).length,
    ).toBeGreaterThan(0);
  });
  it('flags narrating chart titles', () => {
    expect(
      check(
        {
          charts: [{ option: { title: { text: 'This chart shows revenue by week' } } }],
        },
        { pack: 'cn', only: ['DT029'] },
      ).some((f) => f.path.endsWith('.title')),
    ).toBe(true);
  });
  it('passes metric-only titles and no helpers', () => {
    expect(
      check({ charts: [{ option: { title: { text: 'Revenue' } } }] }, { pack: 'global', only: ['DT029'] }),
    ).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT029'] })).toEqual([]);
    });
  }
});
