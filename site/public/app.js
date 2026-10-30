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
document.title = tr('dashtaste · Give your dashboard better taste', 'dashtaste · 让看板更有品味');
document.querySelector('meta[name="description"]').content = tr(
  'See dashboards before and after dashtaste. Check your ECharts options right in your browser.',
  '看看 dashtaste 如何改善看板，在浏览器里检查你的 ECharts 配置。',
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
    'npx skills add FelixFangX/dashtaste --skill dashtaste-cn';
  document.querySelectorAll('.commands code')[1].textContent =
    'npx dashtaste check dashboard.json --pack cn';
}
const heroImage = document.querySelector('.dashboard img');
heroImage.src = zh ? '/gallery/store-after.png' : '/gallery/saas-after.png';
heroImage.alt = tr(
  'DashTaste SaaS dashboard with restrained charts and clear hierarchy',
  'DashTaste 店铺看板，图表克制，层次清晰',
);
document.querySelector('.dashboard figcaption').textContent = tr(
  'SaaS / After dashtaste',
  '店铺 / 使用 dashtaste 后',
);
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
$('pack').value = zh ? 'cn' : 'global';
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
  const { check, summarize } = await import('/dist/engine.js');
  $('run').disabled = false;
  $('run').textContent = tr('Run check ↗', '开始检查 ↗');
  $('run').addEventListener('click', () => {
    $('findings').replaceChildren();
    try {
      const input = JSON.parse($('options').value);
      const findings = check(input, { pack: $('pack').value });
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
        const message = document.createElement('p');
        message.textContent = zh
          ? ruleCopy[Number(finding.ruleId.slice(2)) - 1][0]
          : finding.message;
        const fix = document.createElement('p');
        fix.className = 'fix';
        fix.textContent = `↳ ${zh ? ruleCopy[Number(finding.ruleId.slice(2)) - 1][1] : finding.fix}`;
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
