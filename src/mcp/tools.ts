import { review } from '../engine.js';
import { tasteSpecimen } from '../specimens.js';
import { applyBundle, tasteDocument, writeApply } from '../taste-install.js';
import {
  isTaste,
  resolveTaste,
  tasteCatalog,
  tasteNames,
  tastes,
  type TasteName,
} from '../tastes.js';

const tasteEnum = [...tasteNames];

export const mcpTools = [
  {
    name: 'list_tastes',
    description:
      'List the six dashtaste schools: id, tokens, composition, and the rules sentence. Pick one before building a dashboard.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'taste_tokens',
    description:
      'Tokens, composition caps, and the rules sentence for one named taste. Same payload as `dashtaste tokens --taste`.',
    inputSchema: {
      type: 'object',
      properties: { taste: { type: 'string', enum: tasteEnum } },
      required: ['taste'],
      additionalProperties: false,
    },
  },
  {
    name: 'taste_example',
    description:
      'A minimal ECharts option that scores 100 under one taste. Same payload as `dashtaste example --taste`. Copy it instead of inventing a palette.',
    inputSchema: {
      type: 'object',
      properties: { taste: { type: 'string', enum: tasteEnum } },
      required: ['taste'],
      additionalProperties: false,
    },
  },
  {
    name: 'check_taste',
    description:
      'Check an ECharts option, option array, or page-facts envelope against one taste. Defaults to saas-dense. `--pack global` is saas-dense; `--pack cn` is cn-ecommerce. disable and only use the same rule ids as the CLI. The result includes ruleset, ran, and findings with name and basis. A rainbow palette is an error in every taste.',
    inputSchema: {
      type: 'object',
      properties: {
        option: {},
        optionJson: { type: 'string' },
        taste: { type: 'string', enum: tasteEnum },
        pack: { type: 'string', enum: ['global', 'cn'] },
        mode: { type: 'string', enum: ['light', 'dark'] },
        disable: { type: 'array', items: { type: 'string' } },
        only: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'apply_taste',
    description:
      'Return the tokens.json and example.json bodies for one taste. Pass `out` to also write those files, same as `dashtaste apply --taste`.',
    inputSchema: {
      type: 'object',
      properties: {
        taste: { type: 'string', enum: tasteEnum },
        out: { type: 'string', minLength: 1 },
      },
      required: ['taste'],
      additionalProperties: false,
    },
  },
] as const;

function requireTaste(value: unknown, label = 'taste'): TasteName {
  if (typeof value !== 'string' || !isTaste(value))
    throw new Error(value === undefined ? `missing ${label}` : `Unknown taste: ${String(value)}`);
  return value;
}

function ruleList(value: unknown, label: string): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string' || id.length === 0))
    throw new Error(`${label} must be an array of rule IDs`);
  return value;
}

function optionFrom(args: Record<string, unknown>): unknown {
  if (args.option !== undefined) return args.option;
  if (typeof args.optionJson === 'string') return JSON.parse(args.optionJson);
  throw new Error('option or optionJson is required');
}

/** Run one MCP tool. Throws on unknown tools and invalid arguments. */
export async function callTool(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
  switch (name) {
    case 'list_tastes':
      return tasteCatalog();
    case 'taste_tokens':
      return tasteDocument(tastes[requireTaste(args.taste)]);
    case 'taste_example':
      return tasteSpecimen(requireTaste(args.taste));
    case 'check_taste': {
      const tasteArg = args.taste === undefined ? undefined : requireTaste(args.taste);
      const pack = args.pack === undefined ? undefined : args.pack;
      if (pack !== undefined && pack !== 'global' && pack !== 'cn') throw new Error('Unknown pack');
      if (args.mode !== undefined && args.mode !== 'light' && args.mode !== 'dark')
        throw new Error('mode must be light or dark');
      const taste = resolveTaste({
        ...(pack ? { pack } : {}),
        ...(tasteArg ? { taste: tasteArg } : {}),
      });
      return review(optionFrom(args), {
        ...(pack ? { pack } : {}),
        taste,
        ...(args.mode === 'light' || args.mode === 'dark' ? { mode: args.mode } : {}),
        disable: ruleList(args.disable, 'disable'),
        only: ruleList(args.only, 'only'),
      });
    }
    case 'apply_taste': {
      const taste = requireTaste(args.taste);
      if (args.out === undefined) return applyBundle(taste);
      if (typeof args.out !== 'string' || !args.out.trim())
        throw new Error('out must be a directory');
      return writeApply(taste, args.out);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
