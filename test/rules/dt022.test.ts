import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT022', () => {
  const [flagged, passing] = [
    { charts: [], texts: [text({ text: '销量', fontSize: 11 })] },
    { charts: [], texts: [text({ text: '销量', fontSize: 12 })] },
  ];
  it('flags CJK text below twelve pixels', () => {
    expect(check(flagged, { pack: 'cn', only: ['DT022'] }).length).toBeGreaterThan(0);
  });
  it('passes CJK text at twelve pixels', () => {
    expect(check(passing, { pack: 'cn', only: ['DT022'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT022'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT022'] })).toEqual([]);
      }
    });
  }
});
