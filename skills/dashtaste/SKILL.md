---
name: dashtaste
description: Choose one named ECharts taste and check the dashboard against that school. Tastes are saas-dense, exec-brief, ops-wall, cn-ecommerce, global-marketplace, and editorial-data.
---

Do not ship the default rainbow ECharts look. Pick one taste, then build and check against that school.

1. List tastes with `npx dashtaste tastes`. Read tokens and rules with `npx dashtaste tokens --taste <name>`.
2. Choose one:
   - B2B metrics, compact, straight lines → `saas-dense` (`--pack global` is this alias).
   - A board pack with one chart → `exec-brief`.
   - A dark SRE or status wall → `ops-wall`.
   - Chinese commerce, 万/亿 ticks, a descending funnel → `cn-ecommerce` (`--pack cn` is this alias).
   - Multi-currency cohort or retention → `global-marketplace`.
   - A story chart that leads with an annotation → `editorial-data`.
3. Copy a passing option with `npx dashtaste example --taste <name>`, or write tokens and that example with `npx dashtaste apply --taste <name>`.
4. Run `npx dashtaste check dashboard.json --taste <name>`. Fix errors before shipping. Warnings are still findings.

A taste is tokens plus composition: how many charts, how many series, KPI cap, annotation range, ground luminance, colour cap, motion, unit system, and (where the school needs them) a currency mark or a descending funnel. Swapping a color array without those rules is not the taste.

Rainbow palettes are an error in every taste (DT030). Layout should explain itself. These checks are heuristics, not a substitute for looking at the dashboard.
