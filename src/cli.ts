#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { check, summarize, score } from './engine.js';
import { rules } from './rules/index.js';
import {
  getResolvedPack,
  parsePackOverlay,
  resolvePackOverlay,
  type Mode,
  type PackName,
} from './packs/index.js';
import { extractPage } from './extract.js';
import { tasteSpecimen } from './specimens.js';
import {
  isTaste,
  packAlias,
  resolveTaste,
  tasteCatalog,
  tasteRules,
  tastes,
  type Taste,
  type TasteName,
} from './tastes.js';
import type { Finding } from './types.js';
import { createRequire } from 'node:module';
const version = createRequire(import.meta.url)('../package.json').version as string;
const help: Record<string, string> = {
  main: 'Usage: dashtaste <tastes|check|rules|tokens|example|apply> --help',
  tastes:
    'Usage: dashtaste tastes [--format text|json]\nList the six named tastes, their schools, and the rules the checker enforces.',
  check:
    'Usage: dashtaste check <file|url...> [--taste saas-dense|exec-brief|ops-wall|cn-ecommerce|global-marketplace|editorial-data] [--pack global|cn] [--pack-file path.json] [--mode light|dark] [--format text|json] [--max-warnings N] [--disable DT001,...] [--only DT001,...] [--background #hex]\nCheck options, option arrays, or page facts. --pack global aliases saas-dense. --pack cn aliases cn-ecommerce. With neither flag, the taste is saas-dense. Exit: 0 pass, 1 findings exceed limit, 2 invalid input. Set NO_COLOR to disable ANSI colour; CHROME_PATH selects the browser.',
  rules:
    'Usage: dashtaste rules [--taste <name>] [--pack global|cn] [--pack-file path.json] [--format text|json]\nList rule metadata in rule order.',
  tokens:
    'Usage: dashtaste tokens [--taste <name>] [--pack global|cn] [--pack-file path.json] [--mode light|dark] [--format json|css]\nPrint a taste (tokens plus composition) or, with --pack, the pack colours.',
  example:
    'Usage: dashtaste example --taste <name>\nPrint a minimal option that scores 100 under that taste.',
  apply:
    'Usage: dashtaste apply --taste <name> [--out dir]\nWrite tokens.json and example.json for that taste.',
};

function parseArgs(command: string | undefined, args: string[]) {
  const flags: Record<string, string> = {},
    inputs: string[] = [];
  const allowed: Record<string, string[]> = {
    check: [
      'pack-file',
      'pack',
      'taste',
      'mode',
      'format',
      'max-warnings',
      'disable',
      'only',
      'background',
    ],
    rules: ['pack-file', 'pack', 'taste', 'format'],
    tokens: ['pack-file', 'pack', 'taste', 'mode', 'format'],
    tastes: ['format'],
    example: ['taste'],
    apply: ['taste', 'out'],
  };
  if (!command || !allowed[command])
    throw new Error(
      'usage: dashtaste tastes | check <file|url...> | rules | tokens | example --taste <name> | apply --taste <name>',
    );
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      if (!allowed[command].includes(key) || !args[i + 1] || args[i + 1].startsWith('--'))
        throw new Error(`invalid option: ${args[i]}`);
      flags[key] = args[++i];
    } else inputs.push(args[i]);
  }
  return { flags, inputs };
}

