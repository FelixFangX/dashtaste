import type { Rule } from '../types.js';
import { asArray, series, rule, charts } from './helpers.js';

/** An explicitly visible legend on one series repeats context. */
export const dt023: Rule = rule(
  23,
  'legend-single-series',
  'info',
  'An explicitly visible legend on one series repeats context.',
  'hide the legend or label the series directly',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      if (series(option).length === 1 && asArray(option.legend).some((l) => l.show !== false))
        emit(`${path}.legend`);
    });
  },
);
