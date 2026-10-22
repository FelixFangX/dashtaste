import { beforeAll, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
beforeAll(() => {
  execFileSync('node', ['node_modules/typescript/bin/tsc']);
});
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
  expect(out.version).toBe('0.0.1');
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
  for (let i = 1; i <= 28; i++) expect(r.stdout).toContain(`DT${String(i).padStart(3, '0')}`);
  expect(JSON.parse(cli('rules', '--format', 'json').stdout)).toHaveLength(28);
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

for (const command of ['check', 'rules', 'tokens']) {
  it(`prints help for ${command} without requiring input`, () => {
    const result = cli(command, '--help');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`Usage: dashtaste ${command}`);
  });
}
it('prints top-level help', () => {
  expect(cli('--help').status).toBe(0);
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
