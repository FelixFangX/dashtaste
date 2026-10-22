import { rules } from './rules/index.js';
import type { CheckOptions, Finding, PageFacts, Option } from './types.js';
export function normalizeInput(input: unknown): PageFacts {
    const isObject = (v: unknown): v is Option => !!v && typeof v === 'object' && !Array.isArray(v);
    if (Array.isArray(input)) {
        if (!input.every(isObject))
            throw new Error('expected option objects');
        return { charts: input.map(option => ({ option })) };
    }
    if (!isObject(input))
        throw new Error('expected an option object, option array, or charts envelope');
    if ('charts' in input) {
        if (!Array.isArray(input.charts) || !input.charts.every((c: unknown) => isObject(c) && isObject(c.option)))
            throw new Error('charts must contain option objects');
        return input as PageFacts;
    }
    return { charts: [{ option: input }] };
}
export function check(input: unknown, options: CheckOptions = {}): Finding[] { const facts = normalizeInput(input); const settings = { ...options, pack: options.pack ?? 'global', mode: options.mode ?? 'light' }; return rules.filter(r => r.packs.includes(settings.pack) && !options.disable?.includes(r.id) && (!options.only || options.only.includes(r.id))).flatMap(r => r.check(facts, settings)); }
/** Score = 100 - 10 * errors - 3 * warnings - info, floored at zero. */
export function score(findings: Finding[]): number { return Math.max(0, 100 - findings.reduce((sum, f) => sum + ({ error: 10, warn: 3, info: 1 }[f.severity]), 0)); }
export function summarize(findings: Finding[]) { return { errors: findings.filter(f => f.severity === 'error').length, warnings: findings.filter(f => f.severity === 'warn').length, info: findings.filter(f => f.severity === 'info').length, score: score(findings) }; }
