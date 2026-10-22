# Rules

Run checks with the intended pack and mode. Page-only rules require extracted page facts.
Errors reduce score by 10, warnings by 3, and information by 1; the minimum score is zero.

## DT001 default-palette

Severity: error. Packs: global, cn.

Why: Implicit theme colours make series meaning unstable across charts.

Triggers: Multiple series need explicit colours. Any default palette colour is flagged.

Fix: set option.color to the pack palette (dashtaste tokens --pack <pack>).

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "bar"
          },
          {
            "type": "line"
          }
        ]
      }
    }
  ]
}
```

## DT002 rainbow-palette

Severity: warn. Packs: global, cn.

Why: Too many competing hues make category comparison harder.

Triggers: More than 6 distinct categorical colours or more than 5 saturated 60-degree hue buckets.

Fix: use the pack palette and group remaining categories as Other.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "color": ["#110000", "#220000", "#330000", "#440000", "#550000", "#660000", "#770000"]
      }
    }
  ]
}
```

## DT003 smooth-line

Severity: warn. Packs: global, cn.

Why: Curves can imply observations that were never measured.

Triggers: Line smoothing greater than zero draws values that do not exist.

Fix: use straight segments: smooth: false.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "line",
            "smooth": true
          }
        ]
      }
    }
  ]
}
```

## DT004 symbols-everywhere

Severity: warn. Packs: global, cn.

Why: Repeated symbols obscure the line on longer time series.

Triggers: Line symbols are noisy above 12 points; ECharts shows symbols by default.

Fix: set showSymbol: false.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "line",
            "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          }
        ]
      }
    }
  ]
}
```

## DT005 pie-slices

Severity: warn. Packs: global, cn.

Why: Small pie slices are hard to compare and label.

Triggers: Maximum 5 slices; cn rose charts allow 8.

Fix: use horizontal bars or combine small parts into Other.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "pie",
            "data": [1, 1, 1, 1, 1, 1]
          }
        ]
      }
    }
  ]
}
```

## DT006 pie-overuse

Severity: warn. Packs: global, cn.

Why: Repeated pies and narrow rings make part comparison difficult.

Triggers: More than one pie per page or radius ratio above 0.75 warns. A global pie is informational.

Fix: prefer horizontal bars; keep donut radius ratio at most 0.75.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "pie",
            "radius": ["90%", "100%"],
            "data": [1, 2]
          }
        ]
      }
    }
  ]
}
```

## DT007 three-d

Severity: error. Packs: global, cn.

Why: Depth and perspective distort visible size.

Triggers: 3D series, axes, coordinates, and pseudo-3D pie decoration distort comparisons.

Fix: use flat 2D charts.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "bar3D"
          }
        ]
      }
    }
  ]
}
```

## DT008 dual-axis

Severity: warn. Packs: global, cn.

Why: Independent scales can imply misleading relationships.

Triggers: Above two value axes warns; two axes warn for matching series types or unnamed global axes.

Fix: use one axis or a named amount bar and rate line.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "yAxis": [
          {
            "type": "value",
            "name": "A"
          },
          {
            "type": "value",
            "name": "B"
          }
        ],
        "series": [
          {
            "type": "line"
          },
          {
            "type": "line"
          }
        ]
      }
    }
  ]
}
```

## DT009 missing-unit

Severity: warn. Packs: global, cn.

Why: A value without a unit is ambiguous.

Triggers: Value axes need a name, formatter, or unit metadata.

Fix: put units in axis names or formatter metadata.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "yAxis": {
          "type": "value"
        }
      }
    }
  ]
}
```

## DT010 bar-baseline

Severity: error. Packs: global, cn.

Why: Bar length encodes magnitude relative to zero.

Triggers: Bar value axes must start at zero; positive min and scale: true distort lengths.

Fix: set min: 0 and scale: false.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "bar"
          }
        ],
        "yAxis": {
          "min": 10
        }
      }
    }
  ]
}
```

## DT011 raw-large-numbers

Severity: warn. Packs: global, cn.

Why: Unformatted large values crowd labels and hide useful scale.

Triggers: At data maximum magnitude 10000 or above, axis, visible data label, and tooltip channels need formatters.

Fix: format compact units: cn 万/亿; global K/M.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "data": [10000]
          }
        ],
        "yAxis": {}
      }
    }
  ]
}
```

## DT012 unit-system

Severity: warn. Packs: global, cn.

Why: Mixed unit systems make comparisons harder to read.

Triggers: String formatter templates must use the selected compact unit system.

Fix: use cn 万/亿 or global K/M/B consistently.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "yAxis": {
          "axisLabel": {
            "formatter": "{value}万"
          }
        }
      }
    }
  ]
}
```

## DT013 delta-convention

Severity: error. Packs: global, cn.

Why: Changing colour conventions reverses the apparent meaning of a delta.

Triggers: Directional deltas must follow the page convention and metric polarity: global by polarity; cn red-up by default.

