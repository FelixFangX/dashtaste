import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT023', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'bar' }], legend: {} }),
    chart({ series: [{ type: 'bar' }], legend: { show: false } }),
  ];
  it('flags a visible single-series legend', () => {
    expect(check(flagged, { pack: 'global', only: ['DT023'] }).length).toBeGreaterThan(0);
  });
  it('passes a hidden single-series legend', () => {
    expect(check(passing, { pack: 'global', only: ['DT023'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT023'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT023'] })).toEqual([]);
      }
    });
  }
});
