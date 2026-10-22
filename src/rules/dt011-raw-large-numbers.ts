import type { Rule } from '../types.js';
import { series, valueAxes, seriesValues, rule, charts } from './helpers.js';

/** At data maximum magnitude 10000 or above, axis, visible data label, and tooltip channels need formatters. */
export const dt011: Rule = rule(
  11,
  'raw-large-numbers',
  'warn',
  'At data maximum magnitude 10000 or above, axis, visible data label, and tooltip channels need formatters.',
  'format compact units: cn 万/亿; global K/M',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      if (
        !series(option).some((item) => seriesValues(item).some((value) => Math.abs(value) >= 10000))
      )
        return;
      valueAxes(option).forEach((axis) => {
        if (!axis.axisLabel?.formatter) emit(`${path}.${axis._path}.axisLabel`);
      });
      series(option).forEach((item, index) => {
        if (item.label?.show && !item.label.formatter) emit(`${path}.series[${index}].label`);
      });
      if (
        option.tooltip?.show !== false &&
        (option.tooltip || series(option).some((item) => item.tooltip)) &&
        !option.tooltip?.formatter &&
        !option.tooltip?.valueFormatter
      )
        emit(`${path}.tooltip`);
    });
  },
);
