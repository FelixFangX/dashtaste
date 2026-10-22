import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, tick, money, delta, metric, line, chart, table, ready } = await setup(
  'finance',
  'Treasury',
  'Nov 2025 – Oct 2026',
);
const d = data.finance,
  k = kpisFor('finance');
root.innerHTML += `<div class="top"><section><div style="display:flex;justify-content:space-between;align-items:center">${metric('Cash', money(last(d.cash)), delta(last(d.cash), d.cash.at(-2)), true)}${metric('Runway', last(d.runway).toFixed(1) + ' months', '')}</div><div id="cash" class="chart" style="height:190px"></div><h2 style="margin:4px 0">Monthly burn</h2><div id="burn" class="chart" style="height:96px"></div></section><aside class="rail"><h2>Spend</h2>${table(['People', 'Infrastructure', 'Operations', 'Acquisition', 'Other'], d.ranks, false, d.previousSpend, 'lower-is-better')}<div style="margin-top:28px">${metric('Operating expense', money(last(d.expense)), delta(last(d.expense), d.expense.at(-2), 'vs Sep', 'lower-is-better'))}</div></aside></div><div class="bottom" style="grid-template-columns:3fr 1fr"><section><h2>Revenue & expense</h2><div id="flow" class="chart" style="height:180px"></div></section><section class="rail">${metric('Gross margin', last(d.margin).toFixed(1) + '%', delta(last(d.margin), d.margin.at(-2)))}<div style="margin-top:28px">${metric('Revenue', money(last(d.revenue)), delta(last(d.revenue), d.revenue.at(-2)))}</div></section></div>`;
chart('cash', d.months, [line('Cash', d.cash)], {
  yAxis: {
    type: 'value',
    min: 2000000,
    max: 3500000,
    interval: 500000,
    name: '',
    nameTextStyle: { color: t.muted },
    axisLabel: { color: t.muted, fontSize: 11, formatter: tick },
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
      barMaxWidth: 8,
      data: d.expense.map((v, i) => ({
        value: v * 0.34,
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
const [x, upper] = flow.convertToPixel({ gridIndex: 0 }, [11, last(d.revenue)]);
const [, lower] = flow.convertToPixel({ gridIndex: 0 }, [11, last(d.expense)]);
flow.setOption({
  graphic: [
    {
      id: 'gap-bracket',
      type: 'polyline',
      shape: {
        points: [
          [x - 5, upper],
          [x, upper],
          [x, lower],
          [x - 5, lower],
        ],
      },
      style: { stroke: t.muted, lineWidth: 1, fill: 'none' },
    },
    {
      id: 'gap-label',
      type: 'text',
      x: x - 18,
      y: (upper + lower) / 2,
      style: {
        text: money(last(d.revenue) - last(d.expense)),
        fill: t.muted,
        font: '12px Inter',
        align: 'right',
        verticalAlign: 'middle',
      },
    },
  ],
});
await ready();
