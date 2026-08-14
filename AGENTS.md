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

- `official-india@1.0.1` is a wrapped `country-tax-pack-plugin` artifact.
- `official-india@1.0.1` requires the FloCafe wrapper-loader path.
- Older released FloCafe builds that only parse plain `CountryPack` JSON may fail to install India from the latest catalog.
- `official-thailand@1.0.0` remains a plain `CountryPack` artifact.

## India GST Template Contract

The India wrapper must keep:

- template id: `in.gst.tax-invoice.v1`
- renderer: `{ "id": "flocafe-thermal-receipt-template", "version": 1 }`
- payload format: `escpos-line-template-v1`

## Pre-Release Checks

Before publishing, verify:

- `jq empty` succeeds for every artifact JSON.
- `scripts/tax-packs/prepare-release.cjs` selects the intended artifact for the tag.
- `catalog.json` points to the artifact that will be uploaded.
- the catalog digest equals `sha256` of the full uploaded artifact bytes.
- the detached signature verifies against the full uploaded artifact bytes.
- the live GitHub release can be downloaded and re-verified after publishing.
