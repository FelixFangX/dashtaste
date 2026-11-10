export const copy = {
  copy0: ['Try check', '试一试'],
  copy1: ['Use with your agent ↗', '让 Agent 用起来 ↗'],
  copy2: ['Six dashboard schools', '六种看板学派'],
  copy3: ['Pick a taste.<br>Not a <em>palette.</em>', '选一种品味。<br>不是一块<em>调色板。</em>'],
  copy4: [
    'Agents ship the same default rainbow ECharts look everywhere.',
    'Agent 不该把同一套彩虹 ECharts 带到每个看板。',
  ],
  copy5: [
    'Try a taste <span aria-hidden="true">↗</span>',
    '试一种品味 <span aria-hidden="true">↗</span>',
  ],
  copy6: ['Open dashboard ↗', '打开看板 ↗'],
  copy7: ['Before', '调整前'],
  copy8: ['After', '调整后'],
  copy9: ['Try it here', '在线试用'],
  copy10: ['A second eye for your charts.', '帮你的图表把把关。'],
  copy11: [
    'ECharts JSON in. Actionable fixes out.<br>Runs locally in your browser.',
    '贴入 ECharts JSON，看看哪里能改。<br>检查在浏览器本地完成。',
  ],
  copy12: ['ECharts options', 'ECharts 配置'],
  copy13: ['Load sample ↺', '载入示例 ↺'],
  copy14: ['Taste ', '品味 '],
  copy15: ['saas-dense', 'saas-dense'],
  copy16: ['cn-ecommerce', 'cn-ecommerce'],
  copy17: ['Loading engine…', '正在加载…'],
  copy18: ['Check results', '检查结果'],
  copy19: ['Ready', '就绪'],
  copy20: ['Every detail earns its place.', '每个细节，都有用处。'],
  copy21: ['Run the sample, or paste your own options.', '运行示例，或贴入你的配置。'],
  copy22: [
    'Enable JavaScript to run the browser check. You can also use the CLI below.',
    '启用 JavaScript 即可在线检查，也可以使用下方命令行。',
  ],
  copy23: ['Take it with you', '带进工作流'],
  copy24: ['Better taste.<br>In your workflow.', '让好设计，<br>融入工作流。'],
  copy25: [
    'Style skills for your agent.<br>A check for the dashboard it builds.',
    '给 Agent 一套设计规范。<br>给它做的看板一道检查。',
  ],
  copy26: ['01 / Add the skill', '01 / 添加技能'],
  copy27: ['02 / Check your dashboard', '02 / 检查看板'],
  copy28: ['Built for charts worth reading.', '让图表值得细读。'],
};
export const ruleCopy = [
  ['使用了默认配色', '为图表明确设置规则包中的配色。'],
  ['分类颜色过多', '使用规则包配色，将次要分类合并为“其他”。'],
  ['平滑曲线可能暗示不存在的数据', '使用直线段：smooth: false。'],
  ['数据点标记过多', '不超过 31 个点时使用不大于 5px 的标记，或设置 showSymbol: false。'],
  ['饼图分块过多', '改用横向条形图，或将小项合并为“其他”。'],
  ['饼图使用过多或圆环过厚', '优先使用横向条形图，圆环内外半径比不超过 0.75。'],
  ['立体效果影响比较', '使用平面图表。'],
  ['多条数值轴影响比较', '使用同一数值轴，或拆成对齐的小图。'],
  ['数值缺少单位', '在轴名称、刻度或格式配置中标明单位。'],
  ['条形图数值轴未从零开始', '设置 min: 0 和 scale: false。'],
  ['大数值未做简写', '中文包使用万、亿，全球包使用 K、M。'],
  ['数值单位与规则包不一致', '中文包统一使用万、亿，全球包统一使用 K、M、B。'],
  ['涨跌颜色不符合约定', '全页统一涨跌配色，并考虑指标是越高越好还是越低越好。'],
  ['仅用颜色表达涨跌', '补充 ▲/▼ 或明确的正负号。'],
  ['文字对比度不足', '提高文字与背景的对比度。'],
  ['线条对比度不足', '浅色背景上加深线条，深色背景上提亮线条。'],
  ['渐变装饰影响阅读', '使用纯色背景和填充。'],
  ['发光效果影响阅读', '去掉发光，使用细边框。'],
  ['关键指标过多', '首屏只保留主要指标。'],
  ['关键指标颜色过多', '数值使用正文色，颜色留给涨跌变化。'],
  ['表情符号干扰阅读', '标题使用纯文字，排名使用数字。'],
  ['中文字号过小', '中文字号至少为 12px。'],
  ['单组数据无需图例', '隐藏图例，或直接标注数据系列。'],
  ['条形宽度未限制', '设置 barMaxWidth 不超过 24，大屏不超过 32。'],
  ['多条曲线应直接标注', '隐藏图例，在曲线末端标注系列名称。'],
  ['线条粗细不合适', '主线使用 2px，对比线使用 1.5px。'],
  ['指标数字宽度不一致', '设置 font-variant-numeric: tabular-nums。'],
  ['主要指标不够突出', '主要指标字号至少为其他指标中位数的 1.6 倍。'],
  ['说明文字重复了图表已有信息', '删去重复说明，只保留指标名称和数值。'],
  ['彩虹配色', '改用这一品味的分类色，把多余分类并成「其他」。'],
  ['图表数量超过这一品味的上限', '删到不超过这一品味的图表数量。'],
  ['系列数量超过这一品味的上限', '拆成小图，或减到这一品味允许的系列数。'],
  ['标注数量不在这一品味的范围内', '增删标注，使数量落在这一品味的范围内。'],
  ['开了动画', '设置 animation: false。'],
  ['背景亮度与这一品味的底色不符', '改用这一品味的纸色，或换一个底色匹配的品味。'],
  ['数值轴没有货币标记', '在轴名称里写上货币符号或代码，例如 $、€、£、¥。'],
  ['漏斗数量或顺序不符合这一品味', '漏斗数量不超过上限，阶段从高到低排列。'],
  ['颜色数量超过这一品味的上限', '颜色数量留在这一品味的上限内，多余分类并成「其他」。'],
];

