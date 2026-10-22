import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT018', () => {
  const [flagged, passing] = [
    {
      charts: [],
      shadows: [
        { selector: '.card', boxShadow: '0px 0px 14px rgb(0, 0, 255)', textShadow: 'none' },
      ],
    },
    {
      charts: [],
      shadows: [{ selector: '.card', boxShadow: '0px 0px 14px rgb(0, 0, 0)', textShadow: 'none' }],
    },
  ];
  it('flags a coloured blurred shadow', () => {
    expect(check(flagged, { pack: 'global', only: ['DT018'] }).length).toBeGreaterThan(0);
  });
  it('passes a neutral shadow', () => {
    expect(check(passing, { pack: 'global', only: ['DT018'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT018'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT018'] })).toEqual([]);
      }
    });
  }
});
