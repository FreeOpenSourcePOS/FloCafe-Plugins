# FloCafe Plugins

Signed tax-pack and capability-plugin release artifacts for FloCafe.

## Country tax packs

Source JSON for official country tax packs lives in `main/tax-packs/`.
Release tags use `tax-pack-<pack-id>-v<semver>` and publish signed release
assets:

- `<pack-id>-v<semver>.json`
- `<pack-id>-v<semver>.json.sig`
- `catalog.json`

Published releases:

- `tax-pack-official-india-v1.0.0`
- `tax-pack-official-thailand-v1.0.0`

Wrapped plugin artifacts can also include print-template metadata. For those
releases, `catalog.json` points at the wrapper JSON and the catalog digest plus
detached signature cover the full wrapper bytes.

## Tax-pack print templates

Tax-specific print templates are published with their country tax pack/plugin
artifact. FloCafe core keeps only generic built-in receipt templates until the
plugin-template loader/renderer contract is implemented.

Each tax-pack artifact that includes print templates declares:

- a stable template id
- a merchant-facing display name
- country and jurisdiction scope
- supported paper widths
- renderer id/version
- the template payload the renderer will consume
