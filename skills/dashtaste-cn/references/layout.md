# Chinese-market page layout

## Page skeleton

Use a clear grid with 24px outer padding and 16px gutters.
Start with a 24px sans-serif page title and date controls.
Place the primary KPIs first, followed by trend, comparison, and detail.
A card grid is allowed when the regions have independent measures.
Use flat white cards in light mode, a 1px hairline, and at most 6px radius.
Use no shadow and no decorative icon tile.
Use 16px card padding and align card titles on a shared baseline.
Keep each card focused on one question.
Denser pages are acceptable; clutter is not.
Remove secondary measures before reducing text size.

## Date shortcut control

Place a segmented date control at the top, before the KPI grid.
Use 今天 / 昨天 / 近7天 / 近30天 / 本月 / 自定义。
Use 32–36px segments with a visible selected state.
Show the actual date range near the selected shortcut.
Use the same timezone and cutoff for every region on the page.
Keep region and category filters beside the date control when space allows.
Move filters onto a second line before truncating their values.
Provide keyboard navigation and visible focus.

## KPI card anatomy

Start with a 14px measure label.
Place a 32px ink value beneath it with a 14px unit on the same baseline.
Use a separate comparison row labelled 环比.
Use a second comparison row labelled 同比.
Keep both rows aligned across adjacent cards.
Show ▲ with red for an increase and ▼ with green for a decrease by default.
Use muted colour and no arrow for zero.
Show “–” for invalid comparisons, including a zero denominator.
An optional 48px sparkline can show recent movement.
Keep the sparkline straight, with no symbols, no axes, and no fill gradient.
Use four KPIs by default; keep at most eight primary KPIs.
Do not colour each KPI value differently.

## Rankings and charts

Default to TOP 5; use TOP 10 only when rows remain readable.
Use plain bold numerals for ranks 1–3, then regular numerals.
Use no medals, emoji, badges, or oversized rank backgrounds.
Right-align values and keep one unit throughout the list.
Use 36px ranking rows with optional hairline separators.
Keep axis labels at least 12px, including dense tables.
Use at most five pie slices, or eight for a justified rose chart.
Prefer bars when the task is comparing close amounts.
Put units in axis names; no helper labels or explanatory captions.
Titles can state findings. Never add “this chart shows” text.

## Dark big-screen mode

Use a 1920×1080 artboard as the composition reference.
Use 16px base text and 40–56px KPI values.
Use the dark bg token for the canvas and panel for regions.
Keep surfaces flat navy and dividers at 1px.
Use no glow, starfield, corner frames, neon, or 3D marks.
Use a 24px outer safe area and 16–24px gutters.
Keep the main trend central and supporting comparisons beside it.
Reserve saturated colour for data and selected controls.
Review the page at the actual viewing distance.
Do not enlarge every label just because the canvas is large.
Scale the composition for another display, then check text again.

## Copy and responsive review

Use full-width punctuation in Chinese prose.
Space Hanzi from Latin text and digits in prose.
Keep `1.23万` intact and use no space before `%`.
Use no uppercase or tracked labels and no serif page title.
Use `system-ui, sans-serif` with system CJK fallback only.
Keep all CJK text at least 12px, including tooltips.
On narrow screens use one chart column and two KPI columns.
Check long labels, missing data, empty states, and both colour modes.
