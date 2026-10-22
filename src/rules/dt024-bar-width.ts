import { rule, charts, series } from './helpers.js';
export const dt024 = rule(
  24,
  'bar-width',
  'warn',
  'Bars need an explicit width cap of 24px, or 32px on screens.',
  'set barMaxWidth to 24 or less; use 32 or less on screens',
  (facts, context, emit) => {
    charts(facts, (option, path) =>
      series(option).forEach((s, i) => {
        if (s.type !== 'bar') return;
        const cap = context.pack === 'cn' && context.mode === 'dark' ? 32 : 24;
        const width = s.barMaxWidth ?? s.barWidth;
        if (
          typeof width !== 'number' ||
          width > cap ||
          width <= 0 ||
          (typeof s.barWidth === 'number' && s.barWidth > cap)
        )
          emit(`${path}.series[${i}]`);
      }),
    );
  },
);
