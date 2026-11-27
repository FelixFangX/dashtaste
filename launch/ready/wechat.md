标题：
Agent 看板为什么总长一个样，以及我怎么把它变成可验收的事

开篇：
Coding Agent 搭 ECharts 看板很快，长得却经常像默认模板：彩虹色板、平滑线满圆点、多片饼图、不从零起的柱轴、一排带 emoji 的 KPI。功能测试拦不住这些。

产品：
Dashtaste 不给一套「万能皮肤」，而是 6 种命名的看板流派（`saas-dense`、`exec-brief`、`ops-wall`、`cn-ecommerce`、`global-marketplace`、`editorial-data`）加一套可验收闭环：

- Skill（`dashtaste` 选择器，或 `dashtaste-global` / `dashtaste-cn`）与 stdio MCP（`npx -y dashtaste mcp`）：生成前给 Agent 流派约束、tokens 与 100 分示例
- `npx dashtaste check`：生成后扫 ECharts 配置或渲染页面，38 条规则（`DT001`–`DT038`），区分 `constraint` / `heuristic` / `taste` 依据，输出 path + 改法 + 分数，JSON 可进 Agent / CI

国内流派 `cn-ecommerce`（`--pack cn`）不是换皮：红涨绿跌、万/亿、1920×1080 大屏构图都写进规则；团队也可以用 `--pack-file` 覆盖自己的色板和阈值。

说明：
在线交互 Demo 与同数据 before/after gallery 在 https://dashtaste.ledring.dev 。after 满分 = 对齐规则，不是可用性结论。当前 v0.0.8，目前只支持 ECharts。同系列还有面向 Web 地图的兄弟项目 maptaste（https://maptaste.ledring.dev）。

链接：
https://github.com/FelixFangX/dashtaste
https://www.npmjs.com/package/dashtaste
