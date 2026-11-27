# Security Policy

## Supported versions

Security fixes apply to the latest `0.x` release of `dashtaste`.

## Reporting a vulnerability

Please do not open a public GitHub issue for security vulnerabilities.

Report issues privately through either:

- [GitHub Security Advisories](https://github.com/FelixFangX/dashtaste/security/advisories/new)
- Email: `felix@ledring.dev`

Include the affected `dashtaste` version, reproduction steps or a minimal PoC, and the expected impact.

## Scope notes

- Static checks (`dashtaste check` on JSON options) parse options without executing user-provided JavaScript or ECharts `formatter` functions.
- Checking HTML files or URLs invokes local Chromium via optional `playwright-core`. Do not point URL checks at untrusted pages in privileged environments without browser isolation.
- The stdio MCP server (`dashtaste mcp`) exposes `apply_taste`, which writes `tokens.json` and `example.json` only when an explicit `out` directory is supplied.

## Response

Reports are acknowledged as soon as possible, and fixes are coordinated before public disclosure.
