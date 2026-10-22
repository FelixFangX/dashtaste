import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { check } from '../src/index.js';

for (const pack of ['global', 'cn'] as const) {
  describe(`${pack} chart references`, () => {
    const markdown = readFileSync(`skills/dashtaste-${pack}/references/charts.md`, 'utf8');
    const examples = [...markdown.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];

    it('includes a complete option for every chart type', () => {
      expect(examples).toHaveLength(9);
    });

    for (const [index, example] of examples.entries()) {
      const title = markdown
        .slice(0, example.index)
        .match(/^## .+$/gm)
        ?.at(-1);
      it(`passes ${title ?? index} without errors or warnings`, () => {
        const option: unknown = JSON.parse(example[1]);
        const findings = check(option, { pack });
        expect(findings.filter((finding) => finding.severity !== 'info')).toEqual([]);
      });
    }
  });
}
