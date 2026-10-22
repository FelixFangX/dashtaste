---
name: dashtaste-global
description: Use when building or reviewing dashboards, charts, KPI pages, or admin analytics for a global or English audience.
---

# Dashboard style

1. Pick the global pack when it fits the audience; ask if the audience is unclear.
2. Apply [tokens](references/tokens.md), [chart defaults](references/charts.md), [number conventions](references/numbers.md), and [patterns to avoid](references/avoid.md). Read the relevant references before building or reviewing.
3. After building, run `npx dashtaste check <url or option.json> --pack global` and fix every error. Use a locally installed package. For rendered HTML, install the optional browser dependency and set CHROME_PATH if needed.
4. Make the layout explain itself. No helper labels, explanatory captions, or “this chart shows” text. Put units in axis names.
