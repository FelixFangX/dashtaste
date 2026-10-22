import { getTokens } from '../../dist/packs/index.js';
import { formatDelta } from '../../dist/format.js';
export { data, kpisFor } from '../data.mjs';
export const last = (a) => a.at(-1);
export async function setup(name, title, date) {
  const cn = ['store', 'live'].includes(name),
    screen = name === 'live',
    dark = ['finance', 'live'].includes(name);
  const t = getTokens(cn ? 'cn' : 'global', dark ? 'dark' : 'light');
  const face = cn ? 'Instrument Sans' : 'Inter';
  const bg = t.page || t.bg || t.paper,
    surface = name === 'store' ? t.card : bg;
  const style = document.createElement('style');
  style.textContent = `@font-face{font-family:Inter;src:url('../../vendor/fonts/inter.woff2');font-weight:100 900}@font-face{font-family:'Instrument Sans';src:url('../../vendor/fonts/instrument-sans.woff2');font-weight:100 900}
 *{box-sizing:border-box}body{margin:0;background:${bg};color:${t.ink};font:400 ${screen ? 16 : 13}px '${face}','PingFang SC','Noto Sans CJK SC',sans-serif;font-variant-numeric:tabular-nums;font-feature-settings:'tnum','cv11'}main{margin:${screen ? 32 : 28}px;height:calc(100vh - ${screen ? 64 : 56}px);${name === 'store' ? `background:${surface};border:1px solid ${t.hairline};border-radius:12px;padding:24px 28px;` : 'padding:0 12px;'}}header{height:${screen ? 66 : 64}px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid ${t.hairline};margin-bottom:24px}h1{font-size:20px;font-weight:500;margin:6px 0}h2{font-size:${screen ? 20 : 16}px;font-weight:500;margin:0 0 16px}.muted,label,th,.period{color:${t.muted}}.identity{font-size:${screen ? 16 : 13}px}.date{color:${t.muted};padding-top:12px}label{display:block;font-size:${screen ? 16 : 13}px;font-weight:500}.hero{font-size:${screen ? 120 : 64}px;line-height:1.15;letter-spacing:-.02em;font-weight:500;margin:8px 0 12px}.value{font-size:${screen ? 36 : 24}px;font-weight:500;margin:8px 0}.delta{display:inline-flex;gap:8px;align-items:center;font-size:${screen ? 16 : 12}px}.period{margin-right:16px}.top{display:grid;grid-template-columns:minmax(0,2.12fr) minmax(0,1fr);gap:32px}.rail{border-left:1px solid ${t.hairline};padding-left:28px}.rail .kpi{height:108px;border-bottom:1px solid ${t.hairline};position:relative;padding:8px 0}.spark{position:absolute;width:120px;height:32px;right:0;top:36px}.chart{width:100%;height:260px}.bottom{border-top:1px solid ${t.hairline};margin-top:24px;padding-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:36px}table{width:100%;border-collapse:collapse;font-size:${screen ? 16 : 13}px}th{white-space:nowrap;font-size:${screen ? 16 : 12}px;font-weight:400;text-align:left;height:32px}td{height:${screen ? 48 : 36}px;border-bottom:1px solid ${t.hairline};white-space:nowrap}td:not(:first-child),th:not(:first-child){text-align:right}td.product,.ranking th:nth-child(2){text-align:left;padding-left:16px}.track{height:4px;background:${t.hairline};width:100%;margin-top:6px}.track i{display:block;height:4px;background:${t.brand}}.share{width:100px;padding-left:20px}.rank{min-width:36px;color:${t.muted};width:24px}.channels>div{padding:14px 0;border-bottom:1px solid ${t.hairline}}.row{display:flex;justify-content:space-between}.small-number{font-size:24px;font-weight:500}.strip{display:grid;grid-template-columns:repeat(5,1fr);gap:28px;padding:24px 0;border-top:1px solid ${t.hairline};border-bottom:1px solid ${t.hairline}}.regions{display:grid;grid-template-columns:repeat(6,1fr);gap:24px 28px}.region{position:relative;height:94px;border-bottom:1px solid ${t.hairline}}.region .spark{top:42px;width:100%;height:42px}.region .small-number{font-size:20px}.progress{height:4px;background:${t.hairline};margin:12px 0}.progress i{display:block;height:4px;background:${t.brand}}`;
  style.textContent += `body[data-dashboard=store] main{margin:16px;height:calc(100vh - 32px);padding:16px 24px}body[data-dashboard=store] header{height:48px;margin-bottom:16px}body[data-dashboard=store] .rail .kpi{height:76px;padding:3px 0}body[data-dashboard=store] .rail .value{margin:3px 0}body[data-dashboard=store] .rail .spark{top:24px}body[data-dashboard=store] .channels>div{padding:11px 0}`;
  style.textContent += `body[data-dashboard=live] .hero{font-size:112px;margin:4px 0 8px}body[data-dashboard=live] .strip{padding:16px 0}body[data-dashboard=live] .regions{gap:16px 28px}body[data-dashboard=live] .region{height:78px}body[data-dashboard=live] .region .spark{top:32px;height:40px}`;
  style.textContent += `body[data-dashboard=saas] .rail .kpi{height:96px}`;
  document.head.append(style);
  const root = document.querySelector('main');
  root.innerHTML = `<header><div><div class="identity muted">${cn ? '经营数据' : 'Workspace / Overview'}</div><h1>${title}</h1></div><div class="date">${date}</div></header>`;
  const compact = (v) =>
    cn
      ? Math.abs(v) >= 1e8
        ? (v / 1e8).toFixed(2) + '亿'
        : Math.abs(v) >= 1e4
          ? (v / 1e4).toFixed(1) + '万'
          : v.toLocaleString('en-US', { maximumFractionDigits: 1 })
      : Math.abs(v) >= 1e6
        ? (v / 1e6).toFixed(2) + 'M'
        : Math.abs(v) >= 1e3
          ? (v / 1e3).toFixed(1) + 'K'
          : v.toFixed(0);
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
    `<div class="kpi"><label>${label}</label><div class="${hero ? 'hero' : 'value'}" data-kpi>${v}</div>${change}</div>`;
  const line = (name, values, comparison = false) => ({
    type: 'line',
    name,
    data: values,
    showSymbol: false,
    smooth: false,
    lineStyle: {
      width: comparison ? 1.5 : screen ? 2.5 : 2,
      type: comparison ? 'dashed' : 'solid',
      color: comparison ? t.muted : t.brand,
    },
    itemStyle: { color: comparison ? t.muted : t.brand },
    endLabel: {
      show: true,
      formatter: () => name,
      color: comparison ? t.muted : t.brand,
      fontSize: screen ? 16 : 12,
    },
    labelLayout: { moveOverlap: 'shiftY' },
    markPoint: {
      symbol: 'circle',
      symbolSize: 6,
      label: { show: false },
      data: [{ coord: [values.length - 1, last(values)] }],
    },
  });
  function chart(id, labels, series, extra = {}) {
    const el = document.getElementById(id);
    const c = echarts.init(el, null, { renderer: 'canvas' });
    c.setOption({
      animation: false,
      backgroundColor: surface,
      color: [t.brand, t.other],
      textStyle: { fontFamily: face, fontSize: screen ? 16 : 12, color: t.ink },
      grid: { left: 52, right: 98, top: 22, bottom: 30 },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: t.hairline } },
        axisTick: { show: false },
        axisLabel: { color: t.muted, fontSize: screen ? 16 : 11, hideOverlap: true },
      },
      yAxis: {
        type: 'value',
        name: cn ? '金额（元）' : 'Amount ($)',
        nameTextStyle: { color: t.muted, fontSize: screen ? 16 : 11 },
        axisLine: { show: false },
        axisLabel: { color: t.muted, fontSize: screen ? 16 : 11, formatter: compact },
        splitLine: { lineStyle: { color: t.grid || t.hairline } },
      },
      series,
      ...extra,
    });
    return c;
  }
  const spark = (id, values, max) => {
    const c = echarts.init(document.getElementById(id));
    c.setOption({
      animation: false,
      backgroundColor: surface,
      color: [t.brand],
      grid: { left: 3, right: 4, top: 4, bottom: 4 },
      xAxis: {
        type: 'category',
        axisLabel: { color: t.muted },
        show: false,
        data: values.map((_, i) => i),
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        axisLabel: { formatter: compact, color: t.muted },
        show: false,
        min: 0,
        max: max || Math.max(...values) * 1.1,
      },
      series: [
        {
          ...line('', values),
          endLabel: { show: false },
          lineStyle: { width: 1.5, color: t.brand },
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
    `<table class="ranking"><thead><tr><th>${cnTable ? '排名' : 'Rank'}</th><th>${cnTable ? '商品' : 'Category'}</th><th>${cnTable ? '成交额' : 'Amount'}</th><th>${cnTable ? '占比' : 'Share'}</th><th>${cnTable ? '同比' : name === 'finance' ? 'Δ vs Sep' : 'Δ vs Oct'}</th></tr></thead><tbody>${values.map((v, i) => `<tr><td class="rank">${String(i + 1).padStart(2, '0')}</td><td class="product">${names[i]}</td><td class="amount">${(cn ? '¥' : '$') + (v / (cn ? 10000 : 1000)).toFixed(2) + (cn ? '万' : 'K')}</td><td class="share">${((v / total) * 100).toFixed(1)}%<div class="track"><i style="width:${(v / Math.max(...values)) * 100}%"></i></div></td><td>${delta(v, previous[i], '', polarity)}</td></tr>`).join('')}</tbody></table>`;
  const ready = async () => {
    await document.fonts.ready;
    window.galleryReady = true;
  };
  await document.fonts.load(`500 24px '${face}'`);
  await document.fonts.ready;
  return { root, t, compact, money, delta, metric, line, chart, spark, table, ready };
}
