# Tokens

Use ink and muted for body text on the listed surfaces. Accent colours are for marks and deltas; they are not body text colours. Hairlines are decorative separators.

## light

| Token               | Hex     |
| ------------------- | ------- |
| light.paper         | #FAFAF7 |
| light.ink           | #1B1B18 |
| light.muted         | #6B6B63 |
| light.hairline      | #E7E5DE |
| light.brand         | #2B4C7E |
| light.other         | #B9B7AE |
| light.up            | #2F7D4F |
| light.down          | #B4413A |
| light.categorical.0 | #2B4C7E |
| light.categorical.1 | #C2703D |
| light.categorical.2 | #8E6C8A |
| light.categorical.3 | #A7C4D9 |
| light.categorical.4 | #E2A55C |
| light.sequential.0  | #E5EDF5 |
| light.sequential.1  | #BDCEE2 |
| light.sequential.2  | #8CA8CA |
| light.sequential.3  | #4E719F |
| light.sequential.4  | #2B4C7E |

## dark

| Token              | Hex     |
| ------------------ | ------- |
| dark.paper         | #141412 |
| dark.ink           | #ECEAE3 |
| dark.muted         | #9A988F |
| dark.hairline      | #2B2A26 |
| dark.brand         | #7FA3D9 |
| dark.other         | #5E5C55 |
| dark.up            | #6CC08B |
| dark.down          | #E2857E |
| dark.categorical.0 | #7FA3D9 |
| dark.categorical.1 | #E0975F |
| dark.categorical.2 | #E8CF82 |
| dark.categorical.3 | #C9707E |
| dark.categorical.4 | #A3D0E6 |

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

Use paper for both page and chart surfaces. Separate sections with hairlines.
