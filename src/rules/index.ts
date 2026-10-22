import { contrast, hueBucket, rgb } from '../color.js';
import { packs, getTokens } from '../packs/index.js';
import type { Rule, Option, PageFacts, CheckOptions, Finding, Severity } from '../types.js';
const arr = (v: any): any[] => v == null ? [] : Array.isArray(v) ? v : [v];
const series = (o: Option) => arr(o.series);
const axes = (o: Option) => [...arr(o.xAxis).map((a, i) => ({ ...a, _dimension: 'x', _index: i, _path: `xAxis[${i}]` })), ...arr(o.yAxis).map((a, i) => ({ ...a, _dimension: 'y', _index: i, _path: `yAxis[${i}]` }))].filter(a => a.type === 'value' || (!a.type && !a.data));
const values = (s: Option): number[] => arr(s.data).flatMap(d => { const v = d && typeof d === 'object' && !Array.isArray(d) ? d.value : d; return arr(v).filter((x: any) => typeof x === 'number' && Number.isFinite(x)); });
const color = (s: Option, i: number, o: Option): unknown => s.lineStyle?.color ?? s.itemStyle?.color ?? arr(o.color)[i % Math.max(1, arr(o.color).length)];
const allColors = (o: Option): string[] => [...arr(o.color), ...series(o).flatMap((s, i) => [color(s, i, o), ...arr(s.data).map(d => d?.itemStyle?.color)])].filter((c): c is string => typeof c === 'string');
const walk = (v: any, fn: (key: string, value: any) => void) => { if (v && typeof v === 'object')
    for (const [k, x] of Object.entries(v)) {
        fn(k, x);
        walk(x, fn);
    } };
const pie = (s: Option) => s.type === 'pie';
const radii = (s: Option): number[] => arr(s.radius).map(x => parseFloat(x));
const hasUnit = (a: Option) => !!(a.name || a.unit || a.unitMetadata || a.meta?.unit || a.axisLabel?.formatter);
const defaultColors = new Set(['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']);
type Context = Required<Pick<CheckOptions, 'pack' | 'mode'>> & CheckOptions;
type Emit = (path: string, message?: string, severity?: Severity) => void;
function rule(n: number, name: string, severity: Severity, description: string, fix: string, run: (f: PageFacts, c: Context, emit: Emit) => void, cnOnly = false): Rule {
    const id = `DT${String(n).padStart(3, '0')}`;
    return { id, name, severity, packs: cnOnly ? ['cn'] : ['global', 'cn'], description, fix, check(f, c) { const out: Finding[] = []; run(f, c, (path, message = name.replaceAll('-', ' '), level = severity) => out.push({ ruleId: id, severity: level, message, path, fix })); return out; } };
}
const charts = (f: PageFacts, fn: (o: Option, p: string) => void) => f.charts.forEach((c, i) => fn(c.option, `charts[${i}]`));
function background(f: PageFacts, c: Context, o?: Option): string { const t = getTokens(c.pack, c.mode); return c.background ?? o?.backgroundColor ?? f.page?.background ?? String(t.paper ?? t.card ?? t.panel); }
function sameColor(a: string, b: string): boolean { const x = rgb(a), y = rgb(b); return !!x && !!y && x.every((v, i) => Math.abs(v - y[i]) < .015); }
function deltaDirection(text: string): 'up' | 'down' | 'flat' { return /[▼↓]|-\s*\d/.test(text) ? 'down' : /[▲↑]|\+\s*\d/.test(text) ? 'up' : 'flat'; }
function conventionColor(color: string, expected: string): boolean { if (sameColor(color, expected))
    return true; const a = rgb(color), b = rgb(expected); if (!a || !b)
    return false; const channel = (x: number[]) => x[0] > x[1] * 1.15 && x[0] > x[2] * 1.15 ? 'red' : x[1] > x[0] * 1.15 && x[1] > x[2] * 1.05 ? 'green' : 'other'; return channel(a) !== 'other' && channel(a) === channel(b); }
