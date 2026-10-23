import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, money, compact, delta, metric, line, chart, spark, table, event, ready } =
  await setup('store', '店铺经营概览', '2026年9月1日 – 9月30日');
const d = data.store,
  k = kpisFor('store'),
  rail = k.slice(1);
root.innerHTML += `<div class="top"><section>${metric('成交金额', money(k[0][1]), delta(k[0][1], k[0][4], '同比') + delta(k[0][1], k[0][3], '环比'), true)}<div id="sales" class="chart" style="height:168px"></div></section><aside class="rail">${rail.map(([label, v, type, p, y], i) => `<div class="rail-row">${metric(label, type === 'percent' ? (v * 100).toFixed(2) + '%' : label === '客单价' ? '¥' + v.toFixed(2) : compact(v), delta(v, y || p, '同比'))}<div class="spark" id="s${i}"></div></div>`).join('')}</aside></div><div class="bottom" style="grid-template-columns:1.6fr 1fr;margin-top:16px;padding-top:16px"><section><h2>商品成交 TOP 10</h2>${table(['轻量通勤包', '棉质衬衫', '城市运动鞋', '保温随行杯', '便携收纳盒', '针织开衫', '桌面阅读灯', '休闲长裤', '帆布手提袋', '旅行收纳袋'], d.ranks, true, d.previousRanks, 'higher-is-better', k[0][1])}</section><section class="rail"><h2>九月成交日历</h2><div class="calendar">${['一', '二', '三', '四', '五', '六', '日', '周合计'].map((v) => `<span>${v}</span>`).join('')}${Array.from(
  { length: 5 },
  (_, week) => {
    const days = Array.from({ length: 7 }, (_, weekday) => week * 7 + weekday);
    const total = days.reduce((sum, day) => sum + (d.revenue[day - 1] || 0), 0);
    return (
      days
        .map((day) => {
          const v = d.revenue[day - 1];
          const step = v
            ? Math.min(
                4,
                Math.floor(
                  (5 * (v - Math.min(...d.revenue))) /
                    (Math.max(...d.revenue) - Math.min(...d.revenue)),
                ),
              )
            : 0;
          return `<div style="background:${v ? ['#F0F1EF', '#DFE4E4', '#BFCBD0', '#829CA9', '#3E6A88'][step] : 'transparent'};outline:${day === 9 ? '1px solid ' + t.ink : 'none'};color:${step === 4 ? '#FFFFFF' : '#414141'}">${v ? day : ''}</div>`;
        })
        .join('') +
      `<div class="week-total" data-total="${total}">${(total / 10000).toFixed(2)}万</div>`
    );
  },
).join('')}</div></section></div>`;
const current = line('今年', d.revenue);
current.markPoint.label.position = 'bottom';
const sales = chart('sales', d.months, [current, line('去年', d.yearAgo.revenue, true)], {
  yAxis: {
    type: 'value',
    min: 0,
    max: 200000,
    interval: 40000,
    axisLabel: { color: t.muted, formatter: (v) => (v === 0 ? '0' : v / 10000 + '万') },
    splitLine: { lineStyle: { color: t.grid } },
  },
});
event(sales, 8, d.revenue[8], '99大促', 32, -30);
[d.visitors, d.rate, d.revenue.map((v, i) => v / d.orders[i]), d.refundRate].forEach((v, i) =>
  spark('s' + i, v),
);
await ready();
