# Chart defaults

These complete light-mode options use small values so no compact formatter is needed.
Copy an option into a JSON file and check with `--pack cn`.
For dark mode replace all foreground and surface colours using tokens.md; check with `--mode dark`.
For large values, convert data to display units and name the unit in the axis.
Keep raw values separately for accessible detail views.

## Line

Use for change over time. Keep straight segments and hide symbols. A 240px plot is a useful starting height.

<!-- prettier-ignore -->
```json
{"color": ["#3E6A88"], "xAxis": {"type": "category", "data": ["Mon", "Tue", "Wed"]}, "yAxis": {"type": "value", "name": "Orders"}, "series": [{"type": "line", "smooth": false, "showSymbol": false, "data": [12, 18, 16], "lineStyle": {"width": 2}, "endLabel": {"show": true}}]}
```

## Bar

Compare amounts. Start at zero. Use horizontal bars for long category labels and at most 24px bar thickness (32px on screens).

<!-- prettier-ignore -->
```json
{"color": ["#3E6A88"], "xAxis": {"type": "value", "name": "Orders", "min": 0, "scale": false}, "yAxis": {"type": "category", "data": ["East", "West", "North"]}, "series": [{"type": "bar", "barMaxWidth": 24, "data": [24, 18, 12]}]}
```

## Combo

Use aligned panels for different units. Keep comparison series on one shared axis.

<!-- prettier-ignore -->
```json
{"color": ["#3E6A88"], "xAxis": {"type": "category", "data": ["Mon", "Tue", "Wed"]}, "yAxis": {"type": "value", "name": "Orders", "min": 0}, "series": [{"name": "Orders", "type": "bar", "data": [24, 18, 12], "barMaxWidth": 24}, {"name": "Prior orders", "type": "line", "showSymbol": false, "smooth": false, "data": [12, 15, 18], "lineStyle": {"width": 2}, "endLabel": {"show": true}}]}
```

## Share / pie / donut

No donuts or pies in KPI boards. Use a ranked bar list or a single 100% stacked bar with direct labels. The option below is for isolated composition analysis.

<!-- prettier-ignore -->
```json
{"color": ["#3E6A88"], "series": [{"type": "pie", "radius": ["35%", "60%"], "label": {"show": true, "formatter": "{b}: {d}%"}, "data": [{"name": "New", "value": 60}, {"name": "Repeat", "value": 40}]}]}
```

## Funnel

Use for ordered process stages with a shared population. Keep one colour, descending values, and visible stage labels.

<!-- prettier-ignore -->
```json
{"color": ["#3E6A88"], "series": [{"type": "funnel", "sort": "descending", "label": {"show": true, "formatter": "{b}: {c}"}, "data": [{"name": "Started", "value": 90}, {"name": "Qualified", "value": 60}, {"name": "Completed", "value": 30}]}]}
```

## Table

Use a semantic HTML table in production: left-align labels, right-align amounts, use 36px rows and hairline separators. This static ECharts graphic is a portable option example.

<!-- prettier-ignore -->
```json
{"graphic": [{"type": "text", "left": 16, "top": 16, "style": {"text": "Region        Orders", "fill": "#1D2433", "fontSize": 14}}, {"type": "text", "left": 16, "top": 52, "style": {"text": "East                 24", "fill": "#1D2433", "fontSize": 14}}]}
```

## KPI

Use real text with tabular figures. One 52–64px hero, 22–26px secondary values, 12–13px muted labels; weights 400 and 500.

<!-- prettier-ignore -->
```json
{"graphic": [{"type": "text", "left": 16, "top": 16, "style": {"text": "Orders", "fill": "#5F6B7E", "fontSize": 14}}, {"type": "text", "left": 16, "top": 44, "style": {"text": "124", "fill": "#1D2433", "fontSize": 32}}]}
```

## Ranking / TOP N

Sort descending. Default to TOP 5; use TOP 10 only with room. Use muted tabular ranks without medals. Show the cutoff in the title.

<!-- prettier-ignore -->
```json
{"title": {"text": "Top 3 regions by orders"}, "color": ["#3E6A88"], "xAxis": {"type": "value", "name": "Orders", "min": 0}, "yAxis": {"type": "category", "inverse": true, "data": ["1 East", "2 West", "3 North"]}, "series": [{"type": "bar", "barMaxWidth": 24, "data": [24, 18, 12]}]}
```

## Map

Use only for geographic questions, otherwise use ranking bars. Register a matching GeoJSON map as regions before setOption. Keep roam off and use a sequential scale with units.

<!-- prettier-ignore -->
```json
{"visualMap": {"min": 0, "max": 100, "text": ["Orders", "0"], "inRange": {"color": ["#3E6A88"]}}, "series": [{"type": "map", "map": "regions", "roam": false, "data": [{"name": "East", "value": 24}, {"name": "West", "value": 18}]}]}
```

## Shared interaction defaults

Use tooltip trigger axis for time series and item for isolated marks.
Use one explicit colour for a single series; do not rely on theme defaults.
Hide the legend for one series. For two to four series, hide legends and use end labels in series colour.
Do not use decorative gradients, shadows, 3D marks, or emoji in titles.
Keep missing observations missing; do not replace them with zero.
Use stable ordering for categories unless ranking is the question.
Keep controls outside the plotting rectangle.
Provide keyboard access and a table or textual data alternative.
Use a finding title only when the data supports it after filtering.
A unit belongs in the axis name, not in a helper caption.

## Measured defaults

Main lines use 2px, or 2.5px on screens; comparisons use 1.5px dashed grey.
Hide symbols except one 6px last-point dot and a direct label.
Use straight segments, horizontal grid lines, and no y-axis line.
Bars use at most 65% of their category band; keep value labels outside.
Use one accent mark and neutral context; reserve red and green for deltas.
Small multiples use 1.5px lines without axes and a shared scale per row.
No area gradients, glow, or decorative heavy strokes.
