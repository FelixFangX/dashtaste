import { rule } from './helpers.js';
export const dt027 = rule(
  27,
  'tabular-numerals',
  'warn',
  'KPI numbers need tabular numerals.',
  'set font-variant-numeric to tabular-nums',
  (facts, context, emit) => {
    const numbers = [
      ...(facts.kpis ?? []),
      ...(facts.texts ?? []).filter(
        (t) => /^[\s+−\-\d,.%KMB万亿¥$€]+$/.test(t.text) && /\d/.test(t.text),
      ),
    ];
    const seen = new Set<string>();
    for (const n of numbers) {
      const tabular =
        /tabular-nums/.test(n.fontVariantNumeric ?? '') ||
        /["']tnum["'](?:\s+(?:1|on))?(?=\s*(?:,|$))/.test(n.fontFeatureSettings ?? '');
      if (!tabular && !seen.has(n.selector)) {
        emit(n.selector);
        seen.add(n.selector);
      }
    }
  },
);
