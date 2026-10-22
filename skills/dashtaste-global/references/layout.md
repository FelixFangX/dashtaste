# Global page layout

## Page skeleton

Use one document column, normally 1120–1280px wide.
Centre the column with at least 24px outer padding.
Start with a 24px page title and the selected date range.
Place the main decision first, then evidence, then detail.
Use a 32px gap between major sections.
Use a 16px gap between related elements.
Keep chart surfaces the same paper colour as the page.
Separate sections with a 1px hairline when whitespace is insufficient.
Do not wrap every section in a card.

## KPI strip

Keep primary KPIs in one row on a wide viewport.
Use three to six KPIs; fewer is often clearer.
Separate KPI columns with vertical hairline dividers.
Use no cards, shadows, icon tiles, or coloured value backgrounds.
Each column has a 14px label, 32px ink value, and 12px comparison.
Use smaller units next to values when the unit is fixed.
Keep numeric baselines aligned across the row.
Use colour only on the delta, with an arrow for direction.
Use muted text and no arrow for a flat comparison.
At narrow widths wrap into two columns, preserving reading order.
Keep the label and comparison with their value.

## Titles and evidence

Use finding-style titles when the data supports a claim.
Example: “Repeat orders rose for three weeks”.
Use a neutral measure title when the finding changes with filters.
Example: “Weekly repeat orders”.
Do not write helper labels or explanatory captions.
Do not write “this chart shows” text.
Put units in axis names, such as “Orders (K)”.
Use direct category labels where possible.
Avoid a legend for one series.
Keep method definitions in a separate accessible detail view.

## Filters

Use inline text controls near the title or section they affect.
Example: “Period: Last 30 days” followed by “Region: All”.
Use a visible label and keyboard focus for each control.
Show the selected value directly; avoid an icon-only trigger.
Use 32–36px control height and at least 8px separation.
Keep page-wide filters together above the KPI strip.
Keep local filters beside the relevant section title.
Preserve filter state when opening a detail view.

## Chart and table placement

Use one wide chart for the primary trend, typically 280–360px tall.
Use two columns only for related charts that remain legible.
Avoid more than two charts across the document column.
Align plot edges and category labels, not just outer containers.
Use tables for exact values and mixed measures.
Right-align numbers and keep units consistent within a column.
Use 36px table rows, 14px body text, and hairline row separators.
Limit initial rankings to TOP 5 and offer the full list separately.

## Responsive review

At 768px, move paired charts into one column.
At 375px, retain readable text and allow a table region to scroll.
Do not shrink text to fit a desktop composition.
Check empty, loading, long-label, and missing-data states.
Keep empty states concise and provide a useful next action.
Read the page in source order with styling disabled.
Check keyboard access, visible focus, and contrast in both modes.
Use the same structure in dark mode with dark pack tokens.
