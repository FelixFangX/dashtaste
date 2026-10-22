import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT009', () => {
  const [flagged, passing] = [
    chart({ yAxis: { type: 'value' } }),
    chart({ yAxis: { type: 'value', name: 'Count' } }),
  ];
  it('flags a value axis without units', () => {
    expect(check(flagged, { pack: 'global', only: ['DT009'] }).length).toBeGreaterThan(0);
  });
  it('passes a named value axis', () => {
    expect(check(passing, { pack: 'global', only: ['DT009'] })).toEqual([]);
  });
  it('accepts units in rendered ticks and rejects bare numbers', () => {
    for (const tick of ['$400K', '12万', '25%', '300ms', '2M'])
      expect(
        check(chart({ yAxis: { type: 'value', renderedTickLabels: [tick] } }), { only: ['DT009'] }),
      ).toEqual([]);
    expect(
      check(chart({ yAxis: { type: 'value', renderedTickLabels: ['400', '200'] } }), {
        only: ['DT009'],
      }),
    ).toHaveLength(1);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT009'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT009'] })).toEqual([]);
      }
    });
  }
});
