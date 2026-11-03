# Stop agents shipping rainbow ECharts dashboards.

[![npm](https://img.shields.io/npm/v/dashtaste)](https://www.npmjs.com/package/dashtaste)
[![demo](https://img.shields.io/badge/demo-dashtaste.ledring.dev-555555)](https://dashtaste.ledring.dev)

![Before and after, SaaS, global pack](gallery/compare/saas-wide.png)

```sh
npx dashtaste check dashboard.json
```

## Check

```sh
npx dashtaste check dashboard.json --pack global
npx dashtaste check dashboard.json --pack cn
npx dashtaste check dashboard.json --pack cn --format json
```

Node 20 or newer. Input is one ECharts option, an array of options, or a page-facts envelope. A URL or HTML file also needs the optional `playwright-core` dependency and a local Chromium (`CHROME_PATH`).

From a checkout:

```sh
pnpm install
pnpm build
node dist/cli.js check test/fixtures/bad.json --pack global
```

That fixture prints:

```text
test/fixtures/bad.json
  error  DT001  charts[0]  default ECharts palette  → set option.color to the pack palette (dashtaste tokens --pack global)
  warn  DT003  charts[0].series[1]  smooth line  → use straight segments: smooth: false
  warn  DT004  charts[0].series[1]  symbols everywhere  → use dots at most 5px on at most 31 points, or set showSymbol: false
  warn  DT009  charts[0].yAxis[0]  missing unit  → put units in axis names, rendered ticks, or formatter metadata
  error  DT010  charts[0].yAxis[0]  bar baseline  → set min: 0 and scale: false
  warn  DT011  charts[0].yAxis[0].axisLabel  raw large numbers  → format compact units: cn 万/亿; global K/M
  warn  DT011  charts[0].tooltip  raw large numbers  → format compact units: cn 万/亿; global K/M
  warn  DT024  charts[0].series[0]  bar width  → set barMaxWidth to 24 or less; use 32 or less on screens
2 errors, 6 warnings · score 62/100
```

Exit 0 when there are no errors and warnings are within `--max-warnings` (no limit by default). Exit 1 when any finding is an error, or warnings exceed that limit. Exit 2 when the file or the flags are invalid. Info findings change the score and leave the exit code at 0. `--format json` prints `{ version, pack, inputs, summary }`. Each finding has `ruleId`, `severity`, `message`, `path`, and `fix`. Any rule can be skipped with `--disable`.

The score starts at 100. Each error subtracts 10, each warning 3, each info 1, with a floor of 0.

```ts
import { check } from 'dashtaste';

const findings = check({ series: [] }, { pack: 'global' });
```

`rules` lists rule metadata. `tokens` prints the selected pack colours as JSON or CSS. Flags are in [usage](docs/usage.md). `--pack-file` extends a built-in pack; see [packs](docs/packs.md).

## Skills

```sh
npx skills add FelixFangX/dashtaste --skill dashtaste-global
npx skills add FelixFangX/dashtaste --skill dashtaste-cn
```

Or copy `skills/dashtaste-global` or `skills/dashtaste-cn` into the agent's skills directory and tell it to follow that skill.

## Packs

`global` is green-up, with K / M / B, at most 6 KPIs, and at most 5 pie or rose slices. `cn` is red-up, with 万 / 亿, at most 8 KPIs, at most 5 pie slices, and at most 8 rose slices. `cn` defines a 1920×1080 screen. `DT022` runs on the cn pack only.

Pass `--mode dark` for a dark page. Both packs have light and dark tokens.

## Rules

[Reasons, triggers, and fixes](docs/rules.md).

| ID    | Default | Name                    |
| ----- | ------- | ----------------------- |
| DT001 | error   | default-palette         |
| DT002 | warn    | rainbow-palette         |
| DT003 | warn    | smooth-line             |
| DT004 | warn    | symbols-everywhere      |
| DT005 | warn    | pie-slices              |
| DT006 | warn    | pie-overuse             |
| DT007 | error   | three-d                 |
| DT008 | warn    | dual-axis               |
| DT009 | warn    | missing-unit            |
| DT010 | error   | bar-baseline            |
| DT011 | warn    | raw-large-numbers       |
| DT012 | warn    | unit-system             |
| DT013 | error   | delta-convention        |
| DT014 | warn    | delta-colour-only       |
| DT015 | error   | low-contrast-text       |
| DT016 | warn    | thin-line-contrast      |
| DT017 | warn    | gradient-decoration     |
| DT018 | warn    | glow                    |
| DT019 | warn    | kpi-overload            |
| DT020 | warn    | kpi-rainbow             |
| DT021 | warn    | emoji-icons             |
| DT022 | warn    | cjk-min-size            |
| DT023 | info    | legend-single-series    |
| DT024 | warn    | bar-width               |
| DT025 | warn    | legend-not-direct-label |
| DT026 | warn    | line-weight             |
| DT027 | warn    | tabular-numerals        |
| DT028 | info    | hero-metric             |
| DT029 | warn    | helper-captions         |

## Gallery

[dashtaste.ledring.dev](https://dashtaste.ledring.dev)

Gallery data is fictional, seeded in [gallery/data.mjs](gallery/data.mjs). Each pair shares that data. Before pages use unguided defaults. After pages follow the pack. Counts are from [gallery/results.json](gallery/results.json). A score of 100 means the page matched the rules.

| Dashboard | Pack, mode          | Before                                  | After     |
| --------- | ------------------- | --------------------------------------- | --------- |
| saas      | global, light       | 37 errors, 55 warnings, 2 info, score 0 | score 100 |
| finance   | global, dark        | 7 errors, 46 warnings, 1 info, score 0  | score 100 |
| store     | cn, light           | 47 errors, 71 warnings, 2 info, score 0 | score 100 |
| live      | cn, dark, 1920×1080 | 37 errors, 88 warnings, 1 info, score 0 | score 100 |

Walkthroughs: [docs/cases](docs/cases/).

- [saas](gallery/compare/saas-wide.png)
- [finance](gallery/compare/finance-wide.png)
- [store](gallery/compare/store-wide.png)
- [live](gallery/compare/live-wide.png)

```sh
pnpm gallery
```

This builds the CLI, renders the gallery PNGs, and writes `gallery/results.json`. It needs `playwright-core`. Set `CHROME_PATH` to Chromium. The default is `/usr/bin/google-chrome`.

0.0.7. Rules can change in any 0.x release.

## License

[MIT](LICENSE).
