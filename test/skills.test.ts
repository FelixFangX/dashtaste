import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { packs } from '../src/packs/index.js';
import { rules } from '../src/rules/index.js';
for (const [name, pack] of Object.entries(packs)) {
  it(`${name} skill frontmatter and reference links`, () => {
    const skill = readFileSync(`skills/dashtaste-${name}/SKILL.md`, 'utf8');
    expect(skill).toMatch(new RegExp(`^---\\nname: dashtaste-${name}\\ndescription: .+\\n---`));
    expect(skill.split('\n').length).toBeLessThan(120);
    for (const file of ['tokens', 'charts', 'numbers', 'layout', 'avoid'])
      expect(skill).toContain(`references/${file}.md`);
  });
  it(`${name} token tables match all code tokens exactly`, () => {
    const doc = readFileSync(`skills/dashtaste-${name}/references/tokens.md`, 'utf8');
    const rows = [...doc.matchAll(/^\|\s+(\w+\.\w+(?:\.\d+)?)\s+\|\s+(#[0-9A-F]{6})\s+\|$/gm)];
    const expected: Record<string, string> = {};
    for (const mode of ['light', 'dark'] as const)
      for (const [key, value] of Object.entries(pack[mode]))
        if (Array.isArray(value)) value.forEach((v, i) => (expected[`${mode}.${key}.${i}`] = v));
        else expected[`${mode}.${key}`] = value as string;
    expect(Object.fromEntries(rows.map((r) => [r[1], r[2]]))).toEqual(expected);
    expect(rows.length).toBe(Object.keys(expected).length);
  });
}
it('every documented rule matches metadata', () => {
  const doc = readFileSync('docs/rules.md', 'utf8');
  for (const r of rules) {
    expect(doc).toContain(`## ${r.id} ${r.name}`);
    expect(doc).toContain(r.description);
    expect(doc).toContain(r.fix);
  }
});

for (const name of ['global', 'cn']) {
  for (const reference of ['tokens', 'charts', 'numbers', 'layout', 'avoid']) {
    it(`${name} ${reference} reference stays within the reading budget`, () => {
      const content = readFileSync(`skills/dashtaste-${name}/references/${reference}.md`, 'utf8');
      const lines = content.trimEnd().split('\n').length;
      expect(lines).toBeGreaterThanOrEqual(60);
      expect(lines).toBeLessThanOrEqual(200);
    });
  }
}
