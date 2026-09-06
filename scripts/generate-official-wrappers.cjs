#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'main', 'tax-packs');
const wrapperDir = path.join(root, 'tax-packs');
const publishedAt = '2026-09-06';

const countries = {
  CM: { name: 'Cameroon', currency: 'XAF', rate: '19.25', label: 'VAT', registration: 'Taxpayer Identification Number' },
  UG: { name: 'Uganda', currency: 'UGX', rate: '18', label: 'VAT', registration: 'TIN', pattern: '^\\d{10}$' },
  MA: { name: 'Morocco', currency: 'MAD', rate: '10', label: 'TVA', registration: 'Identifiant fiscal', pattern: '^\\d{15}$', alcoholRate: '20' },
  GB: { name: 'United Kingdom', currency: 'GBP', rate: '20', label: 'VAT', registration: 'VAT registration number', pattern: '^GB\\d{9}(\\d{3})?$', coldRate: '0', alcoholRate: '20' },
  EG: { name: 'Egypt', currency: 'EGP', rate: '14', label: 'VAT', registration: 'Tax registration number', pattern: '^\\d{9}$' },
  DZ: { name: 'Algeria', currency: 'DZD', rate: '19', label: 'TVA', registration: 'NIF', pattern: '^\\d{15}$', reducedRate: '9' },
};

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function allCategoryIds(pack) { return pack.categories.map((category) => category.id); }
function rule(id, label, rate, categoryIds) {
  return { id, label, type: 'percent', categoryIds, rate };
}

function basePack(code, meta) {
  const standardIds = ['standard', 'packaging', 'delivery', 'service_charge', 'addon', 'unclassified'];
  const pack = {
    schemaVersion: 1,
    id: `official-${code.toLowerCase()}`,
    publisher: 'FreeOpenSourcePOS',
    sourceType: 'official',
    version: '1.0.0',
    country: code,
    jurisdiction: '*',
    currency: meta.currency,
    effectiveFrom: publishedAt,
    publishedAt,
    minFloVersion: '2.4.0',
    taxPoint: 'finalized_at',
    inclusivePricingDefault: true,
    registrationNumberLabel: meta.registration,
    categories: standardIds.map((id) => ({ id, label: id === 'standard' ? 'Standard food and restaurant supply' : id[0].toUpperCase() + id.slice(1).replace('_', ' '), ruleIds: ['standard'] })),
    defaultCategories: { product: 'standard', packaging: 'packaging', delivery: 'delivery', service_charge: 'service_charge', addon: 'addon' },
    unclassifiedCategoryId: 'unclassified',
    rules: [rule('standard', `${meta.label} (standard food and restaurant supply)`, meta.rate, standardIds)],
    taxRounding: { scope: 'document', method: 'half_up', decimalPlaces: 2, remainderAllocation: 'largest_remainder' },
    payableRounding: { increment: '0.01', method: 'half_up' },
  };
  if (meta.pattern) pack.registrationNumberFormat = { pattern: meta.pattern, description: `${meta.registration} format` };
  return pack;
}

function addSpecialCategories(pack, meta) {
  const standard = pack.categories.find((c) => c.id === 'standard');
  const all = allCategoryIds(pack);
  if (meta.alcoholRate) {
    pack.categories.push({ id: 'alcohol', label: 'Alcoholic beverages', ruleIds: ['alcohol'] });
    pack.rules.push(rule('alcohol', `${meta.label} (alcoholic beverages)`, meta.alcoholRate, ['alcohol']));
    standard.ruleIds = ['standard'];
  }
  if (meta.coldRate) {
    pack.categories.push({ id: 'cold_takeaway', label: 'Cold takeaway food', ruleIds: ['cold-takeaway'] });
    pack.rules.push(rule('cold-takeaway', `${meta.label} (cold takeaway food)`, meta.coldRate, ['cold_takeaway']));
  }
  if (meta.reducedRate) {
    pack.categories.push({ id: 'reduced', label: 'Reduced-rate food items', ruleIds: ['reduced'] });
    pack.rules.push(rule('reduced', `${meta.label} (reduced rate)`, meta.reducedRate, ['reduced']));
  }
  return pack;
}

