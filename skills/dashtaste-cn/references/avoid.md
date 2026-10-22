# Patterns to avoid

- DT001 default-palette: Multiple series need explicit colours. Any default palette colour is flagged. Fix: set option.color to the pack palette (dashtaste tokens --pack <pack>).
- DT002 rainbow-palette: More than 6 distinct categorical colours or more than 5 saturated 60-degree hue buckets. Fix: use the pack palette and group remaining categories as Other.
- DT003 smooth-line: Line smoothing greater than zero draws values that do not exist. Fix: use straight segments: smooth: false.
- DT004 symbols-everywhere: Line symbols are noisy above 12 points; ECharts shows symbols by default. Fix: set showSymbol: false.
- DT005 pie-slices: Maximum 5 slices; cn rose charts allow 8. Fix: use horizontal bars or combine small parts into Other.
- DT006 pie-overuse: More than one pie per page or radius ratio above 0.75 warns. A global pie is informational. Fix: prefer horizontal bars; keep donut radius ratio at most 0.75.
- DT007 three-d: 3D series, axes, coordinates, and pseudo-3D pie decoration distort comparisons. Fix: use flat 2D charts.
- DT008 dual-axis: Above two value axes warns; two axes warn for matching series types or unnamed global axes. Fix: use one axis or a named amount bar and rate line.
- DT009 missing-unit: Value axes need a name, formatter, or unit metadata. Fix: put units in axis names or formatter metadata.
- DT010 bar-baseline: Bar value axes must start at zero; positive min and scale: true distort lengths. Fix: set min: 0 and scale: false.
- DT011 raw-large-numbers: At data maximum magnitude 10000 or above, axis, visible data label, and tooltip channels need formatters. Fix: format compact units: cn 万/亿; global K/M.
- DT012 unit-system: String formatter templates must use the selected compact unit system. Fix: use cn 万/亿 or global K/M/B consistently.
- DT013 delta-convention: Directional deltas must follow one page convention: global green-up; cn red-up by default. Fix: apply one deltaColors convention to the whole page.
- DT014 delta-colour-only: Directional colour must be accompanied by an arrow or signed number. Fix: add ▲/▼ or an explicit sign.
- DT015 low-contrast-text: Text needs 4.5:1; at least 24px or 18.66px bold needs 3:1. Chart label defaults use 4.5:1. Fix: increase text contrast against its background.
- DT016 thin-line-contrast: Line colours need at least 3:1 against the chart background. Fix: darken light-mode lines or lighten dark-mode lines.
- DT017 gradient-decoration: Card/page gradients and linear or radial chart fills add decoration. Fix: use solid backgrounds and fills.
- DT018 glow: Coloured CSS shadows with blur at least 12px, or chart shadowBlur at least 10, create glow. Fix: remove glow and use hairline borders.
- DT019 kpi-overload: More than 6 global or 8 cn KPI tiles weakens priority. Fix: keep only primary KPIs in the first view.
- DT020 kpi-rainbow: Three or more distinct accent colours on KPI values or tiles distract. Neutral greys and pack text/background tokens are excluded. Fix: use ink for values and reserve colour for deltas.
- DT021 emoji-icons: Emoji in headings, KPI labels, and rankings add inconsistent iconography. Fix: use plain text and plain numerals for rankings.
- DT022 cjk-min-size: CJK text must be at least 12px. Fix: set CJK text to at least 12px.
- DT023 legend-single-series: An explicitly visible legend on one series repeats context. Fix: hide the legend or label the series directly.

No helper labels, explanatory captions, or “this chart shows” text. The layout should explain itself; units belong in axis names.
