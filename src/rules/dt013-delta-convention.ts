import type { Rule } from '../types.js';
import { rule, sameColor, deltaDirection, conventionColor } from './helpers.js';
import { deltaSwapped, getResolvedPack } from '../packs/index.js';

/** Directional deltas must follow the page convention and metric polarity: global by polarity; cn red-up by default. */
export const dt013: Rule = rule(
  13,
  'delta-convention',
  'error',
  'Directional deltas must follow the page convention and metric polarity: global by polarity; cn red-up by default.',
  'apply one deltaColors convention to the whole page',
  function check(facts, context, emit) {
    const tokens = getResolvedPack(context)[context.mode];
    for (const delta of facts.deltas ?? []) {
      const swap = deltaSwapped(context.pack, facts.page?.deltaColors, delta.polarity);
      const dir = delta.direction ?? deltaDirection(delta.text);
      const expected =
        dir === 'up'
          ? swap
            ? tokens.down
            : tokens.up
          : dir === 'down'
            ? swap
              ? tokens.up
              : tokens.down
            : tokens.muted;
      if (!conventionColor(delta.color, expected) && !sameColor(delta.color, tokens.muted))
        emit(delta.selector);
    }
  },
);
