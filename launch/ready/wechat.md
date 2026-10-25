标题：
Agent 看板为什么总长一个样，以及我怎么把它变成可验收的事

开篇：
Coding Agent 搭看板很快，长得却经常像默认模板：彩虹色、平滑线满圆点、多片饼图、不从零起的柱轴、一排带 emoji 的 KPI。功能测试拦不住这些。

产品：
Dashtaste 是两层同一套约定——
- Skill（`dashtaste-global` / `dashtaste-cn`）：生成前约束审美
- `npx dashtaste check`：生成后扫 ECharts 配置或页面，28 条规则，path + 改法 + 分数，JSON 可进 Agent/CI

国内包不是皮肤：红涨绿跌、万/亿、1920 大屏构图都写进「正确」的定义。

说明：
仓库里有同数据 before/after gallery。after 干净 = 对齐规则，不是可用性结论。早期 0.0.7，目前只支持 ECharts。

链接：
https://github.com/FelixFangX/dashtaste
https://www.npmjs.com/package/dashtaste
