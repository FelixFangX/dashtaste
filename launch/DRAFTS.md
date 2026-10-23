# Dashtaste launch drafts (for Felix to post himself — nothing has been posted)

> Status: drafts only. No push, no npm publish from this work, no posts.
> Verified against local main `70bf77a` (ahead 1 of origin), `package.json`, `README.md`, `gallery/results.json`, live npm + GitHub + ledring.dev (2026-10-23 Asia/Shanghai).
> Placeholders like `[attach: …]` mean you add that image when posting.
> Do not invent download counts or stars. Gallery data is fictional seed data in `gallery/data.mjs`. Before/after pairs share the same data; scores are style-linter consistency, not a usability study.

**Package:** `dashtaste` · **version:** `0.0.2` · **license:** MIT  
**Repo:** https://github.com/FelixFangX/dashtaste  
**npm:** https://www.npmjs.com/package/dashtaste  
**Install skill:** `npx skills add FelixFangX/dashtaste --skill dashtaste-global` (or `dashtaste-cn`)  
**Check:** `npx dashtaste check dashboard.json --pack cn`

---

## 1. One-line product pitch (EN)

Dashtaste gives coding agents dashboard taste: two style-pack skills (global / cn) plus a `dashtaste check` linter for ECharts configs and rendered pages (28 rules, DT001–DT028).

Shorter alternative:
Agent-built dashboards that don't look default — style skills + an ECharts chart-design linter.

---

## 2. npm / README short description

Already set in `package.json` (and matches the published npm blurb):

> Dashboard taste for coding agents: two style-pack skills (global and cn) plus a dashtaste check linter for ECharts configs and rendered dashboards.

Optional one-liner for cards / awesome lists:

> Style-pack skills and a chart-design linter so agent-built ECharts dashboards stop looking like the default template.

---

## 3. X thread (EN, 4 posts)

1/
I open-sourced Dashtaste: style skills + a linter so coding agents stop shipping "AI default" dashboards.

Two packs (global / cn). CLI: `npx dashtaste check` on an ECharts JSON or a rendered page.

https://github.com/FelixFangX/dashtaste

2/
What it catches: rainbow palettes, smooth lines with a dot on every point, too many pie slices, bar axes that don't start at zero, a legend for one series, emoji KPI rows, raw 8-digit numbers.

28 rules (DT001–DT028). Each finding has a path and a fix. Score starts at 100.

3/
global vs cn is not cosmetics. Green-up/red-down vs red-up/green-down. K/M/B vs 万/亿. KPI strip vs PoP/YoY cards. cn also covers 1920×1080 big-screen boards.

Same rule IDs; pack changes what "correct" means.

4/
Repo has a before/after gallery (saas, finance, store, live) on the same fictional data. After boards are clean under the linter; treat that as consistency with the rules, not proof the style is "better".

MIT · npm `dashtaste` · early 0.0.2 · ECharts only for now.

[attach: gallery/compare/store-wide.png or saas-wide.png]

---

## 4. Show HN

**Title (≤80 chars):**
Show HN: Dashtaste – chart-design linter and style skills for agent dashboards

Alternates:
- Show HN: Dashtaste – lint ECharts dashboards for default "AI" design smells
- Show HN: Dashtaste – agent skills + 28-rule linter for ECharts dashboards

**URL field:** https://github.com/FelixFangX/dashtaste

**First comment (author):**

Hi HN. Coding agents can scaffold a dashboard quickly, but the look tends to repeat: default or rainbow palettes, smoothed lines with markers on every point, many-slice pies, gradients/glows, a legend for a single series, a row of coloured KPI cards with emoji. None of that fails tests, so nothing pushes back.

Dashtaste is two layers on the same conventions:

1. Style-pack skills (`dashtaste-global` / `dashtaste-cn`) the agent loads before building — palette, type, spacing, number formatting, chart defaults.
2. `npx dashtaste check` — lints an ECharts JSON config or a rendered page (local Chromium + optional `playwright-core`) against 28 rules. Findings include config path + suggested fix, a 0–100 score (−10 error / −3 warning / −1 info), and JSON output for agent/CI loops. Any rule can be `--disable`d.

Locale packs matter: Western green-up/red-down and K/M/B vs Chinese red-up/green-down and 万/亿, plus 1920×1080 "big screen" composition on the cn side.

The repo gallery has four before/after boards on the same fictional data. After pages are written to the same rules the linter checks, so clean scores are a consistency check — judge the images yourself.

Limitations: ECharts only (Vega-Lite / Recharts planned), layout still needs a human, v0.0.2 so rules may move.

npm: https://www.npmjs.com/package/dashtaste

I'd like feedback on rules that feel wrong, smells it misses, and which libraries to support next.

---

## 5. Showoff Saturday / Reddit-style short post

### r/webdev — **only** on Showoff Saturday

