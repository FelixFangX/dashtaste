import type { PackName } from './packs/index.js';

export type TasteName =
  | 'saas-dense'
  | 'exec-brief'
  | 'ops-wall'
  | 'cn-ecommerce'
  | 'global-marketplace'
  | 'editorial-data';

export interface TasteTokens {
  paper: string;
  ink: string;
  muted: string;
  hairline: string;
  brand: string;
  up: string;
  down: string;
  categorical: readonly string[];
}

/** Numbers the checker enforces. A taste is this contract plus the tokens, not a color list alone. */
export interface TasteComposition {
  /** any: light or dark. paper: board-room sheet. dark: night ground. */
  ground: 'any' | 'paper' | 'dark';
  /** Relative luminance. Paper uses the minimum. Dark uses the maximum. */
  groundMinL: number;
  groundMaxL: number;
  maxCharts: number;
  maxSeries: number;
  maxKpis: number;
  maxAnnotations: number;
  minAnnotations: number;
  maxHueBuckets: number;
  maxCategorical: number;
  /** v1 tastes keep chart motion off. */
  motion: 'none';
  numberSystem: 'k-m-b' | 'wan-yi';
  /** Value axes must carry a currency mark. */
  currency: boolean;
  /** descending: an ascending funnel is a finding. null: sort is not policed. */
  funnel: 'descending' | null;
  maxFunnels: number;
}

export interface Taste {
  id: TasteName;
  title: string;
  school: string;
  summary: string;
  /** Short chips for the gallery card. */
  chips: string;
  /** Legacy `--pack` that resolves to this taste, when one exists. */
  packAlias?: PackName;
  /** Pack whose existing rules run with this taste. */
  basePack: PackName;
  defaultMode: 'light' | 'dark';
  tokens: TasteTokens;
  composition: TasteComposition;
}

const quiet = {
  motion: 'none' as const,
  groundMinL: 0.55,
  groundMaxL: 1,
};

export const tastes: Record<TasteName, Taste> = {
  'saas-dense': {
    id: 'saas-dense',
    title: 'SaaS dense',
    school: 'B2B metrics',
    summary: 'B2B metrics — compact, straight lines, no rainbow. Alias for --pack global.',
    chips: '≤8 charts · ≤3 series · straight lines',
    packAlias: 'global',
    basePack: 'global',
    defaultMode: 'light',
    tokens: {
      paper: '#F4F2EE',
      ink: '#1A1A18',
      muted: '#5F5F67',
      hairline: '#DEDCD6',
      brand: '#B65A08',
      up: '#107451',
      down: '#9B1745',
      categorical: ['#B65A08', '#544D61', '#9B896D', '#243635', '#B8BBC6'],
    },
    composition: {
      ...quiet,
      ground: 'any',
      maxCharts: 8,
      maxSeries: 3,
      maxKpis: 6,
      maxAnnotations: 6,
      minAnnotations: 0,
      maxHueBuckets: 5,
      maxCategorical: 6,
      numberSystem: 'k-m-b',
      currency: false,
      funnel: null,
      maxFunnels: 1,
    },
  },
  'exec-brief': {
    id: 'exec-brief',
    title: 'Exec brief',
    school: 'Board room',
    summary: 'Board room — one chart, a handful of KPIs, almost no annotation.',
    chips: '1 chart · ≤3 KPIs · paper',
    basePack: 'global',
    defaultMode: 'light',
    tokens: {
      paper: '#F7F4EF',
      ink: '#1C1917',
      muted: '#6F6A63',
      hairline: '#E6E0D6',
      brand: '#1C1917',
      up: '#1F6B4A',
      down: '#8E2F2F',
      categorical: ['#1C1917', '#8A8175'],
    },
    composition: {
      ...quiet,
      ground: 'paper',
      maxCharts: 1,
      maxSeries: 1,
      maxKpis: 3,
      maxAnnotations: 1,
      minAnnotations: 0,
      maxHueBuckets: 2,
      maxCategorical: 2,
      numberSystem: 'k-m-b',
      currency: false,
      funnel: null,
      maxFunnels: 0,
    },
  },
  'ops-wall': {
    id: 'ops-wall',
    title: 'Ops wall',
    school: 'SRE / status',
    summary: 'SRE wall — dark ground, status colours, motion off.',
    chips: 'Dark ground · status · no motion',
    basePack: 'global',
    defaultMode: 'dark',
    tokens: {
      paper: '#101614',
      ink: '#E7F6EC',
      muted: '#8AA399',
      hairline: '#24302C',
      brand: '#3DDC97',
      up: '#3DDC97',
      down: '#FF5D73',
      categorical: ['#3DDC97', '#E6B15C', '#FF5D73', '#8AA399'],
    },
    composition: {
      ...quiet,
      ground: 'dark',
      groundMinL: 0,
      groundMaxL: 0.15,
      maxCharts: 8,
      maxSeries: 3,
      maxKpis: 8,
      maxAnnotations: 4,
      minAnnotations: 0,
      maxHueBuckets: 4,
      maxCategorical: 4,
      numberSystem: 'k-m-b',
      currency: false,
      funnel: null,
      maxFunnels: 0,
    },
  },
  'cn-ecommerce': {
    id: 'cn-ecommerce',
    title: 'CN ecommerce',
    school: 'GMV and funnel',
    summary: 'Chinese commerce — 万/亿 ticks, descending funnels, red-up. Alias for --pack cn.',
    chips: '万/亿 · descending funnel · red-up',
    packAlias: 'cn',
    basePack: 'cn',
    defaultMode: 'light',
    tokens: {
      paper: '#F2F4F2',
      ink: '#141414',
      muted: '#636261',
      hairline: '#E6E6E6',
      brand: '#3E6A88',
      up: '#C8372F',
      down: '#167D4F',
      categorical: ['#3E6A88', '#20293A', '#C8372F', '#B4A85D', '#77C4D6'],
    },
    composition: {
      ...quiet,
      ground: 'any',
      maxCharts: 14,
      maxSeries: 4,
      maxKpis: 8,
      maxAnnotations: 12,
      minAnnotations: 0,
      maxHueBuckets: 5,
      maxCategorical: 6,
      numberSystem: 'wan-yi',
      currency: false,
      funnel: 'descending',
      maxFunnels: 4,
    },
  },
  'global-marketplace': {
    id: 'global-marketplace',
    title: 'Global marketplace',
    school: 'Cohort and currency',
    summary: 'Marketplace — currency on the axis, two series, a calm cohort line.',
    chips: 'Currency · ≤2 series · cohort',
    basePack: 'global',
    defaultMode: 'light',
    tokens: {
      paper: '#F3F6F8',
      ink: '#1E2A32',
      muted: '#5E6B74',
      hairline: '#D5DEE4',
      brand: '#3E6F8A',
      up: '#1F7A5A',
      down: '#8C4A55',
      categorical: ['#3E6F8A', '#1E2A32', '#8A8178'],
    },
    composition: {
      ...quiet,
      ground: 'paper',
      maxCharts: 4,
      maxSeries: 2,
      maxKpis: 4,
      maxAnnotations: 3,
      minAnnotations: 0,
      maxHueBuckets: 3,
      maxCategorical: 4,
      numberSystem: 'k-m-b',
      currency: true,
      funnel: null,
      maxFunnels: 0,
    },
  },
  'editorial-data': {
    id: 'editorial-data',
    title: 'Editorial data',
    school: 'Story charts',
    summary: 'Story chart — one annotation at least, two charts at most, one accent hue.',
    chips: 'Annotation first · ≤2 charts · one hue',
    basePack: 'global',
    defaultMode: 'light',
    tokens: {
      paper: '#F6F1E8',
      ink: '#1C1917',
      muted: '#6B645C',
      hairline: '#E4D9CC',
      brand: '#9A3412',
      up: '#3F6212',
      down: '#9A3412',
      categorical: ['#1C1917', '#9A3412', '#6B645C'],
    },
    composition: {
      ...quiet,
      ground: 'paper',
      maxCharts: 2,
      maxSeries: 2,
      maxKpis: 2,
      maxAnnotations: 6,
      minAnnotations: 1,
      maxHueBuckets: 2,
      maxCategorical: 3,
      numberSystem: 'k-m-b',
      currency: false,
      funnel: null,
      maxFunnels: 0,
    },
  },
};

