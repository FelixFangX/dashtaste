import { hueBucket, linear, rgb } from './color.js';
import { allColors, isRecord, series, valueAxes } from './rules/helpers.js';
import type { Option, PageFacts } from './types.js';

const weights = [0.2126, 0.7152, 0.0722];

export function luminance(color: string): number {
  const channels = rgb(color);
  if (!channels) return Number.NaN;
  return channels.map(linear).reduce((sum, value, index) => sum + value * weights[index], 0);
}

export function paletteExceeds(option: Option, maxColors: number, maxHues: number): boolean {
  const colors = allColors(option);
  return (
    new Set(colors.map((entry) => entry.toLowerCase())).size > maxColors ||
    new Set(colors.map(hueBucket).filter((entry) => entry !== undefined)).size > maxHues
  );
}

function visitGraphic(node: unknown, countText: () => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => visitGraphic(child, countText));
    return;
  }
  if (!isRecord(node)) return;
  if (node.type === 'text') countText();
  if (node.children) visitGraphic(node.children, countText);
  if (node.elements) visitGraphic(node.elements, countText);
}

/** Story marks: graphic text, mark lines, mark areas, and named mark points. Endpoint dots are not stories. */
export function annotationCount(option: Option): number {
  let count = 0;
  visitGraphic(option.graphic, () => {
    count += 1;
  });
  for (const item of series(option)) {
    const markLine = item.markLine;
    if (isRecord(markLine) && Array.isArray(markLine.data)) count += markLine.data.length;
    const markArea = item.markArea;
    if (isRecord(markArea) && Array.isArray(markArea.data)) count += markArea.data.length;
    const markPoint = item.markPoint;
    if (isRecord(markPoint) && Array.isArray(markPoint.data))
      count += markPoint.data.filter(
        (entry) => isRecord(entry) && typeof entry.name === 'string',
      ).length;
  }
  return count;
}

export function pageAnnotations(facts: PageFacts): number {
  return facts.charts.reduce((sum, chart) => sum + annotationCount(chart.option), 0);
}

const currency = /[$€£¥₩]|\b(?:USD|EUR|GBP|CNY|JPY|KRW)\b/;

export function missingCurrency(option: Option): boolean {
  const axes = valueAxes(option);
  if (!axes.length) return false;
  return axes.some((axis) => {
    const ticks = Array.isArray(axis.renderedTickLabels) ? axis.renderedTickLabels.join(' ') : '';
    return !currency.test(`${axis.name ?? ''} ${axis.axisLabel?.formatter ?? ''} ${ticks}`);
  });
}

export function funnelCount(facts: PageFacts): number {
  return facts.charts.reduce(
    (sum, chart) => sum + series(chart.option).filter((item) => item.type === 'funnel').length,
    0,
  );
}

export function hasAscendingFunnel(option: Option): boolean {
  return series(option).some((item) => item.type === 'funnel' && item.sort === 'ascending');
}
