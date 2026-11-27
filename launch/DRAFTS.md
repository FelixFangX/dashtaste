# Dashtaste launch drafts (paste-ready — nothing posted)

> Status: drafts only. X/Postiz still paused until Felix says go.
> Main line: Agents ship the same default rainbow ECharts look everywhere → pick a named taste, check against 38 rules (`DT001`–`DT038`), and install its tokens (Skill / MCP / CLI loop).
> Verified: npm + GitHub at **0.0.8** (ruleset `dt-2026.2`); 6 named tastes (`saas-dense`, `exec-brief`, `ops-wall`, `cn-ecommerce`, `global-marketplace`, `editorial-data`); 38 rules (`DT001`–`DT038`) with `constraint` / `heuristic` / `taste` basis; gallery results in `gallery/results.json`; site https://dashtaste.ledring.dev
> Attach when posting: `gallery/compare/saas-wide.png` (global / `saas-dense`), `gallery/tastes.png` (6-taste catalog), or `gallery/compare/store-wide.png` (`cn-ecommerce`); optional `live-wide.png`.
> Do not invent download counts or stars. Gallery data is fictional; clean after scores = rule consistency, not a UX study.

**Package:** `dashtaste` · **version:** `0.0.8` · **license:** MIT  
**Repo:** https://github.com/FelixFangX/dashtaste  
**Demo:** https://dashtaste.ledring.dev  
**npm:** https://www.npmjs.com/package/dashtaste  
**Install skill:** `npx skills add FelixFangX/dashtaste --skill dashtaste` (selector; also `dashtaste-global` / `dashtaste-cn`)  
**Check:** `npx dashtaste check dashboard.json --taste saas-dense`  
**MCP server:** `npx -y dashtaste mcp` (`list_tastes`, `taste_tokens`, `taste_example`, `check_taste`, `apply_taste`)  
**Cases:** https://github.com/FelixFangX/dashtaste/tree/main/docs/cases  
**Pack overlay:** `--pack-file` (see `docs/packs.md`)  
**Taste family:** sibling `maptaste` for web maps (https://github.com/FelixFangX/maptaste · https://maptaste.ledring.dev)

Ready files under `launch/ready/`.

---

## One-line pitch

EN: Pick a named dashboard taste, check ECharts against 38 rules (`DT001`–`DT038`), and install its tokens via Skill, CLI, or MCP.

ZH: 选一种命名的看板流派，用 38 条规则（`DT001`–`DT038`）验收 ECharts 配置，通过 Skill / CLI / MCP 跑成闭环。

---

## Channel map

| Channel          | Lead with                                                     | File                         |
| ---------------- | ------------------------------------------------------------- | ---------------------------- |
| X thread         | Rainbow ECharts problem → 6 tastes + 38 rules → MCP + pairing | `ready/x-*.txt`              |
| Show HN          | Main line title; first comment = 6 tastes, basis, MCP, limits | `ready/show-hn-*`            |
| Showoff Saturday | Main line + before/after + 6 tastes                           | `ready/showoff-saturday.txt` |
| 掘金             | Main line → 6 tastes + cn/global locale + MCP                 | `ready/juejin.md`            |
| 小红书           | Main line + store/saas compare image                          | `ready/xhs.txt`              |
| 公众号           | Main line essay, short                                        | `ready/wechat.md`            |

---

## Do not lead with

- "Better / more professional design"
- Star or download counts
- "One shared palette" (the point is 6 distinct named schools, not a single skin)
- ECharts-only as a selling point (state as a limit)

---

## Suggested post order (when unpaused)

1. X thread (attach `gallery/compare/saas-wide.png` or `gallery/tastes.png`) — still paused
2. Show HN + first comment
3. 掘金 / 公众号 / 小红书
4. Showoff Saturday (Sat only) / r/SideProject
