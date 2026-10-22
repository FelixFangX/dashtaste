import { data, dashboards, kpisFor } from '../data.mjs';
import { getTokens } from '../../dist/packs/index.js';
import { formatCompact, formatDelta, formatPercent, formatDate } from '../../dist/format.js';
const name = document.body.dataset.dashboard;
const before = document.body.dataset.variant === 'before';
const config = dashboards.find((d) => d.name === name);
const { pack, mode } = config;
const cn = pack === 'cn',
  live = name === 'live',
  global = !cn;
const t = getTokens(pack, mode),
  d = data[name];
const bg = t.page || t.bg || t.paper,
  surface = t.card || t.panel || t.paper;
const compact = (v) => formatCompact(Number(Number(v).toFixed(2)), pack, { compactFrom: 10000 });
const num = (v) => (before ? String(v) : compact(v));
const pct = (v) => (before ? String(v * 100) : formatPercent(v));
const money = (v) =>
  `${cn ? '¥' : '$'}${before ? num(v) : formatCompact(v, pack, { minimumFractionDigits: 2, compactFrom: 10000 })}`;
const date = formatDate('2026-09-30T12:00:00', pack);
const titles = {
  saas: 'Subscription revenue',
  finance: 'Monthly profit & loss',
  store: '店铺经营概览',
  live: '大促实时大屏',
};
const css = document.createElement('style');
css.textContent = `
*{box-sizing:border-box}body{margin:0;background:${bg};color:${t.ink};font:14px system-ui,sans-serif;font-variant-numeric:tabular-nums}button{font:inherit;color:inherit;cursor:pointer}button:focus-visible{outline:2px solid ${t.brand};outline-offset:3px}main{padding:24px;max-width:${global ? '1328' : live ? '1920' : '1440'}px;margin:auto}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;height:56px}h1{font-size:24px;font-weight:600;margin:0}h2{font-size:18px;font-weight:600;margin:0 0 16px}p{margin:0}.identity{color:${t.muted};margin-bottom:8px;font-size:12px}.date{color:${t.muted}}.controls{display:flex;align-items:center;gap:16px;margin-bottom:24px}.segments{display:flex}button{border:1px solid ${t.hairline};background:${surface};padding:8px 16px;min-height:36px}button.active{background:${t.brand};color:${mode === 'dark' ? bg : '#FFFFFF'};border-color:${t.brand}}.kpis{display:grid;grid-template-columns:repeat(${live ? 6 : 4},1fr);gap:${cn ? 16 : 0}px;margin-bottom:32px}.kpi{padding:${cn ? '16px' : '0 24px'};${cn ? `background:${surface};border:1px solid ${t.hairline};border-radius:6px` : `border-right:1px solid ${t.hairline}`}}.kpi:first-child{${global ? 'padding-left:0' : ''}}.kpi:last-child{border-right:${global ? '0' : `1px solid ${t.hairline}`}}.kpi label{color:${t.muted};display:block;margin-bottom:8px}.value{font-size:${live ? 48 : 32}px;font-weight:600;line-height:1.3;white-space:nowrap}.comparison{font-size:${live ? 16 : cn ? 14 : 12}px;margin-top:8px;display:flex;justify-content:space-between;gap:8px}.comparison span:first-child{color:${t.muted}}.board{display:grid;grid-template-columns:${global ? '1fr 1fr' : '2fr 1fr'};gap:${global ? 32 : 16}px}.panel{min-width:0;${cn ? `background:${surface};border:1px solid ${t.hairline};border-radius:6px;padding:16px` : `border-top:1px solid ${t.hairline};padding-top:24px`}}.wide{grid-column:1/-1}.chart{height:240px}.main-chart{height:${live ? 340 : global ? 242 : 268}px}.ranking{list-style:none;padding:0;margin:0}.ranking li{height:36px;display:grid;grid-template-columns:32px 1fr auto;align-items:center;border-bottom:1px solid ${t.hairline};gap:8px}.ranking b{font-weight:600}.ranking li:last-child{border:0}.ranking .amount{text-align:right}.store-layout{grid-template-columns:2fr 1fr}.store-layout .ranking-panel{grid-row:span 2}.store-layout .chart-small{height:170px}.live-layout{grid-template-columns:1.4fr 1fr 1fr}.live-layout .trend-panel{grid-column:1/3}.live-layout .ranking-panel{grid-column:3;grid-row:1/3}.live-layout .ranking li{height:68px}.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.tile{border-bottom:2px solid ${t.brand};background:${bg};padding:16px;display:flex;justify-content:space-between;gap:12px}.tile span{color:${t.muted}}.ring{height:196px}.ring-wrap{position:relative}.ring-value{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:600;pointer-events:none}.live-page{font-size:16px}.live-page header{height:72px;margin-bottom:24px}.live-page .identity{font-size:16px}.live-page h2{font-size:20px}.live-page .board{gap:24px}.live-page .kpis{margin-bottom:24px}
${before ? `body{background:${live ? 'radial-gradient(ellipse at 30% 15%,#26346c 0,transparent 48%),radial-gradient(ellipse at 90% 80%,#38275b 0,#081225 70%)' : mode === 'dark' ? '#101525' : '#f4f5fb'};font-family:system-ui,sans-serif}header{padding:16px 24px;height:92px;background:linear-gradient(120deg,#7444cb,#3479df);border-radius:16px;color:white;box-shadow:0 0 24px #6655cc55}.identity,.date{color:#c1c2d5}.kpis{gap:16px;margin-bottom:24px}.kpi{padding:16px!important;border:0!important;border-radius:14px;background:linear-gradient(135deg,#7451cb,#a27be9);box-shadow:0 0 18px #7755cc44;color:white}.kpi:nth-child(2){background:linear-gradient(135deg,#217db9,#4dafdf)}.kpi:nth-child(3){background:linear-gradient(135deg,#c26879,#e398ad)}.kpi:nth-child(4){background:linear-gradient(135deg,#21978e,#65b6a8)}.kpi:nth-child(5){background:linear-gradient(135deg,#bd7e22,#c9aa5d)}.kpi:nth-child(6){background:linear-gradient(135deg,#5554b8,#9a8dd4)}.kpi label,.comparison span:first-child{color:#cbd0e4}.value{font-size:${live ? 42 : 30}px}.panel{background:${mode === 'dark' ? '#172039' : '#fff'};border:1px solid ${mode === 'dark' ? '#354365' : '#e3dff5'};border-radius:16px;padding:20px;box-shadow:0 0 18px #7755cc33}.board{gap:20px}.comparison{font-size:12px}${live ? '.panel{border-radius:0;border-left:3px solid #4dd4ef;border-top:3px solid #8674ec}.value{text-shadow:0 0 16px #60aaff}' : ''}` : ''}
`;
css.textContent += `body[data-dashboard=saas] .chart{height:200px}body[data-dashboard=saas] .board{gap:24px}body[data-dashboard=saas] .panel{padding-top:16px}`;
css.textContent += `body[data-dashboard=finance] .chart{height:180px}body[data-dashboard=finance] .main-chart{height:220px}`;
css.textContent += `body[data-dashboard=store] .main-chart{height:200px}body[data-dashboard=store] .chart-small{height:100px}.regions .tile{flex-direction:column;gap:4px;padding:8px}.regions .tile b{font-size:16px}.regions .tile span{font-size:14px}`;
css.textContent += `body[data-dashboard=store][data-variant=after] .chart-small{height:140px}.channel-breakdown{position:absolute;left:48%;right:24px;top:8px;font-size:12px}.channel-breakdown>div{display:flex;justify-content:space-between;height:24px;align-items:center}.channel-breakdown i{display:inline-block;width:8px;height:8px;margin-right:8px}.channel-breakdown b{font-weight:400}`;
css.textContent += `${before && live ? '.kpi:nth-child(1) .value{color:#a9eaff}.kpi:nth-child(2) .value{color:#ffe5a0}.kpi:nth-child(3) .value{color:#b8f1d3}.kpi:nth-child(4) .value{color:#f9b3c4}.kpi:nth-child(5) .value{color:#bcd1ff}.kpi:nth-child(6) .value{color:#e4c1ff}' : ''}`;
if (!before)
  css.textContent += `
body[data-dashboard=saas] .comparison,body[data-dashboard=finance] .comparison{justify-content:flex-start}.kpis{grid-template-columns:repeat(4,minmax(0,1fr))}.live-page .kpis{grid-template-columns:repeat(6,minmax(0,1fr))}.comparison .period{color:${t.muted}}.kpi small{font-size:22px}
body[data-dashboard=saas] main,body[data-dashboard=finance] main{height:900px;display:flex;flex-direction:column}
body[data-dashboard=saas] .board,body[data-dashboard=finance] .board{flex:1;min-height:0;grid-template-rows:1fr 1fr;gap:24px}
body[data-dashboard=saas] .panel,body[data-dashboard=finance] .panel{display:flex;flex-direction:column;padding-top:16px}
body[data-dashboard=saas] .chart,body[data-dashboard=finance] .chart{flex:1;height:auto;min-height:0}
.ranking .top-rank{font-weight:750;font-size:18px}.ranking b{font-weight:400}.rank-product{display:flex;flex-direction:column;gap:7px}.rank-track{height:5px;background:${t.hairline};width:100%;border-radius:2px;overflow:hidden}.rank-track>span{display:block;height:100%;background:${t.brand}}.ranking li{grid-template-columns:32px minmax(0,1fr) 96px;height:39px}.ranking .amount{font-variant-numeric:tabular-nums}
.store-layout{grid-template-columns:1.7fr 1fr}.channel-breakdown{left:48%;right:auto;width:190px;top:8px}.channel-breakdown>div{display:grid;grid-template-columns:1fr 40px;gap:16px}.channel-breakdown b{text-align:right}
.live-layout .ranking{height:calc(100% - 44px);display:grid;grid-template-rows:repeat(8,1fr)}.live-layout .ranking li{height:auto;grid-template-columns:32px minmax(0,1fr) 120px}.live-layout .rank-track{height:7px}.regions .tile{border:0}.regions .tile span{color:inherit}
`;
document.head.append(css);
const root = document.querySelector('main');
const delta = (v, previous, label, i, polarity) => {
  const f = formatDelta(v, previous, pack, { mode, polarity });
  return `<div class="comparison">${!before && global ? '' : `<span>${label}</span>`}<span data-delta data-polarity="${polarity}" data-direction="${f.direction}" style="color:${before ? (i % 2 ? '#39d58a' : '#ed5e70') : f.color}">${before ? `${i % 2 ? '+' : '▲ '}${(((v - previous) / previous) * 100).toFixed(2)}%` : f.text}</span>${!before && global ? `<span class="period">vs ${name === 'saas' ? 'Oct' : 'Sep'}</span>` : ''}</div>`;
};
const kpis = kpisFor(name);
const polarityFor = (label) =>
  ['Churn', 'Operating expense', '退款金额'].includes(label)
    ? 'lower-is-better'
    : 'higher-is-better';
root.innerHTML = `<header><div><div class="identity">${cn ? '示例店铺' : 'Example workspace'}</div><h1>${before ? '✨ ' : ''}${titles[name]}</h1></div><div class="date">${live ? `${date}　18:00` : cn ? `${formatDate('2026-09-01', pack)} 至 ${date}` : name === 'saas' ? 'Jun 1, 2025 – Nov 30, 2026' : 'Nov 1, 2025 – Oct 31, 2026'}</div></header>${name === 'store' ? `<div class="controls"><div class="segments" aria-label="日期范围">${['今天', '昨天', '近7天', '近30天', '本月'].map((s) => `<button class="${s === '近30天' ? 'active' : ''}" aria-pressed="${s === '近30天'}">${s}</button>`).join('')}</div></div>` : ''}<section class="kpis">${kpis.map(([label, v, type, previous, yearAgo], i) => `<div class="kpi"><label data-kpi-label>${before ? ['💰', '📈', '🎯', '👥', '⚡', '💎'][i] + ' ' : ''}${label}</label><div class="value" data-kpi>${type === 'money' ? money(v) : type === 'percent' ? pct(v) : type === 'months' && !before ? v.toFixed(1) : num(v)}${type === 'months' ? ' <small>months</small>' : ''}</div>${delta(v, previous, cn ? (live ? '日环比' : '环比') : 'Prior month', i, polarityFor(label))}${cn && !live ? delta(v, yearAgo, '同比', i + 1, polarityFor(label)) : ''}</div>`).join('')}</section><div class="board ${name === 'store' ? 'store-layout' : live ? 'live-layout' : ''}"></div>`;
const board = root.querySelector('.board');
function panel(title, cls = '') {
  const el = document.createElement('section');
  el.className = `panel ${cls}`;
  el.innerHTML = `<h2>${title}</h2>`;
  board.append(el);
  return el;
}
const charts = [];
function chart(title, option, cls = '', chartCls = '') {
  const el = panel(title, cls);
  const canvas = document.createElement('div');
  canvas.className = `chart ${chartCls}`;
  el.append(canvas);
  const instance = echarts.init(canvas, null, { renderer: 'canvas' });
  charts.push(instance);
  const base = {
    animation: false,
    backgroundColor: before ? (mode === 'dark' ? '#172039' : '#ffffff') : surface,
    textStyle: { fontFamily: 'system-ui, sans-serif', fontSize: live ? 16 : 12, color: t.ink },
    tooltip: { trigger: 'axis', valueFormatter: compact, shadowBlur: 0 },
    grid: { left: 60, right: 28, top: 52, bottom: 32 },
    ...(!before ? { color: t.categorical } : {}),
  };
  if (!before && option.yAxis?.type === 'category') {
    const rows = option.yAxis.data.map((label, i) => ({ label, value: option.series[0].data[i] }));
    rows.sort((a, b) => (a.label === 'Other' ? 1 : b.label === 'Other' ? -1 : b.value - a.value));
    option.yAxis.data = rows.map((r) => r.label);
    option.yAxis.inverse = true;
    option.xAxis = {
      ...option.xAxis,
      show: false,
      name: '',
      max: Math.max(...rows.map((r) => r.value)) * 1.22,
    };
    option.series[0].data = rows.map((r) => r.value);
    option.series[0].label = {
      show: true,
      position: 'right',
      color: t.ink,
      formatter: (p) => (title === 'Signups by channel' ? compact(p.value) : money(p.value)),
    };
    option.grid = { left: 100, right: 32, top: 8, bottom: 8 };
  } else if (!before && global) {
    option.grid = { left: 64, right: 28, top: 44, bottom: 32 };
  }
  instance.setOption({ ...base, ...option });
  return el;
}
const axis = (name, extra = {}) => ({
  type: 'value',
  name: before ? '' : global && name.includes('$') ? name.replace('($)', '($K)') : name,
  min: 0,
  scale: before,
  axisLabel: {
    color: t.muted,
    fontSize: live ? 16 : 12,
    ...(!before
      ? {
          formatter:
            global && name.includes('$')
              ? (v) => (v / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })
              : compact,
        }
      : {}),
  },
  nameTextStyle: { color: t.muted, fontSize: live ? 16 : 12 },
  splitLine: { lineStyle: { color: t.hairline } },
  ...extra,
});
const x = {
  type: 'category',
  data: d.months,
  axisLabel: { color: t.muted, fontSize: live ? 16 : 12, hideOverlap: true },
  axisLine: { lineStyle: { color: t.hairline } },
  axisTick: { show: false },
};
const line = (title, values, extra = {}) => ({
  type: 'line',
  name: title,
  data: values,
  smooth: before,
  showSymbol: before,
  symbolSize: 6,
  lineStyle: { width: 2 },
  ...extra,
});
const bar = (title, values, extra = {}) => ({
  type: 'bar',
  name: title,
  data: values,
  barMaxWidth: 24,
  ...extra,
});
const legend = {
  textStyle: { color: t.muted, fontSize: live ? 16 : 12 },
  top: 0,
  left: 'center',
  itemWidth: 14,
  itemHeight: 8,
};
function ranking(title, labels, values) {
  const el = panel(title, 'ranking-panel');
  el.innerHTML += `<ol class="ranking" data-ranking>${values.map((v, i) => `<li><b class="${i < 3 ? 'top-rank' : ''}">${before && live && i < 3 ? ['🥇', '🥈', '🥉'][i] : compact(i + 1)}</b><span class="rank-product">${labels[i]}${!before ? `<span class="rank-track"><span style="width:${(v / Math.max(...values)) * 100}%"></span></span>` : ''}</span><span class="amount">${money(v)}</span></li>`).join('')}</ol>`;
}
function parts(title, labels) {
  const values = before
    ? d.parts
    : [...d.parts.slice(0, 4), d.parts.slice(4).reduce((a, b) => a + b, 0)];
  const el = chart(
    title,
    {
      tooltip: { trigger: 'item', valueFormatter: (v) => formatPercent(v / 100), shadowBlur: 0 },
      legend: {
        show: before,
        ...(before ? { ...legend, bottom: 0, top: undefined, left: 'center' } : {}),
      },
      series: [
        {
          type: 'pie',
          radius: ['46%', '68%'],
          center: before ? ['50%', '45%'] : ['38%', '50%'],
          label: { show: false },
          itemStyle: { shadowBlur: before ? 24 : 0, shadowColor: '#7766cc' },
          data: values.map((v, i) => ({
            name: labels[i] || (cn ? `渠道 ${compact(i + 1)}` : `Channel ${compact(i + 1)}`),
            value: v,
          })),
        },
      ],
    },
    '',
    name === 'store' ? 'chart-small' : '',
  );
  if (!before) {
    el.lastChild.style.position = 'relative';
    el.lastChild.insertAdjacentHTML(
      'beforeend',
      `<div class="channel-breakdown">${values.map((v, i) => `<div><span><i style="background:${t.categorical[i]}"></i>${labels[i]}</span><b>${formatPercent(v / 100, 0)}</b></div>`).join('')}</div>`,
    );
  }
}
if (name === 'saas') {
  chart(
    before
      ? 'MRR trend'
      : `MRR ${kpis[0][1] >= kpis[0][3] ? 'up' : 'down'} ${Math.abs((kpis[0][1] / kpis[0][3] - 1) * 100).toFixed(1)}% in November`,
    { xAxis: x, yAxis: axis('MRR ($)'), series: [line('MRR', d.revenue)] },
    '',
    'main-chart',
  );
  chart('New vs churned MRR', {
    legend,
    xAxis: x,
    yAxis: before ? [axis(''), axis('')] : axis('MRR ($)'),
    series: [bar('New', d.added), bar('Churned', d.churned, before ? { yAxisIndex: 1 } : {})],
  });
  chart(
    'Revenue by plan',
    before
      ? {
          tooltip: { trigger: 'item' },
          series: [
            {
              type: 'pie',
              radius: ['40%', '68%'],
              label: { show: false },
              itemStyle: { shadowBlur: 24 },
              data: d.plans.map((v, i) => ({ name: d.planNames[i], value: v })),
            },
          ],
        }
      : {
          xAxis: axis('Revenue ($)'),
          yAxis: {
            type: 'category',
            data: [...d.planNames.slice(0, 4), 'Other'],
            axisLabel: { color: t.muted },
            axisTick: { show: false },
            axisLine: { show: false },
          },
          series: [
            bar('Revenue', [...d.plans.slice(0, 4), d.plans.slice(4).reduce((a, b) => a + b, 0)]),
          ],
        },
  );
  chart('Signups by channel', {
    xAxis: axis('Signups'),
    yAxis: {
      type: 'category',
      data: ['Direct', 'Search', 'Referral', 'Other'],
      axisLabel: { color: t.muted },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [bar('Signups', d.ranks.slice(0, 4))],
  });
} else if (name === 'finance') {
  chart(
    'Revenue stays ahead of operating expense',
    {
      legend,
      xAxis: x,
      yAxis: before ? [axis(''), axis('')] : axis('Amount ($)'),
      series: [
        bar('Revenue', d.revenue),
        line('Operating expense', d.expense, before ? { yAxisIndex: 1 } : {}),
      ],
    },
    'wide',
    'main-chart',
  );
  chart('Gross margin', {
    xAxis: x,
    yAxis: axis('Margin (%)', {
      ...(!before ? { min: 50, max: 80, interval: 10 } : {}),
      axisLabel: { color: t.muted, formatter: (v) => formatPercent(v / 100, 0) },
    }),
    series: [line('Gross margin', d.margin)],
  });
  chart('Operating expense by category', {
    xAxis: axis('Expense ($)'),
    yAxis: {
      type: 'category',
      inverse: true,
      data: ['People', 'Infrastructure', 'Operations', 'Marketing', 'Other'],
      axisLabel: { color: t.muted },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [bar('Expense', d.ranks)],
  });
} else if (name === 'store') {
  chart(
    '成交趋势',
    {
      legend,
      xAxis: x,
      yAxis: [
        axis('成交金额（万元）'),
        axis('转化率（%）', {
          axisLabel: { color: t.muted, formatter: (v) => formatPercent(v / 100) },
        }),
      ],
      series: [
        bar(
          '成交金额',
          d.revenue.map((v) => v / 10000),
        ),
        line('转化率', d.rate, {
          yAxisIndex: 1,
          lineStyle: { color: before ? undefined : t.categorical[3], width: 2 },
          itemStyle: { color: before ? undefined : t.categorical[3] },
        }),
      ],
    },
    'trend-panel',
    'main-chart',
  );
  ranking(
    `商品成交排行 · TOP ${compact(10)}`,
    Array.from({ length: 10 }, (_, i) => `示例商品 ${String.fromCharCode(65 + i)}`),
    d.ranks,
  );
  parts('渠道成交占比', [
    '自然搜索',
    '直接访问',
    '内容推荐',
    '付费推广',
    '其他',
    '活动入口',
    '外部链接',
  ]);
} else {
  chart(
    '今日成交高于昨日',
    {
      legend,
      xAxis: x,
      yAxis: axis('成交金额（万元）'),
      series: [
        line(
          '今日',
          d.revenue.map((v) => v / 10000),
        ),
        line(
          '昨日',
          d.yesterday.map((v) => v / 10000),
          before
            ? {}
            : {
                lineStyle: { color: t.muted, type: 'dashed', width: 2 },
                itemStyle: { color: t.muted },
              },
        ),
      ],
    },
    'trend-panel',
    'main-chart',
  );
  ranking(
    `商品成交排行 · TOP ${compact(before ? 5 : 8)}`,
    Array.from({ length: before ? 5 : 8 }, (_, i) => `示例商品 ${String.fromCharCode(65 + i)}`),
    before ? d.ranks.slice(0, 5) : d.ranks,
  );
  const ring = chart(
    '目标达成率',
    {
      tooltip: { show: false, shadowBlur: 0 },
      series: [
        {
          type: 'pie',
          silent: true,
          radius: ['54%', '76%'],
          label: { show: false },
          itemStyle: { shadowBlur: before ? 24 : 0 },
          data: [
            { value: (kpis[0][1] / 2000000) * 100, name: '已完成' },
            {
              value: 100 - (kpis[0][1] / 2000000) * 100,
              name: '待完成',
              itemStyle: { color: before ? undefined : t.hairline },
            },
          ],
        },
      ],
    },
    '',
    'ring',
  );
  ring.lastChild.classList.add('ring-wrap');
  ring.lastChild.insertAdjacentHTML(
    'beforeend',
    `<div class="ring-value">${pct(kpis[0][1] / 2000000)}</div>`,
  );
  const el = panel('区域成交', 'regions');
  const shades = ['#17263c', '#203955', '#294d70', '#32618b', t.brand];
  el.innerHTML += `<div class="tiles">${d.regions.map((v, i) => `<div class="tile" ${!before ? `style="background:${shades[Math.min(4, Math.floor(((v - Math.min(...d.regions)) / (Math.max(...d.regions) - Math.min(...d.regions))) * 5))]};color:${v >= Math.min(...d.regions) + (Math.max(...d.regions) - Math.min(...d.regions)) * 0.8 ? '#0B1220' : '#f0f5fc'}"` : ''}><span>区域 ${String.fromCharCode(65 + i)}</span><b>${money(v)}</b></div>`).join('')}</div>`;
}
document.body.classList.toggle('live-page', live);
window.galleryReady = true;
