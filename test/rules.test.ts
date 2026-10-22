import { describe, it, expect } from 'vitest';
import { check } from '../src/index.js';
import type { PageFacts } from '../src/types.js';
import { chart, text } from './rules/helpers.js';

for (const pack of ['global', 'cn'] as const)
  describe(`${pack} pack variations`, () => {
    it('pie limit', () => {
      expect(
        check(chart({ series: [{ type: 'pie', roseType: 'radius', data: Array(8).fill(1) }] }), {
          pack,
          only: ['DT005'],
        }),
      ).toHaveLength(pack === 'cn' ? 0 : 1);
    });
    it('pie preference', () => {
      const fs = check(chart({ series: [{ type: 'pie', radius: ['30%', '60%'], data: [1, 2] }] }), {
        pack,
        only: ['DT006'],
      });
      expect(fs).toHaveLength(pack === 'cn' ? 0 : 1);
      if (pack === 'global') expect(fs[0].severity).toBe('info');
    });
    it('unnamed mixed dual axis', () =>
      expect(
        check(chart({ yAxis: [{}, {}], series: [{ type: 'bar' }, { type: 'line' }] }), {
          pack,
          only: ['DT008'],
        }),
      ).toHaveLength(pack === 'cn' ? 0 : 1));
    it('unit templates', () => {
      for (const [formatter, fail] of [
        ['{value}K', pack === 'cn'],
        ['{value}万', pack === 'global'],
      ] as const)
        expect(
          check(chart({ yAxis: { axisLabel: { formatter } } }), { pack, only: ['DT012'] }),
        ).toHaveLength(fail ? 1 : 0);
    });
    it('delta convention and switch', () => {
      const red = pack === 'cn' ? '#D93A3A' : '#B4413A',
        green = pack === 'cn' ? '#167D4F' : '#2F7D4F';
      for (const convention of ['red-up', 'green-up'] as const) {
        const facts: PageFacts = {
          charts: [],
          page: { deltaColors: convention },
          deltas: [
            { selector: '.delta', text: '▲ 1%', color: convention === 'red-up' ? red : green },
          ],
        };
        expect(check(facts, { pack, only: ['DT013'] })).toEqual([]);
        facts.deltas![0].color = convention === 'red-up' ? green : red;
        expect(check(facts, { pack, only: ['DT013'] })).toHaveLength(1);
      }
    });
    it('KPI limit', () =>
      expect(
        check(
          { charts: [], kpis: Array(7).fill({ color: '#111111', text: '5', selector: '.kpi' }) },
          { pack, only: ['DT019'] },
        ),
      ).toHaveLength(pack === 'cn' ? 0 : 1));
    it('CJK floor only cn', () =>
      expect(
        check(
          { charts: [], texts: [text({ text: '销量', fontSize: 11 })] },
          { pack, only: ['DT022'] },
        ),
      ).toHaveLength(pack === 'cn' ? 1 : 0));
  });
it('default palette hex and per-series overrides', () => {
  expect(check(chart({ color: ['#5470C6'] }), { only: ['DT001'] })).toHaveLength(1);
  expect(
    check(
      chart({ series: [{ itemStyle: { color: '#111111' } }, { lineStyle: { color: '#222222' } }] }),
      { only: ['DT001'] },
    ),
  ).toEqual([]);
});
it('scale and shadow chart variants', () => {
  expect(
    check(
      chart({ series: [{ type: 'bar', itemStyle: { shadowBlur: 10 } }], yAxis: { scale: true } }),
      { only: ['DT010', 'DT018'] },
    ),
  ).toHaveLength(2);
});
it('chart text and gradient fills', () => {
  expect(
    check(
      chart({
        backgroundColor: '#ffffff',
        legend: { textStyle: { color: '#eeeeee' } },
        series: [{ areaStyle: { color: { type: 'linear' } } }],
      }),
      { only: ['DT015', 'DT017'] },
    ),
  ).toHaveLength(2);
});
it('large bold text threshold', () => {
  expect(
    check({ charts: [], texts: [text({ color: '#777777', fontSize: 24 })] }, { only: ['DT015'] }),
  ).toEqual([]);
});
it('normalizes arrays and rejects malformed envelopes', () => {
  expect(check([{}])).toEqual([]);
  expect(() => check({ charts: [{}] })).toThrow();
  expect(() => check(null)).toThrow();
});
it('3D false flags and surface series', () => {
  expect(check(chart({ is3D: false, series: [{ type: 'pie' }] }), { only: ['DT007'] })).toEqual([]);
  expect(check(chart({ series: [{ type: 'surface' }] }), { only: ['DT007'] })).toHaveLength(1);
});
it('rate axis minimum does not change amount bar baseline', () => {
  expect(
    check(
      chart({
        xAxis: { type: 'category' },
        yAxis: [
          { type: 'value', min: 0 },
          { type: 'value', min: 10 },
        ],
        series: [
          { type: 'bar', yAxisIndex: 0 },
          { type: 'line', yAxisIndex: 1 },
        ],
      }),
      { pack: 'cn', only: ['DT010'] },
    ),
  ).toEqual([]);
});
it('large chart legend has the large text contrast threshold', () => {
  expect(
    check(
      chart({
        backgroundColor: '#ffffff',
        legend: { textStyle: { color: '#777777', fontSize: 24 } },
      }),
      { only: ['DT015'] },
    ),
  ).toEqual([]);
});
it('neutral delta text is not colour-only encoding', () => {
  expect(
    check(
      { charts: [], deltas: [{ selector: '.delta', text: '0%', color: '#222222' }] },
      { only: ['DT014'] },
    ),
  ).toEqual([]);
});
it('named chart backgrounds are known colours', () => {
  expect(
    check(chart({ backgroundColor: 'white', color: ['#eeeeee'], series: [{ type: 'line' }] }), {
      only: ['DT016'],
    }),
  ).toHaveLength(1);
});
