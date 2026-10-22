import type { Rule } from '../types.js';
import { walk, rule, charts } from './helpers.js';

/** String formatter templates must use the selected compact unit system. */
export const dt012: Rule = rule(
  12,
  'unit-system',
  'warn',
  'String formatter templates must use the selected compact unit system.',
  'use cn 万/亿 or global K/M/B consistently',
  function check(facts, context, emit) {
    charts(facts, (option, path) => {
      walk(option, (key, value) => {
        if (
          /formatter/i.test(key) &&
          typeof value === 'string' &&
          (context.pack === 'cn' ? /(?:\}|\d|\s)[KMB]\b/.test(value) : /[万亿]/.test(value))
        )
          emit(path, 'formatter uses another unit system');
      });
    });
  },
);
