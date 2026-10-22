import type { Rule } from '../types.js';
import { rule, charts } from './helpers.js';

/** Emoji in headings, KPI labels, and rankings add inconsistent iconography. */
export const dt021: Rule = rule(
  21,
  'emoji-icons',
  'warn',
  'Emoji in headings, KPI labels, and rankings add inconsistent iconography.',
  'use plain text and plain numerals for rankings',
  function check(facts, context, emit) {
    for (const entry of facts.emojis ?? []) emit(entry.selector);
    charts(facts, (option, path) => {
      if (/\p{Extended_Pictographic}/u.test(JSON.stringify(option.title ?? '')))
        emit(`${path}.title`);
    });
  },
);
