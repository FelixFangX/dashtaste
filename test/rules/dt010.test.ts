import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT010', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'bar' }], yAxis: { min: 10 } }),
    chart({ series: [{ type: 'bar' }], yAxis: { min: 0 } }),
  ];
  it('flags a positive bar baseline', () => {
    expect(check(flagged, { pack: 'global', only: ['DT010'] }).length).toBeGreaterThan(0);
  });
  it('passes a zero bar baseline', () => {
    expect(check(passing, { pack: 'global', only: ['DT010'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT010'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT010'] })).toEqual([]);
      }
    });
  }
});

it('flags a scaled horizontal bar axis', () => {
  expect(
    check(
      {
        xAxis: { type: 'value', name: 'Orders', scale: true },
        yAxis: { type: 'category', data: ['East'] },
        series: { type: 'bar', data: [{ value: 24 }] },
      },
      { only: ['DT010'] },
    ),
  ).toHaveLength(1);
});
