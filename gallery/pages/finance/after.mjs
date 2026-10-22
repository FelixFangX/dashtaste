import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, money, delta, metric, line, chart, table, ready } = await setup(
  'finance',
  'Treasury',
  'Nov 2025 – Oct 2026',
);
const d = data.finance,
  k = kpisFor('finance');
root.innerHTML += `<div class="top"><section><div style="display:flex;justify-content:space-between;align-items:center">${metric('Cash', money(last(d.cash)), delta(last(d.cash), d.cash.at(-2)), true)}${metric('Runway', last(d.runway).toFixed(1) + ' months', '')}</div><div id="cash" class="chart" style="height:190px"></div><h2 style="margin:4px 0">Monthly burn</h2><div id="burn" class="chart" style="height:96px"></div></section><aside class="rail"><h2>Spend</h2>${table(['People', 'Infrastructure', 'Operations', 'Acquisition', 'Other'], d.ranks, false, d.previousSpend, 'lower-is-better')}<div style="margin-top:28px">${metric('Operating expense', money(last(d.expense)), delta(last(d.expense), d.expense.at(-2), 'vs Sep', 'lower-is-better'))}</div></aside></div><div class="bottom" style="grid-template-columns:3fr 1fr"><section><h2>Revenue & expense</h2><div id="flow" class="chart" style="height:180px"></div></section><section class="rail">${metric('Gross margin', last(d.margin).toFixed(1) + '%', delta(last(d.margin), d.margin.at(-2)))}<div style="margin-top:28px">${metric('Operating surplus', money(last(d.revenue) - last(d.expense)))}</div></section></div>`;
chart('cash', d.months, [line('Cash', d.cash)], {
  yAxis: {
    type: 'value',
    min: 2000000,
    max: 3500000,
    interval: 500000,
    name: 'Cash ($)',
    nameTextStyle: { color: t.muted },
    axisLabel: { color: t.muted, fontSize: 11, formatter: money },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: t.grid } },
  },
});
chart(
  'burn',
  d.months,
  [
    {
      type: 'bar',
      barMaxWidth: 18,
      data: d.expense.map((v, i) => ({
        value: v * 0.34,
        itemStyle: { color: i === 11 ? t.brand : t.other },
      })),
      label: {
        show: true,
        position: 'top',
        color: t.muted,
        fontSize: 11,
        formatter: (p) => money(p.value),
      },
    },
  ],
  {
    grid: { left: 52, right: 98, top: 22, bottom: 24 },
    yAxis: {
      type: 'value',
      name: 'Burn ($)',
      nameTextStyle: { color: t.muted },
      axisLabel: { formatter: money, color: t.muted },
      show: false,
      min: 0,
    },
  },
);
const rev = line('Revenue', d.revenue),
  exp = line('Expense', d.expense, true);
rev.markLine = {
  symbol: 'none',
  lineStyle: { color: t.muted, width: 1 },
  label: {
    formatter: money(last(d.revenue) - last(d.expense)),
    color: t.ink,
    position: 'middle',
    rotate: 0,
  },
  data: [[{ coord: [11, last(d.expense)] }, { coord: [11, last(d.revenue)] }]],
};
chart('flow', d.months, [rev, exp]);
await ready();
