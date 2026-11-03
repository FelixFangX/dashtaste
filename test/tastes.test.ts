import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { check, score } from '../src/index.js';
import { tasteSpecimen } from '../src/specimens.js';
import { packAlias, tasteNames, tasteRules, tastes } from '../src/tastes.js';
import type { TasteName } from '../src/tastes.js';

const acceptable = (style: ReturnType<typeof tasteSpecimen>, taste: TasteName) => {
  const result = check(style, { taste });
  const findings = result.filter((finding) => finding.severity !== 'info');
  expect(findings, `${taste} ${JSON.stringify(result)}`).toEqual([]);
  expect(score(result), taste).toBe(100);
  return result;
};

describe('named tastes', () => {
  it('ships six schools and maps the old packs onto two of them', () => {
    expect(tasteNames).toEqual([
      'saas-dense',
      'exec-brief',
      'ops-wall',
      'cn-ecommerce',
      'global-marketplace',
      'editorial-data',
    ]);
    expect(packAlias).toEqual({ global: 'saas-dense', cn: 'cn-ecommerce' });
    expect(tastes['saas-dense'].packAlias).toBe('global');
    expect(tastes['cn-ecommerce'].packAlias).toBe('cn');
    for (const id of tasteNames) expect(tasteRules(tastes[id]).length).toBeGreaterThan(40);
  });

  it('fails the rainbow fixture under every taste', () => {
    const rainbow = tasteSpecimen('rainbow');
    for (const taste of tasteNames) {
      const result = check(rainbow, { taste });
      expect(
        result.some((finding) => finding.ruleId === 'DT030' && finding.severity === 'error'),
        taste,
      ).toBe(true);
      expect(score(result), taste).toBeLessThan(90);
    }
  });

  it('accepts each taste fixture under that taste', () => {
    for (const taste of tasteNames) acceptable(tasteSpecimen(taste), taste);
  });

  it('accepts the committed fixture files', () => {
    for (const taste of tasteNames) {
      const style = JSON.parse(
        readFileSync(new URL(`./fixtures/tastes/${taste}.json`, import.meta.url), 'utf8'),
      );
      expect(style).toEqual(tasteSpecimen(taste));
      acceptable(style, taste);
    }
    const rainbow = JSON.parse(
      readFileSync(new URL('./fixtures/tastes/rainbow.json', import.meta.url), 'utf8'),
    );
    expect(
      check(rainbow, { taste: 'saas-dense' }).some((finding) => finding.ruleId === 'DT030'),
    ).toBe(true);
  });

  it('keeps --pack as an alias and rejects a disagreeing pair', () => {
    const good = tasteSpecimen('saas-dense');
    expect(check(good).length).toBe(0);
    expect(check(good, { pack: 'global' })).toEqual([]);
    expect(check(tasteSpecimen('cn-ecommerce'), { pack: 'cn' })).toEqual([]);
    expect(check(good, { taste: 'saas-dense', pack: 'global' })).toEqual([]);
    expect(() => check(good, { taste: 'ops-wall', pack: 'global' })).toThrow(/aliases/);
    expect(() => check(good, { taste: 'nope' as TasteName })).toThrow(/Unknown taste/);
  });

  it('treats chart count as a rule, not a color swap', () => {
    const crowded = tasteSpecimen('exec-brief', { charts: 2 });
    expect(
      check(crowded, { taste: 'exec-brief' }).some((finding) => finding.ruleId === 'DT031'),
    ).toBe(true);
    expect(
      check(crowded, { taste: 'saas-dense' }).filter((finding) => finding.ruleId === 'DT031'),
    ).toEqual([]);
    expect(score(check(crowded, { taste: 'exec-brief' }))).toBeLessThan(100);
  });

  it('caps series on saas-dense and allows the same chart on cn-ecommerce', () => {
    const wide = tasteSpecimen('saas-dense', { series: 4 });
    expect(check(wide, { taste: 'saas-dense' }).some((finding) => finding.ruleId === 'DT032')).toBe(
      true,
    );
    expect(
      check(wide, { taste: 'cn-ecommerce' }).some((finding) => finding.ruleId === 'DT032'),
    ).toBe(false);
  });

  it('requires a story annotation for editorial data and not for saas-dense', () => {
    const bare = tasteSpecimen('editorial-data', { annotations: 0 });
    expect(
      check(bare, { taste: 'editorial-data' }).some((finding) => finding.ruleId === 'DT033'),
    ).toBe(true);
    expect(score(check(bare, { taste: 'editorial-data' }))).toBeLessThan(100);
    expect(
      check(bare, { taste: 'saas-dense' }).filter((finding) => finding.ruleId === 'DT033'),
    ).toEqual([]);
  });

  it('rejects a light ground under ops-wall and a night ground under editorial-data', () => {
    const night = tasteSpecimen('ops-wall');
    const paper = tasteSpecimen('editorial-data');
    expect(
      check(night, { taste: 'editorial-data', mode: 'light' }).some(
        (finding) => finding.ruleId === 'DT035',
      ),
    ).toBe(true);
    expect(
      check(paper, { taste: 'ops-wall' }).some(
        (finding) => finding.ruleId === 'DT035' && finding.severity === 'error',
      ),
    ).toBe(true);
    expect(check(night, { taste: 'ops-wall' })).toEqual([]);
  });

  it('asks marketplace axes for a currency and lets saas-dense omit it', () => {
    const plain = tasteSpecimen('saas-dense');
    expect(
      check(plain, { taste: 'global-marketplace' }).some((finding) => finding.ruleId === 'DT036'),
    ).toBe(true);
    expect(check(tasteSpecimen('global-marketplace'), { taste: 'global-marketplace' })).toEqual([]);
  });

  it('keeps cn funnels descending and rejects them on an exec brief', () => {
    const funnel = tasteSpecimen('cn-ecommerce');
    const ascending = {
      animation: false,
      backgroundColor: '#F2F4F2',
      color: ['#3E6A88'],
      series: [
        {
          type: 'funnel',
          sort: 'ascending',
          data: [
            { name: '支付', value: 30 },
            { name: '访问', value: 90 },
          ],
        },
      ],
    };
    expect(check(funnel, { taste: 'cn-ecommerce' })).toEqual([]);
    expect(
      check(ascending, { taste: 'cn-ecommerce' }).some((finding) => finding.ruleId === 'DT037'),
    ).toBe(true);
    expect(
      check(funnel, { taste: 'exec-brief' }).some((finding) => finding.ruleId === 'DT037'),
    ).toBe(true);
  });

  it('uses a stricter KPI cap on an exec brief than on an ops wall', () => {
    const kpis = {
      charts: [{ option: { backgroundColor: '#101614' } }],
      kpis: Array.from({ length: 4 }, () => ({ selector: '.kpi', text: '5', color: '#111111' })),
    };
    expect(check(kpis, { taste: 'exec-brief', only: ['DT019'] })).toHaveLength(1);
    expect(check(kpis, { taste: 'ops-wall', mode: 'dark', only: ['DT019'] })).toEqual([]);
    expect(check(kpis, { taste: 'saas-dense', only: ['DT019'] })).toEqual([]);
  });
});
