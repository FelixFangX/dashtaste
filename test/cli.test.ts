import { it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const cli = (...args: string[]) =>
  spawnSync(process.execPath, ['dist/cli.js', ...args], {
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });
it('good text exits zero', () => {
  const r = cli('check', 'test/fixtures/good.json', '--pack', 'cn');
  expect(r.status).toBe(0);
  expect(r.stdout).toContain('0 errors, 0 warnings · score 100/100');
});
it('bad text exits one', () => {
  const r = cli('check', 'test/fixtures/bad.json', '--pack', 'cn');
  expect(r.status).toBe(1);
  expect(r.stdout).toContain('error  DT001');
  expect(r.stdout).toContain('DT010');
});
it('json has inputs, score, summary', () => {
  const r = cli('check', 'test/fixtures/bad.json', '--pack', 'cn', '--format', 'json');
  const out = JSON.parse(r.stdout);
  expect(r.status).toBe(1);
  expect(out.version).toBe(JSON.parse(readFileSync('package.json', 'utf8')).version);
  expect(out.inputs[0].score).toBeLessThan(100);
  expect(out.summary.errors).toBeGreaterThan(0);
});
it('only and disable', () => {
  expect(cli('check', 'test/fixtures/bad.json', '--only', 'DT003').status).toBe(0);
  expect(
    cli('check', 'test/fixtures/bad.json', '--only', 'DT003', '--max-warnings', '0').status,
  ).toBe(1);
  expect(
    cli(
      'check',
      'test/fixtures/bad.json',
      '--only',
      'DT003',
      '--disable',
      'DT003',
      '--max-warnings',
      '0',
    ).status,
  ).toBe(0);
});
it('usage and unreadable input exit two', () => {
  for (const args of [
    [],
    ['check'],
    ['check', 'absent.json'],
    ['check', 'test/fixtures/bad.json', '--pack', 'bad'],
    ['check', 'test/fixtures/good.json', '--only', 'DT099'],
    ['check', 'test/fixtures/good.json', '--max-warnings', '-1'],
    ['tokens'],
    ['rules', '--nope', 'x'],
  ])
    expect(cli(...args).status).toBe(2);
});
it('browser error explains CHROME_PATH', () => {
  const r = spawnSync(process.execPath, ['dist/cli.js', 'check', 'test/fixtures/dashboard.html'], {
    encoding: 'utf8',
    env: { ...process.env, CHROME_PATH: '/missing/chromium' },
  });
  expect(r.status).toBe(2);
  expect(r.stderr).toContain('CHROME_PATH');
});
it('rules lists every id', () => {
  const r = cli('rules');
  expect(r.status).toBe(0);
  for (let i = 1; i <= 38; i++) expect(r.stdout).toContain(`DT${String(i).padStart(3, '0')}`);
  expect(JSON.parse(cli('rules', '--format', 'json').stdout)).toHaveLength(38);
});
it('scopes rules --taste to the pack check will run', () => {
  const globalRules = cli('rules', '--pack', 'global', '--format', 'json');
  const cnRules = cli('rules', '--pack', 'cn', '--format', 'json');
  expect(globalRules.status).toBe(0);
  expect(cnRules.status).toBe(0);
  for (const taste of [
    'saas-dense',
    'exec-brief',
    'ops-wall',
    'global-marketplace',
    'editorial-data',
  ])
    expect(cli('rules', '--taste', taste, '--format', 'json').stdout, taste).toBe(
      globalRules.stdout,
    );
  expect(cli('rules', '--taste', 'cn-ecommerce', '--format', 'json').stdout).toBe(cnRules.stdout);
  expect(cli('rules', '--taste', 'saas-dense').stdout).not.toContain('DT022');
  expect(cli('rules').stdout).toContain('DT022');

  const dir = mkdtempSync(join(tmpdir(), 'dashtaste-rules-'));
  try {
    const page = join(dir, 'cjk.json');
    writeFileSync(
      page,
      JSON.stringify({
        charts: [{ option: {} }],
        texts: [
          {
            selector: '.label',
            text: '销量',
            color: '#111111',
            background: '#ffffff',
            fontSize: 11,
            fontWeight: 400,
          },
        ],
      }),
    );
    const global = JSON.parse(
      cli('check', page, '--taste', 'saas-dense', '--only', 'DT022', '--format', 'json').stdout,
    );
    const cn = JSON.parse(
      cli('check', page, '--taste', 'cn-ecommerce', '--only', 'DT022', '--format', 'json').stdout,
    );
    expect(global.inputs[0].findings).toEqual([]);
    expect(cn.inputs[0].findings.map((finding: { ruleId: string }) => finding.ruleId)).toEqual([
      'DT022',
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
it('tokens output', () => {
  expect(JSON.parse(cli('tokens', '--pack', 'cn', '--mode', 'dark').stdout).bg).toBe('#121212');
  expect(cli('tokens', '--pack', 'global', '--format', 'css').stdout).toContain(
    '--dt-paper: #F4F2EE',
  );
});
it('multiple inputs', () => {
  const out = JSON.parse(
    cli('check', 'test/fixtures/good.json', 'test/fixtures/bad.json', '--format', 'json').stdout,
  );
  expect(out.inputs).toHaveLength(2);
});
it('local package executable', () => {
  const r = spawnSync('npx', ['--no-install', 'dashtaste', 'rules'], {
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: '/tmp/dashtaste-npm-cache' },
  });
  expect(r.status, r.stderr).toBe(0);
  expect(r.stdout).toContain('DT023');
});

for (const command of ['check', 'rules', 'tokens', 'tastes', 'example', 'apply', 'mcp']) {
  it(`prints help for ${command} without requiring input`, () => {
    const result = cli(command, '--help');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`Usage: dashtaste ${command}`);
  });
}
it('prints top-level help', () => {
  expect(cli('--help').status).toBe(0);
});

it('lists tastes and prints a passing example', () => {
  const listed = cli('tastes');
  expect(listed.status, listed.stderr).toBe(0);
  for (const name of [
    'saas-dense',
    'exec-brief',
    'ops-wall',
    'cn-ecommerce',
    'global-marketplace',
    'editorial-data',
  ])
    expect(listed.stdout).toContain(name);
  const tokens = cli('tokens', '--taste', 'editorial-data', '--format', 'json');
  expect(tokens.status, tokens.stderr).toBe(0);
  expect(JSON.parse(tokens.stdout).id).toBe('editorial-data');
  expect(JSON.parse(tokens.stdout).rules).toContain('story annotations');
  const example = cli('example', '--taste', 'ops-wall');
  expect(example.status, example.stderr).toBe(0);
  expect(JSON.parse(example.stdout).backgroundColor).toBe('#101614');
  const checked = cli(
    'check',
    'test/fixtures/tastes/editorial-data.json',
    '--taste',
    'editorial-data',
    '--format',
    'json',
  );
  expect(checked.status, checked.stderr).toBe(0);
  expect(JSON.parse(checked.stdout).summary.score).toBe(100);
  expect(JSON.parse(checked.stdout).taste).toBe('editorial-data');
  expect(cli('check', 'test/fixtures/tastes/rainbow.json', '--taste', 'exec-brief').status).toBe(1);
  expect(
    cli('check', 'test/fixtures/good.json', '--pack', 'global', '--taste', 'ops-wall').status,
  ).toBe(2);
  expect(cli('example').status).toBe(2);
  expect(cli('check', 'test/fixtures/good.json', '--taste', 'nope').status).toBe(2);
  expect(cli('mcp', '--extra').status).toBe(2);
});

it('pluralises each summary count independently', () => {
  expect(cli('check', 'test/fixtures/bad.json', '--only', 'DT010,DT003').stdout).toContain(
    '1 error, 1 warning · score 87/100',
  );
  expect(
    cli('check', 'test/fixtures/bad.json', 'test/fixtures/bad.json', '--only', 'DT010,DT003')
      .stdout,
  ).toContain('2 errors, 2 warnings · score 74/100');
  expect(
    cli(
      'check',
      'test/fixtures/bad.json',
      'test/fixtures/bad.json',
      'test/fixtures/bad.json',
      '--only',
      'DT003',
    ).stdout,
  ).toContain('0 errors, 3 warnings · score 91/100');
});

const overlayPath = 'test/fixtures/pack-overlay-cn.json';
it('loads pack-file tokens and uses extends for metadata and check JSON', () => {
  const tokens = cli('tokens', '--pack-file', overlayPath);
  expect(tokens.status, tokens.stderr).toBe(0);
  expect(JSON.parse(tokens.stdout).brand).toBe('#663399');
  expect(
    cli('tokens', '--pack-file', overlayPath, '--mode', 'dark', '--format', 'css').stdout,
  ).toContain('--dt-brand: #BB99EE');
  expect(cli('rules', '--pack-file', overlayPath, '--format', 'json').stdout).toBe(
    cli('rules', '--pack', 'cn', '--format', 'json').stdout,
  );
  const result = cli(
    'check',
    'test/fixtures/good.json',
    '--pack',
    'global',
    '--pack-file',
    overlayPath,
    '--format',
    'json',
  );
  expect(result.status, result.stderr).toBe(0);
  expect(JSON.parse(result.stdout)).toMatchObject({ pack: 'cn', packFile: 'cn-focused' });
});

it('invalid pack files exit two with useful stderr', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dashtaste-packs-'));
  try {
    for (const [name, content, message] of [
      ['missing.json', undefined, 'ENOENT'],
      ['bad.json', '{', 'JSON'],
      ['extends.json', '{"id":"x"}', 'extends'],
      [
        'categorical.json',
        '{"id":"x","extends":"cn","tokens":{"light":{"categorical":[]}}}',
        'categorical',
      ],
      ['disable.json', '{"id":"x","extends":"cn","disable":["DT999"]}', 'unknown rule'],
    ] as const) {
      const path = join(dir, name);
      if (content !== undefined) writeFileSync(path, content);
      const result = cli('tokens', '--pack-file', path);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('pack-file');
      expect(result.stderr).toContain(message);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
