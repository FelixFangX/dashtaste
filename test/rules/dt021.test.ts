import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT021', () => {
  const [flagged, passing] = [
    { charts: [], emojis: [{ selector: 'h1', text: '\uD83C\uDFC6 Sales' }] },
    { charts: [] },
  ];
  it('flags emoji in heading facts', () => {
    expect(check(flagged, { pack: 'global', only: ['DT021'] }).length).toBeGreaterThan(0);
  });
  it('passes plain heading facts', () => {
    expect(check(passing, { pack: 'global', only: ['DT021'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT021'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT021'] })).toEqual([]);
      }
    });
  }
});
