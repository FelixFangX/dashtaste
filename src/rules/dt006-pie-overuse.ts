import type { Rule } from '../types.js';
import { series, isPie, pieRadii, rule, charts } from './helpers.js';

/** More than one pie per page or radius ratio above 0.75 warns. A global pie is informational. */
export const dt006: Rule = rule(
  6,
  'pie-overuse',
  'warn',
  'More than one pie per page or radius ratio above 0.75 warns. A global pie is informational.',
  'prefer horizontal bars; keep donut radius ratio at most 0.75',
  function check(facts, context, emit) {
    const count = facts.charts.reduce(
      (n, entry) => n + series(entry.option).filter(isPie).length,
      0,
    );
    charts(facts, (option, path) =>
      series(option).forEach((item, index) => {
        if (!isPie(item)) return;
        const channels = pieRadii(item);
        if (count > 1 || (channels.length === 2 && channels[0] / channels[1] > 0.75))
          emit(`${path}.series[${index}]`);
        else if (context.pack === 'global')
          emit(`${path}.series[${index}]`, 'prefer bars for part comparison', 'info');
      }),
    );
  },
);
