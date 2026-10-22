#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { check, summarize, score } from './engine.js';
import { rules } from './rules/index.js';
import { getTokens, type PackName, type Mode } from './packs/index.js';
import { extractPage } from './extract.js';
import type { Finding } from './types.js';
const version = '0.0.1';
const help: Record<string, string> = {
  main: 'Usage: dashtaste <check|rules|tokens> --help',
  check:
    'Usage: dashtaste check <file|url...> [--pack global|cn] [--mode light|dark] [--format text|json] [--max-warnings N] [--disable DT001,...] [--only DT001,...] [--background #hex]\nCheck options, option arrays, or page facts. Exit: 0 pass, 1 findings exceed limit, 2 invalid input. Set NO_COLOR to disable ANSI colour; CHROME_PATH selects the browser.',
  rules:
    'Usage: dashtaste rules [--pack global|cn] [--format text|json]\nList rule metadata in rule order.',
  tokens:
    'Usage: dashtaste tokens --pack global|cn [--mode light|dark] [--format json|css]\nPrint exact pack tokens.',
};

function parseArgs(command: string | undefined, args: string[]) {
  const flags: Record<string, string> = {},
    inputs: string[] = [];
  const allowed: Record<string, string[]> = {
    check: ['pack', 'mode', 'format', 'max-warnings', 'disable', 'only', 'background'],
    rules: ['pack', 'format'],
    tokens: ['pack', 'mode', 'format'],
  };
  if (!command || !allowed[command])
    throw new Error('usage: dashtaste check <file|url...> | rules | tokens --pack global|cn');
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

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === '--help' || (command && args.includes('--help'))) {
    console.log(help[command] ?? help.main);
    return;
  }
  const { flags, inputs } = parseArgs(command, args);
  const pack = (flags.pack ?? 'global') as PackName,
    mode = (flags.mode ?? 'light') as Mode,
    format = flags.format ?? (command === 'tokens' ? 'json' : 'text');
  if (!['global', 'cn'].includes(pack)) throw new Error('pack must be global or cn');
  if (!['light', 'dark'].includes(mode)) throw new Error('mode must be light or dark');
  if (!(command === 'tokens' ? ['json', 'css'] : ['json', 'text']).includes(format))
    throw new Error('invalid output format');
  if (command !== 'check' && inputs.length) throw new Error('unexpected input');
  if (command === 'tokens') {
    if (!flags.pack) throw new Error('tokens requires --pack');
    const t = getTokens(pack, mode);
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
    const selected = rules.filter((r) => !flags.pack || r.packs.includes(pack));
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
    const findings = check(data, { pack, mode, disable, only, background: flags.background });
    results.push({ input, findings, score: score(findings) });
  }
  const summary = summarize(results.flatMap((r) => r.findings));
  if (format === 'json')
    console.log(JSON.stringify({ version, pack, inputs: results, summary }, null, 2));
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
      `${summary.errors} error${summary.errors === 1 ? '' : 's'}, ${summary.warnings} warning${summary.warnings === 1 ? '' : 's'} · score ${summary.score}/100`,
    );
  }
  process.exitCode = summary.errors > 0 || summary.warnings > max ? 1 : 0;
}
main().catch((error) => {
  console.error(`dashtaste: ${(error as Error).message}`);
  process.exitCode = 2;
});
