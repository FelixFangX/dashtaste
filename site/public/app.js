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
  const { check, summarize, tasteNames, tastes, tasteSpecimen, rainbowColors, defaultKnobs } =
    await import('/dist/engine.js');
  const catalog = document.getElementById('catalog');
  let selected = $('taste').value;
  const knobs = {
    series: defaultKnobs[selected].series,
    annotations: defaultKnobs[selected].annotations,
    charts: defaultKnobs[selected].charts,
  };
  const bars = (colors, count) => {
    const row = document.createElement('span');
    row.className = 'bars';
    for (let i = 0; i < count; i += 1) {
      const swatch = document.createElement('i');
      swatch.style.background = colors[i % colors.length];
      swatch.style.height = `${28 + ((i * 17) % 36)}px`;
      row.append(swatch);
    }
    return row;
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
      pair.append(
        bars(rainbowColors, 7),
        bars(taste.tokens.categorical, taste.tokens.categorical.length),
      );
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
  const paint = (root, colors, count, frames, notes) => {
    root.replaceChildren();
    const board = document.createElement('div');
    board.className = 'board';
    board.style.background = colors.paper || '#fff';
    board.style.color = colors.ink || '#1a1a18';
    for (let chart = 0; chart < frames; chart += 1) board.append(bars(colors.series, count));
    for (let note = 0; note < notes; note += 1) {
      const label = document.createElement('span');
      label.className = 'note';
      label.textContent = `Note ${note + 1}`;
      board.append(label);
    }
    root.append(board);
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
    paint(
      $('before-preview'),
      { paper: '#ffffff', ink: '#1a1a18', series: rainbowColors },
      7,
      1,
      0,
    );
    paint(
      $('after-preview'),
      { paper: taste.tokens.paper, ink: taste.tokens.ink, series: taste.tokens.categorical },
      knobs.series,
      knobs.charts,
      knobs.annotations,
    );
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