**Title:**
[Showoff Saturday] A chart-design linter (+ agent skills) for ECharts dashboards that all look the same

**Body:**

Agents can spin up a dashboard in minutes. The output often shares the same look: rainbow pies, smooth lines with a symbol on every point, bar axes that don't start at 0, six KPI cards with emoji, a legend for one series.

**Dashtaste** is a small open-source tool for that:

- Skills: `dashtaste-global` and `dashtaste-cn` (delta colours, units, KPI layout, and screen packs differ on purpose)
- CLI: `npx dashtaste check dashboard.json --pack global` — 28 rules, path + fix, 0–100 score, JSON for agents/CI
- Also checks rendered URLs/HTML if you have local Chromium

Gallery in the README is before/after on the same fictional data (style check, not a UX study). MIT, npm package `dashtaste`, early 0.0.2, ECharts-only for now.

Repo: https://github.com/FelixFangX/dashtaste  
npm: https://www.npmjs.com/package/dashtaste

Happy to talk about which rules are too strict or which chart libs you'd want next.

### r/SideProject (self-promo OK if you engage in comments)

**Title:**
I got tired of AI dashboards looking identical, so I wrote style skills + an ECharts design linter

**Body:**
Same substance as the Showoff Saturday post, slightly more first-person. Lead with the problem, then the two parts (skills + `dashtaste check`), then links. Ask for feedback on false positives and missing smells.

---

## 6. Go-live checklist (verified 2026-10-23 Asia/Shanghai)

| Item | Status | Evidence |
| --- | --- | --- |
| GitHub repo exists (public) | **Done** | https://github.com/FelixFangX/dashtaste — public, MIT, 0 stars |
| Push latest local main (gallery polish + README DT024–DT028) | **Not done** | Local `main` at `70bf77a` is **ahead 1** of `origin/main`. Remote README still ends rules at DT023; local lists DT024–DT028. `has_pages`: false. |
| npm publish `dashtaste@0.0.2` | **Done** (package live) | https://www.npmjs.com/package/dashtaste — versions 0.0.0-stage / 0.0.1 / 0.0.2. npm README still mirrors the older rules table (no DT024–DT028) until you push and republish or rely on GitHub README sync. |
| Dedicated gallery URL (Pages / site) | **Not done** | No GitHub Pages. Gallery is PNGs + `gallery/compare/*` in-repo / README embeds only. |
| Site card on ledring.dev | **Not done** | https://ledring.dev Work list has research-thinking-ai, lakeboard-converter, n8n-workflow-collection, dev-work-grok-bot-skill, control-room — **no Dashtaste card**. |
| Facts hygiene before posting | **Note** | Local `gallery/results.json` (in `70bf77a`): saas before 32e/50w; finance 7e/42w; store 42e/61w; live 31e/76w; all after clean 100. Local README gallery table still says finance 40w / store 41e / live 32e — slightly stale vs `results.json`. Prefer "before fails / after clean" in posts, or sync the README counts when you push. |

### Suggested publish order

1. **Push GitHub** — land `70bf77a` (and optionally fix README gallery counts to match `results.json`) so public docs include DT024–DT028 and polished after boards.
2. **npm** — already on 0.0.2; only bump/republish if you need the README/rules table refresh on npm, or ship a 0.0.3 after the push. No need to block launch posts on a new npm version if GitHub is current.
3. **ledring.dev site card** — add a Work card (pitch + GitHub + npm links; optional compare image).
4. **Optional gallery URL** — GitHub Pages or a static host for compare images if you want a link that isn't "scroll the README".
5. **Then post** — X thread → Show HN (with first comment) → Showoff Saturday / SideProject. Attach compare PNGs yourself.

---

## 7. Optional ZH mirror (short; public drafts above are EN)

**一句话：** Dashtaste = 给 Coding Agent 的看板审美层：`dashtaste-global` / `dashtaste-cn` 两套 Skill + `dashtaste check`（ECharts，28 条规则 DT001–DT028）。

**可贴简短：**
Agent 做看板很快，但默认长得像：彩虹饼图、平滑曲线满屏圆点、不从 0 起的柱轴、六个 emoji KPI。Dashtaste 用 Skill 先验 + CLI 验收。`npx dashtaste check` · MIT · https://github.com/FelixFangX/dashtaste

Longer ZH posts (掘金 / 公众号 / 小红书) from an earlier draft pass are omitted here on purpose so this file stays EN-first for HN/X/Reddit. Ask if you want those ZH longforms restored alongside.

---

## Attach when posting

- Primary compare: `gallery/compare/store-wide.png` (cn light) or `gallery/compare/saas-wide.png` (global light)
- Dark / big screen: `gallery/compare/live-wide.png`
- Optional CLI shot: three-rule sample output from README (`DT003` / `DT005` / `DT010`, score 84/100)
