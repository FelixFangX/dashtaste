# Contributing

`dashtaste` is a TypeScript ESM package targeting Node 20+ with minimal runtime dependencies. Keep changes small, verifiable, and grounded in concrete ECharts fixtures.

## Local checks

```sh
pnpm install
pnpm build
pnpm typecheck
pnpm test
pnpm format:check
```

`pnpm test` runs the full Vitest suite. Browser extraction tests (`test/gallery.test.ts`, `test/extract.test.ts`) require `playwright-core` and a local Chromium (`CHROME_PATH`, defaulting to `/usr/bin/google-chrome`) and skip automatically when unavailable.

## Proposing a rule

Before opening a PR for a new rule (`DT0xx`), open an issue or include:

- A minimal ECharts option (or page-facts envelope) that reproduces the failure.
- The rule's `basis`: `constraint` (encoding or contrast failure), `heuristic` (usually wrong, legitimate exceptions exist), or `taste` (enforces a specific named school).
- Default severity (`error`, `warn`, or `info`) and a concrete, actionable `fix` string.

Implementation requirements:

1. Keep rule evaluation pure and deterministic. Never execute user-supplied `formatter` functions, and guard against cyclic option graphs.
2. Add the rule under `src/rules/`, register it in `src/rules/index.ts`, and assign its basis in `src/rules/basis.ts`.
3. Add unit tests under `test/rules/` covering both trigger and clean cases.
4. Document the rule in `docs/rules.md` matching its `id`, `name`, `description`, and `fix` (`test/skills.test.ts` enforces this).
5. Changing existing rule behavior requires bumping `ruleset` in `src/rules/index.ts` and updating the contract fixture under `test/fixtures/ruleset/`.

## Proposing a named taste or pack overlay

- **Team / brand overrides:** use a local JSON overlay with `--pack-file` instead of modifying built-in packs. See [docs/packs.md](docs/packs.md) for the schema (`id`, `extends`, `limits`, `tokens`, `disable`).
- **New built-in taste:** a taste must define distinct composition and caps (chart/series limits, ground, annotations, motion, or domain conventions)—not a palette swap. Define it in `src/tastes.ts`, add a passing 100/100 specimen in `src/specimens.ts`, update `skills/dashtaste/SKILL.md`, and add coverage in `test/tastes.test.ts`.

## Pull requests

- Match the repository formatting (`pnpm format`).
- Do not commit generated site build output (`site/public/dist/`, `site/public/gallery/`).
- Keep documentation and examples accurate to the current code; avoid invented metrics or hype.
