import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT003', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'line', smooth: true }] }),
    chart({ series: [{ type: 'line', smooth: false }] }),
  ];
  it('flags smoothed line segments', () => {
    expect(check(flagged, { pack: 'global', only: ['DT003'] }).length).toBeGreaterThan(0);
  });
  it('passes straight line segments', () => {
    expect(check(passing, { pack: 'global', only: ['DT003'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT003'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT003'] })).toEqual([]);
      }
    });
  }
});
