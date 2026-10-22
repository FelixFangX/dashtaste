import type { Rule } from '../types.js';
import { asArray, series, rule, charts } from './helpers.js';

/** Line symbols are noisy above 12 points; ECharts shows symbols by default. */
export const dt004: Rule = rule(
  4,
  'symbols-everywhere',
  'warn',
  'Line symbols are noisy above 12 points; ECharts shows symbols by default.',
  'set showSymbol: false',
  function check(facts, context, emit) {
    charts(facts, (option, path) =>
      series(option).forEach((item, index) => {
        if (
          item.type === 'line' &&
          item.showSymbol !== false &&
          item.symbol !== 'none' &&
          asArray(item.data).length > 12
        )
          emit(`${path}.series[${index}]`);
      }),
    );
  },
);
