# Pack overlays

The built-in `global` and `cn` packs remain free. A pack file is a local JSON
overlay for private or vertical conventions. It changes existing limits and
colour tokens and can disable existing rules; it adds no rule IDs. There are no
payment, license, server, or hosted API checks.

```sh
npx dashtaste check dashboard.json --pack-file examples/pack-overlay-cn.json
npx dashtaste tokens --pack-file examples/pack-overlay-cn.json --mode dark
npx dashtaste rules --pack-file examples/pack-overlay-cn.json --format json
```

## Schema

| Field         | Type                           | Meaning                                                                         |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `id`          | non-empty string, required     | Overlay identifier, reported as `packFile` in check JSON                        |
| `extends`     | `"global"` or `"cn"`, required | Base pack and effective rule membership                                         |
| `description` | string, optional               | Description of the overlay                                                      |
| `limits`      | object, optional               | Numeric overrides: `maxPieSlices`, `maxRoseSlices`, `maxKpis`, `cjkMinFontSize` |
| `tokens`      | object, optional               | Partial `light` and/or `dark` token objects                                     |
| `disable`     | string array, optional         | Existing rule IDs to skip                                                       |

Limits must be non-negative finite numbers. Token values are strings, except
`categorical` and `sequential`, which must be non-empty arrays of strings when
present. Omitted fields inherit the base. Objects merge by key; arrays replace
base arrays. The built-in pack is cloned and stays unchanged.

```json
{
  "id": "cn-focused",
  "extends": "cn",
  "description": "A focused dashboard with one primary KPI.",
  "limits": { "maxKpis": 1 },
  "tokens": {
    "light": { "brand": "#663399" },
    "dark": { "brand": "#BB99EE" }
  },
  "disable": ["DT021"]
}
```

`--pack-file` determines the effective pack through `extends`, even when `--pack`
is also supplied. Regional logic and rule membership use that base name.
Check JSON retains `pack: "cn"` in this example and adds `packFile: "cn-focused"`.
Overlay disables and CLI `--disable` form a union; disables take precedence over
`--only`. Unknown rule IDs are invalid input.

`tokens` prints the merged tokens for the selected mode, as JSON or CSS.
`rules` filters metadata by `extends`; it still lists rules disabled by the overlay.
Missing files, invalid JSON, invalid schema, or unknown disabled rules exit 2
with a diagnostic on stderr.

This format allows private and vertical packs to be distributed later as zip
archives or npm packages containing JSON files. Consumers can pass an extracted
or installed JSON path to the same CLI; no distribution service is required.
