import { packs } from '../packs/index.js';
import type { Rule } from '../types.js';
import { rule } from './helpers.js';

/** More than 6 global or 8 cn KPI tiles weakens priority. */
export const dt019: Rule = rule(
  19,
  'kpi-overload',
  'warn',
  'More than 6 global or 8 cn KPI tiles weakens priority.',
  'keep only primary KPIs in the first view',
  function check(facts, context, emit) {
    if ((facts.kpis?.length ?? 0) > packs[context.pack].limits.maxKpis) emit('page');
  },
);
