import type { Rule } from '../types.js';
import { rule, sameColor } from './helpers.js';
import { rgb } from '../color.js';
import { getResolvedPack } from '../packs/index.js';

/** Directional colour must be accompanied by an arrow or signed number. */
export const dt014: Rule = rule(
  14,
  'delta-colour-only',
  'warn',
  'Directional colour must be accompanied by an arrow or signed number.',
  'add ▲/▼ or an explicit sign',
  function check(facts, context, emit) {
    const tokens = getResolvedPack(context)[context.mode];
    for (const delta of facts.deltas ?? []) {
      const hasDirection = /[▲▼↑↓]|[+-]\s*\d/.test(delta.text);
      if (hasDirection || sameColor(delta.color, tokens.muted)) continue;
      const channels = rgb(delta.color);
      const hasDirectionalColor = channels && Math.max(...channels) - Math.min(...channels) > 0.08;
      if (hasDirectionalColor) emit(delta.selector);
    }
  },
);
