---
name: dashtaste-cn
description: Build or review readable Chinese-market dashboards with concrete layout, chart, colour, and number defaults.
---

# Dashboard workflow

Use for dashboard pages, chart options, KPI strips, rankings, and dashboard reviews.
For a global audience use dashtaste-global.

1. Pick the cn pack and light or dark mode before choosing colours.
2. Read [tokens](references/tokens.md) for exact colours and sizes.
3. Read [layout](references/layout.md) for page structure and controls.
4. Read [charts](references/charts.md) for the chart types you need.
5. Read [numbers](references/numbers.md) for units, dates, and comparisons.
6. Build the page with real data, explicit units, and clear hierarchy.
7. Run `npx dashtaste check options.json --pack cn --max-warnings 0`.
   For a rendered page, check its URL with a browser available through `CHROME_PATH`.
8. Fix errors and warnings; inspect informational findings. Recheck after edits.
   Read [avoid](references/avoid.md) when replacing a flagged pattern.

## Ten rules to apply first

- DT001: Set explicit series colours from the selected pack.
- DT002: Keep at most five categorical colours; group the tail as Other.
- DT003: Draw straight line segments; smoothing invents intermediate values.
- DT004: Hide line symbols above 12 points.
- DT005: Use ranked bars for shares; no donuts in KPI boards.
- DT007: Use flat two-dimensional marks.
- DT009: Put units in value-axis names.
- DT010: Start bar value axes at zero and disable scale.
- DT013: Use red-up and green-down deltas throughout the page.
- DT015: Meet 4.5:1 text contrast, or 3:1 for large text.

## Layout explains itself

Use no helper labels, explanatory captions, or “this chart shows” text.
Put units in axis names. Titles may state the finding, such as
“Returns fell for three weeks”. Labels identify data and controls directly.
Keep definitions in an accessible detail view when needed, outside chart captions.

## Chinese copy

Use full-width punctuation in Chinese prose. Add a space between Hanzi and
Latin text or digits in prose; keep `1.23万` and `12%` intact.
Use no uppercase or tracked labels and no serif page title.
Keep CJK text at least 12px, or 16px on screens. Use the numeral face
and CJK fallback specified in references/numbers.md.

Use one hero metric, one sheet, hairlines, and direct labels.
Use the measured defaults in the references for all KPI boards.
