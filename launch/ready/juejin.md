标题：
给 Coding Agent 的看板审美闭环：Skill 先验 + dashtaste check 后验

正文：
Agent 搭看板很快，但默认长得像：彩虹饼图、平滑曲线满屏圆点、柱轴不从 0 起、一排 emoji KPI。测试过不了功能，审美没人拦。

Dashtaste 把「好看」收成可验收闭环：

1. Skill 先验：`dashtaste-global` / `dashtaste-cn`（配色、字号、间距、数字格式、图默认值）
2. CLI 后验：`npx dashtaste check` 扫 ECharts JSON 或渲染页，28 条规则，带 path + 改法 + 0–100 分，JSON 给 Agent/CI

global / cn 不是换皮：绿涨红跌 + K/M/B vs 红涨绿跌 + 万/亿；cn 还有 1920 大屏构图。同一套规则 ID，pack 决定什么叫「对」。

仓库 gallery 是同数据 before/after（saas / finance / store / live）。after 干净只说明对齐规则，不是「更好看」的证明——图自己看。

MIT · npm `dashtaste` · 0.0.7 · 目前仅 ECharts

安装 Skill：
`npx skills add FelixFangX/dashtaste --skill dashtaste-cn`

Repo：https://github.com/FelixFangX/dashtaste
