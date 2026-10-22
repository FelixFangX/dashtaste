import { global } from './global.js';
import { cn } from './cn.js';
export type PackName = 'global' | 'cn';
export type Mode = 'light' | 'dark';
export type DeltaColors = 'red-up' | 'green-up' | 'by-polarity';
export type Polarity = 'higher-is-better' | 'lower-is-better';
export function deltaSwapped(
  pack: PackName,
  convention?: DeltaColors,
  polarity?: Polarity,
): boolean {
  const byPolarity =
    convention === 'by-polarity' || (pack === 'global' && convention === undefined);
  if (byPolarity) return (pack === 'cn') !== (polarity === 'lower-is-better');
  return (convention ?? packs[pack].deltaColors) !== packs[pack].deltaColors;
}
export interface Tokens {
  [key: string]: string | readonly string[];
  ink: string;
  muted: string;
  hairline: string;
  brand: string;
  other: string;
  up: string;
  down: string;
  categorical: readonly string[];
}
export interface Pack {
  name: PackName;
  deltaColors: DeltaColors;
  numberSystem: 'k-m-b' | 'wan-yi';
  limits: {
    maxPieSlices: number;
    maxRoseSlices: number;
    maxKpis: number;
    cjkMinFontSize: number;
  };
  screen?: {
    width: number;
    height: number;
    baseFontSize: number;
    kpiMinFontSize: number;
    kpiMaxFontSize: number;
  };
  light: Tokens;
  dark: Tokens;
  typography: {
    body: number;
    minimum: number;
  };
  spacing: readonly number[];
}
export const packs: Record<PackName, Pack> = { global, cn };
export { global, cn };
export function getTokens(pack: PackName, mode: Mode = 'light'): Tokens {
  return packs[pack][mode];
}
