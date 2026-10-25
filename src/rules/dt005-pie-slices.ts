import { getResolvedPack } from '../packs/index.js';
import type { Rule } from '../types.js';
import { asArray, series, isPie, rule, charts } from './helpers.js';

/** Maximum 5 slices; cn rose charts allow 8. */
export const dt005: Rule = rule(
  5,
  'pie-slices',
  'warn',
  'Maximum 5 slices; cn rose charts allow 8.',
  'use horizontal bars or combine small parts into Other',
  function check(facts, context, emit) {
    charts(facts, (option, path) =>
      series(option).forEach((item, index) => {
        if (
          isPie(item) &&
          asArray(item.data).length >
            (item.roseType
              ? getResolvedPack(context).limits.maxRoseSlices
              : getResolvedPack(context).limits.maxPieSlices)
        )
          emit(`${path}.series[${index}]`);
      }),
    );
  },
);
