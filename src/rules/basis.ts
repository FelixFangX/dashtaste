import type { RuleBasis } from '../types.js';

/**
 * The only place a rule's basis is decided. `rule()` has no default.
 * A new id that is missing here throws when the registry loads.
 * Severity is not this map: an error can still be advice.
 */
export const ruleBasis: Record<string, { basis: RuleBasis; rationale: string }> = {
  DT001: {
    basis: 'heuristic',
    rationale: 'ECharts default colours are a theme. Using them does not make the series false.',
  },
  DT002: {
    basis: 'heuristic',
    rationale: 'Many hues are harder to separate. The chart can still encode the categories.',
  },
  DT003: {
    basis: 'heuristic',
    rationale:
      'Smoothing can be a legitimate interpolation. A hit is not proof the chart invented data.',
  },
  DT004: {
    basis: 'heuristic',
    rationale: 'Point markers are a density choice. A marked series can still be the right chart.',
  },
  DT005: {
    basis: 'heuristic',
    rationale: 'A slice cap is a reading aid, not a ban on pies.',
  },
  DT006: {
    basis: 'heuristic',
    rationale: 'Preferring bars is a recommendation. One pie can be the right comparison.',
  },
  DT007: {
    basis: 'heuristic',
    rationale:
      'A 3D mark often distorts a 2D comparison, and it is valid for some spatial data. Severity stays error.',
  },
  DT008: {
    basis: 'heuristic',
    rationale: 'Two value axes can be the right pair of units.',
  },
  DT009: {
    basis: 'heuristic',
    rationale: 'A unitless index is a valid axis. Naming the unit is advice.',
  },
  DT010: {
    basis: 'constraint',
    rationale:
      'A bar encodes amount by length from zero. A positive min or scale:true changes that ratio.',
  },
  DT011: {
    basis: 'heuristic',
    rationale: 'Compact formatting is easier to read. The raw values are still the data.',
  },
  DT012: {
    basis: 'heuristic',
    rationale: '万/亿 versus K/M is the selected pack convention, not a universal unit.',
  },
  DT013: {
    basis: 'heuristic',
    rationale:
      'Up and down colours follow a pack or page convention, not a physical fact. Severity stays error.',
  },
  DT014: {
    basis: 'constraint',
    rationale: 'The extracted delta uses hue alone, with no arrow or sign.',
  },
  DT015: {
    basis: 'constraint',
    rationale:
      'Text contrast is below 4.5:1, or below 3:1 for large or bold text, against the colour this rule compares.',
  },
  DT016: {
    basis: 'constraint',
    rationale: 'The line colour is below 3:1 against the chart background.',
  },
  DT017: {
    basis: 'heuristic',
    rationale: 'A gradient is decoration, not a broken encoding.',
  },
  DT018: {
    basis: 'heuristic',
    rationale: 'Glow is decoration.',
  },
  DT019: {
    basis: 'taste',
    rationale:
      "The cap is the selected taste's max KPIs, or a tighter overlay. It is not a universal limit.",
  },
  DT020: {
    basis: 'heuristic',
    rationale: 'Several accent colours compete. They do not make a number false.',
  },
  DT021: {
    basis: 'heuristic',
    rationale: 'Emoji are inconsistent iconography, not invalid text.',
  },
  DT022: {
    basis: 'heuristic',
    rationale: "12px is this pack's CJK floor, not a universal type minimum.",
  },
  DT023: {
    basis: 'heuristic',
    rationale: 'A one-series legend repeats the title. It is still a valid legend.',
  },
  DT024: {
    basis: 'heuristic',
    rationale: 'The pixel cap is a layout preference.',
  },
  DT025: {
    basis: 'heuristic',
    rationale: 'Direct labels are a recommendation for two to four lines.',
  },
  DT026: {
    basis: 'heuristic',
    rationale: 'Widths outside 1–3px are a house range.',
  },
  DT027: {
    basis: 'heuristic',
    rationale: 'Tabular figures help alignment. Proportional figures are still the numbers.',
  },
  DT028: {
    basis: 'heuristic',
    rationale: 'A size hierarchy is advice about emphasis.',
  },
  DT029: {
    basis: 'heuristic',
    rationale: 'A narrating caption is redundant here. It is not a false statement.',
  },
  DT030: {
    basis: 'taste',
    rationale: 'Every named taste treats a rainbow palette as an error for that school.',
  },
  DT031: {
    basis: 'taste',
    rationale: "Chart count is compared with the selected taste's cap.",
  },
  DT032: {
    basis: 'taste',
    rationale: "Series count is compared with the selected taste's cap.",
  },
  DT033: {
    basis: 'taste',
    rationale: "Annotation count is compared with the selected taste's range.",
  },
  DT034: {
    basis: 'taste',
    rationale: 'Motion on or off follows the selected taste.',
  },
  DT035: {
    basis: 'taste',
    rationale: "Background luminance is compared with the selected taste's ground.",
  },
  DT036: {
    basis: 'taste',
    rationale: 'A currency mark is required only by tastes that ask for one.',
  },
  DT037: {
    basis: 'taste',
    rationale: 'Funnel count and stage order follow the selected taste.',
  },
  DT038: {
    basis: 'taste',
    rationale: "Colour and hue caps are the selected taste's, and can be tighter than DT002.",
  },
};
