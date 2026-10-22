import { rgb } from '../color.js';
import { packs, getTokens } from '../packs/index.js';
import type { Rule, Option, PageFacts, CheckOptions, Finding, Severity } from '../types.js';

export function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export function series(option: Option): Option[] {
  return asArray(option.series);
}

interface ValueAxis extends Option {
  _dimension: 'x' | 'y';
  _index: number;
  _path: string;
}

/** An axis without a declared type or category data defaults to a value axis. */
export function valueAxes(option: Option): ValueAxis[] {
  const axes: ValueAxis[] = [];
  for (const dimension of ['x', 'y'] as const) {
    const options = dimension === 'x' ? option.xAxis : option.yAxis;
    asArray(options).forEach((axis, index) => {
      if (axis.type === 'value' || (!axis.type && !axis.data)) {
        axes.push({
          ...axis,
          _dimension: dimension,
          _index: index,
          _path: `${dimension}Axis[${index}]`,
        });
      }
    });
  }
  return axes;
}

/** Data may contain numbers, coordinate tuples, or objects with a value field. */
export function seriesValues(item: Option): number[] {
  return asArray(item.data).flatMap((datum) => {
    const value = isRecord(datum) ? datum.value : datum;
    return asArray(value).filter(
      (entry): entry is number => typeof entry === 'number' && Number.isFinite(entry),
    );
  });
}

export function seriesColor(item: Option, index: number, option: Option): unknown {
  const palette = asArray(option.color);
  return (
    item.lineStyle?.color ?? item.itemStyle?.color ?? palette[index % Math.max(1, palette.length)]
  );
}

export function allColors(option: Option): string[] {
  const colors: unknown[] = [...asArray(option.color)];
  series(option).forEach((item, index) => {
    colors.push(seriesColor(item, index, option));
    for (const datum of asArray(item.data)) {
      if (isRecord(datum) && isRecord(datum.itemStyle)) colors.push(datum.itemStyle.color);
    }
  });
  return colors.filter((color): color is string => typeof color === 'string');
}

export function walk(value: unknown, visit: (key: string, value: unknown) => void): void {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    visit(key, child);
    walk(child, visit);
  }
}

export function isPie(item: Option): boolean {
  return item.type === 'pie';
}

export function pieRadii(item: Option): number[] {
  return asArray(item.radius).map((radius) => parseFloat(String(radius)));
}

export function hasUnit(axis: Option): boolean {
  return !!(
    axis.name ||
    axis.unit ||
    axis.unitMetadata ||
    axis.meta?.unit ||
    axis.axisLabel?.formatter
  );
}

export const defaultColors = new Set([
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
]);

export type Context = Required<Pick<CheckOptions, 'pack' | 'mode'>> & CheckOptions;
export type Emit = (path: string, message?: string, severity?: Severity) => void;

/** Keep finding metadata and default messages consistent across all rule checks. */
export function rule(
  number: number,
  name: string,
  severity: Severity,
  description: string,
  fix: string,
  run: (facts: PageFacts, context: Context, emit: Emit) => void,
  cnOnly = false,
): Rule {
  const id = `DT${String(number).padStart(3, '0')}`;
  return {
    id,
    name,
    severity,
    packs: cnOnly ? ['cn'] : ['global', 'cn'],
    description,
    fix,
    check(facts, context) {
      const findings: Finding[] = [];
      const emit: Emit = (path, message = name.replaceAll('-', ' '), level = severity) => {
        findings.push({ ruleId: id, severity: level, message, path, fix });
      };
      run(facts, context, emit);
      return findings;
    },
  };
}

export function charts(facts: PageFacts, visit: (option: Option, path: string) => void): void {
  facts.charts.forEach((chart, index) => visit(chart.option, `charts[${index}]`));
}

export function background(facts: PageFacts, context: Context, option?: Option): string {
  const tokens = getTokens(context.pack, context.mode);
  return (
    context.background ??
    option?.backgroundColor ??
    facts.page?.background ??
    String(tokens.paper ?? tokens.card ?? tokens.panel)
  );
}

/** Allow small rounding differences between hex and computed CSS colours. */
export function sameColor(first: string, second: string): boolean {
  const firstChannels = rgb(first);
  const secondChannels = rgb(second);
  return (
    !!firstChannels &&
    !!secondChannels &&
    firstChannels.every((channel, index) => Math.abs(channel - secondChannels[index]) < 0.015)
  );
}

export function deltaDirection(text: string): 'up' | 'down' | 'flat' {
  if (/[▼↓]|-\s*\d/.test(text)) return 'down';
  if (/[▲↑]|\+\s*\d/.test(text)) return 'up';
  return 'flat';
}

function dominantChannel(channels: number[]): 'red' | 'green' | 'other' {
  const [red, green, blue] = channels;
  if (red > green * 1.15 && red > blue * 1.15) return 'red';
  if (green > red * 1.15 && green > blue * 1.05) return 'green';
  return 'other';
}

export function conventionColor(color: string, expected: string): boolean {
  if (sameColor(color, expected)) return true;
  const actualChannels = rgb(color);
  const expectedChannels = rgb(expected);
  if (!actualChannels || !expectedChannels) return false;
  const actualChannel = dominantChannel(actualChannels);
  return actualChannel !== 'other' && actualChannel === dominantChannel(expectedChannels);
}

/** Narrow JSON objects before inspecting extension fields. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
