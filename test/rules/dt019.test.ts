import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT019', () => {
  const [flagged, passing] = [
    {
      charts: [],
      kpis: Array.from({ length: 9 }, () => ({ selector: '.kpi', text: '22', color: '#111111' })),
    },
    { charts: [], kpis: [] },
  ];
  it('flags too many primary KPIs', () => {
    expect(check(flagged, { pack: 'global', only: ['DT019'] }).length).toBeGreaterThan(0);
  });
  it('passes a page without KPI overload', () => {
    expect(check(passing, { pack: 'global', only: ['DT019'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT019'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT019'] })).toEqual([]);
      }
    });
  }
});
