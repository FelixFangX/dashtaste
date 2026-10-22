import { it, expect } from 'vitest';
import { formatCompact, formatPercent, formatDelta, formatDate } from '../src/format.js';
import { score } from '../src/engine.js';
it('compact global', () => {
  expect([1200, 3400000, 5600000000].map((n) => formatCompact(n, 'global'))).toEqual([
    '1.2K',
    '3.4M',
    '5.6B',
  ]);
  expect(formatCompact(-1200, 'global')).toBe('-1.2K');
});
it('compact cn', () => {
  expect(formatCompact(12300, 'cn')).toBe('1.23万');
  expect(formatCompact(456000000, 'cn')).toBe('4.56亿');
  expect(formatCompact(9999, 'cn')).toBe('9999');
});
it('invalid formatting', () => {
  expect(formatCompact(Infinity, 'cn')).toBe('–');
  expect(formatPercent(NaN)).toBe('–');
  expect(formatDate('bad')).toBe('–');
});
it('percent and explicit date', () => {
  expect(formatPercent(0.072)).toBe('7.2%');
  expect(formatDate(new Date(2026, 0, 2), 'cn')).toBe('2026-01-02');
});
it('deltas and switches', () => {
  expect(formatDelta(107.2, 100, 'global')).toEqual({
    text: '▲ 7.2%',
    direction: 'up',
    color: '#2F7D4F',
  });
  expect(formatDelta(90, 100, 'cn')).toEqual({
    text: '▼ 10.0%',
    direction: 'down',
    color: '#167D4F',
  });
  expect(formatDelta(101, 100, 'cn', { deltaColors: 'green-up', label: '同比' }).text).toBe(
    '同比 ▲ 1.0%',
  );
  expect(formatDelta(101, 100, 'cn', { deltaColors: 'green-up' }).color).toBe('#167D4F');
});
it('flat and invalid deltas', () => {
  expect(formatDelta(1, 1, 'cn').direction).toBe('flat');
  expect(formatDelta(1, 1, 'cn').text).toBe('0.0%');
  for (const [a, b] of [
    [1, 0],
    [NaN, 1],
    [Infinity, 1],
  ])
    expect(formatDelta(a, b, 'global').text).toBe('–');
});
it('score floors at zero', () => {
  expect(score([])).toBe(100);
  expect(score(Array(11).fill({ severity: 'error' }))).toBe(0);
});
