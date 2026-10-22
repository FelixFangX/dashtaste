import { packs, getTokens, type PackName, type DeltaColors, type Mode } from './packs/index.js';
export function formatCompact(value: number, pack: PackName): string {
  if (!Number.isFinite(value)) return '–';
  const units: [number, string][] =
    pack === 'cn'
      ? [
          [1e8, '亿'],
          [1e4, '万'],
        ]
      : [
          [1e9, 'B'],
          [1e6, 'M'],
          [1e3, 'K'],
        ];
  const unit = units.find(([n]) => Math.abs(value) >= n);
  return unit
    ? `${Number((value / unit[0]).toFixed(pack === 'cn' ? 2 : 1))}${unit[1]}`
    : String(value);
}
export function formatPercent(value: number, digits = 1): string {
  return Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : '–';
}
export function formatDelta(
  current: number,
  previous: number,
  pack: PackName,
  options: {
    label?: string;
    deltaColors?: DeltaColors;
    mode?: Mode;
  } = {},
) {
  const t = getTokens(pack, options.mode);
  const delta = (current - previous) / Math.abs(previous);
  const direction =
    !Number.isFinite(current) || !Number.isFinite(previous) || previous === 0
      ? 'invalid'
      : delta === 0
        ? 'flat'
        : delta > 0
          ? 'up'
          : 'down';
  const swapped = (options.deltaColors ?? packs[pack].deltaColors) !== packs[pack].deltaColors;
  const color =
    direction === 'up'
      ? swapped
        ? t.down
        : t.up
      : direction === 'down'
        ? swapped
          ? t.up
          : t.down
        : t.muted;
  const text =
    direction === 'invalid'
      ? '–'
      : `${direction === 'up' ? '▲ ' : direction === 'down' ? '▼ ' : ''}${formatPercent(Math.abs(delta))}`;
  return {
    text: options.label && direction !== 'invalid' ? `${options.label} ${text}` : text,
    direction,
    color,
  } as const;
}
/** Uses local calendar fields; no locale-dependent date ordering. */
export function formatDate(value: Date | string | number, pack: PackName = 'cn'): string {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return '–';
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return pack === 'cn' ? iso : iso;
}
