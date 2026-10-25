import { getResolvedPack } from '../packs/index.js';
import type { Rule } from '../types.js';
import { rule } from './helpers.js';

/** CJK text must be at least 12px. */
export const dt022: Rule = rule(
  22,
  'cjk-min-size',
  'warn',
  'CJK text must be at least 12px.',
  'set CJK text to at least 12px',
  function check(facts, context, emit) {
    for (const text of facts.texts ?? [])
      if (
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(
          text.text,
        ) &&
        text.fontSize < getResolvedPack(context).limits.cjkMinFontSize
      )
        emit(text.selector);
  },
  true,
);
