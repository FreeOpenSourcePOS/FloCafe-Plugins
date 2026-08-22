# Developer Instructions

This repository is the source and release-artifact home for FloCafe tax packs
and capability plugins.

## Release Rules

- Release tags must use `tax-pack-<pack-id>-v<semver>`.
- Plain country packs live in `main/tax-packs/`.
- Wrapped country-pack plugin artifacts live in `tax-packs/<pack-id>/v<semver>/plugin.json`.
- Do not keep draft, experimental, or incompatible plugin wrappers in this repo.
- Do not tag a wrapped plugin artifact unless the target FloCafe loader branch can parse it.
- The release catalog digest must be computed over the exact bytes of the published artifact.
- The detached signature must be computed over the exact same bytes as the catalog digest.
- For wrapped plugin artifacts, those bytes are the full wrapper JSON, not the inner `taxPack`.
- FloCafe may store the inner `CountryPack` as `packJson`, but must retain the full signed wrapper for digest/signature validation.

## Current Compatibility

- `official-india@1.0.5` is a wrapped `country-tax-pack-plugin` artifact.
- `official-india@1.0.5` requires the FloCafe wrapper-loader path and supports
  printable column profiles.
- Older released FloCafe builds that only parse plain `CountryPack` JSON may fail to install India from the latest catalog.
- Thailand is intentionally not in the active catalog while the India
  wrapper-template path is being tested.

## India GST Template Contract

The India wrapper ships two print templates in `printTemplates`, both under
the same tax pack:

- `in.gst.tax-invoice.v1` ("GST Advanced") — full item grid including a
  per-line `rate` (unit price) column on the 40/42/44/48-column profiles.
- `in.gst.tax-invoice-simple.v1` ("GST Simple") — identical in every other
  respect, but omits the `rate` column at every paper width; the freed column
  width is folded into the `item` column so each profile's columns still sum
  to its paper width. The 44/48-column `taxRate` (GST%) column is unaffected
  by this — only `rate` is dropped.

Both templates must keep:

- renderer: `{ "id": "flocafe-thermal-receipt-template", "version": 1 }`
- payload format: `escpos-line-template-v1`

For new India GST template releases, prefer printable column profiles instead
of paper-millimeter assumptions:

```ts
type PrinterColumnWidth = 32 | 36 | 40 | 42 | 44 | 48;
```

Official templates should ship `templatePayload.widthProfiles` for all six
widths when practical. Core is expected to choose exact match first, then the
nearest smaller profile, and never render a wider layout on a smaller printer.

`tax-packs/official-india/v1.0.5/plugin.json` is the source artifact for the
fuller GST thermal invoice payload. Each template keeps the same renderer,
payload format, and six width profiles, and adds FloCafe-native declarative
sections for brand/table/customer header, invoice identity, item grid, item
notes/addons, adjustments, totals, payments, loyalty, tax breakup, footer, cut,
cash-drawer pulse, and companion KOT recipe.

Released version directories (e.g. `v1.0.4`) are immutable once tagged and
published — ship further changes as a new `v<semver>` directory, never by
editing an already-tagged artifact in place.

## Pre-Release Checks

Before publishing, verify:

- `jq empty` succeeds for every artifact JSON.
- `scripts/tax-packs/prepare-release.cjs` selects the intended artifact for the tag.
- `catalog.json` points to the artifact that will be uploaded.
- the catalog digest equals `sha256` of the full uploaded artifact bytes.
- the detached signature verifies against the full uploaded artifact bytes.
- the live GitHub release can be downloaded and re-verified after publishing.