Fix: apply one deltaColors convention to the whole page.

Minimal failing input:

```json
{
  "charts": [],
  "deltas": [
    {
      "selector": "#delta",
      "text": "▲ 3%",
      "color": "#B4413A"
    }
  ]
}
```

## DT014 delta-colour-only

Severity: warn. Packs: global, cn.

Why: Colour alone excludes readers who cannot distinguish the chosen hues.

Triggers: Directional colour must be accompanied by an arrow or signed number.

Fix: add ▲/▼ or an explicit sign.

Minimal failing input:

```json
{
  "charts": [],
  "deltas": [
    {
      "selector": "#delta",
      "text": "3%",
      "color": "#2F7D4F"
    }
  ]
}
```

## DT015 low-contrast-text

Severity: error. Packs: global, cn.

Why: Low contrast makes text difficult to read.

Triggers: Text needs 4.5:1; at least 24px or 18.66px bold needs 3:1. Chart label defaults use 4.5:1.

Fix: increase text contrast against its background.

Minimal failing input:

```json
{
  "charts": [],
  "texts": [
    {
      "selector": "#text",
      "text": "Label",
      "color": "#eeeeee",
      "background": "#ffffff",
      "fontSize": 14,
      "fontWeight": 400
    }
  ]
}
```

## DT016 thin-line-contrast

Severity: warn. Packs: global, cn.

Why: Thin marks need stronger contrast than large filled regions.

Triggers: Line colours need at least 3:1 against the chart background.

Fix: darken light-mode lines or lighten dark-mode lines.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "backgroundColor": "#ffffff",
        "color": ["#eeeeee"],
        "series": [
          {
            "type": "line"
          }
        ]
      }
    }
  ]
}
```

## DT017 gradient-decoration

Severity: warn. Packs: global, cn.

Why: Decorative gradients add visual structure unrelated to data.

Triggers: Card/page gradients and linear or radial chart fills add decoration.

Fix: use solid backgrounds and fills.

Minimal failing input:

```json
{
  "charts": [],
  "gradients": [
    {
      "selector": ".card",
      "background": "linear-gradient(red, blue)"
    }
  ]
}
```

## DT018 glow

Severity: warn. Packs: global, cn.

Why: Glow blurs boundaries and competes with measured values.

Triggers: Coloured CSS shadows with blur at least 12px, or chart shadowBlur at least 10, create glow.

Fix: remove glow and use hairline borders.

Minimal failing input:

```json
{
  "charts": [],
  "shadows": [
    {
      "selector": ".card",
      "boxShadow": "0px 0px 14px rgb(0, 0, 255)",
      "textShadow": "none"
    }
  ]
}
```

## DT019 kpi-overload

Severity: warn. Packs: global, cn.

Why: Too many primary values weaken priority.

Triggers: More than 6 global or 8 cn KPI tiles weakens priority.

Fix: keep only primary KPIs in the first view.

Minimal failing input:

```json
{
  "charts": [],
  "kpis": [
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#111111"
    }
  ]
}
```

## DT020 kpi-rainbow

Severity: warn. Packs: global, cn.

Why: Competing KPI accents distract from the primary measures.

Triggers: Three or more distinct accent colours on KPI values or tiles distract. Neutral greys and pack text/background tokens are excluded.

Fix: use ink for values and reserve colour for deltas.

Minimal failing input:

```json
{
  "charts": [],
  "kpis": [
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#ff0000"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#00ff00"
    },
    {
      "selector": ".kpi",
      "text": "22",
      "color": "#0000ff"
    }
  ]
}
```

## DT021 emoji-icons

Severity: warn. Packs: global, cn.

Why: Emoji add inconsistent visual emphasis to functional labels.

Triggers: Emoji in headings, KPI labels, and rankings add inconsistent iconography.

Fix: use plain text and plain numerals for rankings.

Minimal failing input:

```json
{
  "charts": [],
  "emojis": [
    {
      "selector": "h1",
      "text": "\uD83C\uDFC6 Sales"
    }
  ]
}
```

## DT022 cjk-min-size

Severity: warn. Packs: cn.

Why: Small CJK glyphs lose essential detail.

Triggers: CJK text must be at least 12px.

Fix: set CJK text to at least 12px.

Minimal failing input (cn pack):

```json
{
  "charts": [],
  "texts": [
    {
      "selector": "#text",
      "text": "销量",
      "color": "#111111",
      "background": "#ffffff",
      "fontSize": 11,
      "fontWeight": 400
    }
  ]
}
```

## DT023 legend-single-series

Severity: info. Packs: global, cn.

Why: A single-series legend repeats context already available in the title.

Triggers: An explicitly visible legend on one series repeats context.

Fix: hide the legend or label the series directly.

Minimal failing input:

```json
{
  "charts": [
    {
      "option": {
        "series": [
          {
            "type": "bar"
          }
        ],
        "legend": {}
      }
    }
  ]
}
```
