import { rule, charts, series } from './helpers.js';
export const dt026 = rule(
  26,
  'line-weight',
  'warn',
  'Line widths outside 1–3px obscure the data.',
  'use 2px main lines and 1.5px comparison lines',
  (facts, context, emit) => {
    charts(facts, (option, path) =>
      series(option).forEach((s, i) => {
        const width = s.lineStyle?.width;
        if (s.type === 'line' && typeof width === 'number' && (width < 1 || width > 3))
          emit(`${path}.series[${i}]`);
      }),
    );
  },
);
