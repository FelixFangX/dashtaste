import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tasteSpecimen } from './specimens.js';
import { tasteRules, tastes, type Taste, type TasteName } from './tastes.js';

/** Tokens plus the composition sentence `tokens --taste` prints. */
export function tasteDocument(taste: Taste) {
  return {
    id: taste.id,
    title: taste.title,
    school: taste.school,
    packAlias: taste.packAlias ?? null,
    basePack: taste.basePack,
    defaultMode: taste.defaultMode,
    tokens: taste.tokens,
    composition: taste.composition,
    rules: tasteRules(taste),
  };
}

/** The two files `apply --taste` writes, without touching the disk. */
export function applyBundle(id: TasteName) {
  const document = tasteDocument(tastes[id]);
  return {
    taste: id,
    tokens: {
      id: document.id,
      tokens: document.tokens,
      composition: document.composition,
      rules: document.rules,
    },
    example: tasteSpecimen(id),
  };
}

/** Write `tokens.json` and `example.json` for one taste. */
export async function writeApply(id: TasteName, dir: string) {
  const bundle = applyBundle(id);
  await mkdir(dir, { recursive: true });
  const tokensPath = join(dir, 'tokens.json');
  const examplePath = join(dir, 'example.json');
  await writeFile(tokensPath, `${JSON.stringify(bundle.tokens, null, 2)}\n`);
  await writeFile(examplePath, `${JSON.stringify(bundle.example, null, 2)}\n`);
  return { ...bundle, wrote: [tokensPath, examplePath] };
}
