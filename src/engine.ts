import { getResolvedPack, resolvePackOverlay, type Mode, type PackName } from './packs/index.js';
import { rules, ruleset } from './rules/index.js';
import { resolveTaste, tastes, type TasteName } from './tastes.js';
import type { CheckOptions, Finding, PageFacts, Option } from './types.js';
export function normalizeInput(input: unknown): PageFacts {
  const isObject = (v: unknown): v is Option => !!v && typeof v === 'object' && !Array.isArray(v);
  if (Array.isArray(input)) {
    if (!input.every(isObject)) throw new Error('expected option objects');
    return { charts: input.map((option) => ({ option })) };
  }
  if (!isObject(input))
    throw new Error('expected an option object, option array, or charts envelope');
  if ('charts' in input) {
    if (
      !Array.isArray(input.charts) ||
      !input.charts.every((c: unknown) => isObject(c) && isObject(c.option))
    )
      throw new Error('charts must contain option objects');
    return input as unknown as PageFacts;
  }
  return { charts: [{ option: input }] };
}
export function assertKnownRules(ids: readonly string[] | undefined, label: string): void {
  if (!ids?.length) return;
  const known = new Set(rules.map((rule) => rule.id));
  const unknown: string[] = [];
  for (const id of ids) if (!known.has(id) && !unknown.includes(id)) unknown.push(id);
  if (unknown.length)
    throw new Error(
      `unknown rule in ${label}: ${unknown.map((id) => (id === '' ? '""' : id)).join(', ')}`,
    );
}

/** Shown when the input contains no chart and no finding. The score is still the finding formula. */
export const emptyChartsNote = 'No charts reviewed. The score is not a quality verdict.';

function prepare(input: unknown, options: CheckOptions) {
  assertKnownRules(options.disable, 'disable');
  assertKnownRules(options.only, 'only');
  const facts = normalizeInput(input);
  const requestedPack = options.packOverlay?.extends ?? options.pack;
  const taste = resolveTaste({
    ...(requestedPack ? { pack: requestedPack } : {}),
    ...(options.taste ? { taste: options.taste } : {}),
  });
  const pack = requestedPack ?? tastes[taste].basePack;
  const settings = {
    ...options,
    taste,
    pack,
    mode: options.mode ?? tastes[taste].defaultMode,
    resolvedPack: options.packOverlay
      ? resolvePackOverlay(options.packOverlay)
      : getResolvedPack({ ...options, pack }),
    disable: [...new Set([...(options.disable ?? []), ...(options.packOverlay?.disable ?? [])])],
  };
  const selected = rules.filter(
    (rule) =>
      rule.packs.includes(settings.pack) &&
      !settings.disable.includes(rule.id) &&
      (!options.only || options.only.includes(rule.id)),
  );
  return { facts, settings, selected };
}

export function check(input: unknown, options: CheckOptions = {}): Finding[] {
  const { facts, settings, selected } = prepare(input, options);
  return selected.flatMap((rule) => rule.check(facts, settings));
}

export interface Review {
  ruleset: typeof ruleset;
  taste: TasteName;
  pack: PackName;
  mode: Mode;
  ran: string[];
  chartsReviewed: number;
  findings: Finding[];
  summary: ReturnType<typeof summarize>;
  score: number;
  note?: string;
}

/** Same selection and findings as check, plus the ruleset and the rule ids that ran. */
export function review(input: unknown, options: CheckOptions = {}): Review {
  const { facts, settings, selected } = prepare(input, options);
  const findings = selected.flatMap((rule) => rule.check(facts, settings));
  const summary = summarize(findings);
  const chartsReviewed = facts.charts.length;
  return {
    ruleset,
    taste: settings.taste,
    pack: settings.pack,
    mode: settings.mode,
    ran: selected.map((rule) => rule.id),
    chartsReviewed,
    findings,
    summary,
    score: summary.score,
    ...(chartsReviewed === 0 && findings.length === 0 ? { note: emptyChartsNote } : {}),
  };
}
/** Score = 100 - 10 * errors - 3 * warnings - info, floored at zero. */
export function score(findings: Finding[]): number {
  return Math.max(
    0,
    100 - findings.reduce((sum, f) => sum + { error: 10, warn: 3, info: 1 }[f.severity], 0),
  );
}
export function summarize(findings: Finding[]) {
  return {
    errors: findings.filter((f) => f.severity === 'error').length,
    warnings: findings.filter((f) => f.severity === 'warn').length,
    info: findings.filter((f) => f.severity === 'info').length,
    score: score(findings),
  };
}

export {
  tastes,
  tasteNames,
  packAlias,
  resolveTaste,
  tasteCatalog,
  tasteRules,
  signatureRamp,
  isTaste,
} from './tastes.js';
export { tasteSpecimen, defaultKnobs, knobsFor, rainbowColors } from './specimens.js';
export { ruleset } from './rules/index.js';
