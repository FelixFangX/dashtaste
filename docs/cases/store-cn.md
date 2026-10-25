# Case: retail store (cn, light)

**Audience:** Chinese retail / ops dashboard  
**Pack:** `cn` · **Mode:** light · **Viewport:** 1440×900  
**Source:** [gallery/pages/store](../../gallery/pages/store/) · scores in [results.json](../../gallery/results.json)

Unguided agent defaults tend to look like a template: rainbow series, smooth lines, pie overload, equal-sized KPIs, and filler helper sentences under each metric. This pair uses the same fictional seed data; only the style changes.

## Scores

| Variant | Errors | Warnings | Score |
| ------- | ------ | -------- | ----- |
| before  | 47     | 71       | 0     |
| after   | 0      | 0        | 100   |

Before rule IDs (from `results.json`): DT001, DT002, DT003, DT004, DT005, DT008, DT009, DT010, DT013, DT015, DT016, DT017, DT018, DT021, DT022, DT023, DT024, DT027, DT028, DT029.

## What the before page trips on

Concrete smells that show up in the check (not an exhaustive list):

- **DT002 / DT001** — rainbow / default palette on series
- **DT003** — smooth lines instead of straight segments
- **DT005** — too many pie slices (prefer bars or an Other bucket)
- **DT010** — bar axis not baseline-zero
- **DT028** — no clear hero metric (everything the same size)
- **DT029** — AI-default KPI helper captions under the numbers

## What after applies (cn pack)

From the pack table in the README, after is built to cn conventions rather than global defaults:

- Red-up / green-down deltas; wan / yi units where large numbers appear
- Flat KPI cards with period-over-period and year-over-year rows
- One hero metric sized well above the rest (DT028)
- No decorative glow / gradient chrome (DT017, DT018)
- Helper captions removed or replaced with real context only (DT029)

After score 100 means these rules are satisfied for this HTML page. It is not a claim about conversion, readability studies, or production traffic.

## Images

| Before | After | Side-by-side |
| ------ | ----- | ------------ |
| ![before](../../gallery/store-before.png) | ![after](../../gallery/store-after.png) | [wide compare](../../gallery/compare/store-wide.png) |

## Reproduce

From a checkout (build once if `dist/` is missing):

```sh
pnpm build
node dist/cli.js check gallery/pages/store/before.html --pack cn
node dist/cli.js check gallery/pages/store/after.html --pack cn
```

Or against published CLI:

```sh
npx dashtaste check gallery/pages/store/before.html --pack cn
```

HTML checks need a local Chromium (`CHROME_PATH`). Rule reasons: [docs/rules.md](../rules.md).
