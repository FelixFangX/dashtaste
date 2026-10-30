# DashTaste landing

The landing source is versioned here from the existing `dashtaste-site` worker. The fold follows the approved blend, retaining the product's `#f6f5f1` paper and `#406347` accent. “Try gallery” opens the existing comparison section; the checker and agent installation remain below it.

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm site:build
```

The build copies the compiled checker, gallery pages, screenshots, ECharts, and local fonts into ignored asset directories under `site/public`. Serve that directory at the site root. The worker configuration is retained in `site/wrangler.toml`; building does not deploy it.

`?lang=en|zh` overrides the saved language. English uses SaaS/Finance and the global pack; Chinese uses Store/Live and the CN pack. Gallery links, before/after legends, checker samples, and results follow the selected language.

Validation for this change: TypeScript build and typecheck passed; EN/ZH runtime checks passed for gallery selection, links, packs, samples, findings, reset, and chart series language. The wider suite passed 298 tests; remaining failures require unavailable ECharts dependencies or browser/process permissions. Chromium screenshot verification was blocked by the sandbox's socket restriction.