function template(code, name, simple = false) {
  const profiles = [32, 36, 40, 42, 44, 48].map((columns) => {
    const narrow = columns <= 36;
    const item = narrow ? columns - 14 : columns - (simple ? 13 : 20);
    const lineColumns = [
      { key: 'item', label: 'ITEM', width: item, align: 'left', wrap: true, maxLines: 2 },
      { key: 'quantity', label: 'QTY', width: narrow ? 3 : 4, align: 'right' },
      ...(!simple && columns >= 40 ? [{ key: 'rate', label: 'RATE', width: 7, align: 'right' }] : []),
      { key: 'amount', label: narrow ? 'AMT' : 'TOTAL', width: narrow ? 9 : 10, align: 'right' },
    ];
    return { columns, layout: { lineItems: { gap: 1, columns: lineColumns, detailLines: ['addons', 'specialInstructions'] }, taxSummary: { labelWidth: columns - 10, amountWidth: 9 } } };
  });
  return {
    id: `${code.toLowerCase()}.vat.tax-invoice${simple ? '-simple' : ''}.v1`,
    displayName: `${name} Tax Invoice${simple ? ' Simple' : ''}`,
    country: code,
    jurisdiction: '*',
    paperColumns: [32, 36, 40, 42, 44, 48],
    renderer: { id: 'flocafe-thermal-receipt-template', version: 1 },
    templatePayload: {
      format: 'escpos-line-template-v1',
      widthProfiles: profiles,
      header: { businessNameTransform: 'uppercase', taxTitleWhenTaxPresent: 'TAX INVOICE', titleWhenTaxAbsent: 'INVOICE' },
      fields: { taxRegistrationNumberLabel: 'TAX ID' },
      lineItems: { includeAddons: true, includeSpecialInstructions: true },
      totals: { showSubtotal: true, showDiscount: true, showTaxRegistrationNumber: 'when_tax_present_or_enabled' },
      footer: { useConfiguredFooterNote: true, includePoweredByFloPOS: true },
    },
  };
}

function makeWrapper(pack, name) {
  return {
    schemaVersion: 1,
    artifactType: 'country-tax-pack-plugin',
    id: `tax-pack-${pack.id}`,
    displayName: `${name} Official Tax Pack`,
    publisher: 'FreeOpenSourcePOS',
    version: pack.version,
    country: pack.country,
    jurisdiction: pack.jurisdiction,
    publishedAt: pack.publishedAt,
    minFloVersion: pack.minFloVersion,
    taxPack: pack,
    printTemplates: [template(pack.country, name), template(pack.country, name, true)],
  };
}

for (const [code, meta] of Object.entries(countries)) {
  const pack = addSpecialCategories(basePack(code, meta), meta);
  writeJson(path.join(sourceDir, `${code.toLowerCase()}.json`), pack);
  writeJson(path.join(wrapperDir, pack.id, `v${pack.version}`, 'plugin.json'), makeWrapper(pack, meta.name));
}

for (const source of fs.readdirSync(sourceDir).filter((file) => file.startsWith('community-') && file.endsWith('.json'))) {
  const pack = readJson(path.join(sourceDir, source));
  const code = pack.country;
  const name = ({ AR: 'Argentina', FR: 'France', GH: 'Ghana', ID: 'Indonesia', JP: 'Japan', MX: 'Mexico', NP: 'Nepal', PK: 'Pakistan', PH: 'Philippines', SA: 'Saudi Arabia', ZA: 'South Africa', US: 'United States', UZ: 'Uzbekistan' })[code];
  if (!name) continue;
  pack.id = `official-${code.toLowerCase()}`;
  pack.publisher = 'FreeOpenSourcePOS';
  pack.sourceType = 'official';
  pack.version = '1.0.0';
  pack.publishedAt = publishedAt;
  pack.effectiveFrom = publishedAt;
  if (code === 'GH') {
    pack.categories.forEach((c) => { c.label = c.id === 'standard' ? 'Standard food and restaurant supply (VAT 15% + NHIL 2.5% + GETFund 2.5%)' : c.label; });
  }
  if (code === 'US') {
    pack.categories.forEach((c) => { c.label = c.id === 'standard' ? 'Merchant-configured state/local sales tax' : c.label; });
    pack.rules[0].id = 'sales-tax-local';
    pack.rules[0].label = 'Sales Tax (merchant-configured state/local rate)';
    pack.rules[0].rate = '0';
    pack.categories.forEach((c) => { c.ruleIds = ['sales-tax-local']; });
  }
  writeJson(path.join(sourceDir, `${code.toLowerCase()}.json`), pack);
  writeJson(path.join(wrapperDir, pack.id, `v${pack.version}`, 'plugin.json'), makeWrapper(pack, name));
}

// Wrap Thailand's existing official source pack as well so every official
// country source has the same receipt-template surface.
for (const source of ['th.json', 'in.json']) {
  const pack = readJson(path.join(sourceDir, source));
  if (pack.country === 'IN') continue; // India v1.0.5 is immutable and complete.
  const name = pack.country === 'TH' ? 'Thailand' : 'India';
  writeJson(path.join(wrapperDir, pack.id, `v1.0.0`, 'plugin.json'), makeWrapper(pack, name));
}

// One immutable catalog-cleanup release removes the superseded community IDs
// from the cumulative catalog without rewriting any already-published bytes.
const cleanupFile = path.join(wrapperDir, 'official-za', 'v1.0.1', 'plugin.json');
const cleanup = readJson(path.join(wrapperDir, 'official-za', 'v1.0.0', 'plugin.json'));
cleanup.version = '1.0.1';
cleanup.taxPack.version = '1.0.1';
cleanup.taxPack.publishedAt = publishedAt;
cleanup.publishedAt = publishedAt;
writeJson(cleanupFile, cleanup);
