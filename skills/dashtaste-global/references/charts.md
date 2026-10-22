# Chart defaults

| Type | Defaults |
| --- | --- |
| Line | 1.5px straight segments, no symbols; label endpoints if space permits |
| Bar | Zero baseline; horizontal for ranked categories; units in axis names |
| Categories | At most 5 categories plus grey Other |
| Pie and donut | Prefer horizontal bars; at most 5 parts |
| Legend | Hide for one series; hide when direct labels fit |
| Map | Use a table or ranked bars when location is not the question |

## ECharts line

```json
{"color":["#2B4C7E","#C2703D","#8E6C8A","#A7C4D9","#E2A55C"],"xAxis":{"type":"category","data":["A","B"]},"yAxis":{"type":"value","name":"Count","min":0},"legend":{"show":false},"series":[{"type":"line","smooth":false,"showSymbol":false,"lineStyle":{"width":1.5},"data":[12,18]}]}
```

## ECharts ranked bars

```json
{"color":["#2B4C7E"],"xAxis":{"type":"value","name":"Count","min":0},"yAxis":{"type":"category","data":["A","B"]},"series":[{"type":"bar","data":[12,18]}]}
```

Avoid dual axes. Use aligned small multiples when measures have different units.
