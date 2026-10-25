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
    monoFontFamily: string;
    axisSize: number;
    tracking: string;
    fontFamily: string;
    fontFeatureSettings: string;
    headingWeight: number;
    bodyWeight: number;
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

/** Resolve once in the engine; direct rule callers can use the base pack. */
export function getResolvedPack(options: { pack?: PackName; resolvedPack?: Pack }): Pack {
  return options.resolvedPack ?? packs[options.pack ?? 'global'];
}

export interface PackOverlay {
  id: string;
  extends: PackName;
  description?: string;
  limits?: Partial<Pack['limits']>;
  tokens?: { light?: Partial<Tokens>; dark?: Partial<Tokens> };
  disable?: string[];
}

/** Validate untrusted JSON before merging it with a built-in pack. */
export function parsePackOverlay(value: unknown): PackOverlay {
  const object = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object' && !Array.isArray(v);
  const fail = (message: string): never => {
    throw new Error(`invalid pack-file: ${message}`);
  };
  if (!object(value)) return fail('expected an object');
  if (typeof value.id !== 'string' || !value.id.trim()) fail('id must be a non-empty string');
  if (value.extends !== 'global' && value.extends !== 'cn') fail('extends must be global or cn');
  if (value.description !== undefined && typeof value.description !== 'string')
    fail('description must be a string');
  if (value.limits !== undefined) {
    if (!object(value.limits)) return fail('limits must be an object');
    for (const [key, limit] of Object.entries(value.limits)) {
      if (
        !Object.hasOwn(packs.global.limits, key) ||
        typeof limit !== 'number' ||
        !Number.isFinite(limit) ||
        limit < 0
      )
        fail(`limits.${key} must be a non-negative finite number for a supported limit`);
    }
  }
  if (value.tokens !== undefined) {
    if (!object(value.tokens)) return fail('tokens must be an object');
    for (const [mode, tokens] of Object.entries(value.tokens)) {
      if (mode !== 'light' && mode !== 'dark') fail('tokens mode must be light or dark');
      if (!object(tokens)) return fail(`tokens.${mode} must be an object`);
      for (const [key, token] of Object.entries(tokens)) {
        if (key === 'categorical' || key === 'sequential') {
          if (
            !Array.isArray(token) ||
            !token.length ||
            !token.every((entry) => typeof entry === 'string')
          )
            fail(`tokens.${mode}.${key} must be a non-empty string array`);
        } else if (typeof token !== 'string') fail(`tokens.${mode}.${key} must be a string`);
      }
    }
  }
  if (
    value.disable !== undefined &&
    (!Array.isArray(value.disable) || !value.disable.every((id) => typeof id === 'string'))
  )
    fail('disable must be an array of rule IDs');
  return value as unknown as PackOverlay;
}

export function resolvePackOverlay(overlay: PackOverlay): Pack {
  const base = structuredClone(packs[overlay.extends]);
  return {
    ...base,
    limits: { ...base.limits, ...overlay.limits },
    light: { ...base.light, ...overlay.tokens?.light } as Tokens,
    dark: { ...base.dark, ...overlay.tokens?.dark } as Tokens,
  };
}
