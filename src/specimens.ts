import type { Option } from './types.js';
import type { Taste, TasteName } from './tastes.js';
import { tastes } from './tastes.js';

/** Seven qualitative colours: more than six, so every taste treats this as a rainbow. */
export const rainbowColors = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#a65628',
  '#f781bf',
] as const;

export interface TasteKnobs {
  series: number;
  annotations: number;
  charts: number;
}

export const defaultKnobs: Record<TasteName, TasteKnobs> = {
  'saas-dense': { series: 1, annotations: 0, charts: 1 },
  'exec-brief': { series: 1, annotations: 0, charts: 1 },
  'ops-wall': { series: 1, annotations: 0, charts: 1 },
  'cn-ecommerce': { series: 1, annotations: 0, charts: 1 },
  'global-marketplace': { series: 2, annotations: 0, charts: 1 },
  'editorial-data': { series: 1, annotations: 1, charts: 1 },
};

export type SpecimenKind = 'rainbow' | TasteName;

export function knobsFor(id: TasteName, partial?: Partial<TasteKnobs>): TasteKnobs {
  return { ...defaultKnobs[id], ...partial };
}

function notes(taste: Taste, count: number): Option[] {
  return Array.from({ length: count }, (_, index) => ({
    type: 'text',
    left: 8,
    top: 8 + index * 18,
    style: { text: `Note ${index + 1}`, fill: taste.tokens.ink, fontSize: 12 },
  }));
}

function funnel(taste: Taste): Option {
  const color = taste.tokens.categorical[0];
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: [color],
    series: [
      {
        type: 'funnel',
        sort: 'descending',
        label: { show: true, formatter: '{b}' },
        data: [
          { name: '访问', value: 90, itemStyle: { color } },
          { name: '下单', value: 60, itemStyle: { color: taste.tokens.categorical[1] ?? color } },
          { name: '支付', value: 30, itemStyle: { color: taste.tokens.ink } },
        ],
      },
    ],
  };
}

function cartesian(taste: Taste, seriesCount: number): Option {
  const palette = taste.tokens.categorical;
  const count = Math.max(1, seriesCount);
  const marketplace = taste.id === 'global-marketplace';
  const kind = marketplace ? 'line' : 'bar';
  const built = Array.from({ length: count }, (_, index) => {
    const color = palette[index % palette.length];
    if (kind === 'line')
      return {
        type: 'line',
        name: index === 0 ? 'This cohort' : 'Prior cohort',
        data: [12 + index, 18, 14 + index],
        showSymbol: false,
        smooth: false,
        lineStyle: { width: 2, color },
        itemStyle: { color },
      };
    return {
      type: 'bar',
      name: `Series ${index + 1}`,
      data: [12 + index, 18, 9 + index],
      barMaxWidth: 16,
      itemStyle: { color },
    };
  });
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: palette.slice(0, count),
    legend: { show: false },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: {
      type: 'value',
      min: 0,
      scale: false,
      name: marketplace
        ? 'Revenue ($)'
        : taste.composition.numberSystem === 'wan-yi'
          ? '成交额'
          : 'Orders',
    },
    series: built,
  };
}

function oneChart(taste: Taste, knobs: TasteKnobs, index: number): Option {
  const primary =
    taste.id === 'cn-ecommerce' && knobs.series === 1
      ? funnel(taste)
      : cartesian(taste, knobs.series);
  if (index === 0 && knobs.annotations > 0)
    return { ...primary, graphic: notes(taste, knobs.annotations) };
  return primary;
}

function rainbow(): Option {
  return {
    animation: true,
    backgroundColor: '#ffffff',
    color: [...rainbowColors],
    legend: { show: true },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: rainbowColors.map((color, index) => ({
      type: index % 2 ? 'line' : 'bar',
      name: `Series ${index + 1}`,
      smooth: true,
      data: [8 + index, 14, 11 + index],
      itemStyle: { color },
      lineStyle: { color },
    })),
  };
}

/** A rainbow enemy, or one named taste at the given knobs. One chart returns an option; more return a page. */
export function tasteSpecimen(
  kind: SpecimenKind,
  partial?: Partial<TasteKnobs>,
): Option | { charts: { option: Option }[] } {
  if (kind === 'rainbow') return rainbow();
  const knobs = knobsFor(kind, partial);
  const taste = tastes[kind];
  const charts = Array.from({ length: Math.max(1, knobs.charts) }, (_, index) =>
    oneChart(taste, knobs, index),
  );
  if (charts.length === 1) return charts[0];
  return { charts: charts.map((option) => ({ option })) };
}
