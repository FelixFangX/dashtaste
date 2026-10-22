import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT015', () => {
  const [flagged, passing] = [
    { charts: [], texts: [text({ color: '#eeeeee' })] },
    { charts: [], texts: [text()] },
  ];
  it('flags low-contrast body text', () => {
    expect(check(flagged, { pack: 'global', only: ['DT015'] }).length).toBeGreaterThan(0);
  });
  it('passes readable body text', () => {
    expect(check(passing, { pack: 'global', only: ['DT015'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT015'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT015'] })).toEqual([]);
      }
    });
  }
});
