import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { check, emptyChartsNote, review, ruleset } from '../src/engine.js';
import type { Option } from '../src/types.js';

/** Synthetic bar and line. Not a captured customer dashboard. */
function mixed(): Option {
  return {
    animation: false,
    backgroundColor: '#ffffff',
    legend: { show: false },
    yAxis: { type: 'value', min: 0, scale: false, name: 'Orders' },
    xAxis: { type: 'category', data: ['Mon', 'Tue'] },
    series: [
      {
        type: 'bar',
        name: 'Orders',
        data: [12, 18],
        barMaxWidth: 16,
        itemStyle: { color: '#B65A08' },
      },
      {
        type: 'line',
        name: 'Target',
        data: [10, 14],
        showSymbol: false,
        smooth: false,
        lineStyle: { width: 2, color: '#243635' },
        itemStyle: { color: '#243635' },
      },
    ],
  };
}

describe('review', () => {
  it('keeps a ruleset apart from the package version and does not change the option', () => {
    const option = mixed();
    const before = JSON.stringify(option);
    const report = review(option, { taste: 'saas-dense' });
    expect(JSON.stringify(option)).toBe(before);
    expect(report.ruleset).toBe(ruleset);
    expect(report.ruleset).toBe('dt-2026.2');
    expect(report.chartsReviewed).toBe(1);
    expect(report.note).toBeUndefined();
    expect(report.ruleset).not.toBe(JSON.parse(readFileSync('package.json', 'utf8')).version);
    expect(report.taste).toBe('saas-dense');
    expect(report.pack).toBe('global');
    expect(report.mode).toBe('light');
    expect(report.findings).toEqual([]);
    expect(report.score).toBe(100);
    expect(report.ran).not.toContain('DT022');
    expect(report.ran).toContain('DT030');
    expect(review(option, { taste: 'cn-ecommerce' }).ran).toContain('DT022');
    expect(JSON.stringify(review(option, { taste: 'saas-dense' }))).toBe(JSON.stringify(report));
    expect(check(option, { taste: 'saas-dense' })).toEqual(report.findings);
  });

  it('treats a smooth line as advice and keeps the taste finding separate', () => {
    const option = mixed();
    option.animation = true;
    const line = (option.series as Option[])[1];
    line.smooth = true;
    const report = review(option, { taste: 'saas-dense' });
    expect(report.findings.find((finding) => finding.ruleId === 'DT003')).toMatchObject({
      name: 'smooth-line',
      basis: 'heuristic',
      severity: 'warn',
      path: 'charts[0].series[1]',
      message: 'smooth line',
    });
    expect(report.findings.find((finding) => finding.ruleId === 'DT034')).toMatchObject({
      name: 'taste-motion',
      basis: 'taste',
      severity: 'warn',
      path: 'charts[0]',
      message: 'animation is on',
      fix: 'set animation: false',
    });
    expect(report.findings.some((finding) => finding.basis === 'constraint')).toBe(false);
    expect(report.score).toBe(
      100 - 3 * report.findings.filter((f) => f.severity === 'warn').length,
    );
    for (const finding of report.findings) {
      expect(finding.path.length).toBeGreaterThan(0);
      expect(finding.fix.length).toBeGreaterThan(0);
      expect(finding.name.length).toBeGreaterThan(0);
    }
  });

  it('applies disable and only without running a rule outside the pack', () => {
    const option = mixed();
    (option.series as Option[])[1].smooth = true;
    expect(
      review(option, { taste: 'saas-dense', disable: ['DT003'] }).findings.map((f) => f.ruleId),
    ).not.toContain('DT003');
    expect(review(option, { taste: 'saas-dense', only: ['DT003'] }).ran).toEqual(['DT003']);
    expect(review(option, { taste: 'saas-dense', only: ['DT022'] }).ran).toEqual([]);
    expect(() => check(option, { only: ['DT099', 'NOPE', 'DT099'] })).toThrow(
      'unknown rule in only: DT099, NOPE',
    );
    expect(() => review(option, { disable: ['NOPE'] })).toThrow('unknown rule in disable: NOPE');
  });

  it('does not call formatter functions or overflow on a cyclic option', () => {
    const option = mixed();
    let calls = 0;
    option.yAxis = {
      type: 'value',
      min: 0,
      scale: false,
      name: 'Orders',
      axisLabel: {
        formatter() {
          calls += 1;
          return '1';
        },
      },
    };
    expect(check(option, { taste: 'saas-dense' })).toEqual([]);
    expect(calls).toBe(0);
    const cyclic = mixed();
    (cyclic.series as Option[])[0].loop = cyclic;
    expect(() => check(cyclic, { only: ['DT007'] })).not.toThrow();
  });

  it('keeps a score of 100 for an empty list and says no charts were reviewed', () => {
    const report = review([], { taste: 'saas-dense' });
    expect(report.score).toBe(100);
    expect(report.findings).toEqual([]);
    expect(report.chartsReviewed).toBe(0);
    expect(report.note).toBe(emptyChartsNote);
    expect(report.summary.score).toBe(100);
  });
});
