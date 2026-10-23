import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, tick, money, compact, delta, metric, line, chart, spark, table, event, ready } =
  await setup('saas', 'Revenue', 'Jun 2025 – Nov 2026');
const d = data.saas,
  k = kpisFor('saas');
const rail = k.slice(1);
root.innerHTML += `<div class="top"><section><div style="display:flex;justify-content:space-between;align-items:end">${metric('MRR', money(k[0][1]), delta(k[0][1], k[0][3]), true)}</div><div class="bridge"><h2>November</h2><div class="bridge-ends"><span class="muted">Start <b>${money(d.revenue.at(-2))}</b></span><span class="muted">End <b>${money(last(d.revenue))}</b></span></div><div id="bridge" style="height:118px;width:100%"></div></div><div id="mrr" class="chart" style="height:140px"></div></section><aside class="rail">${rail.map(([label, v, type, p], i) => `<div class="rail-row">${metric(label, type === 'money' ? money(v) : type === 'percent' ? (v * 100).toFixed(2) + '%' : compact(v), delta(v, p, 'vs Oct', label === 'Churn' ? 'lower-is-better' : 'higher-is-better'))}<div class="spark" id="s${i}"></div></div>`).join('')}</aside></div><div class="bottom"><section><h2>MRR movement</h2><div id="movement" class="chart" style="height:158px"></div></section><section><h2>Plans</h2><table><thead><tr><th>Plan</th><th>Accounts</th><th>MRR</th><th>Share</th><th>Δ vs Oct</th></tr></thead><tbody>${d.plans.map((v, i) => `<tr><td>${d.planNames[i]}</td><td>${d.planAccounts[i].toLocaleString('en-US')}</td><td>${'$' + ((v / 1000).toFixed(1) + 'K')}</td><td class="share"><span class="share-inline"><span class="track"><i style="width:${(v / Math.max(...d.plans)) * 100}%"></i></span><span>${((v / last(d.revenue)) * 100).toFixed(1)}%</span></span></td><td>${delta(v, d.previousPlans[i], '')}</td></tr>`).join('')}</tbody></table></section></div>`;
const net = last(d.added) + last(d.expansion) - last(d.churned);
const segments = [
  ['+New', 0, last(d.added), last(d.added), t.ink],
  ['+Expansion', last(d.added), last(d.added) + last(d.expansion), last(d.expansion), t.muted],
  ['−Churn', last(d.added) + last(d.expansion), net, -last(d.churned), '#C9C5BD'],
  ['= Net new', 0, net, net, t.brand],
];
const bridge = echarts.init(document.getElementById('bridge'));
bridge.setOption({
  animation: false,
  color: [t.ink, t.muted, t.brand],
  grid: { left: 0, right: 0, top: 18, bottom: 22 },
  xAxis: {
    type: 'category',
    data: segments.map((s) => s[0]),
    axisTick: { show: false },
    axisLine: { onZero: true, lineStyle: { color: t.ink, width: 1 } },
    axisLabel: { color: t.ink, fontFamily: 'Inter', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    min: 0,
    axisLabel: { formatter: tick },
    max: Math.max(...segments.map((s) => s[1]), ...segments.map((s) => s[2])) * 1.05,
    show: false,
  },
  series: [
    {
      type: 'custom',
      data: segments.map((s, i) => [i, s[1], s[2]]),
      renderItem: (params, api) => {
        const i = api.value(0),
          s = segments[i],
          a = api.coord([i, s[1]]),
          b = api.coord([i, s[2]]);
        return {
          type: 'group',
          children: [
            {
              type: 'rect',
              shape: {
                x: a[0] - 7,
                y: Math.min(a[1], b[1]),
                width: 14,
                height: Math.abs(b[1] - a[1]),
              },
              style: { fill: s[4] },
            },
            {
              type: 'text',
              x: b[0] + (i === 2 ? 12 : 0),
              y: b[1] + (i === 2 ? 0 : -7),
              style: {
                text: (s[3] < 0 ? '−' : '+') + '$' + (Math.abs(s[3]) / 1000).toFixed(1) + 'K',
                fill: t.ink,
                font: '12px "Geist Mono"',
                align: i === 2 ? 'left' : 'center',
                verticalAlign: i === 2 ? 'middle' : 'bottom',
              },
            },
          ],
        };
      },
    },
  ],
});
const main = line('MRR', d.revenue);
main.markPoint.label.position = 'bottom';
main.markLine = {
  symbol: 'none',
  lineStyle: { color: t.muted, type: 'dashed', width: 1.5 },
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