export const rules: Rule[] = [
    rule(1, 'default-palette', 'error', 'Multiple series need explicit colours. Any default palette colour is flagged.', 'set option.color to the pack palette (dashtaste tokens --pack <pack>)', (f, c, e) => charts(f, (o, p) => { if ((series(o).length > 1 && !arr(o.color).length && series(o).some(s => !s.itemStyle?.color && !s.lineStyle?.color)) || allColors(o).some(x => defaultColors.has(x.toLowerCase())))
        e(p, 'default ECharts palette'); })),
    rule(2, 'rainbow-palette', 'warn', 'More than 6 distinct categorical colours or more than 5 saturated 60-degree hue buckets.', 'use the pack palette and group remaining categories as Other', (f, c, e) => charts(f, (o, p) => { const colors = allColors(o); if (new Set(colors.map(x => x.toLowerCase())).size > 6 || new Set(colors.map(hueBucket).filter(x => x !== undefined)).size > 5)
        e(p); })),
    rule(3, 'smooth-line', 'warn', 'Line smoothing greater than zero draws values that do not exist.', 'use straight segments: smooth: false', (f, c, e) => charts(f, (o, p) => series(o).forEach((s, i) => { if (s.type === 'line' && (s.smooth === true || typeof s.smooth === 'number' && s.smooth > 0))
        e(`${p}.series[${i}]`); }))),
    rule(4, 'symbols-everywhere', 'warn', 'Line symbols are noisy above 12 points; ECharts shows symbols by default.', 'set showSymbol: false', (f, c, e) => charts(f, (o, p) => series(o).forEach((s, i) => { if (s.type === 'line' && s.showSymbol !== false && s.symbol !== 'none' && arr(s.data).length > 12)
        e(`${p}.series[${i}]`); }))),
    rule(5, 'pie-slices', 'warn', 'Maximum 5 slices; cn rose charts allow 8.', 'use horizontal bars or combine small parts into Other', (f, c, e) => charts(f, (o, p) => series(o).forEach((s, i) => { if (pie(s) && arr(s.data).length > (c.pack === 'cn' && s.roseType ? 8 : 5))
        e(`${p}.series[${i}]`); }))),
    rule(6, 'pie-overuse', 'warn', 'More than one pie per page or radius ratio above 0.75 warns. A global pie is informational.', 'prefer horizontal bars; keep donut radius ratio at most 0.75', (f, c, e) => { const count = f.charts.reduce((n, x) => n + series(x.option).filter(pie).length, 0); charts(f, (o, p) => series(o).forEach((s, i) => { if (!pie(s))
        return; const r = radii(s); if (count > 1 || r.length === 2 && r[0] / r[1] > .75)
        e(`${p}.series[${i}]`);
    else if (c.pack === 'global')
        e(`${p}.series[${i}]`, 'prefer bars for part comparison', 'info'); })); }),
    rule(7, 'three-d', 'error', '3D series, axes, coordinates, and pseudo-3D pie decoration distort comparisons.', 'use flat 2D charts', (f, c, e) => charts(f, (o, p) => { let bad = false; walk(o, (k, v) => { if (/3d|globe/i.test(k) && v !== false && v != null || typeof v === 'string' && (/3d|globe/i.test(v) || v === 'surface') && ['type', 'coordinateSystem'].includes(k))
        bad = true; }); if (bad)
        e(p); })),
    rule(8, 'dual-axis', 'warn', 'Above two value axes warns; two axes warn for matching series types or unnamed global axes.', 'use one axis or a named amount bar and rate line', (f, c, e) => charts(f, (o, p) => { const a = axes(o); if (a.length < 2)
        return; const types = series(o).map(s => s.type); if (a.length > 2 || new Set(types).size < types.length || c.pack === 'global' && a.some(x => !x.name))
        e(p); })),
    rule(9, 'missing-unit', 'warn', 'Value axes need a name, formatter, or unit metadata.', 'put units in axis names or formatter metadata', (f, c, e) => charts(f, (o, p) => axes(o).forEach(a => { if (!hasUnit(a))
        e(`${p}.${a._path}`); }))),
    rule(10, 'bar-baseline', 'error', 'Bar value axes must start at zero; positive min and scale: true distort lengths.', 'set min: 0 and scale: false', (f, c, e) => charts(f, (o, p) => { axes(o).forEach(a => { const bars = series(o).filter(s => s.type === 'bar' && (s[`${a._dimension}AxisIndex`] ?? 0) === a._index); if (bars.length && (typeof a.min === 'number' && a.min > 0 || a.scale === true))
        e(`${p}.${a._path}`); }); })),
    rule(11, 'raw-large-numbers', 'warn', 'At data maximum magnitude 10000 or above, axis, visible data label, and tooltip channels need formatters.', 'format compact units: cn 万/亿; global K/M', (f, c, e) => charts(f, (o, p) => { if (!series(o).some(s => values(s).some(v => Math.abs(v) >= 10000)))
        return; axes(o).forEach(a => { if (!a.axisLabel?.formatter)
        e(`${p}.${a._path}.axisLabel`); }); series(o).forEach((s, i) => { if (s.label?.show && !s.label.formatter)
        e(`${p}.series[${i}].label`); }); if (o.tooltip?.show !== false && (o.tooltip || series(o).some(s => s.tooltip)) && !o.tooltip?.formatter && !o.tooltip?.valueFormatter)
        e(`${p}.tooltip`); })),
    rule(12, 'unit-system', 'warn', 'String formatter templates must use the selected compact unit system.', 'use cn 万/亿 or global K/M/B consistently', (f, c, e) => charts(f, (o, p) => { walk(o, (k, v) => { if (/formatter/i.test(k) && typeof v === 'string' && (c.pack === 'cn' ? /(?:\}|\d|\s)[KMB]\b/.test(v) : /[万亿]/.test(v)))
        e(p, 'formatter uses another unit system'); }); })),
    rule(13, 'delta-convention', 'error', 'Directional deltas must follow one page convention: global green-up; cn red-up by default.', 'apply one deltaColors convention to the whole page', (f, c, e) => { const t = getTokens(c.pack, c.mode), swap = (f.page?.deltaColors ?? packs[c.pack].deltaColors) !== packs[c.pack].deltaColors; for (const d of f.deltas ?? []) {
        const dir = d.direction ?? deltaDirection(d.text);
        const expected = dir === 'up' ? (swap ? t.down : t.up) : dir === 'down' ? (swap ? t.up : t.down) : t.muted;
        if (!conventionColor(d.color, expected) && !sameColor(d.color, t.muted))
            e(d.selector);
    } }),
    rule(14, 'delta-colour-only', 'warn', 'Directional colour must be accompanied by an arrow or signed number.', 'add ▲/▼ or an explicit sign', (f, c, e) => { const t = getTokens(c.pack, c.mode); for (const d of f.deltas ?? [])
        if (!/[▲▼↑↓]|[+-]\s*\d/.test(d.text) && !sameColor(d.color, t.muted) && (() => { const r = rgb(d.color); return r && Math.max(...r) - Math.min(...r) > .08; })())
            e(d.selector); }),
    rule(15, 'low-contrast-text', 'error', 'Text needs 4.5:1; at least 24px or 18.66px bold needs 3:1. Chart label defaults use 4.5:1.', 'increase text contrast against its background', (f, c, e) => { for (const t of f.texts ?? []) {
        const limit = t.fontSize >= 24 || t.fontSize >= 18.66 && t.fontWeight >= 700 ? 3 : 4.5;
        if (contrast(t.color, t.background) < limit)
            e(t.selector);
    } charts(f, (o, p) => { for (const [key, xs] of [['xAxis', arr(o.xAxis)], ['yAxis', arr(o.yAxis)], ['legend', arr(o.legend)]] as const)
        xs.forEach((x, i) => { const style = key === 'legend' ? x.textStyle : x.axisLabel; if (style?.color && contrast(style.color, background(f, c, o)) < (style.fontSize >= 24 || style.fontSize >= 18.66 && (style.fontWeight === 'bold' || style.fontWeight >= 700) ? 3 : 4.5))
            e(`${p}.${key}[${i}]`); }); }); }),
    rule(16, 'thin-line-contrast', 'warn', 'Line colours need at least 3:1 against the chart background.', 'darken light-mode lines or lighten dark-mode lines', (f, c, e) => charts(f, (o, p) => series(o).forEach((s, i) => { const col = color(s, i, o); if (s.type === 'line' && typeof col === 'string' && contrast(col, background(f, c, o)) < 3)
        e(`${p}.series[${i}]`); }))),
    rule(17, 'gradient-decoration', 'warn', 'Card/page gradients and linear or radial chart fills add decoration.', 'use solid backgrounds and fills', (f, c, e) => { for (const x of f.gradients ?? [])
        e(x.selector); charts(f, (o, p) => { let found = false; walk(o, (k, v) => { if (k === 'type' && ['linear', 'radial'].includes(v))
        found = true; }); if (found)
        e(p); }); }),
    rule(18, 'glow', 'warn', 'Coloured CSS shadows with blur at least 12px, or chart shadowBlur at least 10, create glow.', 'remove glow and use hairline borders', (f, c, e) => { for (const x of f.shadows ?? []) {
        const v = x.boxShadow + ' ' + x.textShadow;
        const chunks = v.split(/,(?![^()]*\))/);
        if (chunks.some(s => { const nums = [...s.replace(/rgba?\([^)]*\)|#[\da-f]+/gi, '').matchAll(/(-?[\d.]+)px/g)].map(m => +m[1]); const col = s.match(/rgba?\([^)]*\)|#[\da-f]+/i)?.[0]; const r = col ? rgb(col) : undefined; return nums[2] >= 12 && r && Math.max(...r) - Math.min(...r) > .05; }))
            e(x.selector);
    } charts(f, (o, p) => { let found = false; walk(o, (k, v) => { if (k === 'shadowBlur' && v >= 10)
        found = true; }); if (found)
        e(p); }); }),
    rule(19, 'kpi-overload', 'warn', 'More than 6 global or 8 cn KPI tiles weakens priority.', 'keep only primary KPIs in the first view', (f, c, e) => { if ((f.kpis?.length ?? 0) > (c.pack === 'global' ? 6 : 8))
        e('page'); }),
    rule(20, 'kpi-rainbow', 'warn', 'Three or more distinct accent colours on KPI values or tiles distract. Neutral greys and pack text/background tokens are excluded.', 'use ink for values and reserve colour for deltas', (f, c, e) => { const t = getTokens(c.pack, c.mode); const neutral = [t.ink, t.muted, t.paper, t.card, t.page, t.bg, t.panel].filter((x): x is string => typeof x === 'string'); const accent = (x: string) => { const r = rgb(x); return r && Math.max(...r) - Math.min(...r) > .08 && !neutral.some(n => sameColor(n, x)); }; const cs = (f.kpis ?? []).flatMap(k => [k.color, k.background ?? '']).filter(accent); if (new Set(cs.map(x => rgb(x)?.join(','))).size >= 3)
        e('page'); }),
    rule(21, 'emoji-icons', 'warn', 'Emoji in headings, KPI labels, and rankings add inconsistent iconography.', 'use plain text and plain numerals for rankings', (f, c, e) => { for (const x of f.emojis ?? [])
        e(x.selector); charts(f, (o, p) => { if (/\p{Extended_Pictographic}/u.test(JSON.stringify(o.title ?? '')))
        e(`${p}.title`); }); }),
    rule(22, 'cjk-min-size', 'warn', 'CJK text must be at least 12px.', 'set CJK text to at least 12px', (f, c, e) => { for (const t of f.texts ?? [])
        if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(t.text) && t.fontSize < 12)
            e(t.selector); }, true),
    rule(23, 'legend-single-series', 'info', 'An explicitly visible legend on one series repeats context.', 'hide the legend or label the series directly', (f, c, e) => charts(f, (o, p) => { if (series(o).length === 1 && arr(o.legend).some(l => l.show !== false))
        e(`${p}.legend`); }))
];
