import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { check } from '../src/engine.js';
import { packs, parsePackOverlay, resolvePackOverlay } from '../src/packs/index.js';

const overlay = parsePackOverlay(
  JSON.parse(readFileSync('test/fixtures/pack-overlay-cn.json', 'utf8')),
);

it('merges limits and mode tokens onto an independent clone', () => {
  const pack = resolvePackOverlay(overlay);
  expect(pack.limits).toEqual({ ...packs.cn.limits, maxKpis: 1 });
  expect(pack.light).toEqual({ ...packs.cn.light, brand: '#663399' });
  expect(pack.dark).toEqual({ ...packs.cn.dark, brand: '#BB99EE' });
  pack.light.categorical = ['#000000'];
  pack.typography.body = 999;
  expect(packs.cn.light.categorical).not.toEqual(['#000000']);
  expect(packs.cn.typography.body).not.toBe(999);
  expect(packs.cn.limits.maxKpis).toBe(8);
});

it('tightens KPI limits and unions overlay and CLI disables', () => {
  const facts = {
    charts: [],
    kpis: [1, 2].map((n) => ({ selector: `#k${n}`, text: `${n}`, color: '#000000' })),
    emojis: [{ selector: '#title', text: 'emoji' }],
  };
  expect(check(facts, { pack: 'cn', only: ['DT019'] })).toEqual([]);
  expect(
    check(facts, { pack: 'global', packOverlay: overlay, only: ['DT019', 'DT021'] }).map(
      (f) => f.ruleId,
    ),
  ).toEqual(['DT019']);
  expect(
    check(facts, { packOverlay: overlay, disable: ['DT019'], only: ['DT019', 'DT021'] }),
  ).toEqual([]);
});

it('uses merged background tokens in contrast rules', () => {
  const facts = {
    charts: [{ option: { series: [{ type: 'line', lineStyle: { color: '#FFFFFF', width: 1 } }] } }],
  };
  const packOverlay = parsePackOverlay({
    id: 'contrast',
    extends: 'global',
    tokens: { light: { paper: '#000000' } },
  });
  expect(check(facts, { only: ['DT016'] })).toHaveLength(1);
  expect(check(facts, { packOverlay, only: ['DT016'] })).toEqual([]);
});

it.each([
  {},
  { id: 'x' },
  { id: 'x', extends: 'other' },
  { id: 'x', extends: 'cn', tokens: { light: { categorical: [] } } },
  { id: 'x', extends: 'cn', tokens: { dark: { sequential: [1] } } },
  { id: 'x', extends: 'cn', limits: { maxKpis: '1' } },
])('rejects invalid overlay schema %j', (value) => {
  expect(() => parsePackOverlay(value)).toThrow('invalid pack-file');
});
