# Usage

Build with Node 20.19 or newer and pnpm:

```sh
pnpm install
pnpm build
npx dashtaste --help
```

## Check options

```sh
npx dashtaste check options.json --taste saas-dense
npx dashtaste check first.json second.json --taste cn-ecommerce --format json
npx dashtaste check options.json --pack cn --mode dark --max-warnings 0
```

`--taste` selects a named school. `--pack global` is `saas-dense`. `--pack cn` is `cn-ecommerce`.
Passing both is an error when they name different schools. With neither flag, the taste is `saas-dense`.

Input may be one ECharts option, an array of options, or a page facts envelope:

```json
{
  "charts": [{ "id": "orders", "option": { "series": [] } }],
  "page": { "background": "#FFFFFF", "deltaColors": "red-up" }
}
```

Page facts may also contain texts, gradients, shadows, kpis, deltas, and emojis.
An option-only input cannot test computed page typography or CSS decoration.
See the exported types for each fact shape.

Defaults are the saas-dense taste (the global pack), light mode, text output, and unlimited warnings.
Errors always fail. `--max-warnings 0` also fails on any warning.
Informational findings lower the score but do not fail a check.

## Pack files

Use `--pack-file path.json` with `check`, `rules`, or `tokens` to extend a built-in
pack. The JSON schema requires `id` (non-empty string) and `extends` (`global` or
`cn`). Optional fields are `description` (string), `limits` (partial numeric
`maxPieSlices`, `maxRoseSlices`, `maxKpis`, `cjkMinFontSize`), `tokens` (partial
`light`/`dark` token objects), and `disable` (existing rule ID array).
Limits are non-negative finite numbers. Token values are strings; `categorical`
and `sequential` must be non-empty string arrays when present.

```sh
npx dashtaste check dashboard.json --pack-file examples/pack-overlay-cn.json
npx dashtaste tokens --pack-file examples/pack-overlay-cn.json --mode dark
```

The file's `extends` takes precedence over `--pack`. Limits and tokens merge onto
a clone of the base pack; arrays replace base arrays. Overlay disables combine
with `--disable`. `rules` lists base-pack metadata, including disabled rules.
JSON checks add `packFile` with the overlay id and keep `pack` as the base name.
Invalid pack files exit 2 with a diagnostic on stderr.
See [Pack overlays](packs.md) for an example and distribution details.

## Check rendered pages

```sh
CHROME_PATH=/path/to/chromium npx dashtaste check dashboard.html --pack cn
CHROME_PATH=/path/to/chromium npx dashtaste check http://localhost:3000 --pack global
```

HTML mode needs Playwright's core package and a Chromium executable.
It reads mounted ECharts instances through `window.echarts` after network idle
and a 500ms settling interval. Render charts before that point.
It collects visible text, composited backgrounds, decoration, KPIs, and deltas.
Use `data-kpi`, `data-delta`, and `data-direction="up|down|flat"` for explicit facts.
Set `data-delta-colors="red-up|green-up"` on the document element to override
one page's comparison convention. Keep every directional delta consistent.
The extractor inspects visible DOM text; canvas text is checked through options.

## Flags and exit codes

| Flag             | Commands      | Values                                         |
| ---------------- | ------------- | ---------------------------------------------- |
| `--pack-file`    | all           | path to a JSON overlay                         |
| `--taste`        | all           | one of the six taste ids                       |
| `--pack`         | all           | `global` (`saas-dense`), `cn` (`cn-ecommerce`) |
| `--mode`         | check, tokens | `light`, `dark`                                |
| `--format`       | check, rules  | `text`, `json`                                 |
| `--format`       | tokens        | `json`, `css`                                  |
| `--max-warnings` | check         | non-negative integer                           |
| `--only`         | check         | comma-separated rule IDs                       |
| `--disable`      | check         | comma-separated rule IDs                       |
| `--background`   | check         | three- or six-digit hex colour                 |
| `--help`         | all           | command-specific usage                         |

`--disable` takes precedence over `--only`. Unknown rule IDs are input errors, and the message names each unknown id.
`--background` overrides chart, page, and pack backgrounds for contrast checks.
`tokens` requires `--taste`, `--pack`, or `--pack-file`. `--taste` prints tokens plus the composition rules. `--pack` still prints that pack's colours.

