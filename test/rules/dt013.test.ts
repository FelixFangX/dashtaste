import { describe, it, expect } from 'vitest';
import { check } from '../../src/index.js';
import { getTokens } from '../../src/packs/index.js';

describe('DT013', () => {
  const [flagged, passing] = [
    { charts: [], deltas: [{ selector: '#delta', text: '▲ 3%', color: '#B4413A' }] },
    { charts: [], deltas: [{ selector: '#delta', text: '▲ 3%', color: '#2F7D4F' }] },
  ];
  it('flags a red upward global delta', () => {
    expect(check(flagged, { pack: 'global', only: ['DT013'] }).length).toBeGreaterThan(0);
  });
  it('passes a green upward global delta', () => {
    expect(check(passing, { pack: 'global', only: ['DT013'] })).toEqual([]);
  });
  for (const pack of ['global', 'cn'] as const) {
    it('passes an empty option for ' + pack, () => {
      expect(check({}, { pack, only: ['DT013'] })).toEqual([]);
    });
    it('passes missing series and object or array data for ' + pack, () => {
      for (const option of [
        { title: { text: 'Count' } },
        { series: { type: 'bar', data: [{ value: 2 }, [1, 3], 4] } },
      ]) {
        expect(check(option, { pack, only: ['DT013'] })).toEqual([]);
      }
    });
  }
});

for (const pack of ['global', 'cn'] as const) {
  for (const mode of ['light', 'dark'] as const) {
    for (const convention of [undefined, 'by-polarity'] as const) {
      it(`validates lower-is-better deltas for ${pack}/${mode}/${convention}`, () => {
        const tokens = getTokens(pack, mode);
        for (const direction of ['up', 'down'] as const) {
          const red = pack === 'cn' ? tokens.up : tokens.down;
          const green = pack === 'cn' ? tokens.down : tokens.up;
          const expected = direction === 'up' ? red : green;
          const facts = {
            charts: [],
            page: { deltaColors: convention },
            deltas: [
              {
                selector: '#churn',
                text: direction === 'up' ? '▲ 4.3%' : '▼ 4.3%',
                color: expected,
                polarity: 'lower-is-better' as const,
              },
            ],
          };
          expect(check(facts, { pack, mode, only: ['DT013'] })).toEqual([]);
          facts.deltas[0].color = expected === red ? green : red;
          expect(check(facts, { pack, mode, only: ['DT013'] })).toHaveLength(1);
        }
      });
    }
  }
}
