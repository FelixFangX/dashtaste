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

/** Annotation voice. The first line is what the default knob shows. */
const voices: Record<TasteName, readonly string[]> = {
  'saas-dense': ['Wk 12', 'Wk 13', 'Wk 14', 'Wk 15'],
  'exec-brief': ['Board'],
  'ops-wall': ['Page', 'Ack', 'Mute'],
  'cn-ecommerce': ['大促', '直播', '会员'],
  'global-marketplace': ['USD', 'EUR', 'GBP'],
  'editorial-data': ['The spike is the lede.', 'Source: panel', 'n = 1,240'],
};

function notes(taste: Taste, count: number): Option[] {
  const lines = voices[taste.id];
  const story = taste.id === 'editorial-data';
  return Array.from({ length: count }, (_, index) => ({
    type: 'text',
    left: story ? 228 : 8,
    top: (story ? 24 : 8) + index * 18,
    style: {
      text: index < lines.length ? lines[index] : `${lines[0]} ${index + 1}`,
      fill: taste.tokens.ink,
      fontSize: 12,
    },
  }));
}

function paletteOf(taste: Taste, count: number): string[] {
  return taste.tokens.categorical.slice(0, Math.max(1, count));
}

function saas(taste: Taste, seriesCount: number): Option {
  const palette = paletteOf(taste, seriesCount);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = [18, 22, 19, 24, 21, 26, 23];
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: palette,
    legend: { show: false },
    grid: { left: 36, right: 8, top: 12, bottom: 20 },
    xAxis: { type: 'category', data: days, axisTick: { show: false } },
    yAxis: { type: 'value', min: 0, scale: false, name: 'Orders' },
    series: palette.map((color, index) => ({
      type: 'bar',
      name: index === 0 ? 'Orders' : `Orders ${index + 1}`,
      data: base.map((value) => value - index * 2),
      barMaxWidth: 10,
      itemStyle: { color },
    })),
  };
}

function exec(taste: Taste, seriesCount: number): Option {
  const palette = paletteOf(taste, seriesCount);
  const base = [2.4, 4.2, 3];
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: palette,
    title: {
      text: '4.2',
      subtext: 'NRR',
      left: 8,
      top: 0,
      itemGap: 0,
      textStyle: { color: taste.tokens.ink, fontSize: 40, fontWeight: 500 },
      subtextStyle: { color: taste.tokens.ink, fontSize: 12 },
    },
    legend: { show: false },
    grid: { left: 8, right: 16, top: 78, bottom: 20 },
    xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3'], axisTick: { show: false } },
    yAxis: { type: 'value', min: 0, scale: false, name: 'NRR' },
    series: palette.map((color, index) => ({
      type: 'bar',
      name: index === 0 ? 'NRR' : `NRR ${index + 1}`,
      data: base.map((value) => Math.max(0.4, value - index * 0.6)),
      barMaxWidth: 18,
      itemStyle: { color },
    })),
  };
}

function ops(taste: Taste, seriesCount: number): Option {
  const lanes = ['API', 'DB', 'Queue', 'CDN'];
  const up = taste.tokens.up;
  const down = taste.tokens.down;
  const count = Math.max(1, seriesCount);
  const extra = taste.tokens.categorical.filter((color) => color !== up && color !== down);
  const series: Option[] = [
    {
      type: 'bar',
      name: 'Health',
      barMaxWidth: 14,
      data: lanes.map((_, index) => ({
        value: index === 2 ? 0.35 : 1,
        itemStyle: { color: index === 2 ? down : up },
      })),
    },
  ];
  for (let index = 1; index < count; index += 1) {
    const color = extra[(index - 1) % Math.max(1, extra.length)] ?? up;
    series.push({
      type: 'bar',
      name: `Lane ${index + 1}`,
      barMaxWidth: 8,
      itemStyle: { color },
      data: [0.8, 0.55, 0.4, 0.7].map((value) => Math.max(0.2, value - (index - 1) * 0.1)),
    });
  }
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: [up, down, ...extra.slice(0, Math.max(0, count - 1))],
    legend: { show: false },
    grid: { left: 8, right: 8, top: 12, bottom: 20 },
    xAxis: { type: 'category', data: lanes, axisTick: { show: false } },
    yAxis: { type: 'value', min: 0, max: 1, scale: false, name: 'Checks' },
    series,
  };
}

function funnel(taste: Taste): Option {
  const [visit, order, pay] = taste.tokens.categorical;
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: [visit, order, pay],
    series: [
      {
        type: 'funnel',
        sort: 'descending',
        left: '8%',
        width: '54%',
        minSize: '18%',
        maxSize: '100%',
        gap: 4,
        label: { show: true, formatter: '{b}', fontSize: 12 },
        data: [
          { name: '访问 12.4万', value: 90, itemStyle: { color: visit } },
          { name: '下单 3.1万', value: 60, itemStyle: { color: order } },
          { name: '支付 1.2万', value: 30, itemStyle: { color: pay } },
        ],
      },
    ],
  };
}

