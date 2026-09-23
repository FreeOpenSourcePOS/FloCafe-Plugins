# FloCafe Plugins

Signed tax-pack and capability-plugin release artifacts for FloCafe.

## Supported countries

Each country has one published release: its latest official tax pack. Click a
country to open its release page.

| Country | Version |
| --- | --- |
| [Algeria](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-dz-v1.0.0) | 1.0.0 |
| [Argentina](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-ar-v1.0.0) | 1.0.0 |
| [Australia](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-au-v1.0.0) | 1.0.0 |
| [Cameroon](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-cm-v1.0.0) | 1.0.0 |
| [Egypt](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-eg-v1.0.0) | 1.0.0 |
| [France](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-fr-v1.0.0) | 1.0.0 |
| [Germany](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-de-v1.0.0) | 1.0.0 |
| [Ghana](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-gh-v1.0.0) | 1.0.0 |
| [India](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-india-v1.0.5) | 1.0.5 |
| [Indonesia](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-id-v1.0.0) | 1.0.0 |
| [Italy](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-it-v1.0.0) | 1.0.0 |
| [Japan](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-jp-v1.0.0) | 1.0.0 |
| [Kenya](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-ke-v1.0.0) | 1.0.0 |
| [Mexico](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-mx-v1.0.0) | 1.0.0 |
| [Morocco](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-ma-v1.0.0) | 1.0.0 |
| [Nepal](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-np-v1.0.0) | 1.0.0 |
| [Pakistan](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-pk-v1.0.0) | 1.0.0 |
| [Philippines](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-ph-v1.0.0) | 1.0.0 |
| [Saudi Arabia](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-sa-v1.0.0) | 1.0.0 |
| [South Africa](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-za-v1.0.1) | 1.0.1 |
| [Thailand](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-thailand-v1.0.0) | 1.0.0 |
| [Turkey](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-tr-v1.0.0) | 1.0.0 |
| [Uganda](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-ug-v1.0.0) | 1.0.0 |
| [United Kingdom](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-gb-v1.0.0) | 1.0.0 |
| [United States](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-us-v1.0.0) | 1.0.0 |
| [Uzbekistan](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-uz-v1.0.0) | 1.0.0 |
| [Vietnam](https://github.com/FreeOpenSourcePOS/FloCafe-Plugins/releases/tag/tax-pack-official-vn-v1.0.0) | 1.0.0 |

The India wrapper includes two print templates:

- template ids: `in.gst.tax-invoice.v1` and
  `in.gst.tax-invoice-simple.v1`
- renderer: `flocafe-thermal-receipt-template@1`
- payload format: `escpos-line-template-v1`
- live `official-india@1.0.5` printable columns: `32`, `36`, `40`, `42`,
  `44`, `48`

## Compatibility

`official-india@1.0.5` is a wrapped plugin artifact. FloCafe `3.2.0` and newer
contain the wrapper-loader path that validates the full wrapper bytes while
storing the inner `taxPack` as `packJson`.

FloCafe builds older than `3.2.0` that only parse plain `CountryPack` JSON are
expected to fail when installing wrapped artifacts. New wrapped plugins must
therefore declare `minFloVersion: 3.2.0` or newer.

Thailand is not in the active catalog while the India wrapper-template path is
being tested.

## 2026 country expansion

Four additional wrapped artifacts target wrapper-capable FloCafe `3.2.0` and
newer:

- Australia, Germany, Italy, and Vietnam
- Vietnam tracks FloAdmin ticket `RL5-NW5N`

Brazil (`2X9-KQZ6`), Canada, China, and Russia are researched but intentionally
deferred because a country-wide offline profile cannot safely select their
current jurisdiction-, taxpayer-status-, exemption-, or transition-dependent
restaurant taxes.

The tax decisions, official sources, cross-country comparison, and limitations
are recorded in [`docs/country-tax-research-2026-09-23.md`](docs/country-tax-research-2026-09-23.md).

`tax-packs/official-india/v1.0.5/plugin.json` is the India wrapper source for
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

Published releases are listed under [Supported countries](#supported-countries).

The current source tree contains official wrapper artifacts for every country
requested through FloAdmin tax-support tickets: Argentina, Algeria, Cameroon,
Egypt, France, Ghana, the United Kingdom, Indonesia, Japan, Kenya, Morocco,
Mexico, Nepal, Pakistan, the Philippines, Saudi Arabia, South Africa, Thailand,
Turkey, Uganda, the United States, and Uzbekistan. The `official-*` artifacts supersede
the former `community-*` sources.

Each new official wrapper contains an advanced and simple thermal invoice
template with profiles for 32, 36, 40, 42, 44, and 48 printable columns. New
official artifacts are tagged individually and signed by the release workflow
before FloCafe can install them from the live catalog.

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
