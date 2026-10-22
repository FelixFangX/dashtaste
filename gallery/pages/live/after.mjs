import { setup, data, kpisFor, last } from '../after-shared.mjs';
const { root, t, money, compact, delta, metric, line, chart, spark, table, ready } = await setup(
  'live',
  '大促实时大屏',
  '2026年9月30日　18:00:00',
);
const d = { ...data.live };
const ordered = d.regions
  .map((v, i) => ({ v, hourly: d.regionHourly[i] }))
  .sort((a, b) => b.v - a.v);
d.regions = ordered.map((r) => r.v);
d.regionHourly = ordered.map((r) => r.hourly);
const k = kpisFor('live');
root.innerHTML += `<div class="top" style="grid-template-columns:2.2fr 1fr"><section>${metric('实时成交额', money(k[0][1]), delta(k[0][1], k[0][3], '较昨日同时段'), true)}<div class="row" style="margin-top:8px"><span class="muted">目标达成</span><span>63.7%　${money(k[0][1])} <span class="muted">/ ¥2亿</span></span></div><div class="progress"><i style="width:${(k[0][1] / 2000000) * 100}%"></i></div><div id="cumulative" class="chart" style="height:352px"></div></section><aside class="rail"><h2>商品 TOP 8</h2>${table(['轻量通勤包', '棉质衬衫', '城市运动鞋', '保温随行杯', '便携收纳盒', '针织开衫', '桌面阅读灯', '休闲长裤'], d.ranks, true, d.previousRanks, 'higher-is-better', k[0][1])}</aside></div><div class="strip" style="margin-top:24px">${k
  .slice(1)
  .map(([label, v, type, p]) =>
    metric(
      label,
      type === 'percent'
        ? (v * 100).toFixed(2) + '%'
        : label === '客单价'
          ? '¥' + v.toFixed(2)
          : type === 'money'
            ? money(v)
            : compact(v),
      delta(v, p, '较昨日同时段', label === '退款金额' ? 'lower-is-better' : 'higher-is-better'),
    ),
  )
  .join(
    '',
  )}</div><section style="padding-top:16px"><h2>区域成交</h2><div class="regions">${d.regions.map((v, i) => `<div class="region"><div class="row"><span class="muted">${['广东', '浙江', '江苏', '上海', '北京', '山东', '福建', '四川', '湖北', '河南', '湖南', '其他'][i]}</span><span class="small-number">${money(v)}</span></div><div class="spark" id="r${i}"></div></div>`).join('')}</div></section>`;
const today = line('今日', d.revenue);
today.markLine = {
  symbol: 'none',
  label: { show: true, formatter: '18:00', color: t.muted, fontSize: 16 },
  lineStyle: { color: t.hairline, width: 1 },
  data: [{ xAxis: 18 }],
};
chart(
  'cumulative',
  d.months.map((v, i) => (i === 18 ? '' : v)),
  [today, line('昨日', d.yesterday, true)],
  {
    yAxis: {
      type: 'value',
      min: 0,
      max: 1500000,
      interval: 500000,
      axisLabel: { fontSize: 16, color: t.muted, formatter: (v) => v / 10000 + '万' },
      splitLine: { lineStyle: { color: t.grid } },
    },
  },
);
d.regions.forEach((v, i) => spark('r' + i, d.regionHourly[i], Math.max(...d.regions) * 1.1));
await ready();
