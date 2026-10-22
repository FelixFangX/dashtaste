import type { PageFacts } from './types.js';
/** Runs in the page without closures over the host process. */
export function extractInPage(): PageFacts {
  const facts: PageFacts = {
    charts: [],
    texts: [],
    gradients: [],
    shadows: [],
    kpis: [],
    deltas: [],
    emojis: [],
  };
  const selector = (el: Element): string => {
    if (el.id) return `#${CSS.escape(el.id)}`;
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && node !== document.documentElement) {
      const parent: Element | null = node.parentElement;
      parts.unshift(
        `${node.tagName.toLowerCase()}:nth-child(${parent ? [...parent.children].indexOf(node) + 1 : 1})`,
      );
      node = parent;
    }
    return parts.join(' > ');
  };
  // Composite transparent ancestor backgrounds over the browser canvas.
  const compositeBackground = (el: Element): string => {
    const layers: number[][] = [];
    let node: Element | null = el;
    while (node) {
      const c = getComputedStyle(node)
        .backgroundColor.match(/[\d.]+/g)
        ?.map(Number);
      if (c) {
        layers.push([c[0], c[1], c[2], c[3] ?? 1]);
        if ((c[3] ?? 1) >= 1) break;
      }
      node = node.parentElement;
    }
    let out = [255, 255, 255];
    for (const l of layers.reverse()) out = out.map((v, i) => l[i] * l[3] + v * (1 - l[3]));
    return `rgb(${out.map(Math.round).join(', ')})`;
  };
  const ownText = (el: Element) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent ?? '')
      .join(' ')
      .trim();
  for (const el of document.querySelectorAll('*')) {
    const style = getComputedStyle(el);
    if (
      ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName) ||
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      Number(style.opacity) === 0 ||
      !el.getClientRects().length
    )
      continue;
    const path = selector(el),
      text = ownText(el),
      fontSize = parseFloat(style.fontSize);
    // Text facts carry computed foreground, composited background, and size.
    if (text)
      facts.texts!.push({
        selector: path,
        text,
        color: style.color,
        background: compositeBackground(el),
        fontSize,
        fontWeight: style.fontWeight === 'bold' ? 700 : parseInt(style.fontWeight) || 400,
      });
    // Decoration facts include CSS gradients and shadows.
    if (/gradient\(/.test(style.backgroundImage))
      facts.gradients!.push({ selector: path, background: style.backgroundImage });
    if (style.boxShadow !== 'none' || style.textShadow !== 'none')
      facts.shadows!.push({
        selector: path,
        boxShadow: style.boxShadow,
        textShadow: style.textShadow,
      });
    // KPI and delta facts support explicit data attributes and visible-value heuristics.
    if (
      el.hasAttribute('data-kpi') ||
      (fontSize >= 22 && /^[\s+−\-\d,.%KMB万亿¥$€]+$/.test(text) && /\d/.test(text))
    )
      facts.kpis!.push({
        selector: path,
        text: text || el.textContent?.trim() || '',
        color: style.color,
        background: compositeBackground(el),
      });
    if (el.hasAttribute('data-delta') || /[▲▼↑↓]|[+\-]\s*\d+(?:\.\d+)?%/.test(text)) {
      const direction = el.getAttribute('data-direction');
      facts.deltas!.push({
        selector: path,
        text: text || el.textContent?.trim() || '',
        color: style.color,
        ...(['up', 'down', 'flat'].includes(direction ?? '')
          ? { direction: direction as 'up' | 'down' | 'flat' }
          : {}),
      });
    }
    // Emoji facts are limited to headings, labels, KPIs, and rankings.
    if (
      /\p{Extended_Pictographic}/u.test(text) &&
      el.closest('h1,h2,h3,h4,h5,h6,label,[data-kpi-label],[data-ranking],[data-kpi]')
    )
      facts.emojis!.push({ selector: path, text });
  }
  // Chart facts preserve the live ECharts option for each mounted chart.
  const echarts = (
    window as unknown as {
      echarts?: {
        getInstanceByDom: (el: Element) =>
          | {
              getOption: () => Record<string, unknown>;
            }
          | undefined;
      };
    }
  ).echarts;
  if (echarts)
    for (const el of document.querySelectorAll('[_echarts_instance_]')) {
      const instance = echarts.getInstanceByDom(el);
      if (instance) facts.charts.push({ id: el.id || selector(el), option: instance.getOption() });
    }
  // Page facts provide the background and optional delta convention.
  facts.page = {
    background: compositeBackground(document.body),
    ...(document.documentElement.dataset.deltaColors === 'red-up' ||
    document.documentElement.dataset.deltaColors === 'green-up'
      ? { deltaColors: document.documentElement.dataset.deltaColors }
      : {}),
  };
  return facts;
}
