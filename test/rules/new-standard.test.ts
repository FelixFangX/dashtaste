import { it, expect } from 'vitest';
import { check } from '../../src/index.js';
import type { PageFacts, Option } from '../../src/types.js';
const chart = (option: Option): PageFacts => ({ charts: [{ option }] });
for (const [id, bad, good] of [
  [
    'DT024',
    chart({ series: [{ type: 'bar', barWidth: 40 }] }),
    chart({ series: [{ type: 'bar', barMaxWidth: 24 }] }),
  ],
  [
    'DT025',
    chart({ legend: { show: true }, series: [{ type: 'line' }, { type: 'line' }] }),
    chart({
      legend: { show: false },
      series: [
        { type: 'line', endLabel: { show: true } },
        { type: 'line', endLabel: { show: true } },
      ],
    }),
  ],
  [
    'DT026',
    chart({ series: [{ type: 'line', lineStyle: { width: 4 } }] }),
    chart({ series: [{ type: 'line', lineStyle: { width: 2 } }] }),
  ],
  [
    'DT027',
    { charts: [], kpis: [{ selector: '#n', text: '12', color: '#111111' }] },
    {
      charts: [],
      kpis: [{ selector: '#n', text: '12', color: '#111111', fontVariantNumeric: 'tabular-nums' }],
    },
  ],
  [
    'DT028',
    {
      charts: [],
      kpis: [24, 24, 24].map((fontSize) => ({
        selector: '#n',
        text: '12',
        color: '#111111',
        fontSize,
      })),
    },
    {
      charts: [],
      kpis: [64, 24, 24].map((fontSize) => ({
        selector: '#n',
        text: '12',
        color: '#111111',
        fontSize,
      })),
    },
  ],
] as [string, PageFacts, PageFacts][]) {
  it(id + ' flags the failing case', () => expect(check(bad, { only: [id] })).toHaveLength(1));
  it(id + ' accepts the passing case', () => expect(check(good, { only: [id] })).toHaveLength(0));
}
it('DT024 permits 32px only on a dark screen', () => {
  const f = chart({ series: [{ type: 'bar', barMaxWidth: 32 }] });
  expect(check(f, { only: ['DT024'], pack: 'cn', mode: 'dark' })).toEqual([]);
  expect(check(f, { only: ['DT024'], pack: 'cn' })).toHaveLength(1);
});
it('DT026 detects hairline data', () =>
  expect(
    check(chart({ series: [{ type: 'line', lineStyle: { width: 0.5 } }] }), { only: ['DT026'] }),
  ).toHaveLength(1));
it('DT027 supports feature settings', () =>
  expect(
    check(
      {
        charts: [],
        kpis: [{ selector: '#n', text: '12', color: '#111111', fontFeatureSettings: '"tnum"' }],
      },
      { only: ['DT027'] },
    ),
  ).toEqual([]));
it('DT027 rejects disabled tabular features', () =>
  expect(
    check(
      {
        charts: [],
        kpis: [{ selector: '#n', text: '12', color: '#111111', fontFeatureSettings: '"tnum" 0' }],
      },
      { only: ['DT027'] },
    ),
  ).toHaveLength(1));
it('DT027 checks numeric table text', () =>
  expect(
    check(
      {
        charts: [],
        texts: [
          {
            selector: 'td',
            text: '$12.00',
            color: '#111111',
            background: '#FFFFFF',
            fontWeight: 400,
            fontSize: 13,
          },
        ],
      },
      { only: ['DT027'] },
    ),
  ).toHaveLength(1));
it('DT024 rejects a width that defeats its cap', () =>
  expect(
    check(chart({ series: [{ type: 'bar', barMaxWidth: 24, barWidth: 40 }] }), { only: ['DT024'] }),
  ).toHaveLength(1));
