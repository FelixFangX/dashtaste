import { copy, ruleCopy } from './locale.js';
const requested = new URLSearchParams(location.search).get('lang');
let saved;
try {
  saved = localStorage.getItem('dashtaste-lang');
} catch {}
const lang = ['en', 'zh'].includes(requested) ? requested : saved === 'zh' ? 'zh' : 'en';
const zh = lang === 'zh';
try {
  localStorage.setItem('dashtaste-lang', lang);
} catch {}
const tr = (en, cn) => (zh ? cn : en);
for (const el of document.querySelectorAll('[data-i18n]')) {
  const value = copy[el.dataset.i18n][zh ? 1 : 0];
  if (el.querySelector('select')) el.firstChild.textContent = value;
  else el.innerHTML = value;
}
document.documentElement.lang = zh ? 'zh-CN' : 'en';
document.title = tr('dashtaste · Pick a taste', 'dashtaste · 选一种品味');
document.querySelector('meta[name="description"]').content = tr(
  'Pick a named dashboard taste. Agents ship the same default rainbow ECharts look everywhere.',
  '选一种看板品味。Agent 不该把同一套彩虹 ECharts 带到每个看板。',
);
const toggle = document.getElementById('language');
const nextURL = new URL(location.href);
nextURL.searchParams.set('lang', zh ? 'en' : 'zh');
toggle.href = nextURL.pathname + nextURL.search + nextURL.hash;
toggle.textContent = zh ? 'EN' : '中文';
toggle.lang = zh ? 'en' : 'zh';
for (const [selector, en, cn] of [
  ['nav', 'Main', '主导航'],
  ['.showcase', 'Dashboard before and after', '看板调整前后'],
  ['.tabs', 'Choose dashboard', '选择看板'],
  ['#options', 'ECharts options JSON', 'ECharts 配置 JSON'],
])
  document.querySelector(selector).setAttribute('aria-label', tr(en, cn));
