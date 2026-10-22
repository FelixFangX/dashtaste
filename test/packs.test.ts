import { it, expect } from 'vitest';
import { packs } from '../src/packs/index.js';
import { contrast } from '../src/color.js';
import { matrices, simulatedLab, distance } from './color-vision.js';
for (const [name, pack] of Object.entries(packs))
  for (const mode of ['light', 'dark'] as const) {
    const t = pack[mode];
    it(`${name} ${mode} all body pairs pass WCAG AA`, () => {
      const surfaces = ['paper', 'page', 'card', 'bg', 'panel']
        .map((k) => t[k])
        .filter((v): v is string => typeof v === 'string');
      for (const bg of surfaces)
        for (const fg of [t.ink, t.muted])
          expect(contrast(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
    });
    for (const [vision, matrix] of Object.entries(matrices))
      it(`${name} ${mode} ${vision} categorical separation`, () => {
        const labs = t.categorical.map((hex) => simulatedLab(hex, matrix));
        for (let i = 0; i < labs.length; i++)
          for (let j = 0; j < i; j++)
            expect(
              distance(labs[i], labs[j]),
              `${t.categorical[i]} / ${t.categorical[j]}`,
            ).toBeGreaterThanOrEqual(0.08);
      });
  }

for (const mode of ['light', 'dark'] as const)
  for (const [vision, matrix] of Object.entries(matrices))
    it(`global ${mode} ${vision} accent differs from down`, () => {
      const t = packs.global[mode];
      expect(
        distance(simulatedLab(t.brand, matrix), simulatedLab(t.down, matrix)),
      ).toBeGreaterThanOrEqual(0.08);
    });

for (const mode of ['light', 'dark'] as const)
  for (const [vision, matrix] of Object.entries(matrices))
    it(`cn ${mode} ${vision} accent differs from delta colours`, () => {
      const t = packs.cn[mode];
      for (const delta of [t.up, t.down])
        expect(
          distance(simulatedLab(t.accent as string, matrix), simulatedLab(delta, matrix)),
        ).toBeGreaterThanOrEqual(0.08);
    });
