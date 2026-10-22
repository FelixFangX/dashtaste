import type { Rule } from '../types.js';
import { series, valueAxes, rule, charts } from './helpers.js';

/** Bar value axes must start at zero; positive min and scale: true distort lengths. */
export const dt010: Rule = rule(
  10,
  'bar-baseline',
  'error',
  'Bar value axes must start at zero; positive min and scale: true distort lengths.',
  'set min: 0 and scale: false',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      valueAxes(option).forEach((axis) => {
        const bars = series(option).filter(
          (item) =>
            item.type === 'bar' && (item[`${axis._dimension}AxisIndex`] ?? 0) === axis._index,
        );
        if (bars.length && ((typeof axis.min === 'number' && axis.min > 0) || axis.scale === true))
          emit(`${path}.${axis._path}`);
      });
    });
  },
);
