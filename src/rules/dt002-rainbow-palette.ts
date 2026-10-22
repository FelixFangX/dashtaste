import type { Rule } from '../types.js';
import { allColors, rule, charts } from './helpers.js';
import { hueBucket } from '../color.js';

/** More than 6 distinct categorical colours or more than 5 saturated 60-degree hue buckets. */
export const dt002: Rule = rule(
  2,
  'rainbow-palette',
  'warn',
  'More than 6 distinct categorical colours or more than 5 saturated 60-degree hue buckets.',
  'use the pack palette and group remaining categories as Other',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      const colors = allColors(option);
      if (
        new Set(colors.map((entry) => entry.toLowerCase())).size > 6 ||
        new Set(colors.map(hueBucket).filter((entry) => entry !== undefined)).size > 5
      )
        emit(path);
    });
  },
);
