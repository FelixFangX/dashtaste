import type { Rule } from '../types.js';
import { series, seriesColor, rule, charts, background } from './helpers.js';
import { contrast } from '../color.js';

/** Line colours need at least 3:1 against the chart background. */
export const dt016: Rule = rule(
  16,
  'thin-line-contrast',
  'warn',
  'Line colours need at least 3:1 against the chart background.',
  'darken light-mode lines or lighten dark-mode lines',
  function check(facts, context, emit) {
    charts(facts, (option, path) =>
      series(option).forEach((item, index) => {
        const lineColor = seriesColor(item, index, option);
        if (
          item.type === 'line' &&
          typeof lineColor === 'string' &&
          contrast(lineColor, background(facts, context, option)) < 3
        )
          emit(`${path}.series[${index}]`);
      }),
    );
  },
);
