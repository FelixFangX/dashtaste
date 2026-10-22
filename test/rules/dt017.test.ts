import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT017', () => {
  const [flagged, passing] = [
    { charts: [], gradients: [{ selector: '.card', background: 'linear-gradient(red, blue)' }] },
    { charts: [] },
  ];
  it('flags a CSS gradient', () => {
    expect(check(flagged, { pack: 'global', only: ['DT017'] }).length).toBeGreaterThan(0);
  });
  it('passes a page without gradients', () => {
    expect(check(passing, { pack: 'global', only: ['DT017'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT017'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT017'] })).toEqual([]);
      }
    });
  }
});
