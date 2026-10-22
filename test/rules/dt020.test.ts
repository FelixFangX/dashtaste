import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT020', () => {
  const [flagged, passing] = [
    {
      charts: [],
      kpis: ['#ff0000', '#00ff00', '#0000ff'].map((color) => ({
        selector: '.kpi',
        text: '22',
        color,
      })),
    },
    {
      charts: [],
      kpis: ['#111111', '#777777', '#222222'].map((color) => ({
        selector: '.kpi',
        text: '22',
        color,
      })),
    },
  ];
  it('flags three KPI accent colours', () => {
    expect(check(flagged, { pack: 'global', only: ['DT020'] }).length).toBeGreaterThan(0);
  });
  it('passes neutral KPI values', () => {
    expect(check(passing, { pack: 'global', only: ['DT020'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT020'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT020'] })).toEqual([]);
      }
    });
  }
});
