import type { PackName, Mode, DeltaColors, Polarity } from './packs/index.js';
/** JSON-compatible ECharts options; unknown extension fields are retained. */
export interface ChartStyle {
  color?: string | Option;
  formatter?: string | ((...args: unknown[]) => unknown);
  fontSize?: number;
  fontWeight?: number | 'bold' | 'normal';
  show?: boolean;
}

/** Fields inspected by the rules; other ECharts fields remain available as unknown. */
export interface Option {
  [key: string]: unknown;
  series?: Option | Option[];
  xAxis?: Option | Option[];
  yAxis?: Option | Option[];
  legend?: Option | Option[];
  color?: string | string[];
  backgroundColor?: string;
  type?: string;
  data?: unknown[];
  lineStyle?: ChartStyle;
  itemStyle?: ChartStyle;
  textStyle?: ChartStyle;
  axisLabel?: ChartStyle;
  label?: ChartStyle;
  tooltip?: { show?: boolean; formatter?: unknown; valueFormatter?: unknown };
  name?: string;
  unit?: unknown;
  unitMetadata?: unknown;
  meta?: { unit?: unknown };
  radius?: string | number | (string | number)[];
  smooth?: boolean | number;
  showSymbol?: boolean;
  symbol?: string;
  roseType?: string | boolean;
  min?: number | string;
  scale?: boolean;
}
export interface ChartFacts {
  id?: string;
  option: Option;
}
export interface TextFact {
  selector: string;
  text: string;
  color: string;
  background: string;
  fontSize: number;
  fontWeight: number;
}
export interface DeltaFact {
  selector: string;
  text: string;
  color: string;
  direction?: 'up' | 'down' | 'flat';
  polarity?: Polarity;
}
export interface PageFacts {
  charts: ChartFacts[];
  texts?: TextFact[];
  gradients?: {
    selector: string;
    background: string;
  }[];
  shadows?: {
    selector: string;
    boxShadow: string;
    textShadow: string;
  }[];
  kpis?: {
    selector: string;
    text: string;
    color: string;
    background?: string;
  }[];
  deltas?: DeltaFact[];
  emojis?: {
    selector: string;
    text: string;
  }[];
  page?: {
    background?: string;
    deltaColors?: DeltaColors;
  };
}
export interface CheckOptions {
  pack?: PackName;
  mode?: Mode;
  background?: string;
  disable?: string[];
  only?: string[];
}
export type Severity = 'error' | 'warn' | 'info';
export interface Finding {
  ruleId: string;
  severity: Severity;
  message: string;
  path: string;
  fix: string;
}
export interface Rule {
  id: string;
  name: string;
  severity: Severity;
  packs: PackName[];
  description: string;
  fix: string;
  check: (
    facts: PageFacts,
    options: Required<Pick<CheckOptions, 'pack' | 'mode'>> & CheckOptions,
  ) => Finding[];
}