/** English is the stable identifier. Chinese is display copy. Rule ids and names stay as-is. */
export const basisCopy = {
  constraint: '约束',
  heuristic: '建议',
  taste: '品味',
};

export const emptyChartsNote = [
  'No charts reviewed. The score is not a quality verdict.',
  '未检查任何图表。100 分不是质量结论。',
];

const groundCopy = { dark: '深色', paper: '纸色' };

/** Keep taste ids and numbers. Fall back to the static row when the English message is the short form. */
export function zhMessage(finding) {
  const message = finding.message;
  let match = message.match(/^([\w-]+) allows (\d+) charts?; this page has (\d+)$/);
  if (match) return `${match[1]} 最多 ${match[2]} 张图，这一页有 ${match[3]} 张`;
  match = message.match(/^([\w-]+) allows (\d+) series on a chart; this chart has (\d+)$/);
  if (match) return `${match[1]} 单图最多 ${match[2]} 条系列，这一图有 ${match[3]} 条`;
  match = message.match(/^([\w-]+) allows (\d+)[–-](\d+) story annotations; this page has (\d+)$/);
  if (match) return `${match[1]} 允许 ${match[2]}–${match[3]} 处标注，这一页有 ${match[4]} 处`;
  match = message.match(/^([\w-]+) ground is (\w+); background luminance is ([\d.]+)$/);
  if (match)
    return `${match[1]} 的底色是 ${groundCopy[match[2]] ?? match[2]}，背景亮度是 ${match[3]}`;
  match = message.match(/^([\w-]+) allows (\d+) funnels; this page has (\d+)$/);
  if (match) return `${match[1]} 最多 ${match[2]} 个漏斗，这一页有 ${match[3]} 个`;
  match = message.match(/^([\w-]+) allows (\d+) colours and (\d+) hue buckets$/);
  if (match) return `${match[1]} 最多 ${match[2]} 种颜色、${match[3]} 个色相段`;
  const row = ruleCopy[Number(String(finding.ruleId).slice(2)) - 1];
  return row ? row[0] : message;
}

export function zhFix(finding) {
  const row = ruleCopy[Number(String(finding.ruleId).slice(2)) - 1];
  return row ? row[1] : finding.fix;
}
