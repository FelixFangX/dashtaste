import type { Rule } from '../types.js';
import { series, walk, rule, charts } from './helpers.js';

/** 3D series, axes, coordinates, and pseudo-3D pie decoration distort comparisons. */
export const dt007: Rule = rule(
  7,
  'three-d',
  'error',
  '3D series, axes, coordinates, and pseudo-3D pie decoration distort comparisons.',
  'use flat 2D charts',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      let bad = false;
      walk(option, (key, value) => {
        if (
          (/3d|globe/i.test(key) && value !== false && value != null) ||
          (typeof value === 'string' &&
            (/3d|globe/i.test(value) || value === 'surface') &&
            ['type', 'coordinateSystem'].includes(key))
        )
          bad = true;
      });
      if (bad) emit(path);
    });
  },
);
