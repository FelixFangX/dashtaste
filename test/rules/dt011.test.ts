import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT011', () => {
  const [flagged, passing] = [
    chart({ series: [{ data: [10000] }], yAxis: {} }),
    chart({
      series: [{ data: [10000], label: { show: true, formatter: '{c}K' } }],
      yAxis: { axisLabel: { formatter: '{value}K' } },
      tooltip: { formatter: '{c}K' },
    }),
  ];
  it('flags large values without formatters', () => {
    expect(check(flagged, { pack: 'global', only: ['DT011'] }).length).toBeGreaterThan(0);
  });
  it('passes formatters on all visible channels', () => {
    expect(check(passing, { pack: 'global', only: ['DT011'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT011'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT011'] })).toEqual([]);
      }
    });
  }
});

for (const pack of ['global', 'cn'] as const) {
  for (const data of [[{ value: 10000 }], [[1, 10000]], [-10000]]) {
    it(`flags large object, coordinate, and negative data in ${pack}: ${JSON.stringify(data)}`, () => {
      expect(
        check(
          { yAxis: {}, series: { type: 'line', data } },
          {
            pack,
            only: ['DT011'],
          },
        ),
      ).toHaveLength(1);
    });
  }
}
