# Numbers and dates

## Compact amounts

Use 万 at 10,000 and 亿 at 100,000,000.
Use `1.23万`, with no internal space.
Fix a column to 万 when comparing rows or charts near a unit threshold.
For example, 9,800 and 12,300 become 0.98万 and 1.23万 in that column.
Use auto units for isolated KPIs with very different scales.
Auto examples: 12,300 → 1.23万; 230,000,000 → 2.3亿.
The formatter API uses auto units; fixed 万 is a local display calculation.

Use at most two decimals for Chinese compact units and one for global units.
Omit trailing zeroes on compact amounts.
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
Default: red up, green down. A deliberate green-up override must cover the page.
同比 compares the same period in the previous year.
环比 compares the immediately preceding period of the same length.
日环比 compares today with yesterday at the same elapsed cutoff.
周同比 compares with the same weekday of the previous week.
For incomplete periods compare equal elapsed durations, not full prior periods.
Label each comparison explicitly; never use a bare second percentage.

## Dates and shortcuts

Display dates as `2026-10-21`; use 24-hour times such as `14:30`.
Date shortcuts: 今天 / 昨天 / 近7天 / 近30天 / 本月 / 自定义。
Define 近7天 and 近30天 as inclusive calendar windows ending today.
本月 starts on day 1 and ends at the selected cutoff today.
今天 and 昨天 use the dashboard timezone, not the viewer's implicit timezone.
Use full-width punctuation in Chinese prose and spaces around Latin text or digits.
Keep compact values such as `1.23万` and percentages such as `12%` intact.

## Format API

```ts
import { formatCompact, formatPercent, formatDelta, formatDate } from 'dashtaste/format';

const amount = formatCompact(12300, 'cn');
const rate = formatPercent(0.123, 1);
const delta = formatDelta(110, 100, 'cn', { label: '环比' });
// Render delta.text and delta.color together; preserve the returned direction.
const date = formatDate(new Date(2026, 9, 21), 'cn');
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
