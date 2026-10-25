import type { Rule, Option } from '../types.js';
import { rule, charts, asArray } from './helpers.js';

function titleText(option: Option): string {
  const title = option.title as unknown;
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object' && 'text' in title) {
    const text = (title as { text?: unknown }).text;
    return typeof text === 'string' ? text : '';
  }
  return '';
}

/** Helper sentences under KPIs and chart titles that narrate the chart repeat visible structure. */
export const dt029: Rule = rule(
  29,
  'helper-captions',
  'warn',
  'Helper sentences under KPIs and chart titles that narrate the chart repeat visible structure.',
  'remove the helper sentence; keep the metric label and value only',
  function check(facts, context, emit) {
    for (const entry of facts.helpers ?? []) emit(entry.selector);
    charts(facts, (option, path) => {
      const text = titleText(option);
      if (/this chart shows|shows the|本图显示|该图展示|此图显示/i.test(text)) emit(`${path}.title`);
    });
  },
);
