import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {packs} from '../src/packs/index.js';
import {rules} from '../src/rules/index.js';
for(const [name,pack]of Object.entries(packs)){
 it(`${name} skill frontmatter and reference links`,()=>{const skill=readFileSync(`skills/dashtaste-${name}/SKILL.md`,'utf8');expect(skill).toMatch(new RegExp(`^---\\nname: dashtaste-${name}\\ndescription: .+\\n---`));expect(skill.split('\n').length).toBeLessThan(120);for(const file of ['tokens','charts','numbers','avoid'])expect(skill).toContain(`references/${file}.md`);});
 it(`${name} token tables match all code tokens exactly`,()=>{const doc=readFileSync(`skills/dashtaste-${name}/references/tokens.md`,'utf8');const rows=[...doc.matchAll(/^\| (\w+\.\w+(?:\.\d+)?) \| (#[0-9A-F]{6}) \|$/gm)];const expected:Record<string,string>={};for(const mode of ['light','dark'] as const)for(const [key,value]of Object.entries(pack[mode]))if(Array.isArray(value))value.forEach((v,i)=>expected[`${mode}.${key}.${i}`]=v);else expected[`${mode}.${key}`]=value as string;expect(Object.fromEntries(rows.map(r=>[r[1],r[2]]))).toEqual(expected);expect(rows.length).toBe(Object.keys(expected).length);});
}
it('every documented rule matches metadata',()=>{const doc=readFileSync('docs/rules.md','utf8');for(const r of rules){expect(doc).toContain(`## ${r.id} ${r.name}`);expect(doc).toContain(r.description);expect(doc).toContain(r.fix);}});
