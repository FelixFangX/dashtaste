import type { Rule } from '../types.js';
import { tasteByName, type TasteName } from '../tastes.js';
import {
  funnelCount,
  hasAscendingFunnel,
  luminance,
  missingCurrency,
  pageAnnotations,
  paletteExceeds,
} from '../taste-metrics.js';
import { rule, series } from './helpers.js';

const tasteRule = (
  number: Parameters<typeof rule>[0],
  name: Parameters<typeof rule>[1],
  severity: Parameters<typeof rule>[2],
  description: Parameters<typeof rule>[3],
  fix: Parameters<typeof rule>[4],
  run: Parameters<typeof rule>[5],
) => rule(number, name, severity, description, fix, run);

const tasteOf = (context: { taste?: TasteName }) => tasteByName(context.taste ?? 'saas-dense');

/** Rainbow is an error in every taste, not a warning that a pack can waive. */
export const dt030: Rule = tasteRule(
  30,
  'taste-rainbow',
  'error',
  'A rainbow palette is an error in every taste: more than 6 colours or more than 5 saturated hue buckets.',
  "use this taste's categorical colours and group the tail as Other",
  (facts, context, emit) => {
    facts.charts.forEach((chart, index) => {
      if (paletteExceeds(chart.option, 6, 5)) emit(`charts[${index}]`, 'rainbow palette');
    });
  },
);

export const dt031: Rule = tasteRule(
  31,
  'taste-chart-cap',
  'warn',
  'More charts than this taste allows crowds the page.',
  "remove charts until the page is within this taste's chart cap",
  (facts, context, emit) => {
    const cap = tasteOf(context).composition.maxCharts;
    if (facts.charts.length > cap)
      emit(
        'page',
        `${context.taste} allows ${cap} chart${cap === 1 ? '' : 's'}; this page has ${facts.charts.length}`,
      );
  },
);

export const dt032: Rule = tasteRule(
  32,
  'taste-series-cap',
  'warn',
  'More series on one chart than this taste allows.',
  "split series into small multiples or drop them under this taste's series cap",
  (facts, context, emit) => {
    const cap = tasteOf(context).composition.maxSeries;
    facts.charts.forEach((chart, index) => {
      const count = series(chart.option).length;
      if (count > cap)
        emit(
          `charts[${index}]`,
          `${context.taste} allows ${cap} series on a chart; this chart has ${count}`,
        );
    });
  },
);

export const dt033: Rule = tasteRule(
  33,
  'taste-annotation',
  'warn',
  "Story annotations are outside this taste's minimum or maximum.",
  "add or remove graphic labels, mark lines, and named points until the count is inside the taste's range",
  (facts, context, emit) => {
    const { minAnnotations, maxAnnotations } = tasteOf(context).composition;
    const count = pageAnnotations(facts);
    if (count < minAnnotations || count > maxAnnotations)
      emit(
        'page',
        `${context.taste} allows ${minAnnotations}–${maxAnnotations} story annotations; this page has ${count}`,
      );
  },
);

export const dt034: Rule = tasteRule(
  34,
  'taste-motion',
  'warn',
  'Chart animation is on, and this taste keeps motion off.',
  'set animation: false',
  (facts, context, emit) => {
    if (tasteOf(context).composition.motion !== 'none') return;
    facts.charts.forEach((chart, index) => {
      if (chart.option.animation === true) emit(`charts[${index}]`, 'animation is on');
    });
  },
);

export const dt035: Rule = tasteRule(
  35,
  'taste-ground',
  'warn',
  'Background luminance disagrees with the taste ground. Dark grounds fail as an error; paper grounds warn.',
  "use this taste's paper colour, or switch to a taste whose ground matches the page",
  (facts, context, emit) => {
    const taste = tasteOf(context);
    const { ground, groundMinL, groundMaxL } = taste.composition;
    if (ground === 'any') return;
    const fallback = context.mode === 'dark' ? '#141412' : '#F7F5F1';
    facts.charts.forEach((chart, index) => {
      const color =
        context.background ??
        (typeof chart.option.backgroundColor === 'string'
          ? chart.option.backgroundColor
          : undefined) ??
        facts.page?.background ??
        fallback;
      const value = luminance(color);
      if (Number.isNaN(value)) return;
      const darkFail = ground === 'dark' && value > groundMaxL;
      const paperFail = ground === 'paper' && value < groundMinL;
      if (darkFail || paperFail)
        emit(
          `charts[${index}]`,
          `${taste.id} ground is ${ground}; background luminance is ${value.toFixed(2)}`,
          darkFail ? 'error' : 'warn',
        );
    });
  },
);

export const dt036: Rule = tasteRule(
  36,
  'taste-currency',
  'warn',
  'A value axis is missing a currency mark, and this taste is multi-currency.',
  'name the axis with a currency symbol or code, such as $, €, £, or ¥',
  (facts, context, emit) => {
    if (!tasteOf(context).composition.currency) return;
    facts.charts.forEach((chart, index) => {
      if (missingCurrency(chart.option))
        emit(`charts[${index}]`, 'value axis has no currency mark');
    });
  },
);

export const dt037: Rule = tasteRule(
  37,
  'taste-funnel',
  'warn',
  "A funnel breaks this taste's funnel rule: too many funnels, or a stage order that is not descending.",
  'keep funnel count within the cap and sort stages descending',
  (facts, context, emit) => {
    const taste = tasteOf(context);
    const count = funnelCount(facts);
    if (count > taste.composition.maxFunnels)
      emit(
        'page',
        `${taste.id} allows ${taste.composition.maxFunnels} funnels; this page has ${count}`,
      );
    if (taste.composition.funnel !== 'descending') return;
    facts.charts.forEach((chart, index) => {
      if (hasAscendingFunnel(chart.option)) emit(`charts[${index}]`, 'funnel is not descending');
    });
  },
);

export const dt038: Rule = tasteRule(
  38,
  'taste-palette',
  'warn',
  'More categorical colours or saturated hue buckets than this taste allows.',
  "stay inside this taste's colour cap; group the tail as Other",
  (facts, context, emit) => {
    const { maxCategorical, maxHueBuckets } = tasteOf(context).composition;
    facts.charts.forEach((chart, index) => {
      if (paletteExceeds(chart.option, maxCategorical, maxHueBuckets))
        emit(
          `charts[${index}]`,
          `${context.taste} allows ${maxCategorical} colours and ${maxHueBuckets} hue buckets`,
        );
    });
  },
);
