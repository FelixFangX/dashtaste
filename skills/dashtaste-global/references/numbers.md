# Numbers and dates

## Compact amounts

Keep counts below 10,000 grouped in full. Use K from 10,000, M at 1,000,000, and B at 1,000,000,000.
Auto examples: 12,300 → 12.3K; 2,300,000 → 2.3M.
Fix one display unit across a comparison table or shared axis.
Keep exact values in details when compact rounding hides a meaningful difference.
The formatter API uses auto units; fixed units are a local display calculation.

Use at most two decimals for Chinese compact units and one for global units.
Omit trailing zeroes on isolated compact amounts; use consistent decimals within a list or column.
Use `minimumFractionDigits: 2` for monetary lists and `compactFrom: 10000` for grouped full counts below 10,000.
Use integers for counts unless the measure is an average.
Use two decimals for monetary detail when required by the measure.
Use tabular numerals and right alignment for numeric columns.
Do not mix automatic unit switches within a shared chart axis.
Scale values before using a literal axis formatter; templates do not divide data.
A series value of 1.23 with axis name Orders (万) represents 12,300 orders.

## Percentages

Store rates as fractions in application data: 0.123 means 12.3%.
`formatPercent(0.123)` returns `12.3%`.
Use one decimal by default and zero for coarse whole-number shares.
Use two decimals only when changes at that scale matter.
Keep no space before `%`.
Distinguish a relative percent change from a percentage-point difference.
A move from 20% to 25% is +5 percentage points and +25% relative.

## Deltas

Compute (current − previous) / abs(previous).
Show ▲ for positive and ▼ for negative, always together with colour.
Zero is flat: `0.0%`, muted colour, no arrow.
Invalid values and a zero previous value display `–`.
Do not infer good or bad solely from direction; name the measure clearly.
Apply one page-wide delta convention, including tables and tooltips.
Default: green for improvement, red for deterioration. `polarity` defaults to
`higher-is-better`; set `lower-is-better` for churn, expenses, and refunds.
Arrows always follow the sign; rising churn is red. Mark deltas or ancestors with
`data-polarity="lower-is-better"` for extraction and DT013.
Explicit red-up or green-up conventions are page-wide directional overrides.
Label comparisons as prior period or prior year, with equal time coverage.
For incomplete periods compare equal elapsed durations.

## Dates and shortcuts

Display dates as `Oct 21, 2026`; use a consistent dashboard timezone.
Use Today / Yesterday / Last 7 days / Last 30 days / This month / Custom.
Define rolling calendar windows inclusively and show the selected range.
`formatDate` currently returns `2026-10-21` for both packs.
Use the explicit presentation adapter below for a global long date.

## Format API

```ts
import { formatCompact, formatPercent, formatDelta, formatDate } from 'dashtaste/format';

const amount = formatCompact(12300, 'global');
const rate = formatPercent(0.123, 1);
const delta = formatDelta(110, 100, 'global', { label: 'Prior period' });
// Render delta.text and delta.color together; preserve the returned direction.
const date = formatDate(new Date(2026, 9, 21), 'global');
const fixedWan = `${Number((12300 / 10000).toFixed(2))}万`;
const longDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(2026, 9, 21));
```

Set timezone handling before formatting server timestamps.
Never parse a display string back into analytical data.
Keep raw amounts, units, and comparison periods as separate fields.

## Numeral typography

Use "Inter" with font-feature-settings "tnum", "cv11".
Set font-variant-numeric: tabular-nums on every number.
Keep decimal precision consistent within each metric and table column.
Use 500 for headings and values, 400 for body text; never exceed 600.
Use one hero at 2.2 times the secondary KPI size or larger.
