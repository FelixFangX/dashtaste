import type { Rule } from '../types.js';
import { series, valueAxes, rule, charts } from './helpers.js';

/** Above two value axes warns; two axes warn for matching series types or unnamed global axes. */
export const dt008: Rule = rule(
  8,
  'dual-axis',
  'warn',
  'Above two value axes warns; two axes warn for matching series types or unnamed global axes.',
  'use one axis or a named amount bar and rate line',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      const axes = valueAxes(option);
      if (axes.length < 2) return;
      const types = series(option).map((item) => item.type);
      if (
        axes.length > 2 ||
        new Set(types).size < types.length ||
        (context.pack === 'global' && axes.some((entry) => !entry.name))
      )
        emit(path);
    });
  },
);
