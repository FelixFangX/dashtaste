import { getResolvedPack } from '../packs/index.js';
import { tasteByName } from '../tastes.js';
import type { Rule } from '../types.js';
import { rule } from './helpers.js';

/** KPI cap follows the selected taste. Without one, global allows 6 and cn allows 8. */
export const dt019: Rule = rule(
  19,
  'kpi-overload',
  'warn',
  'More KPI tiles than the selected taste allows weakens priority.',
  'keep only primary KPIs in the first view',
  function check(facts, context, emit) {
    const tasteCap = context.taste
      ? tasteByName(context.taste).composition.maxKpis
      : getResolvedPack(context).limits.maxKpis;
    const overlayCap = context.packOverlay?.limits?.maxKpis;
    const cap = overlayCap === undefined ? tasteCap : Math.min(tasteCap, overlayCap);
    if ((facts.kpis?.length ?? 0) > cap) emit('page');
  },
);
