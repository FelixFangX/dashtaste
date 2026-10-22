import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT012', () => {
  const [flagged, passing] = [
    chart({ yAxis: { axisLabel: { formatter: '{value}万' } } }),
    chart({ yAxis: { axisLabel: { formatter: '{value}K' } } }),
  ];
  it('flags Chinese units in the global pack', () => {
    expect(check(flagged, { pack: 'global', only: ['DT012'] }).length).toBeGreaterThan(0);
  });
  it('passes global compact units', () => {
    expect(check(passing, { pack: 'global', only: ['DT012'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT012'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT012'] })).toEqual([]);
      }
    });
  }
});
