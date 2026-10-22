import { rule, charts, series, asArray } from './helpers.js';
export const dt025 = rule(
  25,
  'legend-not-direct-label',
  'warn',
  'Two to four line series need direct labels instead of a legend.',
  'hide the legend and label series at their last point',
  (facts, context, emit) => {
    charts(facts, (option, path) => {
      const lines = series(option).filter((s) => s.type === 'line');
      if (lines.length < 2 || lines.length > 4) return;
      if (
        asArray(option.legend).some((l) => l.show !== false) &&
        !lines.every((s) => (s.endLabel as { show?: boolean } | undefined)?.show || s.label?.show)
      )
        emit(path);
    });
  },
);
