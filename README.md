# FloCafe Plugins

Signed tax-pack and capability-plugin release artifacts for FloCafe.

## Live catalog state

Verified from FloCafe core against GitHub Releases:

- latest release tag: `tax-pack-official-india-v1.0.1`
- catalog entries:
  - `official-india@1.0.1`
  - `official-thailand@1.0.0`
- India wrapper digest:
  `418fb4b9e9f6ba449c5a75600edeb9eb84bf97c137708236a33571b942ded692`
- India artifact type: `country-tax-pack-plugin`
- India tax pack stored by FloCafe core: inner `CountryPack` from `taxPack`
- India signed artifact retained by FloCafe core: full wrapper JSON bytes

The India wrapper includes one print template:

- template id: `in.gst.tax-invoice.v1`
- renderer: `flocafe-thermal-receipt-template@1`
- payload format: `escpos-line-template-v1`
- live `official-india@1.0.1` profile mapping: `58mm -> 42 columns`,
  `80mm -> 48 columns`

## Compatibility

`official-india@1.0.1` is a wrapped plugin artifact. It is installable by the
FloCafe wrapper-loader branch that validates the full wrapper bytes while
storing the inner `taxPack` as `packJson`.

Released/older FloCafe builds that only parse plain `CountryPack` JSON are
expected to fail when installing India from the latest catalog. Do not publish
additional wrapped plugin artifacts until the corresponding FloCafe loader path
has landed in the target build line.

Thailand remains a plain `CountryPack` artifact at `official-thailand@1.0.0`.

`tax-packs/official-india/v1.0.2/plugin.json` is staged as the next India
wrapper source for the printer-column template contract. Publish it only after
FloCafe core supports `templatePayload.widthProfiles`.

## Country Tax Packs

Source JSON for official country tax packs lives in `main/tax-packs/`.
Release tags use `tax-pack-<pack-id>-v<semver>` and publish signed release
assets:

- `<pack-id>-v<semver>.json`
- `<pack-id>-v<semver>.json.sig`
- `catalog.json`

Published releases:

- `tax-pack-official-india-v1.0.0`
- `tax-pack-official-india-v1.0.1`
- `tax-pack-official-thailand-v1.0.0`

Wrapped plugin artifacts can also include print-template metadata. For those
releases, `catalog.json` points at the wrapper JSON and the catalog digest plus
detached signature cover the full wrapper bytes.

## Tax-Pack Print Templates

Tax-specific print templates are published with their country tax pack/plugin
artifact. FloCafe core keeps only generic built-in receipt templates until the
plugin-template loader/renderer contract is implemented.

Each tax-pack artifact that includes print templates declares:

- a stable template id
- a merchant-facing display name
- country and jurisdiction scope
- supported printable column widths
- renderer id/version
- the template payload the renderer will consume

Official FloCafe tax templates should prefer printable text columns over paper
millimeters. The current target column set is:

```ts
type PrinterColumnWidth = 32 | 36 | 40 | 42 | 44 | 48;
```

Template payloads should provide `widthProfiles` for all six widths when
practical:

```json
{
  "format": "escpos-line-template-v1",
  "widthProfiles": [
    { "columns": 32, "layout": { "...": "..." } },
    { "columns": 36, "layout": { "...": "..." } },
    { "columns": 40, "layout": { "...": "..." } },
    { "columns": 42, "layout": { "...": "..." } },
    { "columns": 44, "layout": { "...": "..." } },
    { "columns": 48, "layout": { "...": "..." } }
  ]
}
```

FloCafe core should select an exact profile first, then the nearest smaller
profile. It must not squeeze a wider profile onto a smaller printer.

Only source artifacts that are expected to install in the matching FloCafe
loader branch should live under `tax-packs/`. Remove experimental wrappers or
draft plugin artifacts before tagging a release.
