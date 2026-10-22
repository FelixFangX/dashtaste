import { rule } from './helpers.js';
export const dt028 = rule(
  28,
  'hero-metric',
  'info',
  'Pages with at least three KPIs need a clear hero metric.',
  'make the largest KPI at least 1.6 times the median of the others',
  (facts, context, emit) => {
    const sizes = (facts.kpis ?? [])
      .map((k) => k.fontSize ?? 0)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);
    if (sizes.length < 3) return;
    const largest = sizes.pop()!;
    const mid = Math.floor(sizes.length / 2);
    const median = sizes.length % 2 ? sizes[mid] : (sizes[mid - 1] + sizes[mid]) / 2;
    if (largest < median * 1.6) emit('page.kpis');
  },
);
