import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { callTool, mcpTools } from '../src/mcp/tools.js';
import { tasteSpecimen } from '../src/specimens.js';
import { tasteNames } from '../src/tastes.js';

describe('MCP tools', () => {
  it('registers list, tokens, example, check, and apply', () => {
    expect(mcpTools.map((tool) => tool.name)).toEqual([
      'list_tastes',
      'taste_tokens',
      'taste_example',
      'check_taste',
      'apply_taste',
    ]);
  });

  it('lists every named taste', async () => {
    const catalog = (await callTool('list_tastes')) as { id: string }[];
    expect(catalog.map((taste) => taste.id)).toEqual([...tasteNames]);
  });

  it('fails a rainbow option and accepts the saas-dense fixture', async () => {
    const rainbow = (await callTool('check_taste', {
      taste: 'saas-dense',
      option: tasteSpecimen('rainbow'),
    })) as {
      taste: string;
      score: number;
      findings: { ruleId: string; severity: string }[];
    };
    expect(rainbow.taste).toBe('saas-dense');
    expect(
      rainbow.findings.some(
        (finding) => finding.ruleId === 'DT030' && finding.severity === 'error',
      ),
    ).toBe(true);
    expect(rainbow.score).toBeLessThan(90);

    const passing = (await callTool('check_taste', {
      optionJson: JSON.stringify(tasteSpecimen('saas-dense')),
    })) as { taste: string; score: number; findings: unknown[] };
    expect(passing.taste).toBe('saas-dense');
    expect(passing.findings).toEqual([]);
    expect(passing.score).toBe(100);
  });

  it('returns tokens and an example that scores 100', async () => {
    const tokens = (await callTool('taste_tokens', { taste: 'editorial-data' })) as {
      id: string;
      rules: string;
    };
    expect(tokens.id).toBe('editorial-data');
    expect(tokens.rules).toContain('story annotations');
    const example = await callTool('taste_example', { taste: 'ops-wall' });
    const checked = (await callTool('check_taste', { taste: 'ops-wall', option: example })) as {
      score: number;
    };
    expect(checked.score).toBe(100);
  });

  it('apply returns the bundle and can write it', async () => {
    const bundle = (await callTool('apply_taste', { taste: 'cn-ecommerce' })) as {
      taste: string;
      example: unknown;
      wrote?: string[];
    };
    expect(bundle.taste).toBe('cn-ecommerce');
    expect(bundle.wrote).toBeUndefined();
    expect(
      (
        (await callTool('check_taste', { taste: 'cn-ecommerce', option: bundle.example })) as {
          score: number;
        }
      ).score,
    ).toBe(100);

    const dir = mkdtempSync(join(tmpdir(), 'dashtaste-mcp-'));
    try {
      const written = (await callTool('apply_taste', { taste: 'cn-ecommerce', out: dir })) as {
        wrote: string[];
      };
      expect(written.wrote).toEqual([join(dir, 'tokens.json'), join(dir, 'example.json')]);
      expect(JSON.parse(readFileSync(join(dir, 'tokens.json'), 'utf8')).id).toBe('cn-ecommerce');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects an unknown tool and a disagreeing pack', async () => {
    await expect(callTool('preview_place')).rejects.toThrow(/Unknown tool/);
    await expect(
      callTool('check_taste', { taste: 'ops-wall', pack: 'global', option: { series: [] } }),
    ).rejects.toThrow(/aliases/);
  });
});
