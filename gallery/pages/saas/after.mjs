import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, tick, money, compact, delta, metric, line, chart, spark, table, event, ready } =
  await setup('saas', 'Revenue', 'Jun 2025 – Nov 2026');
const d = data.saas,
  k = kpisFor('saas');
const rail = k.slice(1);
root.innerHTML += `<div class="top"><section><div style="display:flex;justify-content:space-between;align-items:end">${metric('MRR', money(k[0][1]), delta(k[0][1], k[0][3]), true)}</div><div class="bridge"><h2>November</h2><div id="bridge" style="height:108px;width:100%"></div></div><div id="mrr" class="chart" style="height:165px"></div></section><aside class="rail">${rail.map(([label, v, type, p], i) => `<div class="rail-row">${metric(label, type === 'money' ? money(v) : type === 'percent' ? (v * 100).toFixed(2) + '%' : compact(v), delta(v, p, 'vs Oct', label === 'Churn' ? 'lower-is-better' : 'higher-is-better'))}<div class="spark" id="s${i}"></div></div>`).join('')}</aside></div><div class="bottom"><section><h2>MRR movement</h2><div id="movement" class="chart" style="height:165px"></div></section><section><h2>Plans</h2><table><thead><tr><th>Plan</th><th>Accounts</th><th>MRR</th><th>Share</th><th>Δ vs Oct</th></tr></thead><tbody>${d.plans.map((v, i) => `<tr><td>${d.planNames[i]}</td><td>${d.planAccounts[i].toLocaleString('en-US')}</td><td>${'$' + ((v / 1000).toFixed(1) + 'K')}</td><td class="share"><span class="share-inline"><span class="track"><i style="width:${(v / Math.max(...d.plans)) * 100}%"></i></span><span>${((v / last(d.revenue)) * 100).toFixed(1)}%</span></span></td><td>${delta(v, d.previousPlans[i], '')}</td></tr>`).join('')}</tbody></table></section></div>`;
// A zoomed value axis with explicit floating interval geometry, never zero-based bars.
const start = d.revenue.at(-2),
  end = last(d.revenue);
const segments = [
  ['New', start, start + last(d.added), t.ink, last(d.added)],
  ['Expansion', start + last(d.added), end + last(d.churned), t.muted, last(d.expansion)],
  ['Churn', end + last(d.churned), end, '#C9C5BD', -last(d.churned)],
];
const bridgeTicks = [];
for (let v = Math.ceil((start - 1000) / 5000) * 5000; v < end + 2000; v += 5000)
  bridgeTicks.push(v);
