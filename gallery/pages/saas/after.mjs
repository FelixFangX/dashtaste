import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, money, compact, delta, metric, line, chart, spark, table, ready } = await setup(
  'saas',
  'Revenue',
  'Jun 2025 – Nov 2026',
);
const d = data.saas,
  k = kpisFor('saas');
const rail = k.slice(1);
root.innerHTML += `<div class="top"><section>${metric('MRR', money(k[0][1]), delta(k[0][1], k[0][3]), true)}<div id="mrr" class="chart" style="height:244px"></div></section><aside class="rail">${rail.map(([label, v, type, p], i) => `<div style="position:relative">${metric(label, type === 'money' ? money(v) : type === 'percent' ? (v * 100).toFixed(2) + '%' : compact(v), delta(v, p, 'vs Oct', label === 'Churn' ? 'lower-is-better' : 'higher-is-better'))}<div class="spark" id="s${i}"></div></div>`).join('')}</aside></div><div class="bottom"><section><h2>MRR movement</h2><div id="movement" class="chart" style="height:260px"></div></section><section><h2>Plans</h2><table><thead><tr><th>Plan</th><th>Accounts</th><th>MRR</th><th>Share</th><th>Δ vs Oct</th></tr></thead><tbody>${d.plans.map((v, i) => `<tr><td>${d.planNames[i]}</td><td>${Math.round((last(d.accounts) * v) / last(d.revenue))}</td><td>${money(v)}</td><td class="share">${((v / last(d.revenue)) * 100).toFixed(1)}%<div class="track"><i style="width:${(v / Math.max(...d.plans)) * 100}%"></i></div></td><td>${delta(v, d.previousPlans[i], '')}</td></tr>`).join('')}</tbody></table></section></div>`;
const main = line('MRR', d.revenue);
main.markLine = {
  symbol: 'none',
  lineStyle: { color: t.muted, type: 'dashed', width: 1.5 },
  label: { formatter: 'Target $400K', position: 'insideEndTop', color: t.muted },
  data: [{ yAxis: 400000 }],
};
chart('mrr', d.months, [main], {
  yAxis: {
    type: 'value',
    min: 150000,
    max: 450000,
    interval: 100000,
    name: 'MRR ($)',
    nameTextStyle: { color: t.muted },
    axisLabel: { color: t.muted, fontSize: 11, formatter: compact },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: t.grid } },
  },
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
        .map((v, i) => (i === 11 ? { value: v, label: { formatter: 'New\n' + compact(v) } } : v)),
      barMaxWidth: 12,
      itemStyle: { color: t.brand },
      label: {
        show: true,
        position: 'top',
        color: t.muted,
        fontSize: 11,
        formatter: (p) => compact(p.value),
      },
    },
    {
      type: 'bar',
      name: 'Churned',
      data: d.churned
        .slice(-12)
        .map((v, i) =>
          i === 11 ? { value: -v, label: { formatter: 'Churned\n' + compact(-v) } } : -v,
        ),
      barMaxWidth: 12,
      itemStyle: { color: t.other },
      label: {
        show: true,
        position: 'bottom',
        color: t.muted,
        fontSize: 11,
        formatter: (p) => compact(p.value),
      },
    },
  ],
  {
    grid: { left: 52, right: 12, top: 24, bottom: 28 },
    xAxis: {
      type: 'category',
      data: d.months.slice(-12).map((s) => s.slice(5)),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: t.hairline } },
      axisLabel: { color: t.muted, fontSize: 11 },
    },
  },
);
await ready();
