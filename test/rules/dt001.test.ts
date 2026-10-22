import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT001', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'bar' }, { type: 'line' }] }),
    chart({ color: ['#2B4C7E', '#C2703D'], series: [{ type: 'bar' }, { type: 'line' }] }),
  ];
  it('flags implicit colours on multiple series', () => {
    expect(check(flagged, { pack: 'global', only: ['DT001'] }).length).toBeGreaterThan(0);
  });
  it('passes explicit series colours', () => {
    expect(check(passing, { pack: 'global', only: ['DT001'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT001'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT001'] })).toEqual([]);
      }
    });
  }
});
