import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, money, compact, delta, metric, line, chart, spark, table, ready } = await setup(
  'store',
  '店铺经营概览',
  '2026年9月1日 – 9月30日',
);
const d = data.store,
  k = kpisFor('store'),
  rail = k.slice(1);
root.innerHTML += `<div class="top"><section>${metric('成交金额', money(k[0][1]), delta(k[0][1], k[0][4], '同比') + delta(k[0][1], k[0][3], '环比'), true)}<div id="sales" class="chart" style="height:186px"></div></section><aside class="rail">${rail.map(([label, v, type, p, y], i) => `<div class="rail-row">${metric(label, type === 'percent' ? (v * 100).toFixed(2) + '%' : label === '客单价' ? '¥' + v.toFixed(2) : compact(v), delta(v, y || p, '同比'))}<div class="spark" id="s${i}"></div></div>`).join('')}</aside></div><div class="bottom" style="grid-template-columns:1.6fr 1fr;margin-top:18px;padding-top:18px"><section><h2>商品成交 TOP 10</h2>${table(['轻量通勤包', '棉质衬衫', '城市运动鞋', '保温随行杯', '便携收纳盒', '针织开衫', '桌面阅读灯', '休闲长裤', '帆布手提袋', '旅行收纳袋'], d.ranks, true, d.previousRanks, 'higher-is-better', k[0][1])}</section><section class="rail"><h2>渠道成交</h2><div class="channels">${['自然搜索', '推荐流量', '直接访问', '内容引流', '活动会场', '付费推广', '其他'].map((s, i) => `<div><span>${s}</span><span class="track"><i style="width:${(d.parts[i] / d.parts[0]) * 100}%"></i></span><span class="num">¥${(d.channels[i] / 10000).toFixed(1)}万</span><span class="num">${d.parts[i].toFixed(1)}%</span></div>`).join('')}</div></section></div>`;
chart('sales', d.months, [line('今年', d.revenue), line('去年', d.yearAgo.revenue, true)], {
  yAxis: {
    type: 'value',
    min: 0,
    max: 120000,
    interval: 40000,
    axisLabel: { color: t.muted, formatter: (v) => (v === 0 ? '0' : v / 10000 + '万') },
    splitLine: { lineStyle: { color: t.grid } },
  },
});
[d.visitors, d.rate, d.revenue.map((v, i) => v / d.orders[i]), d.refundRate].forEach((v, i) =>
  spark('s' + i, v),
);
await ready();
