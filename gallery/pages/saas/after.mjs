import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, tick, money, compact, delta, metric, line, chart, spark, table, ready } =
  await setup('saas', 'Revenue', 'Jun 2025 – Nov 2026');
const d = data.saas,
  k = kpisFor('saas');
const rail = k.slice(1);
root.innerHTML += `<div class="top"><section><div style="display:flex;justify-content:space-between;align-items:end">${metric('MRR', money(k[0][1]), delta(k[0][1], k[0][3]), true)}</div><div id="mrr" class="chart" style="height:254px"></div></section><aside class="rail">${rail.map(([label, v, type, p], i) => `<div class="rail-row">${metric(label, type === 'money' ? money(v) : type === 'percent' ? (v * 100).toFixed(2) + '%' : compact(v), delta(v, p, 'vs Oct', label === 'Churn' ? 'lower-is-better' : 'higher-is-better'))}<div class="spark" id="s${i}"></div></div>`).join('')}</aside></div><div class="bottom"><section><h2>MRR movement</h2><div id="movement" class="chart" style="height:210px"></div></section><section><h2>Plans</h2><table><thead><tr><th>Plan</th><th>Accounts</th><th>MRR</th><th>Share</th><th>Δ vs Oct</th></tr></thead><tbody>${d.plans.map((v, i) => `<tr><td>${d.planNames[i]}</td><td>${Math.round((last(d.accounts) * v) / last(d.revenue)).toLocaleString('en-US')}</td><td>${'$' + ((v / 1000).toFixed(1) + 'K')}</td><td class="share"><span class="share-inline"><span class="track"><i style="width:${(v / Math.max(...d.plans)) * 100}%"></i></span><span>${((v / last(d.revenue)) * 100).toFixed(1)}%</span></span></td><td>${delta(v, d.previousPlans[i], '')}</td></tr>`).join('')}</tbody></table></section></div>`;
const main = line('MRR', d.revenue);
main.markPoint.label.position = 'bottom';
main.markLine = {
  symbol: 'none',
  lineStyle: { color: t.muted, type: 'dashed', width: 1 },
  label: { show: false },
  data: [{ yAxis: 400000 }],
};
const mrr = chart('mrr', d.months, [main], {
  yAxis: {
    type: 'value',
    min: 100000,
    max: 400000,
    interval: 100000,
    name: '',
    nameTextStyle: { color: t.muted },
    axisLabel: { color: t.muted, fontSize: 11, formatter: tick },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: t.grid } },
  },
});
const [targetX, targetY] = mrr.convertToPixel({ gridIndex: 0 }, [12, 400000]);
mrr.setOption({
  graphic: [
    {
      id: 'target-leader',
      type: 'polyline',
      shape: {
        points: [
          [targetX, targetY],
          [targetX - 12, targetY - 12],
          [targetX - 40, targetY - 12],
        ],
      },
      style: { stroke: t.muted, lineWidth: 1, fill: 'none' },
    },
    {
      id: 'target-label',
      type: 'text',
      x: targetX - 46,
      y: targetY - 12,
      style: {
        text: 'Target $400K',
        fill: t.muted,
        font: '12px Inter',
        align: 'right',
        verticalAlign: 'middle',
      },
    },
  ],
});
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
