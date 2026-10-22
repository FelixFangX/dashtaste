import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT014', () => {
  const [flagged, passing] = [
    { charts: [], deltas: [{ selector: '#delta', text: '3%', color: '#2F7D4F' }] },
    { charts: [], deltas: [{ selector: '#delta', text: '+3%', color: '#2F7D4F' }] },
  ];
  it('flags direction expressed only through colour', () => {
    expect(check(flagged, { pack: 'global', only: ['DT014'] }).length).toBeGreaterThan(0);
  });
  it('passes a signed coloured delta', () => {
    expect(check(passing, { pack: 'global', only: ['DT014'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT014'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT014'] })).toEqual([]);
      }
    });
  }
});