function cnBars(taste: Taste, seriesCount: number): Option {
  const palette = paletteOf(taste, seriesCount);
  const days = ['一', '二', '三', '四', '五', '六', '日'];
  const base = [12.4, 9.8, 11.2, 14.1, 13.4, 16.2, 15.1];
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: palette,
    legend: { show: false },
    grid: { left: 48, right: 8, top: 12, bottom: 20 },
    xAxis: { type: 'category', data: days, axisTick: { show: false } },
    yAxis: {
      type: 'value',
      min: 0,
      scale: false,
      name: '成交额',
      axisLabel: { formatter: '{value}万' },
    },
    series: palette.map((color, index) => ({
      type: 'bar',
      name: index === 0 ? '成交额' : `成交额 ${index + 1}`,
      data: base.map((value) => Math.round((value - index * 1.4) * 10) / 10),
      barMaxWidth: 12,
      itemStyle: { color },
    })),
  };
}

function marketplace(taste: Taste, seriesCount: number): Option {
  const names = ['USD', 'EUR', 'GBP'] as const;
  const curves = [
    [100, 78, 66, 58],
    [100, 74, 60, 51],
    [100, 70, 55, 46],
  ];
  const palette = paletteOf(taste, seriesCount);
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: palette,
    legend: { show: false },
    grid: { left: 40, right: 48, top: 16, bottom: 22 },
    xAxis: { type: 'category', data: ['W0', 'W1', 'W4', 'W8'], axisTick: { show: false } },
    yAxis: { type: 'value', min: 0, scale: false, name: 'USD · EUR' },
    series: palette.map((color, index) => ({
      type: 'line',
      name: names[index % names.length],
      data: curves[index % curves.length],
      smooth: false,
      showSymbol: false,
      endLabel: { show: true, formatter: '{a}', color, fontSize: 12 },
      lineStyle: { width: index === 0 ? 2 : 1.5, color },
      itemStyle: { color },
    })),
  };
}

function editorial(taste: Taste, seriesCount: number): Option {
  const palette = paletteOf(taste, seriesCount);
  const curves = [
    [12, 40, 18],
    [10, 16, 14],
  ];
  return {
    animation: false,
    backgroundColor: taste.tokens.paper,
    color: palette,
    legend: { show: false },
    grid: { left: 40, right: 132, top: 16, bottom: 22 },
    xAxis: { type: 'category', data: ['Open', 'Peak', 'After'], axisTick: { show: false } },
    yAxis: { type: 'value', min: 0, scale: false, name: 'Readers' },
    series: palette.map((color, index) => ({
      type: 'line',
      name: index === 0 ? 'Readership' : `Readership ${index + 1}`,
      data: curves[index % curves.length],
      smooth: false,
      showSymbol: index === 0,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { width: index === 0 ? 2 : 1.5, color },
      itemStyle: { color },
    })),
  };
}

function primary(taste: Taste, knobs: TasteKnobs): Option {
  switch (taste.id) {
    case 'saas-dense':
      return saas(taste, knobs.series);
    case 'exec-brief':
      return exec(taste, knobs.series);
    case 'ops-wall':
      return ops(taste, knobs.series);
    case 'cn-ecommerce':
      return knobs.series === 1 ? funnel(taste) : cnBars(taste, knobs.series);
    case 'global-marketplace':
      return marketplace(taste, knobs.series);
    case 'editorial-data':
      return editorial(taste, knobs.series);
    default: {
      const never: never = taste.id;
      return never;
    }
  }
}

function oneChart(taste: Taste, knobs: TasteKnobs): Option {
  const chart = primary(taste, knobs);
  if (knobs.annotations > 0) return { ...chart, graphic: notes(taste, knobs.annotations) };
  return chart;
}

function rainbow(): Option {
  return {
    animation: true,
    backgroundColor: '#ffffff',
    color: [...rainbowColors],
    legend: { show: true },
    grid: { left: 28, right: 12, top: 36, bottom: 20 },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: rainbowColors.map((color, index) => ({
      type: index % 2 ? 'line' : 'bar',
      name: `Series ${index + 1}`,
      smooth: true,
      data: [8 + index, 14, 11 + index],
      itemStyle: { color },
      lineStyle: { color, width: 2 },
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
  const charts = Array.from({ length: Math.max(1, knobs.charts) }, () => oneChart(taste, knobs));
  if (charts.length === 1) return charts[0];
  return { charts: charts.map((option) => ({ option })) };
}
