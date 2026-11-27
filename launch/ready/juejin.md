标题：
给 Coding Agent 的看板审美闭环：6 种流派 + 38 条 ECharts 验收规则

正文：
Agent 搭 ECharts 看板很快，但默认到处都是同一套彩虹模板：默认色板、平滑曲线满屏圆点、柱轴不从 0 起、一排 emoji KPI。功能测试拦不住这些。

Dashtaste 不是换一套共享色板，而是把「选流派 + 验收」收成闭环：

1. 6 种命名流派（`saas-dense`、`exec-brief`、`ops-wall`、`cn-ecommerce`、`global-marketplace`、`editorial-data`）：每种都绑定构图上限、底色、动效与数字格式，不是换皮。`saas-dense`（`--pack global`）绿涨红跌 + K/M/B，`cn-ecommerce`（`--pack cn`）红涨绿跌 + 万/亿 + 1920×1080 大屏规则；团队私有规范可用 `--pack-file` 覆盖。
2. CLI 验收：`npx dashtaste check dashboard.json --taste saas-dense` 扫 ECharts JSON 或渲染页，38 条规则（`DT001`–`DT038`），每条结果标明 `constraint` / `heuristic` / `taste` 依据、配置 path、改法与 0–100 分，支持 JSON 给 Agent / CI 循环。
3. Agent 接入：Skill（`npx skills add FelixFangX/dashtaste --skill dashtaste`，另有 `dashtaste-global` / `dashtaste-cn`）或直接挂 stdio MCP（`npx -y dashtaste mcp`）。

在线 6 流派交互 Demo + 同数据 before/after gallery（`saas` / `finance` / `store` / `live`）：https://dashtaste.ledring.dev
after 满分只说明对齐规则，不是可用性结论——图自己看。同系列做地图配色的兄弟项目是 maptaste（https://maptaste.ledring.dev）。

MIT · npm `dashtaste` · v0.0.8 · 目前仅 ECharts

Repo：https://github.com/FelixFangX/dashtaste