if (zh) {
  document.querySelector('.tabs').innerHTML =
    '<button aria-pressed="true" data-example="store">店铺</button><button aria-pressed="false" data-example="live">实时大屏</button>';
  document.querySelectorAll('.commands code')[0].textContent =
    'npx skills add FelixFangX/dashtaste --skill dashtaste';
  document.querySelectorAll('.commands code')[1].textContent =
    'npx dashtaste check dashboard.json --taste cn-ecommerce';
}
const $ = (id) => document.getElementById(id);
const sample = {
  xAxis: {
    type: 'category',
    data: zh ? ['周一', '周二', '周三', '周四', '周五'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  yAxis: { type: 'value' },
  legend: { show: true },
  series: [
    {
      name: tr('Revenue', '成交额'),
      type: 'line',
      smooth: true,
      showSymbol: true,
      data: [12000, 18000, 14000, 23000, 21000],
    },
  ],
};
const loadSample = () => {
  $('options').value = JSON.stringify(sample, null, 2);
};
loadSample();
$('taste').value = zh ? 'cn-ecommerce' : 'saas-dense';
$('reset').addEventListener('click', () => {
  loadSample();
  $('summary').textContent = tr('Ready', '就绪');
  $('findings').replaceChildren();
  $('options').focus();
});
for (const button of document.querySelectorAll('[data-example]')) {
  button.addEventListener('click', () => {
    const name = button.dataset.example;
    for (const tab of document.querySelectorAll('[data-example]'))
      tab.setAttribute('aria-pressed', String(tab === button));
    for (const variant of ['before', 'after']) {
      $(`${variant}-image`).src = `/gallery/${name}-${variant}.png`;
      $(`${variant}-image`).alt = tr(
        `${button.textContent} dashboard ${variant} dashtaste`,
        `${button.textContent}看板${variant === 'before' ? '调整前' : '调整后'}`,
      );
      $(`${variant}-link`).href = `/gallery/${name}-${variant}.png`;
    }
    $('live-link').href = `/gallery/pages/${name}/after.html`;
    $('pack-label').textContent = tr('global pack', '中文包');
  });
}
document.querySelector('[data-example]').click();
document.documentElement.style.visibility = '';
try {
  const { check, summarize, tasteNames, tastes, tasteSpecimen, defaultKnobs } =
    await import('/dist/engine.js');
  const catalog = document.getElementById('catalog');
  let selected = $('taste').value;
  const knobs = {
    series: defaultKnobs[selected].series,
    annotations: defaultKnobs[selected].annotations,
    charts: defaultKnobs[selected].charts,
  };
  const chartsOf = (specimen) =>
    specimen && Array.isArray(specimen.charts)
      ? specimen.charts.map((chart) => chart.option)
      : [specimen];
  const numberOf = (datum) => (datum && typeof datum === 'object' ? datum.value : datum);
  const colorOf = (series, datum) =>
    (datum && datum.itemStyle && datum.itemStyle.color) ||
    (series.itemStyle && series.itemStyle.color) ||
    (series.lineStyle && series.lineStyle.color) ||
    'currentColor';
  const graphicTexts = (option) => {
    const found = [];
    const visit = (node) => {
      if (Array.isArray(node)) node.forEach(visit);
      else if (node && typeof node === 'object') {
        if (node.type === 'text' && node.style && node.style.text)
          found.push(String(node.style.text));
        if (node.children) visit(node.children);
        if (node.elements) visit(node.elements);
      }
    };
    visit(option.graphic);
    return found;
  };
  const categories = (option) => (option.xAxis && option.xAxis.data) || [];
  const isStatus = (option) => categories(option).join('|') === 'API|DB|Queue|CDN';
  const el = (tag, className) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  };
  const barsEl = (option, onlyBars) => {
    const row = el('div', 'bars');
    const series = (option.series || []).filter((item) => !onlyBars || item.type === 'bar');
    const cats = categories(option);
    const cap = series[0] && series[0].barMaxWidth;
    if ((typeof cap === 'number' && cap <= 12) || cats.length >= 7) row.classList.add('dense');
    if (option.title && option.title.text) row.classList.add('short');
    const peak = Math.max(1, ...series.flatMap((item) => (item.data || []).map(numberOf)));
    for (let index = 0; index < cats.length; index += 1) {
      const group = el('span', 'group');
      for (const item of series) {
        const datum = (item.data || [])[index];
        const bar = document.createElement('i');
        bar.style.height = `${Math.max(12, (numberOf(datum) / peak) * 100)}%`;
        bar.style.background = colorOf(item, datum);
        group.append(bar);
      }
      row.append(group);
    }
    return row;
  };
  const linesEl = (option) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 40');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.classList.add('lines');
    const series = (option.series || []).filter((item) => item.type === 'line');
    const cats = Math.max(1, categories(option).length);
    const values = series.flatMap((item) => (item.data || []).map(numberOf));
    const peak = Math.max(1, ...values);
    const floor = Math.min(...values);
    const base = floor > peak * 0.45 ? floor - (peak - floor) * 0.35 : 0;
    const span = Math.max(1, peak - base);
    const yOf = (datum) => 36 - ((numberOf(datum) - base) / span) * 32;
    for (const item of series) {
      const points = (item.data || [])
        .map((datum, index) => {
          const x = cats === 1 ? 50 : (index / (cats - 1)) * 96 + 2;
          return `${x},${yOf(datum)}`;
        })
        .join(' ');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      path.setAttribute('points', points);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', colorOf(item));
      path.setAttribute('stroke-width', String((item.lineStyle && item.lineStyle.width) || 2));
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.append(path);
      if (item.endLabel && item.endLabel.show) {
        const tag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const last = (item.data || []).length - 1;
        const x = cats === 1 ? 50 : (last / (cats - 1)) * 96 + 2;
        const y = yOf((item.data || [])[last]);
        tag.setAttribute('x', String(Math.min(86, x + 1.5)));
        tag.setAttribute('y', String(y + 1.2));
        tag.setAttribute('fill', colorOf(item));
        tag.textContent = item.name || '';
        svg.append(tag);
      }
    }
    return svg;
  };
  const funnelEl = (series) => {
    const wrap = el('div', 'funnel');
    const data = series.data || [];
    const peak = Math.max(1, ...data.map((datum) => datum.value || 0));
    for (const datum of data) {
      const row = el('div', 'funnel-row');
      const bar = document.createElement('i');
      bar.style.width = `${Math.max(18, ((datum.value || 0) / peak) * 100)}%`;
      bar.style.background = (datum.itemStyle && datum.itemStyle.color) || colorOf(series);
      const label = document.createElement('span');
      label.textContent = datum.name || '';
      row.append(bar, label);
      wrap.append(row);
    }
    return wrap;
  };
  const statusEl = (option) => {
    const wrap = el('div', 'status-board');
    const cats = categories(option);
    for (const item of option.series || []) {
      const row = el('div', 'status');
      cats.forEach((name, index) => {
        const datum = (item.data || [])[index];
        const cell = el('div', 'cell');
        const pip = document.createElement('i');
        pip.style.background = colorOf(item, datum);
        const label = document.createElement('span');
        label.textContent = name;
        cell.append(pip, label);
        row.append(cell);
      });
      wrap.append(row);
    }
    return wrap;
  };
  const frameFor = (option, ink) => {
    const frame = el('div', 'frame');
    const series = option.series || [];
    const types = new Set(series.map((item) => item.type));
    frame.dataset.kind = types.has('funnel') ? 'funnel' : types.has('line') ? 'line' : 'bar';
    frame.style.background = option.backgroundColor || '#fff';
    frame.style.color = ink;
    if (option.legend && option.legend.show) {
      const legend = el('div', 'legend-row');
      for (const item of series) {
        const entry = document.createElement('span');
        const swatch = document.createElement('i');
        swatch.style.background = colorOf(item);
        entry.append(swatch, document.createTextNode(item.name || ''));
        legend.append(entry);
      }
      frame.append(legend);
    }
    if (option.title && option.title.text) {
      frame.classList.add('has-hero');
      const hero = el('p', 'hero-figure');
      hero.append(document.createTextNode(option.title.text));
      const sub = document.createElement('span');
      sub.textContent = option.title.subtext || '';
      hero.append(sub);
      frame.append(hero);
    }
    if (types.has('funnel')) frame.append(funnelEl(series.find((item) => item.type === 'funnel')));
    else if (isStatus(option)) frame.append(statusEl(option));
    else if (types.has('line') && types.has('bar')) {
      const combo = el('div', 'combo');
      combo.append(barsEl(option, true), linesEl(option));
      frame.append(combo);
    } else if (types.has('line')) frame.append(linesEl(option));
    else frame.append(barsEl(option, false));
    const notes = graphicTexts(option);
    if (notes.length) {
      const stack = el('div', 'callouts');
      for (const text of notes) {
        const line = document.createElement('p');
        line.textContent = text;
        stack.append(line);
      }
      frame.append(stack);
    }
    const yName = option.yAxis && option.yAxis.name;
    if (yName && !(option.title && option.title.text)) {
      const axis = el('span', 'axis-name');
      axis.textContent = yName;
      frame.append(axis);
    }
    return frame;
  };
  const paintSpecimen = (root, specimen, ink) => {
    root.replaceChildren();
    const board = el('div', 'board');
    const options = chartsOf(specimen);
    board.dataset.count = String(options.length);
    if (options.length > 1)
      board.style.gridTemplateColumns =
        options.length <= 4 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))';
    for (const option of options) board.append(frameFor(option, ink));
    root.append(board);
  };
  const renderCatalog = () => {
    catalog.replaceChildren();
    for (const id of tasteNames) {
      const taste = tastes[id];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'taste-card';
      card.dataset.taste = id;
      card.setAttribute('aria-pressed', String(id === selected));
      const pair = document.createElement('span');
      pair.className = 'pair';
      const before = document.createElement('span');
      before.className = 'mini';
      paintSpecimen(before, tasteSpecimen('rainbow'), '#1a1a18');
      const after = document.createElement('span');
      after.className = 'mini';
      paintSpecimen(after, tasteSpecimen(id), taste.tokens.ink);
      pair.append(before, after);
      const name = document.createElement('span');
      name.className = 'taste-id';
      name.textContent = taste.id;
      const school = document.createElement('span');
      school.className = 'taste-school';
      school.textContent = taste.school;
      const chips = document.createElement('span');
      chips.className = 'taste-chips';
      chips.textContent = taste.chips;
      card.append(pair, name, school, chips);
      card.addEventListener('click', () => select(id));
      catalog.append(card);
    }
  };
  const refresh = () => {
    const taste = tastes[selected];
    $('study-taste').textContent = selected;
    $('after-name').textContent = selected;
    $('knob-series').value = String(knobs.series);
    $('knob-notes').value = String(knobs.annotations);
    $('knob-charts').value = String(knobs.charts);
    $('out-series').textContent = String(knobs.series);
    $('out-notes').textContent = String(knobs.annotations);
    $('out-charts').textContent = String(knobs.charts);
    for (const id of ['knob-series', 'knob-notes', 'knob-charts']) {
      const input = $(id);
      const span =
        (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min));
      input.style.setProperty('--pct', `${span * 100}%`);
    }
    paintSpecimen($('before-preview'), tasteSpecimen('rainbow'), '#1a1a18');
    paintSpecimen($('after-preview'), tasteSpecimen(selected, knobs), taste.tokens.ink);
    const findings = check(tasteSpecimen(selected, knobs), { taste: selected });
    const totals = summarize(findings);
    $('score').textContent = String(totals.score);
    $('score').dataset.low = String(totals.score < 100);
  };
  const select = (id) => {
    selected = id;
    $('taste').value = id;
    knobs.series = defaultKnobs[id].series;
    knobs.annotations = defaultKnobs[id].annotations;
    knobs.charts = defaultKnobs[id].charts;
    for (const card of catalog.querySelectorAll('[data-taste]'))
      card.setAttribute('aria-pressed', String(card.dataset.taste === id));
    refresh();
  };
  for (const [id, key] of [
    ['knob-series', 'series'],
    ['knob-notes', 'annotations'],
    ['knob-charts', 'charts'],
  ])
    $(id).addEventListener('input', () => {
      knobs[key] = Number($(id).value);
      refresh();
    });
  $('taste').addEventListener('change', () => select($('taste').value));
  renderCatalog();
  select(selected);
  $('run').disabled = false;
  $('run').textContent = tr('Run check ↗', '开始检查 ↗');
  $('run').addEventListener('click', () => {
    $('findings').replaceChildren();
    try {
      const input = JSON.parse($('options').value);
      const findings = check(input, { taste: $('taste').value });
      const totals = summarize(findings);
      $('summary').textContent = tr(
        `${totals.errors} errors · ${totals.warnings} warnings · ${totals.info} info`,
        `${totals.errors} 项错误 · ${totals.warnings} 项警告 · ${totals.info} 项提示`,
      );
      if (!findings.length) {
        const p = document.createElement('p');
        p.className = 'muted';
        p.textContent = tr(
          'No findings for these options. Rendered layout and data accuracy still need a look.',
          '未发现问题。布局效果和数据准确性仍需人工确认。',
        );
        $('findings').append(p);
      }
      for (const finding of findings) {
        const item = document.createElement('article');
        item.className = 'finding';
        const top = document.createElement('div');
        top.className = 'finding-top';
        const severity = document.createElement('span');
        severity.className = `severity ${finding.severity}`;
        severity.textContent = zh
          ? { error: '错误', warn: '警告', info: '提示' }[finding.severity]
          : finding.severity;
        const rule = document.createElement('span');
        rule.textContent = finding.ruleId;
        top.append(severity, rule);
        const localized = ruleCopy[Number(finding.ruleId.slice(2)) - 1];
        const message = document.createElement('p');
        message.textContent = zh && localized ? localized[0] : finding.message;
        const fix = document.createElement('p');
        fix.className = 'fix';
        fix.textContent = `↳ ${zh && localized ? localized[1] : finding.fix}`;
        const path = document.createElement('code');
        path.textContent = finding.path;
        item.append(top, message, fix, path);
        $('findings').append(item);
      }
    } catch (error) {
      $('summary').textContent = tr('Check input', '请检查输入');
      const message = document.createElement('p');
      message.className = 'muted';
      message.textContent = tr(
        `Unable to check: ${error.message}`,
        '无法检查：请确认输入是有效的 ECharts JSON 配置。',
      );
      $('findings').append(message);
    }
  });
} catch {
  $('run').textContent = tr('Engine unavailable', '检查引擎暂不可用');
  $('summary').textContent = tr('Use the CLI below to run a check.', '请使用下方命令行检查。');
}
