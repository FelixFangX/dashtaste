import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT006', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'pie', radius: ['90%', '100%'], data: [1, 2] }] }),
    chart({ series: [{ type: 'bar', data: [1, 2] }] }),
  ];
  it('flags a donut radius ratio above 0.75', () => {
    expect(check(flagged, { pack: 'global', only: ['DT006'] }).length).toBeGreaterThan(0);
  });
  it('passes a bar comparison', () => {
    expect(check(passing, { pack: 'global', only: ['DT006'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT006'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT006'] })).toEqual([]);
      }
    });
  }
});

for (const pack of ['global', 'cn'] as const) {
  it(`flags multiple pies across separate charts in ${pack}`, () => {
    expect(
      check(
        [
          { series: { type: 'pie', data: [{ value: 1 }] } },
          { series: { type: 'pie', data: [{ value: 2 }] } },
        ],
        { pack, only: ['DT006'] },
      ),
    ).toHaveLength(2);
  });
}
