import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT008', () => {
  const [flagged, passing] = [
    chart({
      yAxis: [
        { type: 'value', name: 'A' },
        { type: 'value', name: 'B' },
      ],
      series: [{ type: 'line' }, { type: 'line' }],
    }),
    chart({
      yAxis: [
        { type: 'value', name: 'Amount' },
        { type: 'value', name: 'Rate' },
      ],
      series: [{ type: 'bar' }, { type: 'line' }],
    }),
  ];
  it('flags matching series types on two value axes', () => {
    expect(check(flagged, { pack: 'global', only: ['DT008'] }).length).toBeGreaterThan(0);
  });
  it('flags a named amount-and-rate combo', () => {
    expect(check(passing, { pack: 'global', only: ['DT008'] })).toHaveLength(1);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT008'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT008'] })).toEqual([]);
      }
    });
  }
});
