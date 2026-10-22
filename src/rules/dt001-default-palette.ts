import type { Rule } from '../types.js';
import { asArray, series, allColors, defaultColors, rule, charts } from './helpers.js';

/** Multiple series need explicit colours. Any default palette colour is flagged. */
export const dt001: Rule = rule(
  1,
  'default-palette',
  'error',
  'Multiple series need explicit colours. Any default palette colour is flagged.',
  'set option.color to the pack palette (dashtaste tokens --pack <pack>)',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      if (
        (series(option).length > 1 &&
          !asArray(option.color).length &&
          series(option).some((item) => !item.itemStyle?.color && !item.lineStyle?.color)) ||
        allColors(option).some((entry) => defaultColors.has(entry.toLowerCase()))
      )
        emit(path, 'default ECharts palette');
    });
  },
);
