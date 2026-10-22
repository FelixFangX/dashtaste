import type { Rule } from '../types.js';
import { walk, rule, charts } from './helpers.js';

/** Card/page gradients and linear or radial chart fills add decoration. */
export const dt017: Rule = rule(
  17,
  'gradient-decoration',
  'warn',
  'Card/page gradients and linear or radial chart fills add decoration.',
  'use solid backgrounds and fills',
  function check(facts, context, emit) {
    for (const entry of facts.gradients ?? []) emit(entry.selector);
    charts(facts, (option, path) => {
      let found = false;
      walk(option, (key, value) => {
        if (key === 'type' && typeof value === 'string' && ['linear', 'radial'].includes(value))
          found = true;
      });
      if (found) emit(path);
    });
  },
);
