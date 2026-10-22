import type { Rule } from '../types.js';
import { valueAxes, hasUnit, rule, charts } from './helpers.js';

/** Value axes need a name, formatter, unit metadata, or units in rendered ticks. */
export const dt009: Rule = rule(
  9,
  'missing-unit',
  'warn',
  'Value axes need a name, formatter, unit metadata, or units in rendered ticks.',
  'put units in axis names, rendered ticks, or formatter metadata',
  function check(facts, context, emit) {
    charts(facts, (option, path) =>
      valueAxes(option).forEach((axis) => {
        if (!hasUnit(axis)) emit(`${path}.${axis._path}`);
      }),
    );
  },
);
