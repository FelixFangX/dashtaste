import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT016', () => {
  const [flagged, passing] = [
    chart({ backgroundColor: '#ffffff', color: ['#eeeeee'], series: [{ type: 'line' }] }),
    chart({ backgroundColor: '#ffffff', color: ['#111111'], series: [{ type: 'line' }] }),
  ];
  it('flags a low-contrast line', () => {
    expect(check(flagged, { pack: 'global', only: ['DT016'] }).length).toBeGreaterThan(0);
  });
  it('passes a dark line on white', () => {
    expect(check(passing, { pack: 'global', only: ['DT016'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT016'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT016'] })).toEqual([]);
      }
    });
  }
});
