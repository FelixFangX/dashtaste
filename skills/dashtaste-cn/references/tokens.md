# Tokens

Use ink and muted for body text on the listed surfaces. Accent colours are for marks and deltas; they are not body text colours. Hairlines are decorative separators.

## light

| Token               | Hex     |
| ------------------- | ------- |
| light.page          | #F6F7F9 |
| light.card          | #FFFFFF |
| light.hairline      | #E6E8EC |
| light.ink           | #1D2433 |
| light.muted         | #5F6B7E |
| light.brand         | #2A62D9 |
| light.other         | #B9B7AE |
| light.up            | #D93A3A |
| light.down          | #167D4F |
| light.flat          | #5F6B7E |
| light.categorical.0 | #2A62D9 |
| light.categorical.1 | #36B3C2 |
| light.categorical.2 | #F0A33C |
| light.categorical.3 | #2E3F66 |
| light.categorical.4 | #B9CFF5 |
| light.categorical.5 | #A8673A |

## dark

| Token              | Hex     |
| ------------------ | ------- |
| dark.bg            | #0B1220 |
| dark.panel         | #111A2B |
| dark.hairline      | #1F2A3D |
| dark.ink           | #E6EBF5 |
| dark.muted         | #8C99B0 |
| dark.brand         | #4F8CFF |
| dark.other         | #5E5C55 |
| dark.up            | #FF6B6B |
| dark.down          | #3CCB86 |
| dark.flat          | #8C99B0 |
| dark.categorical.0 | #4F8CFF |
| dark.categorical.1 | #3FD0D4 |
| dark.categorical.2 | #FFD27A |
| dark.categorical.3 | #2D4E8F |
| dark.categorical.4 | #E38A5D |

## Typography and spacing

| Role                     | Size | Weight |
| ------------------------ | ---- | ------ |
| Page title               | 24px | 600    |
| Section title            | 18px | 600    |
| Body and control         | 14px | 400    |
| Axis and secondary label | 12px | 400    |
| KPI value                | 32px | 600    |
| KPI unit                 | 14px | 400    |

Use `system-ui, sans-serif`. Use tabular numerals for numeric columns.
Space on a 4px grid: 4, 8, 12, 16, 24, 32px.
Use 24px page padding, 16px section gaps, and 16px panel padding.
Radius: 0px for charts, 4px for controls, at most 6px for cards.
Borders: 1px solid hairline. Shadows: none.
Use ink for primary text; muted for secondary text on the listed surfaces.
Use brand for a single measured series, selection, and keyboard focus.
Use categorical colours only to distinguish independent series or categories.
Keep category-to-colour mappings stable across the page and across filters.
Use other grey for a grouped tail or a de-emphasised comparison, never missing data.
Use up/down only for directional comparisons; flat values use muted.
Hairline and other are not body text colours.
Use the lightest sequential colour for low values and darkest for high values.
Do not interpolate categorical colours into a sequential scale.
Line colours need 3:1 against their surface; pale categorical marks suit bars.
Text needs 4.5:1, or 3:1 at 24px or 18.66px bold.
Do not assume an accent colour is suitable for small text.

Dark screen: use bg for the canvas and panel for regions.
Use a 1920×1080 artboard, 16px body, and 40–56px KPI values.
