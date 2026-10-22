import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT007', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'bar3D' }] }),
    chart({ series: [{ type: 'bar' }] }),
  ];
  it('flags three-dimensional series', () => {
    expect(check(flagged, { pack: 'global', only: ['DT007'] }).length).toBeGreaterThan(0);
  });
  it('passes flat bar series', () => {
    expect(check(passing, { pack: 'global', only: ['DT007'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT007'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT007'] })).toEqual([]);
      }
    });
  }
});