Exit 0 means no errors and warnings within the selected limit.
Exit 1 means errors or too many warnings.
Exit 2 means invalid arguments, unreadable input, or unavailable extraction.
Set `NO_COLOR` to suppress ANSI colour in text output.
JSON output contains version, ruleset, pack, taste, mode, ran, per-input findings, chartsReviewed, and summary.
`ruleset` (`dt-2026.2`) versions rule behavior. It does not change when the npm package version changes, and a package bump does not by itself change it. `dt-2026.1` is not a runnable engine.
`test/fixtures/ruleset/dt-2026.2.json` is the reviewed baseline. The test runs `review()` on those synthetic cases and compares the JSON, and it compares every rule's id, name, basis, rationale, severity, and packs. It does not hash the source. It fails when the live result differs. Accepting a difference means a new ruleset id and a new file. The file does not cover every branch, captured customer dashboards, browser pixels, or older ruleset ids.
`ran` lists the rule ids that executed, in registry order, after pack, `--disable`, and `--only`. A known id outside the selected pack is skipped. An unknown id is an input error and the message names that id, for example `unknown rule in only: DT099`.
Each finding contains ruleId, name, basis (`constraint`, `heuristic`, or `taste`), severity, message, path, and fix. The rationale lives on the rule, from `dashtaste rules`, not on every finding.
`constraint` is a measured encoding or contrast failure: bar length from a non-zero baseline (DT010), direction by colour alone (DT014), text contrast (DT015), and line contrast (DT016). `heuristic` is presentation advice. A smooth line (DT003) and point markers (DT004) are heuristic: they can be legitimate charts. `taste` is the selected named school, including the KPI cap (DT019) and DT030–DT038. Basis does not change severity or the exit code. The checker does not rewrite series or data.
Score starts at 100: subtract 10 per error, 3 per warning, and 1 per info.
The minimum score is zero. An empty chart list still scores 100, because the score counts findings, and the result adds `chartsReviewed: 0` and `No charts reviewed. The score is not a quality verdict.` A score of 100 with charts reviewed means no findings, not a usability study.

## Inspect metadata and tokens

```sh
npx dashtaste tastes
npx dashtaste rules --pack cn --format json
npx dashtaste tokens --taste editorial-data
npx dashtaste tokens --pack global --mode light
npx dashtaste tokens --pack cn --mode dark --format css
npx dashtaste example --taste ops-wall
npx dashtaste apply --taste saas-dense --out ./taste
npx dashtaste mcp
```

`mcp` starts a stdio server. It exposes `list_tastes`, `taste_tokens`, `taste_example`, `check_taste`, and `apply_taste`. Those tools call the same catalog, checker, and apply bundle as the CLI. The default taste is `saas-dense`. `check_taste` accepts `disable` and `only` as arrays of rule ids.

The cn pack includes screen composition settings for a 1920×1080 artboard.
Screen composition uses dark tokens and `--mode dark`; it is not a third CLI mode.
Pack objects also expose numberSystem, limits, typography, and spacing.
Token output contains only colours for the selected light or dark mode.

## Library and formatting

```ts
import { check, summarize } from 'dashtaste';
import { formatCompact, formatPercent, formatDelta, formatDate } from 'dashtaste/format';

const findings = check({ series: [] }, { pack: 'cn', mode: 'light' });
const summary = summarize(findings);
const amount = formatCompact(12300, 'cn'); // 1.23万
const percent = formatPercent(0.125); // 12.5%
const delta = formatDelta(110, 100, 'cn'); // render text and color together
const date = formatDate(new Date(2026, 9, 21), 'cn'); // 2026-10-21
```

The date helper returns local calendar dates in YYYY-MM-DD form for both packs.
Use an explicit display adapter for global long dates such as Oct 21, 2026.
See each skill's numbers reference for exact comparison and rounding rules.

## Skills and development

Choose skills/dashtaste-global or skills/dashtaste-cn for the intended audience.
Each skill links tokens, chart examples, numbers, layout, and patterns to avoid.
Use the matching pack when checking the examples or a generated dashboard.
Layout and copy still need visual review; the rule checker does not prove usability.

```sh
pnpm format
pnpm format:check
pnpm typecheck
pnpm build
pnpm test
```

The tests cover rule contracts, pack differences, colour contrast and vision,
CLI behavior, formatting, skill consistency, every chart JSON example, and browser extraction.
