import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT002', () => {
  const [flagged, passing] = [
    chart({ color: ['#110000', '#220000', '#330000', '#440000', '#550000', '#660000', '#770000'] }),
    chart({ color: ['#2B4C7E'] }),
  ];
  it('flags more than six categorical colours', () => {
    expect(check(flagged, { pack: 'global', only: ['DT002'] }).length).toBeGreaterThan(0);
  });
  it('passes a restrained palette', () => {
    expect(check(passing, { pack: 'global', only: ['DT002'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT002'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT002'] })).toEqual([]);
      }
    });
  }
});
