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
  const mono = 'Geist Mono';
  const bg = t.page || t.bg || t.paper,
    surface = name === 'store' ? t.card : bg;
  const style = document.createElement('style');
  style.textContent = `@font-face{font-family:Inter;src:url('../../vendor/fonts/inter.woff2');font-weight:100 900}@font-face{font-family:'Instrument Sans';src:url('../../vendor/fonts/instrument-sans.woff2');font-weight:100 900}
 @font-face{font-family:'Geist Mono';src:url('../../vendor/fonts/geist-mono.woff2');font-weight:100 900} *{box-sizing:border-box}body{margin:0;background:${bg};color:${t.ink};font:400 ${screen ? 16 : 13}px '${face}','PingFang SC','Noto Sans CJK SC',sans-serif;font-variant-numeric:tabular-nums;font-feature-settings:'tnum','cv11'}main{margin:${screen ? 32 : 28}px;height:calc(100vh - ${screen ? 64 : 56}px);${name === 'store' ? `background:${surface};border:1px solid ${t.hairline};border-radius:12px;padding:24px 28px;` : 'padding:0 12px;'}}header{height:${screen ? 66 : 64}px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid ${t.hairline};margin-bottom:24px}h1{font-size:20px;font-weight:500;margin:6px 0}h2{font-size:16px;font-weight:500;margin:0 0 16px}.muted,label,th,.period{color:${t.muted}}.identity{font-size:${screen ? 16 : 13}px}.date{color:${t.muted};padding-top:12px}label{display:block;font-size:${screen ? 16 : 13}px;font-weight:500}.hero{font-size:${screen ? 120 : 64}px;line-height:1.15;letter-spacing:-.025em;font-weight:500;margin:8px 0 12px}.value{font-size:${screen ? 36 : 24}px;font-weight:500;margin:8px 0}.delta{display:inline-flex;gap:6px;align-items:center;font-size:${screen ? 16 : 12}px}.period{margin-right:16px;white-space:nowrap}.top{display:grid;grid-template-columns:minmax(0,2.12fr) minmax(0,1fr);gap:32px}.rail{border-left:1px solid ${t.hairline};padding-left:28px}.rail .kpi{height:108px;border-bottom:1px solid ${t.hairline};position:relative;padding:8px 0}.spark{position:absolute;width:120px;height:32px;right:0;top:36px}.chart{width:100%;height:260px}.bottom{border-top:1px solid ${t.hairline};margin-top:24px;padding-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:36px}table{width:100%;border-collapse:collapse;font-size:${screen ? 16 : 13}px}th{white-space:nowrap;font-size:${screen ? 16 : 12}px;font-weight:400;text-align:left;height:32px}td{height:${screen ? 48 : 36}px;border-bottom:1px solid ${t.hairline};white-space:nowrap}td:not(:first-child),th:not(:first-child){text-align:right}td.product,.ranking th:nth-child(2){text-align:left;padding-left:16px}.track{height:4px;background:${t.hairline};width:100%;margin-top:6px}.track i{display:block;height:4px;background:${t.ink}}.share{width:100px;padding-left:20px}.rank{min-width:36px;color:${t.muted};width:24px}.channels>div{padding:14px 0;border-bottom:1px solid ${t.hairline}}.row{display:flex;justify-content:space-between}.small-number{font-size:24px;font-weight:500}.strip{display:grid;grid-template-columns:repeat(5,1fr);gap:28px;padding:24px 0;border-top:1px solid ${t.hairline};border-bottom:1px solid ${t.hairline}}.regions{display:grid;grid-template-columns:repeat(6,1fr);gap:24px 28px}.region{position:relative;height:94px;border-bottom:1px solid ${t.hairline}}.region .spark{top:42px;width:100%;height:42px}.region .small-number{font-size:20px}.progress{height:4px;background:${t.hairline};margin:12px 0}.progress i{display:block;height:4px;background:${t.ink}}`;
  style.textContent += `body[data-dashboard=store] main{margin:16px;height:calc(100vh - 32px);padding:16px 24px}body[data-dashboard=store] header{height:48px;margin-bottom:16px}body[data-dashboard=store] .rail .kpi{height:76px;padding:3px 0}body[data-dashboard=store] .rail .value{margin:3px 0}body[data-dashboard=store] .rail .spark{top:24px}body[data-dashboard=store] .channels>div{padding:11px 0}`;
  style.textContent += `body[data-dashboard=live] .hero{font-size:112px;margin:4px 0 8px}body[data-dashboard=live] .strip{padding:16px 0}body[data-dashboard=live] .regions{gap:16px 28px}body[data-dashboard=live] .region{height:78px}body[data-dashboard=live] .region .spark{top:32px;height:40px}`;
  style.textContent += `body[data-dashboard=saas] .rail .kpi{height:96px}`;
  style.textContent += `.kpi{padding:8px 0;min-height:98px}.hero{margin:8px 0}.delta-row{display:flex;align-items:center;min-height:18px;white-space:nowrap}.hero + .delta-row{margin-top:8px}.chart{margin-top:20px}.rail .kpi{height:110px;padding:10px 0 14px}.rail .value{margin:8px 0}.share{width:150px;padding-left:16px}.share-inline{display:inline-flex;gap:10px;align-items:center}.share-inline .track{width:64px;margin:0;border-radius:2px;overflow:hidden}.share-inline>span:last-child{width:44px;text-align:right}.ranking{table-layout:auto}.ranking .product{width:100%}.ranking .amount{min-width:90px}.target{display:flex;align-items:center;gap:12px;padding-bottom:36px}.target .track{width:160px;margin:0}.target .track i{background:#C9D2FF}body[data-dashboard=store] header{height:78px;padding-bottom:16px}body[data-dashboard=store] h1{margin:4px 0 0}body[data-dashboard=store] .top>.rail{display:grid;grid-template-columns:1fr 1fr;gap:0 20px}body[data-dashboard=store] .rail .kpi{height:148px;padding:8px 0 42px}body[data-dashboard=store] .rail .value{font-size:26px;margin:6px 0}body[data-dashboard=store] .rail .spark{width:100%;height:28px;top:auto;bottom:8px}body[data-dashboard=store] .channels>div{height:40px;padding:0;display:grid;grid-template-columns:64px 1fr 82px 48px;gap:10px;align-items:center;border-bottom:1px solid ${t.hairline}}.channels .track{height:6px;margin:0}.channels .track i{height:6px}.channels .num{text-align:right}body[data-dashboard=live] .hero{font-size:88px;line-height:1.05}body[data-dashboard=live] .chart{margin-top:20px}body[data-dashboard=live] .strip{margin-top:16px!important;padding:12px 0}body[data-dashboard=live] .regions{gap:12px 28px}body[data-dashboard=live] .region{height:94px}body[data-dashboard=live] .region .spark{top:34px;height:54px}body[data-dashboard=finance] .ranking td{height:40px}body[data-dashboard=finance] .bottom .rail .kpi{height:112px}`;
  style.textContent += `body[data-dashboard=saas] .bottom td{height:32px}body[data-dashboard=store] header{height:70px}body[data-dashboard=store] .hero{font-size:52px}body[data-dashboard=store] td{height:32px}body[data-dashboard=store] .top>.rail{align-content:start}body[data-dashboard=store] .bottom .rail{display:block}body[data-dashboard=store] .ranking .product{width:auto}body[data-dashboard=store] .ranking{table-layout:fixed}body[data-dashboard=store] .ranking th:first-child{width:36px}body[data-dashboard=store] .ranking th:nth-child(3){width:100px}body[data-dashboard=store] .ranking th:nth-child(4){width:150px}body[data-dashboard=store] .ranking th:nth-child(5){width:72px}body[data-dashboard=finance] #burn{margin-top:10px}body[data-dashboard=finance] .bottom .rail .kpi{height:98px}body[data-dashboard=live] .hero{font-size:64px}body[data-dashboard=live] .strip{padding:8px 0;margin-top:12px!important}body[data-dashboard=live] .strip .kpi{padding:0;min-height:94px;height:94px}body[data-dashboard=live] .strip .value{font-size:30px;line-height:1.15;margin:4px 0}body[data-dashboard=live] .progress{margin:8px 0}body[data-dashboard=live] .region{height:85px}body[data-dashboard=live] .region .spark{height:45px}`;
  style.textContent += `.period:empty{display:none}td:last-child{padding-left:10px}th:not(:first-child){padding-left:12px}.target{padding-bottom:48px}body[data-dashboard=finance] .top{grid-template-columns:minmax(0,1.85fr) minmax(0,1fr)}body[data-dashboard=finance] .share{padding-left:8px}body[data-dashboard=store] .bottom{grid-template-columns:1.4fr 1fr!important}`;
  style.textContent += `header{height:48px;margin-bottom:20px}body[data-dashboard=store] header{height:48px}th{font-family:${cn ? face : mono};font-size:${screen ? 16 : cn ? 12 : 11}px;letter-spacing:${cn ? 0 : '.06em'};text-transform:${cn ? 'none' : 'uppercase'}}${!cn ? `label{font:400 11px '${mono}';letter-spacing:.06em;text-transform:uppercase}` : ''}.track i{background:${t.ink};opacity:.2}tr:first-child .track i,.channels>div:first-child .track i{opacity:1}.progress i{background:${t.ink}}body[data-dashboard=live] .hero{font-size:112px;line-height:1.15;margin-top:12px}body[data-dashboard=live] header{height:44px;margin-bottom:12px}body[data-dashboard=live] .kpi{min-height:0}body[data-dashboard=live] .chart{margin-top:8px}body[data-dashboard=live] .region{height:75px}body[data-dashboard=live] .region .spark{height:38px}`;
  style.textContent += `body[data-dashboard=store] .top>.rail{display:block}body[data-dashboard=store] .top>.rail .kpi{height:82px;min-height:0;padding:8px 136px 8px 0}body[data-dashboard=store] .top>.rail label{font-size:13px}body[data-dashboard=store] .top>.rail .value{font-size:24px;line-height:28px;margin:3px 0}body[data-dashboard=store] .top>.rail .spark{width:120px;height:32px;top:24px;bottom:auto}body[data-dashboard=store] .channels .track,body[data-dashboard=store] .channels .track i{height:4px}body[data-dashboard=store] .channels .track i{background:${t.muted};opacity:1}body[data-dashboard=store] .channels>div:first-child .track i{background:${t.ink}}`;
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
    showSymbol: !cn && values.length <= 31,
    symbol: comparison ? 'emptyCircle' : 'circle',
    symbolSize: 3.5,
    smooth: false,
    lineStyle: {
      width: comparison ? 1 : 1.5,
      type: comparison ? 'dashed' : 'solid',
      color: comparison ? t.muted : cn && !dark ? t.brand : t.ink,
    },
    itemStyle: { color: comparison ? t.muted : cn && !dark ? t.brand : t.ink },
    endLabel: { show: false },
    markPoint: comparison
      ? undefined
      : {
          symbol: 'circle',
          symbolSize: 7,
          itemStyle: { color: cn ? t.accent : t.brand },
          label: {
            show: !!name,
            formatter: () => money(last(values)),
            position: 'top',
            distance: 10,
            color: cn ? t.ink : t.brand,
            fontSize: screen ? 16 : 11,
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
        axisLine: { lineStyle: { color: t.hairline } },
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
    const annotations = [];
    series.forEach((item, i) => {
      if (item.type !== 'line' || !item.name) return;
      const [x, y] = c.convertToPixel({ gridIndex: 0 }, [labels.length - 1, item.data.at(-1)]);
      annotations.push(
        {
          id: 'leader-' + i,
          type: 'line',
          shape: { x1: x + 5, y1: y, x2: x + 22, y2: y },
          style: { stroke: t.muted, lineWidth: 1 },
        },
        {
          id: 'annotation-' + i,
          type: 'text',
          x: x + 28,
          y,
          style: {
            text: item.name,
            fill: t.muted,
            font: `${screen ? 16 : 12}px '${face}'`,
            verticalAlign: 'middle',
          },
        },
      );
    });
    if (annotations.length) c.setOption({ graphic: annotations });
    return c;
  }
  const spark = (id, values, max) => {
    const c = echarts.init(document.getElementById(id));
    c.setOption({
      animation: false,
      backgroundColor: surface,
      color: [t.ink],
      grid: { left: 3, right: 4, top: 4, bottom: 4 },
      xAxis: {
        type: 'category',
        axisLabel: { color: t.muted },
        show: false,
        data: values.map((_, i) => i),
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
          lineStyle: { width: 1.5, color: cn && !dark ? t.brand : t.ink },
          markPoint: {
            symbol: 'circle',
            symbolSize: 4,
            itemStyle: { color: cn ? t.accent : t.brand },
            label: { show: false },
            data: [{ coord: [values.length - 1, last(values)] }],
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
    `<table class="ranking"><thead><tr><th>${cnTable ? '排名' : 'Rank'}</th><th>${cnTable ? '商品' : 'Item'}</th><th>${cnTable ? '成交额' : 'Amount'}</th><th>${cnTable ? '占比' : 'Share'}</th><th>${cnTable ? '同比' : name === 'finance' ? 'Δ vs Sep' : 'Δ vs Oct'}</th></tr></thead><tbody>${values.map((v, i) => `<tr><td class="rank">${String(i + 1).padStart(2, '0')}</td><td class="product">${names[i]}</td><td class="amount">${(cn ? '¥' : '$') + (v / (cn ? 10000 : 1000)).toFixed(2) + (cn ? '万' : 'K')}</td><td class="share"><span class="share-inline"><span class="track"><i style="width:${(v / Math.max(...values)) * 100}%"></i></span><span>${((v / total) * 100).toFixed(1)}%</span></span></td><td>${delta(v, previous[i], '', polarity)}</td></tr>`).join('')}</tbody></table>`;
  const ready = async () => {
    await document.fonts.ready;
    window.galleryReady = true;
  };
  await document.fonts.load(`500 24px '${face}'`);
  await document.fonts.load(`400 11px '${mono}'`);
  await document.fonts.ready;
  return { root, t, tick, compact, money, delta, metric, line, chart, spark, table, ready };
}