const bridge = echarts.init(document.getElementById('bridge'));
bridge.setOption({
  animation: false,
  color: [t.ink, t.muted],
  grid: { left: 100, right: 240, top: 30, bottom: 42 },
  xAxis: {
    type: 'value',
    min: start - 1000,
    max: end + 2000,
    interval: 5000,
    axisLine: { show: true, lineStyle: { color: t.hairline, width: 1 } },
    axisTick: { show: true, customValues: bridgeTicks, lineStyle: { color: t.hairline } },
    axisLabel: {
      customValues: bridgeTicks,
      color: t.muted,
      fontFamily: 'Geist Mono',
      fontSize: 10,
      formatter: (v) => '$' + (v / 1000).toFixed(0) + 'K',
    },
    splitLine: { show: false },
  },
  yAxis: { type: 'category', data: ['MRR'], show: false },
  series: [
    {
      type: 'custom',
      data: segments.map((s, i) => [s[1], s[2], i]),
      renderItem: (params, api) => {
        const segment = segments[api.value(2)],
          a = api.coord([api.value(0), 0]),
          b = api.coord([api.value(1), 0]);
        return {
          type: 'group',
          children: [
            {
              type: 'rect',
              shape: {
                x: Math.min(a[0], b[0]),
                y: a[1] + (api.value(2) === 2 ? 2 : -6),
                width: Math.abs(b[0] - a[0]),
                height: api.value(2) === 2 ? 4 : 8,
              },
              style: { fill: segment[3] },
            },
            ...(api.value(2) === 0
              ? []
              : [
                  {
                    type: 'line',
                    shape: {
                      x1: (a[0] + b[0]) / 2,
                      y1: a[1] + (api.value(2) === 2 ? 7 : -7),
                      x2: api.value(2) === 2 ? Math.max(a[0], b[0]) + 12 : (a[0] + b[0]) / 2 + 10,
                      y2: a[1] + (api.value(2) === 2 ? 4 : -18),
                    },
                    style: { stroke: t.muted, lineWidth: 1 },
                  },
                ]),
            {
              type: 'text',
              x:
                api.value(2) === 2
                  ? Math.max(a[0], b[0]) + 16
                  : (a[0] + b[0]) / 2 + (api.value(2) === 1 ? 10 : 0),
              y: a[1] + (api.value(2) === 2 ? 4 : -20),
              style: {
                text:
                  segment[0] +
                  ' ' +
                  (segment[4] < 0 ? '−' : '+') +
                  '$' +
                  (Math.abs(segment[4]) / 1000).toFixed(1) +
                  'K',
                fill: t.ink,
                font: '12px Inter',
                align: api.value(2) === 0 ? 'center' : 'left',
                verticalAlign: api.value(2) === 2 ? 'middle' : 'bottom',
              },
            },
          ],
        };
      },
    },
  ],
});
bridge.setOption({
  graphic: [start, end].flatMap((v, i) => {
    const [x, y] = bridge.convertToPixel({ gridIndex: 0 }, [v, 0]);
    return [
      {
        type: 'line',
        shape: { x1: x, y1: y - 9, x2: x, y2: y + 9 },
        style: { stroke: i ? t.brand : t.ink, lineWidth: 1 },
      },
      {
        type: 'text',
        x,
        y: y + 44,
        style: {
          text: (i ? 'End ' : 'Start ') + money(v),
          fill: i ? t.brand : t.ink,
          font: '12px Inter',
          align: i ? 'left' : 'right',
        },
      },
    ];
  }),
});
const main = line('MRR', d.revenue);
main.markPoint.label.position = 'bottom';
main.markLine = {
  symbol: 'none',
  lineStyle: { color: t.muted, type: 'dashed', width: 1 },
  label: {
    show: true,
    formatter: 'Target $500K',
    position: 'insideEndTop',
    color: t.muted,
    fontSize: 11,
    fontFamily: 'Geist Mono',
  },
  data: [{ yAxis: 500000 }],
};
const mrr = chart('mrr', d.months, [main], {
  yAxis: {
    type: 'value',
    min: 100000,
    max: 550000,
    interval: 150000,
    name: '',
    nameTextStyle: { color: t.muted },
    axisLabel: { color: t.muted, fontSize: 11, formatter: tick },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: t.grid } },
  },
});
event(mrr, 9, d.revenue[9], 'New pricing', -92, -45);
rail.forEach((r, i) =>
  spark('s' + i, [d.netNew, d.churn, d.accounts, d.revenue.map((v, j) => v / d.accounts[j])][i]),
);
chart(
  'movement',
  d.months.slice(-12),
  [
    {
      type: 'bar',
      name: 'New',
      data: d.added
        .slice(-12)
        .map((v, i) =>
          i === 11
            ? { value: v, label: { show: true, formatter: 'New $' + (v / 1000).toFixed(1) + 'K' } }
            : v,
        ),
      barMaxWidth: 8,
      itemStyle: { color: (p) => (p.dataIndex === 11 ? t.brand : '#B9B5AC') },
      label: {
        show: false,
        position: 'top',
        color: t.muted,
        fontSize: 11,
        formatter: (p) => compact(p.value),
      },
    },
    {
      type: 'bar',
      name: 'Churned',
      data: d.churned.slice(-12).map((v, i) =>
        i === 11
          ? {
              value: -v,
              label: { show: true, formatter: 'Churned −$' + (v / 1000).toFixed(1) + 'K' },
            }
          : -v,
      ),
      barMaxWidth: 8,
      itemStyle: { color: '#D6D2CA' },
      label: {
        show: false,
        position: 'bottom',
        color: t.muted,
        fontSize: 11,
        formatter: (p) => compact(p.value),
      },
    },
  ],
  {
    grid: { left: 52, right: 100, top: 24, bottom: 28 },
    yAxis: {
      type: 'value',
      min: -10000,
      max: 25000,
      interval: 10000,
      axisLabel: {
        showMaxLabel: false,
        color: t.muted,
        formatter: (v) => (v === 0 ? '0' : tick(v)),
      },
      splitLine: { lineStyle: { color: t.grid } },
    },
    xAxis: {
      type: 'category',
      data: d.months.slice(-12).map((s) => s.slice(5)),
      axisTick: { show: false },
      axisLine: { onZero: true, lineStyle: { color: t.ink, width: 1 } },
      axisLabel: { color: t.muted, fontSize: 11 },
    },
  },
);
await ready();
