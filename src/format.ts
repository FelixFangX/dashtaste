import {
  deltaSwapped,
  getTokens,
  type Polarity,
  type PackName,
  type DeltaColors,
  type Mode,
} from './packs/index.js';
export function formatCompact(
  value: number,
  pack: PackName,
  options: { minimumFractionDigits?: number; compactFrom?: number } = {},
): string {
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
  const unit = units.find(([n]) => Math.abs(value) >= Math.max(n, options.compactFrom ?? 10000));
  const minimumFractionDigits = options.minimumFractionDigits ?? 0;
  return unit
    ? `${(value / unit[0]).toLocaleString('en-US', { minimumFractionDigits, maximumFractionDigits: Math.max(minimumFractionDigits, pack === 'cn' ? 2 : 1), useGrouping: false })}${unit[1]}`
    : options.compactFrom !== undefined || options.minimumFractionDigits !== undefined
      ? value.toLocaleString('en-US', {
          minimumFractionDigits,
          maximumFractionDigits: Math.max(minimumFractionDigits, 2),
        })
      : value.toLocaleString('en-US', { maximumFractionDigits: 2 });
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
    polarity?: Polarity;
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
  const swapped = deltaSwapped(pack, options.deltaColors, options.polarity);
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
