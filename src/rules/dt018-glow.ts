import type { Rule } from '../types.js';
import { walk, rule, charts } from './helpers.js';
import { rgb } from '../color.js';

/** Coloured CSS shadows with blur at least 12px, or chart shadowBlur at least 10, create glow. */
export const dt018: Rule = rule(
  18,
  'glow',
  'warn',
  'Coloured CSS shadows with blur at least 12px, or chart shadowBlur at least 10, create glow.',
  'remove glow and use hairline borders',
  function check(facts, context, emit) {
    for (const entry of facts.shadows ?? []) {
      const value = entry.boxShadow + ' ' + entry.textShadow;
      const chunks = value.split(/,(?![^()]*\))/);
      if (
        chunks.some((item) => {
          const nums = [
            ...item.replace(/rgba?\([^)]*\)|#[\da-f]+/gi, '').matchAll(/(-?[\d.]+)px/g),
          ].map((m) => +m[1]);
          const lineColor = item.match(/rgba?\([^)]*\)|#[\da-f]+/i)?.[0];
          const channels = lineColor ? rgb(lineColor) : undefined;
          return nums[2] >= 12 && channels && Math.max(...channels) - Math.min(...channels) > 0.05;
        })
      )
        emit(entry.selector);
    }
    charts(facts, (option, path) => {
      let found = false;
      walk(option, (key, value) => {
        if (key === 'shadowBlur' && typeof value === 'number' && value >= 10) found = true;
      });
      if (found) emit(path);
    });
  },
);
