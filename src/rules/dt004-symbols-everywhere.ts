import type { Rule } from '../types.js';
import { asArray, series, rule, charts } from './helpers.js';

/** Use small explicit dots only on short series; avoid default symbols everywhere. */
export const dt004: Rule = rule(
  4,
  'symbols-everywhere',
  'warn',
  'Use small explicit dots only on short series; avoid default symbols everywhere.',
  'use dots at most 5px on at most 31 points, or set showSymbol: false',
  function check(facts, context, emit) {
    charts(facts, (option, path) =>
      series(option).forEach((item, index) => {
        if (
          item.type === 'line' &&
          item.showSymbol !== false &&
          item.symbol !== 'none' &&
          asArray(item.data).length > 0 &&
          !(
            asArray(item.data).length <= 31 &&
            item.symbol === 'circle' &&
            typeof item.symbolSize === 'number' &&
            item.symbolSize <= 5 &&
            series(option).filter(
              (s) => s.type === 'line' && s.showSymbol !== false && s.symbol === 'circle',
            ).length <= 1
          ) &&
          !(
            asArray(item.data).length <= 31 &&
            item.symbol === 'emptyCircle' &&
            typeof item.symbolSize === 'number' &&
            item.symbolSize <= 5 &&
            item.lineStyle?.type === 'dashed'
          )
        )
          emit(`${path}.series[${index}]`);
      }),
    );
  },
);
