import { documentTheme } from './after-theme.mjs';
import { getTokens } from '../../dist/packs/index.js';
import { formatDelta } from '../../dist/format.js';
export { data, kpisFor } from '../data.mjs';
const shares = (values, total) => {
  const exact = values.map((v) => (v / total) * 1000),
    rounded = exact.map(Math.floor);
  const order = exact.map((v, i) => ({ i, r: v - rounded[i] })).sort((a, b) => b.r - a.r);
  const remainder = 1000 - rounded.reduce((a, b) => a + b, 0);
  for (let n = 0; n < remainder; n++) rounded[order[n].i]++;
  return rounded.map((v) => v / 10);
};
export const last = (a) => a.at(-1);
export async function setup(name, title, date) {
  const cn = ['store', 'live'].includes(name),
    screen = name === 'live',
    dark = ['finance', 'live'].includes(name);
  const t = documentTheme(getTokens(cn ? 'cn' : 'global', dark ? 'dark' : 'light'), dark);
  const face = cn ? 'Instrument Sans' : 'Inter';
  const mono = 'Geist Mono';
  const bg = name === 'store' ? t.page : t.paper,
    surface = name === 'store' ? t.card : bg;
  const style = document.createElement('style');
  const accent = t.brand;
  style.textContent = `
@font-face{font-family:Inter;src:url('../../vendor/fonts/inter.woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'Instrument Sans';src:url('../../vendor/fonts/instrument-sans.woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'Geist Mono';src:url('../../vendor/fonts/geist-mono.woff2');font-weight:100 900;font-display:swap}
*{box-sizing:border-box}
body{margin:0;background:${bg};color:${t.ink};font:400 ${screen ? 16 : 13}px '${face}','PingFang SC','Noto Sans CJK SC',sans-serif;font-variant-numeric:tabular-nums;font-feature-settings:'tnum','cv11'}
main{margin:${screen ? 32 : 28}px;height:calc(100vh - ${screen ? 64 : 56}px);padding:0 12px}
header{height:48px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid ${t.hairline};margin-bottom:18px}
h1{font-size:20px;font-weight:550;letter-spacing:-.025em;line-height:1.3;margin:0}h2{font-size:${screen ? 18 : 15}px;font-weight:550;letter-spacing:-.015em;line-height:1.4;margin:0 0 16px}
.muted,label,th,.period,.date{color:${t.muted}}.date{padding-top:3px;font-size:${screen ? 16 : 12}px;line-height:1.5;font-family:'${mono}';letter-spacing:-.025em}
label{display:block;font-size:${screen ? 16 : 13}px;font-weight:500;line-height:1.4}
.kpi{position:relative;padding:8px 0;min-width:0}
.hero,.value,.small-number{font-weight:500;font-variant-numeric:tabular-nums}
.hero{font-size:${screen ? 120 : 56}px;line-height:1.12;letter-spacing:-.02em;margin:6px 0 8px}
.value{font-size:${screen ? 36 : 24}px;line-height:1.2;margin:7px 0}
.delta{display:inline-flex;gap:6px;align-items:center;font-size:${screen ? 16 : 12}px}
.delta-row{display:flex;align-items:center;min-height:18px;white-space:nowrap;gap:12px}.period{white-space:nowrap}.period:empty{display:none}
.top{display:grid;grid-template-columns:minmax(0,2.12fr) minmax(0,1fr);gap:32px}
.rail{border-left:1px solid ${t.hairline};padding-left:28px;min-width:0}
.rail-row{display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:16px;padding:17px 0;border-bottom:1px solid ${t.hairline}}
.rail-row .kpi{padding:0}.rail-row .value{margin:5px 0}.rail-row .spark{position:static;align-self:center}
.spark{position:absolute;width:120px;height:36px;right:0;top:38px}
.chart{width:100%;height:260px;margin-top:20px}
.bottom{border-top:1px solid ${t.hairline};margin-top:18px;padding-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:36px}
table{width:100%;border-collapse:collapse;font-size:${screen ? 16 : 13}px}
th{height:32px;text-align:left;font-size:${screen ? 16 : 12}px;font-weight:400;font-family:'${cn ? face : mono}';white-space:nowrap}
td{height:${screen ? 48 : 36}px;border-bottom:1px solid ${t.hairline};white-space:nowrap}
td:not(:first-child),th:not(:first-child){text-align:right;padding-left:10px}
td.product,.ranking th:nth-child(2){text-align:left;padding-left:14px}.rank{width:30px;color:${t.muted}}
.share{width:140px;padding-left:14px}.share-inline{display:inline-flex;gap:10px;align-items:center}.share-inline>span:last-child{width:44px;text-align:right}
.track,.progress{height:4px;background:${t.hairline}}.track i,.progress i{display:block;height:4px;background:${t.ink}}
.share-inline .track{width:60px}.track i{background:${t.brand};opacity:.55}
.row{display:flex;justify-content:space-between;gap:12px}.small-number{font-size:24px}
.bridge{margin-top:14px}.bridge h2{margin:0}.bridge-ends{display:flex;justify-content:space-between;margin:8px 0;font-size:12px}.bridge-ends b{font:12px 'Geist Mono';color:${t.ink};font-variant-numeric:tabular-nums;font-feature-settings:'tnum'}
.ruler{max-width:48%;padding:0 26px 0 8px}.ruler .value{margin-bottom:18px}
.calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr)) 76px;grid-template-rows:32px repeat(5,minmax(0,1fr));gap:4px;width:100%;height:392px;text-align:center;font:12px 'Geist Mono';font-variant-numeric:tabular-nums;font-feature-settings:'tnum';color:${t.muted}}
.calendar>span{align-self:center}.calendar>div{display:grid;place-items:center;border-radius:2px}.calendar .week-total{background:none;color:${t.ink};justify-content:end}
body[data-dashboard=saas] #mrr{margin-top:16px}
body[data-dashboard=finance] .top{grid-template-columns:minmax(0,1.85fr) minmax(0,1fr)}
body[data-dashboard=finance] .ranking .share{width:110px;padding-left:8px}body[data-dashboard=finance] .share-inline .track{width:36px}
body[data-dashboard=finance] #burn{margin-top:10px}body[data-dashboard=finance] .bottom .kpi{padding:4px 0}
body[data-dashboard=store] main{margin:16px;height:calc(100vh - 32px);padding:22px 26px;background:${surface};border:1px solid ${t.hairline};border-radius:3px}
body[data-dashboard=store] header{margin-bottom:18px}body[data-dashboard=store] .hero{font-size:56px}
body[data-dashboard=store] .rail-row{padding:8px 0}body[data-dashboard=store] .rail-row label{line-height:15px}body[data-dashboard=store] .rail-row .delta-row{min-height:16px;line-height:16px}body[data-dashboard=store] .rail-row .value{font-size:22px;line-height:24px;margin:2px 0}
body[data-dashboard=store] .bottom{grid-template-columns:1.4fr 1fr!important}
body[data-dashboard=store] .ranking{table-layout:fixed}body[data-dashboard=store] .ranking th:first-child{width:34px}body[data-dashboard=store] .ranking th:nth-child(3){width:100px}body[data-dashboard=store] .ranking th:nth-child(4){width:142px}body[data-dashboard=store] .ranking th:nth-child(5){width:72px}
.hero-band{display:flex;align-items:center;justify-content:space-between;gap:28px}.pace{width:280px;flex-shrink:0}.pace>div{margin:22px 0}.progress{margin:12px 0}
.strip{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:28px;border-top:1px solid ${t.hairline};border-bottom:1px solid ${t.hairline}}
.regions{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px 28px}
.region{position:relative;height:80px;border-bottom:1px solid ${t.hairline}}.region .row{align-items:baseline}.region .small-number{font-size:24px}.region .spark{top:34px;width:100%;height:44px}
body[data-dashboard=live] header{height:44px;margin-bottom:12px}body[data-dashboard=live] .hero{font-size:120px;margin:8px 0;line-height:1.12}
body[data-dashboard=live] .chart{margin-top:8px}body[data-dashboard=live] .strip{margin-top:18px!important;padding:8px 0}
body[data-dashboard=live] .strip .value{margin:4px 0}
body[data-dashboard=live] .strip .kpi{padding:0}body[data-dashboard=live] main>section{padding-top:14px!important}body[data-dashboard=live] main>section h2{margin-bottom:12px}
body[data-dashboard=live] .regions{grid-template-columns:repeat(9,minmax(0,1fr));gap:12px 22px}
body[data-dashboard=live] .region.major{grid-column:span 3;height:115px}
body[data-dashboard=live] .region.major .small-number{font-size:40px}
body[data-dashboard=live] .region.major .spark{top:54px;height:64px}
body[data-dashboard=live] .region.minor{height:88px}
body[data-dashboard=live] .region.minor .small-number{font-size:20px}
body[data-dashboard=live] .region.minor .spark{top:44px;height:44px}
body[data-dashboard=live] .pace>div{margin:14px 0}
body[data-dashboard=live] .hero{font-size:112px;letter-spacing:-.045em}
body[data-dashboard=live] .strip{margin-top:8px!important;padding:4px 0}
body[data-dashboard=live] header{margin-bottom:4px}
body[data-dashboard=live] main{margin:28px 32px;height:calc(100vh - 56px)}
body[data-dashboard=live] main>section{padding-top:8px!important}
body[data-dashboard=saas] .rail-row{padding:14px 0}
body[data-dashboard=saas] .bottom td{height:28px}body[data-dashboard=saas] .bottom th{height:28px}
body[data-dashboard=finance] .bottom .rail .kpi{height:auto;padding:6px 0}
body[data-dashboard=store] td{height:32px}body[data-dashboard=store] .calendar{height:352px}body[data-dashboard=store] .bottom{align-items:stretch}body[data-dashboard=store] .bottom>section{display:flex;flex-direction:column}body[data-dashboard=store] .bottom .rail{flex:1}body[data-dashboard=store] .calendar{flex:1;height:auto;min-height:0}
`;
  document.head.append(style);
  const root = document.querySelector('main');
  root.innerHTML = `<header><div><h1>${title}</h1></div><div class="date">${date}</div></header>`;
  const compact = (v) =>
    cn
      ? Math.abs(v) >= 1e8
        ? (v / 1e8).toFixed(2) + '亿'
        : Math.abs(v) >= 1e4
          ? (v / 1e4).toFixed(1) + '万'
          : v.toLocaleString('en-US', { maximumFractionDigits: 1 })
      : Math.abs(v) >= 1e6
        ? (v / 1e6).toFixed(2) + 'M'
        : Math.abs(v) >= 1e4
          ? (v / 1e3).toFixed(1) + 'K'
          : v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const tick = (v) => {
    const n = Math.abs(v),
      unit = cn ? (n >= 1e8 ? 1e8 : n >= 1e4 ? 1e4 : 1) : n >= 1e6 ? 1e6 : n >= 1e3 ? 1e3 : 1;
    return (
      (v < 0 ? '−' : '') +
      (cn ? '' : '$') +
      Number((n / unit).toFixed(2)) +
      (cn
        ? unit === 1e8
          ? '亿'
          : unit === 1e4
            ? '万'
            : '元'
        : unit === 1e6
          ? 'M'
          : unit === 1e3
            ? 'K'
            : '')
    );
  };
  const money = (v) => (cn ? '¥' : '$') + compact(v);
  const delta = (
    v,
    p,
    period = cn ? '同比' : name === 'finance' ? 'vs Sep' : 'vs Oct',
    polarity = 'higher-is-better',
  ) => {
    const f = formatDelta(v, p, cn ? 'cn' : 'global', { mode: dark ? 'dark' : 'light', polarity });
    return `<span class="delta"><span data-delta data-polarity="${polarity}" data-direction="${f.direction}" style="color:${f.color}">${f.text}</span><span class="period">${period}</span></span>`;
  };
  const metric = (label, v, change = '', hero = false) =>
    `<div class="kpi" data-kpi-row><label>${label}</label><div class="${hero ? 'hero' : 'value'}" data-kpi>${v}</div><div class="delta-row">${change}</div></div>`;
  const line = (name, values, comparison = false) => ({
    type: 'line',
    name,
    data: values,
    showSymbol: false,
    symbol: comparison ? 'emptyCircle' : 'circle',
    symbolSize: 3.5,
    smooth: false,
    lineStyle: {
      width: comparison ? 1.5 : 1.8,
      type: comparison ? 'dashed' : 'solid',
      color: comparison ? t.muted : cn && !dark ? t.brand : t.ink,
    },
    itemStyle: { color: comparison ? t.muted : cn && !dark ? t.brand : t.ink },
    endLabel: { show: false },
    markPoint: comparison
      ? undefined
      : {
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: accent },
          label: {
            show: !!name,
            formatter: () => money(last(values)),
            position: 'top',
            distance: 8,
            color: cn ? t.ink : accent,
            fontSize: screen ? 16 : 12,
            fontFamily: face,
          },
          data: [{ coord: [values.length - 1, last(values)] }],
        },
  });
  function chart(id, labels, series, extra = {}) {
    const el = document.getElementById(id);
    const c = echarts.init(el, null, { renderer: 'canvas' });
    c.setOption({
      animation: false,
      backgroundColor: surface,
      color: [t.ink, t.muted],
      textStyle: { fontFamily: face, fontSize: screen ? 16 : 12, color: t.ink },
      grid: { left: 52, right: 98, top: 22, bottom: 30 },
      series,
      ...extra,
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisTick: { show: false },
        axisLine: { show: false },
        ...extra.xAxis,
        axisLabel: {
          color: t.muted,
          fontSize: screen ? 16 : cn ? 12 : 11,
          fontFamily: mono,
          hideOverlap: true,
          formatter: (v) =>
            /^\d{4}-\d{2}$/.test(v)
              ? new Date(v + '-01').toLocaleString('en', { month: 'short' }).toUpperCase() +
                ' ' +
                v.slice(2, 4)
              : String(v).toUpperCase(),
          ...extra.xAxis?.axisLabel,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        splitNumber: 3,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: t.grid || t.hairline, width: 1 } },
        ...extra.yAxis,
        axisLabel: {
          color: t.muted,
          fontSize: screen ? 16 : cn ? 12 : 11,
          fontFamily: cn ? face : mono,
          formatter: tick,
          ...extra.yAxis?.axisLabel,
        },
      },
    });
    const namedLines = series.filter((item) => item.type === 'line' && item.name);
    const annotations = [];
    let previousY = -Infinity;
    if (namedLines.length >= 2) {
      namedLines.forEach((item, i) => {
        const [x, y] = c.convertToPixel({ gridIndex: 0 }, [labels.length - 1, item.data.at(-1)]);
        const labelY =
          Math.abs(y - previousY) < (screen ? 24 : 20)
            ? previousY + (y < previousY ? -1 : 1) * (screen ? 24 : 20)
            : y;
        previousY = labelY;
        annotations.push(
          {
            id: 'leader-' + i,
            type: 'line',
            shape: { x1: x + 5, y1: y, x2: x + 22, y2: labelY },
            style: { stroke: t.muted, lineWidth: 1 },
          },
          {
            id: 'annotation-' + i,
            type: 'text',
            x: x + 28,
            y: labelY,
            style: {
              text: item.name,
              fill: t.muted,
              font: `${screen ? 16 : 12}px '${face}'`,
              verticalAlign: 'middle',
            },
          },
        );
      });
    }
    if (annotations.length) c.setOption({ graphic: annotations });
    return c;
  }
  const spark = (id, values, max, accent = true, hours) => {
    const c = echarts.init(document.getElementById(id));
    c.setOption({
      animation: false,
      backgroundColor: surface,
      color: [t.ink],
      grid: { left: 2, right: 2, top: 2, bottom: 2 },
      xAxis: {
        type: 'category',
        axisLabel: { color: t.muted },
        show: false,
        data: hours || values.map((_, i) => i),
      },
      yAxis: {
        type: 'value',
        name: '',
        axisLabel: { formatter: compact, color: t.muted },
        show: false,
        min: 0,
        max: max || Math.max(...values) * 1.1,
      },
      series: [
        {
          ...line('', values),
          showSymbol: false,
          endLabel: { show: false },
          lineStyle: { width: 1.8, color: cn && !dark ? t.brand : t.ink },
          markPoint: {
            symbol: 'circle',
            symbolSize: 4,
            itemStyle: { color: cn ? t.accent : t.brand },
            label: { show: false },
            data: accent ? [{ coord: [values.length - 1, last(values)] }] : [],
          },
        },
      ],
    });
  };
  const table = (
    names,
    values,
    cnTable = false,
    previous = values,
    polarity = 'higher-is-better',
    total = values.reduce((a, b) => a + b, 0),
  ) =>
    `<table class="ranking"><thead><tr><th>${cnTable ? '排名' : 'Rank'}</th><th>${cnTable ? '商品' : 'Item'}</th><th>${cnTable ? '成交额' : 'Amount'}</th><th>${cnTable ? '占比' : 'Share'}</th><th>${cnTable ? '同比' : name === 'finance' ? 'Δ vs Sep' : 'Δ vs Oct'}</th></tr></thead><tbody>${values.map((v, i) => `<tr><td class="rank">${String(i + 1).padStart(2, '0')}</td><td class="product">${names[i]}</td><td class="amount">${(cn ? '¥' : '$') + (v / (cn ? 10000 : 1000)).toFixed(2) + (cn ? '万' : 'K')}</td><td class="share"><span class="share-inline"><span class="track"><i style="width:${(v / Math.max(...values)) * 100}%"></i></span><span>${shares(values, total)[i].toFixed(1)}%</span></span></td><td>${delta(v, previous[i], '', polarity)}</td></tr>`).join('')}</tbody></table>`;
  const ready = async () => {
    for (const el of root.querySelectorAll(
      '.top > section, .top > aside, .bottom > section, main > section',
    ))
      el.setAttribute('data-section', el.className || 'hero');
    await document.fonts.ready;
    window.galleryReady = true;
  };
  await document.fonts.load(`500 24px '${face}'`);
  await document.fonts.load(`400 11px '${mono}'`);
  await document.fonts.ready;
  const event = (c, index, value, text, dx = 32, dy = -42) => {
    const [x, y] = c.convertToPixel({ gridIndex: 0 }, [index, value]);
    c.setOption({
      graphic: [
        {
          id: 'event-dot',
          type: 'circle',
          shape: { cx: x, cy: y, r: 2.5 },
          style: { fill: surface, stroke: t.ink, lineWidth: 1 },
        },
        {
          id: 'event-leader',
          type: 'polyline',
          shape: {
            points: [
              [x, y],
              [x + dx, y + dy],
              [x + dx + 16, y + dy],
            ],
          },
          style: { stroke: t.muted, lineWidth: 1, fill: 'none' },
        },
        {
          id: 'event-label',
          type: 'text',
          x: x + dx + 20,
          y: y + dy,
          style: {
            text,
            fill: t.ink,
            font: `${screen ? 16 : 12}px '${face}'`,
            verticalAlign: 'middle',
          },
        },
      ],
    });
  };
  return { root, t, tick, compact, money, delta, metric, line, chart, spark, table, ready, event };
}
