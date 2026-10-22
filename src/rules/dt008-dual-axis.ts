import type { Rule } from '../types.js';
import { valueAxes, rule, charts } from './helpers.js';

/** Multiple value axes obscure comparisons, including mixed bar and line charts. */
export const dt008: Rule = rule(
  8,
  'dual-axis',
  'warn',
  'Multiple value axes obscure comparisons, including mixed bar and line charts.',
  'use one value axis or aligned small multiples',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      const axes = valueAxes(option);
      if (axes.length < 2) return;
      emit(path);
    });
  },
);
