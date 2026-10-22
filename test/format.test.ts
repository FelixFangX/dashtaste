import { it, expect } from 'vitest';
import { formatCompact, formatPercent, formatDelta, formatDate } from '../src/format.js';
import { score } from '../src/engine.js';
it('compact global', () => {
  expect([1200, 3400000, 5600000000].map((n) => formatCompact(n, 'global'))).toEqual([
    '1,200',
    '3.4M',
    '5.6B',
  ]);
  expect(formatCompact(-1200, 'global')).toBe('-1,200');
});
it('groups counts below 10,000 in both packs', () => {
  for (const pack of ['global', 'cn'] as const) expect(formatCompact(2007, pack)).toBe('2,007');
});
it('compact cn', () => {
  expect(formatCompact(12300, 'cn')).toBe('1.23万');
  expect(formatCompact(456000000, 'cn')).toBe('4.56亿');
  expect(formatCompact(9999, 'cn')).toBe('9,999');
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
    color: '#107451',
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

it('keeps fixed decimals and full grouped counts when requested', () => {
  expect(formatCompact(147000, 'cn', { minimumFractionDigits: 2 })).toBe('14.70万');
  expect(formatCompact(299.6, 'cn', { minimumFractionDigits: 2 })).toBe('299.60');
  expect(formatCompact(1998, 'global', { compactFrom: 10000 })).toBe('1,998');
  expect(formatCompact(10000, 'global', { compactFrom: 10000 })).toBe('10K');
});

for (const pack of ['global', 'cn'] as const) {
  for (const mode of ['light', 'dark'] as const) {
    it(`applies metric polarity with the ${pack}/${mode} convention`, () => {
      for (const [current, direction] of [
        [110, 'up'],
        [90, 'down'],
      ] as const) {
        const normal = formatDelta(current, 100, pack, { mode });
        const lower = formatDelta(current, 100, pack, { mode, polarity: 'lower-is-better' });
        expect(lower.direction).toBe(direction);
        expect(lower.text).toBe(normal.text);
        expect(lower.color === normal.color).toBe(pack === 'cn');
        const semantic = formatDelta(current, 100, pack, {
          mode,
          polarity: 'lower-is-better',
          deltaColors: 'by-polarity',
        });
        expect(semantic.color).toBe(
          formatDelta(current === 110 ? 90 : 110, 100, pack, { mode, deltaColors: 'green-up' })
            .color,
        );
      }
    });
  }
}
