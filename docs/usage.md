# Usage

Build with Node 20.19 or newer and pnpm:

```sh
pnpm install
pnpm build
npx dashtaste --help
```

## Check options

```sh
npx dashtaste check options.json --pack global
npx dashtaste check first.json second.json --pack cn --format json
npx dashtaste check options.json --pack cn --mode dark --max-warnings 0
```

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

Defaults are the global pack, light mode, text output, and unlimited warnings.
Errors always fail. `--max-warnings 0` also fails on any warning.
Informational findings lower the score but do not fail a check.

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

| Flag             | Commands      | Values                         |
| ---------------- | ------------- | ------------------------------ |
| `--pack`         | all           | `global`, `cn`                 |
| `--mode`         | check, tokens | `light`, `dark`                |
| `--format`       | check, rules  | `text`, `json`                 |
| `--format`       | tokens        | `json`, `css`                  |
| `--max-warnings` | check         | non-negative integer           |
| `--only`         | check         | comma-separated rule IDs       |
| `--disable`      | check         | comma-separated rule IDs       |
| `--background`   | check         | three- or six-digit hex colour |
| `--help`         | all           | command-specific usage         |

`--disable` takes precedence over `--only`. Unknown rule IDs are input errors.
`--background` overrides chart, page, and pack backgrounds for contrast checks.
`tokens` requires an explicit `--pack`.

Exit 0 means no errors and warnings within the selected limit.
Exit 1 means errors or too many warnings.
Exit 2 means invalid arguments, unreadable input, or unavailable extraction.
Set `NO_COLOR` to suppress ANSI colour in text output.
JSON output contains version, pack, per-input findings and scores, and summary.
Each finding contains ruleId, severity, message, path, and fix.
Score starts at 100: subtract 10 per error, 3 per warning, and 1 per info.
The minimum score is zero.

## Inspect metadata and tokens

```sh
npx dashtaste rules --pack cn --format json
npx dashtaste tokens --pack global --mode light
npx dashtaste tokens --pack cn --mode dark --format css
```

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
