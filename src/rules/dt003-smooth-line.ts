import type { Rule } from '../types.js';
import { series, rule, charts } from './helpers.js';

/** Line smoothing greater than zero draws values that do not exist. */
export const dt003: Rule = rule(
  3,
  'smooth-line',
  'warn',
  'Line smoothing greater than zero draws values that do not exist.',
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
