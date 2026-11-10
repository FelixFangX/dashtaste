import { expect, it } from 'vitest';
import { check, emptyChartsNote, review, score } from '../src/engine.js';
import { ruleBasis } from '../src/rules/basis.js';
import { rules } from '../src/rules/index.js';
import {
  basisCopy,
  emptyChartsNote as siteNote,
  ruleCopy,
  zhFix,
  zhMessage,
} from '../site/public/locale.js';

it('classifies every rule in one map and has no silent default', () => {
  expect(Object.keys(ruleBasis)).toEqual(rules.map((rule) => rule.id));
  expect(rules.map((rule) => rule.basis)).toEqual(rules.map((rule) => ruleBasis[rule.id].basis));
  expect(rules.map((rule) => rule.rationale)).toEqual(
    rules.map((rule) => ruleBasis[rule.id].rationale),
  );
  expect(rules.filter((rule) => rule.basis === 'constraint').map((rule) => rule.id)).toEqual([
    'DT010',
    'DT014',
    'DT015',
    'DT016',
  ]);
  expect(rules.filter((rule) => rule.basis === 'taste').map((rule) => rule.id)).toEqual([
    'DT019',
    'DT030',
    'DT031',
    'DT032',
    'DT033',
    'DT034',
    'DT035',
    'DT036',
    'DT037',
    'DT038',
  ]);
  expect(ruleBasis.DT099).toBeUndefined();
});

it('keeps severity when a rule is advice rather than a constraint', () => {
  expect(rules.find((rule) => rule.id === 'DT003')).toMatchObject({
    basis: 'heuristic',
    severity: 'warn',
  });
  expect(rules.find((rule) => rule.id === 'DT004')).toMatchObject({
    basis: 'heuristic',
    severity: 'warn',
  });
  expect(rules.find((rule) => rule.id === 'DT007')).toMatchObject({
    basis: 'heuristic',
    severity: 'error',
  });
  expect(rules.find((rule) => rule.id === 'DT013')).toMatchObject({
    basis: 'heuristic',
    severity: 'error',
  });
  const smooth = check(
    { series: [{ type: 'line', data: [1, 2], smooth: true }] },
    { only: ['DT003'] },
  );
  expect(smooth).toMatchObject([{ ruleId: 'DT003', basis: 'heuristic', severity: 'warn' }]);
  expect(score(smooth)).toBe(97);
  expect(
    check({ series: [{ type: 'line', data: [1, 2], smooth: false }] }, { only: ['DT003'] }),
  ).toEqual([]);
  expect(
    check({ series: [{ type: 'line', data: [1, 2, 3, 4] }] }, { only: ['DT004'] }),
  ).toMatchObject([{ ruleId: 'DT004', basis: 'heuristic', severity: 'warn' }]);
  expect(
    check(
      { series: [{ type: 'line', data: [1, 2, 3, 4], showSymbol: false }] },
      { only: ['DT004'] },
    ),
  ).toEqual([]);
  const spatial = check({ series: [{ type: 'bar3D' }] }, { only: ['DT007'] });
  expect(spatial).toMatchObject([{ ruleId: 'DT007', basis: 'heuristic', severity: 'error' }]);
  expect(score(spatial)).toBe(90);
  const convention = check(
    { charts: [], deltas: [{ selector: '#delta', text: '▲ 3%', color: '#B4413A' }] },
    { taste: 'saas-dense', only: ['DT013'] },
  );
  expect(convention).toMatchObject([{ ruleId: 'DT013', basis: 'heuristic', severity: 'error' }]);
  expect(score(convention)).toBe(90);
});

it('translates basis labels and taste messages without renaming the rule', () => {
  expect(ruleCopy).toHaveLength(38);
  expect(basisCopy).toEqual({ constraint: '约束', heuristic: '建议', taste: '品味' });
  expect(siteNote[0]).toBe(emptyChartsNote);
  expect(zhMessage({ ruleId: 'DT003', message: 'smooth line' })).toBe(
    '平滑曲线可能暗示不存在的数据',
  );
  expect(zhMessage({ ruleId: 'DT034', message: 'animation is on' })).toBe('开了动画');
  expect(zhFix({ ruleId: 'DT034', fix: 'set animation: false' })).toContain('animation: false');
  const counted = zhMessage({
    ruleId: 'DT032',
    message: 'saas-dense allows 3 series on a chart; this chart has 7',
  });
  expect(counted).toContain('saas-dense');
  expect(counted).toContain('3');
  expect(counted).toContain('7');
  expect(counted).not.toContain('series');
  expect(zhMessage({ ruleId: 'DT003', name: 'smooth-line', message: 'smooth line' })).not.toContain(
    'smooth-line',
  );
  const empty = review([], { taste: 'saas-dense' });
  expect(empty.note).toBe(siteNote[0]);
  expect(empty.score).toBe(100);
});
