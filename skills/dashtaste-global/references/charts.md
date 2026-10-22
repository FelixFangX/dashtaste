# Chart defaults

These complete light-mode options use small values so no compact formatter is needed.
Copy an option into a JSON file and check with `--pack global`.
For dark mode replace all foreground and surface colours using tokens.md; check with `--mode dark`.
For large values, convert data to display units and name the unit in the axis.
Keep raw values separately for accessible detail views.

## Line

Use for change over time. Keep straight segments and hide symbols. A 240px plot is a useful starting height.

<!-- prettier-ignore -->
```json
{
  "color": ["#2B4C7E"],
  "xAxis": {"type": "category", "data": ["Mon", "Tue", "Wed"]},
  "yAxis": {"type": "value", "name": "Orders"},
  "series": [{"type": "line", "smooth": false, "showSymbol": false, "data": [12, 18, 16]}]
}
```

## Bar

Compare amounts. Start at zero. Use horizontal bars for long category labels and 20–32px bar thickness.

<!-- prettier-ignore -->
```json
{
  "color": ["#2B4C7E"],
  "xAxis": {"type": "value", "name": "Orders", "min": 0, "scale": false},
  "yAxis": {"type": "category", "data": ["East", "West", "North"]},
  "series": [{"type": "bar", "barMaxWidth": 28, "data": [24, 18, 12]}]
}
```

## Combo

Use only for related amount and rate measures. Name both axes; put amount in bars and rate on a straight line.

<!-- prettier-ignore -->
```json
{
  "color": ["#2B4C7E", "#C2703D"],
  "xAxis": {"type": "category", "data": ["Mon", "Tue", "Wed"]},
  "yAxis": [{"type": "value", "name": "Orders", "min": 0}, {"type": "value", "name": "Rate (%)", "axisLabel": {"formatter": "{value}%"}}],
  "series": [{"name": "Orders", "type": "bar", "data": [24, 18, 12]}, {"name": "Rate", "type": "line", "yAxisIndex": 1, "showSymbol": false, "smooth": false, "data": [12, 15, 18]}]
}
```

## Share / pie / donut

Prefer bars for close shares. Use one pie per page, at most five parts, and a donut inner/outer radius ratio at most 0.75. Label parts directly.

<!-- prettier-ignore -->
```json
{
  "color": ["#2B4C7E", "#C2703D"],
  "series": [{"type": "pie", "radius": ["35%", "60%"], "label": {"show": true, "formatter": "{b}: {d}%"}, "data": [{"name": "New", "value": 60}, {"name": "Repeat", "value": 40}]}]
}
```

## Funnel

Use for ordered process stages with a shared population. Keep one colour, descending values, and visible stage labels.

<!-- prettier-ignore -->
```json
{
  "color": ["#2B4C7E"],
  "series": [{"type": "funnel", "sort": "descending", "label": {"show": true, "formatter": "{b}: {c}"}, "data": [{"name": "Started", "value": 90}, {"name": "Qualified", "value": 60}, {"name": "Completed", "value": 30}]}]
}
```

## Table

Use a semantic HTML table in production: left-align labels, right-align amounts, use 36px rows and hairline separators. This static ECharts graphic is a portable option example.

<!-- prettier-ignore -->
```json
{
  "graphic": [{"type": "text", "left": 16, "top": 16, "style": {"text": "Region        Orders", "fill": "#1B1B18", "fontSize": 14}}, {"type": "text", "left": 16, "top": 52, "style": {"text": "East                 24", "fill": "#1B1B18", "fontSize": 14}}]
}
```

## KPI

Use real text for accessible values in production. Default to ink, a 32px value, and a 14px label. Keep at most six primary KPIs. This option renders a static KPI.

<!-- prettier-ignore -->
```json
{
  "graphic": [{"type": "text", "left": 16, "top": 16, "style": {"text": "Orders", "fill": "#6B6B63", "fontSize": 14}}, {"type": "text", "left": 16, "top": 44, "style": {"text": "124", "fill": "#1B1B18", "fontSize": 32}}]
}
```

## Ranking / TOP N

Sort descending. Default to TOP 5; use TOP 10 only with room. Use plain bold numerals for places 1–3, no medals. Show the cutoff in the title.

<!-- prettier-ignore -->
```json
{
  "title": {"text": "Top 3 regions by orders"},
  "color": ["#2B4C7E"],
  "xAxis": {"type": "value", "name": "Orders", "min": 0},
  "yAxis": {"type": "category", "inverse": true, "data": ["1 East", "2 West", "3 North"]},
  "series": [{"type": "bar", "barMaxWidth": 24, "data": [24, 18, 12]}]
}
```

## Map

Use only for geographic questions, otherwise use ranking bars. Register a matching GeoJSON map as regions before setOption. Keep roam off and use a sequential scale with units.

<!-- prettier-ignore -->
```json
{
  "visualMap": {"min": 0, "max": 100, "text": ["Orders", "0"], "inRange": {"color": ["#E5EDF5", "#2B4C7E"]}},
  "series": [{"type": "map", "map": "regions", "roam": false, "data": [{"name": "East", "value": 24}, {"name": "West", "value": 18}]}]
}
```

## Shared interaction defaults

Use tooltip trigger axis for time series and item for isolated marks.
Use one explicit colour for a single series; do not rely on theme defaults.
Hide the legend for one series. Use a legend only when it resolves ambiguity.
Do not use decorative gradients, shadows, 3D marks, or emoji in titles.
Keep missing observations missing; do not replace them with zero.
Use stable ordering for categories unless ranking is the question.
Keep controls outside the plotting rectangle.
Provide keyboard access and a table or textual data alternative.
Use a finding title only when the data supports it after filtering.
A unit belongs in the axis name, not in a helper caption.
