import type { Rule } from '../types.js';
import { asArray, rule, charts, background } from './helpers.js';
import { contrast } from '../color.js';

function contrastThreshold(fontSize = 0, fontWeight: string | number = 400): number {
  const isBold = fontWeight === 'bold' || (typeof fontWeight === 'number' && fontWeight >= 700);
  return fontSize >= 24 || (fontSize >= 18.66 && isBold) ? 3 : 4.5;
}

/** Text needs 4.5:1; at least 24px or 18.66px bold needs 3:1. Chart label defaults use 4.5:1. */
export const dt015: Rule = rule(
  15,
  'low-contrast-text',
  'error',
  'Text needs 4.5:1; at least 24px or 18.66px bold needs 3:1. Chart label defaults use 4.5:1.',
  'increase text contrast against its background',
  function check(facts, context, emit) {
    for (const text of facts.texts ?? []) {
      const limit = contrastThreshold(text.fontSize, text.fontWeight);
      if (contrast(text.color, text.background) < limit) emit(text.selector);
    }
    charts(facts, (option, path) => {
      for (const [key, entries] of [
        ['xAxis', asArray(option.xAxis)],
        ['yAxis', asArray(option.yAxis)],
        ['legend', asArray(option.legend)],
      ] as const)
        entries.forEach((entry, index) => {
          const style = key === 'legend' ? entry.textStyle : entry.axisLabel;
          if (
            typeof style?.color === 'string' &&
            contrast(style.color, background(facts, context, option)) <
              contrastThreshold(style.fontSize, style.fontWeight)
          )
            emit(`${path}.${key}[${index}]`);
        });
    });
  },
);
