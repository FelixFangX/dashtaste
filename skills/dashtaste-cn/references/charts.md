# Chart defaults

| Type | Defaults |
| --- | --- |
| Line | 1.5px straight segments, no symbols; label endpoints if space permits |
| Bar | Zero baseline; horizontal for ranked categories; units in axis names |
| Categories | Use the categorical palette; reserve red/green for direction |
| Pie and donut | Donut at most 5 parts; rose at most 8 |
| Legend | Hide for one series; hide when direct labels fit |
| Map | Use a tile-grid province map instead of geographic shapes |

## ECharts line

```json
{"color":["#2A62D9","#36B3C2","#F0A33C","#2E3F66","#B9CFF5","#A8673A"],"xAxis":{"type":"category","data":["A","B"]},"yAxis":{"type":"value","name":"Count","min":0},"legend":{"show":false},"series":[{"type":"line","smooth":false,"showSymbol":false,"lineStyle":{"width":1.5},"data":[12,18]}]}
```

## ECharts ranked bars

```json
{"color":["#2A62D9"],"xAxis":{"type":"value","name":"Count","min":0},"yAxis":{"type":"category","data":["A","B"]},"series":[{"type":"bar","data":[12,18]}]}
```

## Amount and rate

A bar + line combo may use two named value axes. Set yAxisIndex: 0 on amount bars and yAxisIndex: 1 on the rate line. Label axes 金额（万） and 比率（%）. Do not use two bar or two line scales.

```json
{"color":["#2A62D9","#36B3C2"],"xAxis":{"type":"category","data":["A","B"]},"yAxis":[{"type":"value","name":"金额（万）","min":0},{"type":"value","name":"比率（%）"}],"series":[{"type":"bar","yAxisIndex":0,"data":[12,18]},{"type":"line","yAxisIndex":1,"smooth":false,"showSymbol":false,"data":[4,6]}]}
```