export const tasteNames = Object.keys(tastes) as TasteName[];

/** `--pack global` is saas-dense. `--pack cn` is cn-ecommerce. */
export const packAlias = {
  global: 'saas-dense',
  cn: 'cn-ecommerce',
} as const satisfies Record<PackName, TasteName>;

export function isTaste(value: string): value is TasteName {
  return Object.prototype.hasOwnProperty.call(tastes, value);
}

export function resolveTaste(options: { pack?: string; taste?: string } = {}): TasteName {
  const taste = options.taste;
  const pack = options.pack;
  if (taste !== undefined && !isTaste(taste)) throw new TypeError('Unknown taste');
  if (pack !== undefined && pack !== 'global' && pack !== 'cn') throw new TypeError('Unknown pack');
  if (taste && pack && packAlias[pack] !== taste)
    throw new TypeError(`Pack ${pack} aliases ${packAlias[pack]}, not ${taste}`);
  if (taste) return taste;
  if (pack) return packAlias[pack];
  return 'saas-dense';
}

export function tasteByName(name: TasteName): Taste {
  return tastes[name];
}

/** One sentence an agent can follow without reading the rule source. */
export function tasteRules(taste: Taste): string {
  const c = taste.composition;
  const ground =
    c.ground === 'dark'
      ? `Near-black ground (luminance ≤ ${c.groundMaxL})`
      : c.ground === 'paper'
        ? `Paper ground (luminance ≥ ${c.groundMinL})`
        : 'Light or dark ground';
  const parts = [
    ground,
    `≤ ${c.maxCharts} charts`,
    `≤ ${c.maxSeries} series on a chart`,
    `≤ ${c.maxKpis} KPIs`,
    `${c.minAnnotations}–${c.maxAnnotations} story annotations`,
    `≤ ${c.maxCategorical} categorical colours`,
    `≤ ${c.maxHueBuckets} saturated hue buckets`,
    'animation off',
    c.numberSystem === 'wan-yi' ? '万/亿 ticks' : 'K/M/B ticks',
  ];
  if (c.currency) parts.push('a currency mark on every value axis');
  if (c.funnel === 'descending') parts.push(`≤ ${c.maxFunnels} funnels, sorted descending`);
  else if (c.maxFunnels === 0) parts.push('no funnels');
  else parts.push(`≤ ${c.maxFunnels} funnels`);
  return `${parts.join(', ')}.`;
}

export function tasteCatalog() {
  return tasteNames.map((id) => {
    const taste = tastes[id];
    return {
      id: taste.id,
      title: taste.title,
      school: taste.school,
      summary: taste.summary,
      chips: taste.chips,
      packAlias: taste.packAlias ?? null,
      basePack: taste.basePack,
      defaultMode: taste.defaultMode,
      tokens: taste.tokens,
      composition: taste.composition,
      rules: tasteRules(taste),
    };
  });
}

/** Colours drawn on a gallery card after the rainbow. */
export function signatureRamp(taste: Taste): readonly string[] {
  return taste.tokens.categorical;
}
