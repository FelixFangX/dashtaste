import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT004', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'line', data: Array(13).fill(1) }] }),
    chart({ series: [{ type: 'line', data: Array(13).fill(1), showSymbol: false }] }),
  ];
  it('flags symbols above twelve observations', () => {
    expect(check(flagged, { pack: 'global', only: ['DT004'] }).length).toBeGreaterThan(0);
  });
  it('states the fix hint once', () => {
    const [finding] = check(flagged, { pack: 'global', only: ['DT004'] });
    expect(finding.fix).toBe('use dots at most 5px on at most 31 points, or set showSymbol: false');
  });
  it('passes hidden line symbols', () => {
    expect(check(passing, { pack: 'global', only: ['DT004'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT004'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT004'] })).toEqual([]);
      }
    });
  }
});

it('allows explicit short ink dots and hollow dashed comparisons', () => {
  expect(
    check(
      chart({
        series: [
          { type: 'line', data: Array(31).fill(1), symbol: 'circle', symbolSize: 4 },
          {
            type: 'line',
            data: Array(31).fill(2),
            symbol: 'emptyCircle',
            symbolSize: 4,
            lineStyle: { type: 'dashed' },
          },
        ],
      }),
      { only: ['DT004'] },
    ),
  ).toEqual([]);
});
it('rejects large, default hollow, long and repeated filled symbols', () => {
  for (const overrides of [
    { symbol: 'circle', symbolSize: 6 },
    { symbol: 'emptyCircle', symbolSize: 4 },
    { symbol: 'circle', symbolSize: 4, data: Array(32).fill(1) },
  ])
    expect(
      check(chart({ series: [{ type: 'line', data: Array(12).fill(1), ...overrides }] }), {
        only: ['DT004'],
      }),
    ).toHaveLength(1);
  expect(
    check(
      chart({
        series: Array(2).fill({
          type: 'line',
          data: Array(12).fill(1),
          symbol: 'circle',
          symbolSize: 4,
        }),
      }),
      { only: ['DT004'] },
    ),
  ).toHaveLength(2);
});
