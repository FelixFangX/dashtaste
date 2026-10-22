import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT005', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'pie', data: Array(6).fill(1) }] }),
    chart({ series: [{ type: 'pie', data: [1, 2, 3] }] }),
  ];
  it('flags more than five pie slices', () => {
    expect(check(flagged, { pack: 'global', only: ['DT005'] }).length).toBeGreaterThan(0);
  });
  it('passes three pie slices', () => {
    expect(check(passing, { pack: 'global', only: ['DT005'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT005'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT005'] })).toEqual([]);
      }
    });
  }
});
