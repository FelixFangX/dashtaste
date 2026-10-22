import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { chart, text } from './helpers.js';

describe('DT001', () => {
  const [flagged, passing] = [
    chart({ series: [{ type: 'bar' }, { type: 'line' }] }),
    chart({ color: ['#2B4C7E', '#C2703D'], series: [{ type: 'bar' }, { type: 'line' }] }),
  ];
  it('flags implicit colours on multiple series', () => {
    expect(check(flagged, { pack: 'global', only: ['DT001'] }).length).toBeGreaterThan(0);
  });
  it('passes explicit series colours', () => {
    expect(check(passing, { pack: 'global', only: ['DT001'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT001'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT001'] })).toEqual([]);
      }
    });
  }
});

// Read the installed tool's palette so upstream defaults cannot silently escape detection.
it('flags the rendered ECharts 6 default palette in both packs', async () => {
  const { init } = await import('echarts');
  const instance = init(null, undefined, { ssr: true, renderer: 'svg', width: 320, height: 200 });
  try {
    instance.setOption({ xAxis: { data: ['A'] }, yAxis: {}, series: [{ type: 'bar', data: [1] }] });
    const option = instance.getOption();
    for (const pack of ['global', 'cn'] as const) {
      expect(check(option, { pack, only: ['DT001'] })).toHaveLength(1);
    }
  } finally {
    instance.dispose();
  }
});
