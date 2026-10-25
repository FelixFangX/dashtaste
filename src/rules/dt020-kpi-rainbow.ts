import type { Rule } from '../types.js';
import { rule, sameColor } from './helpers.js';
import { rgb } from '../color.js';
import { getResolvedPack } from '../packs/index.js';

/** Three or more distinct accent colours on KPI values or tiles distract. Neutral greys and pack text/background tokens are excluded. */
export const dt020: Rule = rule(
  20,
  'kpi-rainbow',
  'warn',
  'Three or more distinct accent colours on KPI values or tiles distract. Neutral greys and pack text/background tokens are excluded.',
  'use ink for values and reserve colour for deltas',
  function check(facts, context, emit) {
    const tokens = getResolvedPack(context)[context.mode];
    const neutral = [
      tokens.ink,
      tokens.muted,
      tokens.paper,
      tokens.card,
      tokens.page,
      tokens.bg,
      tokens.panel,
    ].filter((entry): entry is string => typeof entry === 'string');
    const accent = (entry: string) => {
      const channels = rgb(entry);
      return (
        channels &&
        Math.max(...channels) - Math.min(...channels) > 0.08 &&
        !neutral.some((n) => sameColor(n, entry))
      );
    };
    const colors = (facts.kpis ?? [])
      .flatMap((kpi) => [kpi.color, kpi.background ?? ''])
      .filter(accent);
    if (new Set(colors.map((entry) => rgb(entry)?.join(','))).size >= 3) emit('page');
  },
);
