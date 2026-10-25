---
name: dashtaste-global
description: Build or review readable global-audience dashboards with concrete layout, chart, colour, and number defaults.
---

# Dashboard workflow

Use for dashboard pages, chart options, KPI strips, rankings, and dashboard reviews.
For a Chinese-market audience use dashtaste-cn.

1. Pick the global pack and light or dark mode before choosing colours.
2. Read [tokens](references/tokens.md) for exact colours and sizes.
3. Read [layout](references/layout.md) for page structure and controls.
4. Read [charts](references/charts.md) for the chart types you need.
5. Read [numbers](references/numbers.md) for units, dates, and comparisons.
6. Build the page with real data, explicit units, and clear hierarchy.
7. Run `npx dashtaste check options.json --pack global --max-warnings 0`.
   For a rendered page, check its URL with a browser available through `CHROME_PATH`.
8. Fix errors and warnings; inspect informational findings. Recheck after edits.
   Read [avoid](references/avoid.md) when replacing a flagged pattern.

## Ten rules to apply first

- DT001: Set explicit series colours from the selected pack.
- DT002: Stay within six categorical colours and five saturated hue buckets; group the tail as Other.
- DT003: Draw straight line segments; smoothing invents intermediate values.
- DT004: Use small dots only on short series (at most 31 points, 5px); otherwise hide symbols.
- DT005: Cap pie slices at five (eight for cn rose charts); prefer bars or Other for the rest.
- DT007: Use flat two-dimensional marks.
- DT009: Put units in value-axis names.
- DT010: Start bar value axes at zero and disable scale.
- DT013: Use green for improvement and red for deterioration; set lower-is-better polarity for churn and expenses.
- DT015: Meet 4.5:1 text contrast, or 3:1 for large text.

Prefer horizontal bars for shares on KPI boards; keep donut radius ratio at most 0.75 (DT006).

## Layout explains itself

Use no helper labels, explanatory captions, or “this chart shows” text.
Put units in axis names. Titles may state the finding, such as
“Returns fell for three weeks”. Labels identify data and controls directly.
Keep definitions in an accessible detail view when needed, outside chart captions.

Use one hero metric, one sheet, hairlines, and direct labels.
Use the measured defaults in the references for all KPI boards.
