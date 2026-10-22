# Local usage

Use Node 20 or later and pnpm 10. Run `pnpm install`, `pnpm build`, then `node dist/cli.js rules`. From this folder, `npx --no-install dashtaste rules` resolves the local executable.

```sh
node dist/cli.js check test/fixtures/good.json --pack cn
node dist/cli.js check test/fixtures/bad.json --pack cn --format json
node dist/cli.js tokens --pack global --mode dark --format css
node dist/cli.js rules --pack cn
```

JSON input accepts a single ECharts option, an array of options, or `{ "charts": [{ "id": "sales", "option": {} }], "page": { "deltaColors": "red-up", "background": "#FFFFFF" } }`. The rules API also accepts PageFacts for rendered text, deltas, KPIs, gradients and shadows. ECharts options alone cannot reveal rendered text or KPI tiles.

```js
import { check, score, packs } from 'dashtaste';
import { formatCompact, formatDelta } from 'dashtaste/format';
const findings = check({ series: [] }, { pack: 'cn' });
console.log(score(findings), formatCompact(12300, 'cn'));
```

The CLI accepts multiple inputs. `--only DT001,DT003` selects rules; `--disable DT003` excludes rules even when selected. `--background '#FFFFFF'` overrides the chart background for chart contrast checks. `NO_COLOR` disables terminal colour.

Exit 0 means no errors and warnings within `--max-warnings` (unlimited by default); info findings do not fail. Exit 1 means errors or excess warnings. Exit 2 means invalid usage, unreadable input, or failed extraction. JSON output includes version, pack, per-input findings and scores, and aggregate counts and score. Score is max(0, 100 − 10 × errors − 3 × warnings − info).

HTML/URL mode uses the optional playwright-core dependency. Set `CHROME_PATH` to an installed Chromium executable; otherwise `/usr/bin/google-chrome` is tried, then the browser path managed by Playwright. No browser is downloaded by this package. The browser loads the supplied page, waits for network idle and 500ms, then extracts facts. Page scripts and resources run as they normally do in a browser. ECharts instances must be reachable through `window.echarts`. Browser launch and extraction errors exit 2. No telemetry or network calls occur outside browser mode.

Delta formatting uses `(current - previous) / abs(previous)`. Previous zero and nonfinite numbers are invalid. `formatPercent` takes a ratio. `formatDate` uses local calendar fields. Compact formatting rounds to one decimal globally and two decimals for cn, trimming trailing zeros. `deltaColors` can switch one whole page to red-up or green-up.

Body text tokens are ink and muted on the pack's page/card surfaces. Accent and semantic colours need a separate contrast check if used as text. CSS extraction composites transparent ancestor backgrounds over white; background images, pseudo-elements, canvas text and cross-frame text are outside the text extractor. Text rules use computed CSS values. Emoji checks target titles, labels and rankings. Extracted facts are serializable and the rule engine can run without a browser.

Skills are under `skills/dashtaste-global` and `skills/dashtaste-cn`. Install the chosen folder into the agent's skills directory, or use `npx skills add <repo> --skill dashtaste-cn` once a repository location is available. No remote is needed for local folder installation.
