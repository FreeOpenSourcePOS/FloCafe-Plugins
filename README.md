# FloCafe Plugins

Signed tax-pack and capability-plugin release artifacts for FloCafe.

## Live catalog state

Verified from FloCafe core against GitHub Releases:

- latest release tag: `tax-pack-official-india-v1.0.4`
- catalog entries:
  - `official-india@1.0.4`
- India wrapper digest:
  `d5fecc088453e23e19e897c9a89759311b47c3bbfc7bcb64cae15f167fe140de`
- India artifact type: `country-tax-pack-plugin`
- India tax pack stored by FloCafe core: inner `CountryPack` from `taxPack`
- India signed artifact retained by FloCafe core: full wrapper JSON bytes

The India wrapper includes one print template:

- template id: `in.gst.tax-invoice.v1`
- renderer: `flocafe-thermal-receipt-template@1`
- payload format: `escpos-line-template-v1`
- live `official-india@1.0.4` printable columns: `32`, `36`, `40`, `42`,
  `44`, `48`

## Compatibility

`official-india@1.0.4` is a wrapped plugin artifact. It is installable by the
FloCafe wrapper-loader branch that validates the full wrapper bytes while
storing the inner `taxPack` as `packJson`.

Released/older FloCafe builds that only parse plain `CountryPack` JSON are
expected to fail when installing India from the latest catalog. Do not publish
additional wrapped plugin artifacts until the corresponding FloCafe loader path
has landed in the target build line.

Thailand is not in the active catalog while the India wrapper-template path is
being tested.

`tax-packs/official-india/v1.0.4/plugin.json` is the India wrapper source for
the fuller GST receipt anatomy. It keeps the printer-column template contract
from `1.0.2` and adds declarative sections for the bill, payments, tax breakup,
footer, and a companion KOT recipe.

## Capability Plugin Direction

This repository is the public home for FloCafe's signed plugin artifacts. The
current shipped surface is country tax-pack plugins, but the same catalog and
signature model is intended to grow into capability plugins for payment,
fiscal, delivery, receipt-template, and jurisdiction-resolution integrations.

FloCafe keeps deterministic, offline tax rules in tax packs. Anything that
needs credentials, network access, provider APIs, digital signing, licensed or
large datasets, webhook handling, polling, or external authorization belongs in
a capability plugin or hosted connector instead of a tax pack. Examples:

- India GST rate tables and CGST/SGST/IGST splits: tax pack.
- India IRN/e-invoice submission or digital signing: fiscal plugin.
- Argentina IVA rules: tax pack.
- Argentina ARCA authorization: fiscal plugin.
- Mercado Pago QR, UPI, or card terminal lifecycle: payment plugin.
- PedidosYa, Uber Eats, or similar marketplace order sync: delivery plugin.
- US rooftop/address-level sales-tax resolution: jurisdiction plugin.

The long-term shape is three layers:

```text
FloCafe core
  Stable order, payment, tax, fiscal, delivery, and event contracts.

Signed local plugin
  Flo-owned code may run in-process.
  External executable code must run isolated from Electron main and SQLite.

Hosted connector
  Provider credentials, APIs, polling, webhooks, retries, reconciliation,
  and provider-specific payload conversion.
```

The POS is usually behind NAT on a restaurant computer, so provider-facing
webhooks must not terminate directly on the POS. Hosted connectors should talk
to providers, normalize events, and deliver them back through FloCafe's outbound
cloud channel or another approved broker path.

Future executable plugin manifests should declare at least:

- stable plugin id, publisher, version, artifact digest, and signature
- FloCafe API compatibility range
- scope: `country`, `multi_country`, or `global`
- supported countries and jurisdictions
- capabilities: payment, fiscal document, delivery, jurisdiction lookup,
  receipt template, workflow, or admin UI
- execution mode and ABI version
- requested permissions and allowed outbound hosts
- configuration schema and provider account requirements
- optional hosted service base URL, polling contract, and webhook routes

Security rules are part of the contract, not an implementation detail:

- signed artifacts are immutable once released
- installation and activation are separate actions
- marketplace listings are filtered by the store's configured country
- external plugins must not access raw SQLite tables or Electron APIs
- undeclared permissions and network hosts are rejected
- provider credentials stay in the hosted connector or approved secure store
- provider commands are scoped to the correct connector account
- events are idempotent, replayable, and delivered outside POS DB transactions
- packages can be revoked or disabled without deleting historical business data

Normalized events should carry enough identity to prevent cross-store or
cross-provider leakage:

```json
{
  "eventId": "evt_...",
  "schemaVersion": 1,
  "storeId": "store_...",
  "aggregateType": "order",
  "aggregateId": "ord_...",
  "connectorAccountId": "pedidosya-ar-store-42",
  "idempotencyKey": "provider-event-key",
  "payload": {}
}
```

For delivery connectors, the expected lifecycle is:

```text
received -> accepted -> preparing -> ready -> dispatched -> delivered
received -> rejected
received -> cancelled
accepted -> cancelled
preparing -> cancelled
```

Commands should include `accept`, `deny`, `start_preparing`, `ready`,
`dispatched`, and `cancel`, with durable polling cursors and replay-safe
deduplication.

## Country Tax Packs

Source JSON for official country tax packs lives in `main/tax-packs/`.
Release tags use `tax-pack-<pack-id>-v<semver>` and publish signed release
assets:

- `<pack-id>-v<semver>.json`
- `<pack-id>-v<semver>.json.sig`
- `catalog.json`

Published releases:

- `tax-pack-official-india-v1.0.4`

The current source tree also contains release-ready official wrapper artifacts
for every country requested through FloAdmin tax-support tickets: Argentina,
Algeria, Cameroon, Egypt, France, Ghana, the United Kingdom, Indonesia, Japan,
Morocco, Mexico, Nepal, Pakistan, the Philippines, Saudi Arabia, South Africa,
Thailand, Uganda, the United States, and Uzbekistan. The former
`community-*` files remain as immutable historical source inputs for their
already-published releases; the `official-*` artifacts supersede them for new
releases.

Each new official wrapper contains an advanced and simple thermal invoice
template with profiles for 32, 36, 40, 42, 44, and 48 printable columns. New
official artifacts must still be tagged individually and signed by the release
workflow before FloCafe can install them from the live catalog.

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

The India GST template is a FloCafe-native declarative template. Its receipt
shape is: centered brand/table/customer header, line-item columns, item
notes/addons, discounts, totals, payment lines, loyalty, tax breakup, GST/footer
lines, cut, and optional cash-drawer pulse. FloCafe data bindings and renderer
behavior remain owned by FloCafe core.

Only source artifacts that are expected to install in the matching FloCafe
loader branch should live under `tax-packs/`. Remove experimental wrappers or
draft plugin artifacts before tagging a release.
