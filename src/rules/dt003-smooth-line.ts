import type { Rule } from '../types.js';
import { series, rule, charts } from './helpers.js';

/** Smoothing is flagged. Interpolation can still be legitimate. */
export const dt003: Rule = rule(
  3,
  'smooth-line',
  'warn',
  'A smooth line is flagged. Interpolation can be legitimate; a hit is not proof the chart invented data.',
  'use straight segments: smooth: false',
  function check(facts, context, emit) {
    charts(facts, (option, path) =>
      series(option).forEach((item, index) => {
        if (
          item.type === 'line' &&
          (item.smooth === true || (typeof item.smooth === 'number' && item.smooth > 0))
        )
          emit(`${path}.series[${index}]`);
      }),
    );
  },
);
