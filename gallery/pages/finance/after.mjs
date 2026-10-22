import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, tick, money, delta, metric, line, chart, table, event, ready } = await setup(
  'finance',
  'Treasury',
  'Nov 2025 – Oct 2026',
);
const d = data.finance,
  k = kpisFor('finance');
root.innerHTML += `<div class="top"><section><div style="display:flex;justify-content:space-between;align-items:center">${metric('Cash', money(last(d.cash)), delta(last(d.cash), d.cash.at(-2)), true)}<div class="ruler" style="width:460px;flex-shrink:0"><label>Runway</label><div class="value">${last(d.runway).toFixed(1)} months</div><div style="position:relative;display:flex;justify-content:space-between;border-top:1px solid ${t.muted};height:32px;font:10px 'Geist Mono'">${Array.from({ length: Math.floor(last(d.runway)) + 1 }, (_, i) => `<span style="position:relative;border-left:1px solid ${i === Math.floor(last(d.runway)) ? t.brand : t.muted};height:${i === Math.floor(last(d.runway)) ? 12 : 6}px"><span style="position:absolute;top:14px;${i === Math.floor(last(d.runway)) ? 'right:0' : 'left:0'};white-space:nowrap">${i === Math.floor(last(d.runway)) ? new Date(2026, 9 + i, 1).toLocaleString('en', { month: 'short', year: 'numeric' }) : i % 3 === 0 && i < Math.floor(last(d.runway)) - 3 ? new Date(2026, 9 + i, 1).toLocaleString('en', { month: 'short' }) : ''}</span></span>`).join('')}</div></div></div><div id="cash" class="chart" style="height:190px"></div><h2 style="margin:4px 0">Monthly burn</h2><div id="burn" class="chart" style="height:96px"></div></section><aside class="rail"><h2>Spend</h2>${table(['People', 'Infrastructure', 'Operations', 'Acquisition', 'Other'], d.ranks, false, d.previousSpend, 'lower-is-better')}<div style="margin-top:28px">${metric('Operating expense', money(last(d.expense)), delta(last(d.expense), d.expense.at(-2), 'vs Sep', 'lower-is-better'))}</div></aside></div><div class="bottom" style="grid-template-columns:3fr 1fr"><section><h2>Revenue & expense</h2><div id="flow" class="chart" style="height:180px"></div></section><section class="rail">${metric('Gross margin', last(d.margin).toFixed(1) + '%', delta(last(d.margin), d.margin.at(-2)))}<div style="margin-top:28px">${metric('Revenue', money(last(d.revenue)), delta(last(d.revenue), d.revenue.at(-2)))}</div></section></div>`;
const cash = chart('cash', d.months, [line('Cash', d.cash)], {
  yAxis: {
    type: 'value',
    min: 1000000,
    max: 4000000,
    interval: 500000,
    name: '',
    nameTextStyle: { color: t.muted },
    axisLabel: { color: t.muted, fontSize: 11, formatter: tick },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: t.grid } },
  },
});
event(cash, 5, d.cash[5], 'Raised $1.5M', 32, 36);
chart(
  'burn',
  d.months,
  [
    {
      type: 'bar',
      barMaxWidth: 8,
      data: d.burn.map((v, i) => ({
        value: v,
        label: { show: i === 11 },
        itemStyle: { color: i === 11 ? t.brand : '#5A5850' },
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
      name: '',
      nameTextStyle: { color: t.muted },
      axisLabel: { formatter: tick, color: t.muted },
      show: false,
      min: 0,
    },
  },
);
const rev = line('Revenue', d.revenue),
  exp = line('Expense', d.expense, true);
rev.markPoint.label.position = 'bottom';
const flow = chart('flow', d.months, [rev, exp], {
  yAxis: {
    type: 'value',
    min: 0,
    max: 1000000,
    interval: 250000,
    axisLabel: { color: t.muted, formatter: tick },
    splitLine: { lineStyle: { color: t.grid } },
  },
});
await ready();
