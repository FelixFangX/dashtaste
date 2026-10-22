import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT004', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'line', data: Array(13).fill(1) }] }),
    chart({ series: [{ type: 'line', data: Array(13).fill(1), showSymbol: false }] }),
  ];
  it('flags symbols above twelve observations', () => {
    expect(check(flagged, { pack: 'global', only: ['DT004'] }).length).toBeGreaterThan(0);
  });
  it('passes hidden line symbols', () => {
    expect(check(passing, { pack: 'global', only: ['DT004'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT004'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT004'] })).toEqual([]);
      }
    });
  }
});
