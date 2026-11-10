import { readdirSync, readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { review, ruleset } from '../src/engine.js';
import { rules } from '../src/rules/index.js';

const required = [
  'quiet-saas-dense',
  'smooth-line',
  'straight-line',
  'symbols',
  'symbols-off',
  'bar-baseline',
  'text-contrast',
  'cjk-size',
  'ops-wall-dark',
  'series-cap',
  'currency',
  'only-and-disable',
  'outside-pack',
  'empty-charts',
  'three-d',
  'delta-convention',
];

it('matches the reviewed ruleset corpus, not a source hash', () => {
  const names = readdirSync('test/fixtures/ruleset').filter((name) => name.endsWith('.json'));
  expect(names).toEqual([`${ruleset}.json`]);
  const corpus = JSON.parse(readFileSync(`test/fixtures/ruleset/${ruleset}.json`, 'utf8'));
  expect(corpus.ruleset).toBe(ruleset);
  expect(corpus.synthetic).toBe(true);
  expect(corpus.guards).toMatch(/not a hash/i);
  expect(corpus.doesNotGuard.join('\n')).toMatch(/not executable/i);
  expect(corpus.rules).toEqual(
    rules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      basis: rule.basis,
      rationale: rule.rationale,
      severity: rule.severity,
      packs: rule.packs,
    })),
  );
  expect(corpus.cases.map((entry: { name: string }) => entry.name)).toEqual(required);
  for (const entry of corpus.cases) {
    expect(entry.synthetic).toBe(true);
    expect(review(entry.input, entry.options)).toEqual(entry.report);
  }
  const smooth = corpus.cases.find((entry: { name: string }) => entry.name === 'smooth-line');
  expect(smooth.report.findings[0]).toMatchObject({
    ruleId: 'DT003',
    basis: 'heuristic',
    severity: 'warn',
  });
  expect(smooth.report.score).toBe(97);
  const spatial = corpus.cases.find((entry: { name: string }) => entry.name === 'three-d');
  expect(spatial.report.findings[0]).toMatchObject({
    ruleId: 'DT007',
    basis: 'heuristic',
    severity: 'error',
  });
  expect(spatial.report.score).toBe(90);
  const baseline = corpus.cases.find((entry: { name: string }) => entry.name === 'bar-baseline');
  expect(baseline.report.findings[0]).toMatchObject({
    ruleId: 'DT010',
    basis: 'constraint',
    severity: 'error',
  });
  const empty = corpus.cases.find((entry: { name: string }) => entry.name === 'empty-charts');
  expect(empty.report).toMatchObject({
    chartsReviewed: 0,
    score: 100,
    findings: [],
    note: 'No charts reviewed. The score is not a quality verdict.',
  });
});