function tasteFromFlags(flags: Record<string, string>, pack?: PackName): TasteName {
  try {
    return resolveTaste({
      ...(pack ? { pack } : {}),
      ...(flags.taste ? { taste: flags.taste } : {}),
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

function requireTaste(flags: Record<string, string>): TasteName {
  if (!flags.taste) throw new Error('missing --taste');
  if (!isTaste(flags.taste)) throw new Error(`Unknown taste: ${flags.taste}`);
  return flags.taste;
}

function printTastes(format: string) {
  const catalog = tasteCatalog();
  console.log(
    format === 'json'
      ? JSON.stringify(catalog, null, 2)
      : catalog
          .map(
            (taste) =>
              `${taste.id.padEnd(22)}${taste.summary}${taste.packAlias ? `  (--pack ${taste.packAlias})` : ''}`,
          )
          .join('\n'),
  );
}

function printTasteTokens(taste: Taste, format: string) {
  const payload = {
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
  console.log(
    format === 'json'
      ? JSON.stringify(payload, null, 2)
      : `:root {\n${Object.entries(taste.tokens)
          .flatMap(([key, value]) =>
            Array.isArray(value)
              ? value.map((entry, index) => `  --dt-${key}-${index + 1}: ${entry};`)
              : [`  --dt-${key}: ${value};`],
          )
          .join('\n')}\n  /* ${tasteRules(taste)} */\n}`,
  );
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === '--help' || (command && args.includes('--help'))) {
    console.log(help[command] ?? help.main);
    return;
  }
  const { flags, inputs } = parseArgs(command, args);
  const packOverlay = flags['pack-file']
    ? await (async () => {
        try {
          const overlay = parsePackOverlay(JSON.parse(await readFile(flags['pack-file'], 'utf8')));
          if (overlay.disable?.some((id) => !rules.some((rule) => rule.id === id)))
            throw new Error('unknown rule in disable');
          return overlay;
        } catch (error) {
          throw new Error(
            `cannot load pack-file ${flags['pack-file']}: ${(error as Error).message}`,
          );
        }
      })()
    : undefined;
  const requestedPack = (packOverlay?.extends ?? flags.pack) as PackName | undefined;
  if (requestedPack && !['global', 'cn'].includes(requestedPack))
    throw new Error('pack must be global or cn');
  if (flags.taste && !isTaste(flags.taste)) throw new Error(`Unknown taste: ${flags.taste}`);
  const taste = tasteFromFlags(flags, requestedPack);
  const pack = (requestedPack ?? tastes[taste].basePack) as PackName;
  const mode = (flags.mode ?? tastes[taste].defaultMode) as Mode;
  const format = flags.format ?? (command === 'tokens' ? 'json' : 'text');
  if (!['light', 'dark'].includes(mode)) throw new Error('mode must be light or dark');
  if (!(command === 'tokens' ? ['json', 'css'] : ['json', 'text']).includes(format))
    throw new Error('invalid output format');
  if (command === 'tastes') {
    if (inputs.length) throw new Error('unexpected input');
    printTastes(format);
    return;
  }
  if (command === 'example') {
    if (inputs.length) throw new Error('unexpected input');
    console.log(JSON.stringify(tasteSpecimen(requireTaste(flags)), null, 2));
    return;
  }
  if (command === 'apply') {
    if (inputs.length) throw new Error('unexpected input');
    const selected = tastes[requireTaste(flags)];
    const dir = flags.out ?? '.';
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, 'tokens.json'),
      `${JSON.stringify({ id: selected.id, tokens: selected.tokens, composition: selected.composition, rules: tasteRules(selected) }, null, 2)}\n`,
    );
    await writeFile(
      join(dir, 'example.json'),
      `${JSON.stringify(tasteSpecimen(selected.id), null, 2)}\n`,
    );
    console.log(
      `Wrote ${join(dir, 'tokens.json')} and ${join(dir, 'example.json')} for ${selected.id}`,
    );
    return;
  }
  if (!['check', 'rules', 'tokens'].includes(command ?? '')) throw new Error('unexpected input');
  if (command !== 'check' && inputs.length) throw new Error('unexpected input');
  if (command === 'tokens') {
    if (!flags.pack && !packOverlay && !flags.taste)
      throw new Error('tokens requires --taste, --pack, or --pack-file');
    if (flags.taste) {
      printTasteTokens(tastes[taste], format);
      return;
    }
    const t = (packOverlay ? resolvePackOverlay(packOverlay) : getResolvedPack({ pack }))[mode];
    console.log(
      format === 'json'
        ? JSON.stringify(t, null, 2)
        : `:root {\n${Object.entries(t)
            .flatMap(([k, v]) =>
              Array.isArray(v)
                ? v.map((x, i) => `  --dt-${k}-${i + 1}: ${x};`)
                : [`  --dt-${k}: ${v};`],
            )
            .join('\n')}\n}`,
    );
    return;
  }
  if (command === 'rules') {
    const selected = rules.filter((r) => (!flags.pack && !packOverlay) || r.packs.includes(pack));
    console.log(
      format === 'json'
        ? JSON.stringify(
            selected.map(({ check, ...r }) => r),
            null,
            2,
          )
        : selected.map((r) => `${r.id}  ${r.severity}  ${r.name}  ${r.description}`).join('\n'),
    );
    return;
  }
  if (!inputs.length) throw new Error('check requires at least one input');
  const max = flags['max-warnings'] === undefined ? Infinity : Number(flags['max-warnings']);
  if (max < 0 || (!Number.isInteger(max) && max !== Infinity) || flags['max-warnings'] === '')
    throw new Error('max-warnings must be a non-negative integer');
  const ids = (key: string) => {
    if (!flags[key]) return undefined;
    const values = flags[key].split(',');
    if (values.some((id) => !rules.some((r) => r.id === id)))
      throw new Error(`unknown rule in --${key}`);
    return values;
  };
  const disable = ids('disable'),
    only = ids('only');
  if (flags.background && !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(flags.background))
    throw new Error('background must be a hex colour');
  const results: {
    input: string;
    findings: Finding[];
    score: number;
  }[] = [];
  for (const input of inputs) {
    let data: unknown;
    if (/^https?:\/\//i.test(input) || /\.html?$/i.test(input)) data = await extractPage(input);
    else {
      try {
        data = JSON.parse(await readFile(input, 'utf8'));
      } catch (error) {
        throw new Error(`cannot read JSON input ${input}: ${(error as Error).message}`);
      }
    }
    const findings = check(data, {
      ...(requestedPack ? { pack: requestedPack } : {}),
      taste,
      packOverlay,
      ...(flags.mode ? { mode: flags.mode as Mode } : {}),
      disable,
      only,
      background: flags.background,
    });
    results.push({ input, findings, score: score(findings) });
  }
  const summary = summarize(results.flatMap((r) => r.findings));
  if (format === 'json')
    console.log(
      JSON.stringify(
        {
          version,
          pack,
          taste,
          ...(packOverlay ? { packFile: packOverlay.id } : {}),
          inputs: results,
          summary,
        },
        null,
        2,
      ),
    );
  else {
    const tty = process.stdout.isTTY && process.env.NO_COLOR === undefined;
    for (const result of results) {
      console.log(result.input);
      for (const f of result.findings) {
        const label = tty
          ? `\x1b[${f.severity === 'error' ? 31 : f.severity === 'warn' ? 33 : 36}m${f.severity}\x1b[0m`
          : f.severity;
        console.log(
          `  ${label}  ${f.ruleId}  ${f.path}  ${f.message}  → ${f.fix.replace('<pack>', pack)}`,
        );
      }
    }
    console.log(
      `${summary.errors} error${summary.errors === 1 ? '' : 's'}, ${summary.warnings} warning${summary.warnings === 1 ? '' : 's'} · score ${summary.score}/100 · ${taste}`,
    );
  }
  process.exitCode = summary.errors > 0 || summary.warnings > max ? 1 : 0;
}
main().catch((error) => {
  console.error(`dashtaste: ${(error as Error).message}`);
  process.exitCode = 2;
});
