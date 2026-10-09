'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');
const { prepareRelease } = require('../scripts/tax-packs/prepare-release.cjs');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'flocafe-tax-pack-release-'));
after(() => fs.rmSync(root, { recursive: true, force: true }));

const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
const signingKeyValue = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

function prepare({ name, pack, existingPacks = [], artifactText, tag, signingKey = signingKeyValue }) {
  const fixture = path.join(root, name);
  const packsDirectory = path.join(fixture, 'packs');
  const outputDirectory = path.join(fixture, 'output');
  const artifactDirectory = path.join(fixture, 'artifacts');
  const sourcePath = path.join(packsDirectory, `${pack.id}.json`);
  const existingCatalogPath = path.join(fixture, 'catalog.json');
  fs.mkdirSync(packsDirectory, { recursive: true });
  fs.mkdirSync(artifactDirectory, { recursive: true });
  fs.writeFileSync(sourcePath, artifactText ?? `${JSON.stringify(pack, null, 2)}\n`);
  fs.writeFileSync(existingCatalogPath, JSON.stringify({
    schemaVersion: 1,
    generatedAt: '2026-10-08T00:00:00.000Z',
    packs: existingPacks,
  }));

  const result = prepareRelease({
    tag: tag ?? `tax-pack-${pack.id}-v${pack.version}`,
    packsDirectory,
    pluginArtifactsDirectory: artifactDirectory,
    outputDirectory,
    existingCatalogPath,
    signingKeyValue: signingKey,
    generatedAt: '2026-10-09T00:00:00.000Z',
  });
  return { ...result, outputDirectory, sourcePath };
}

function pack(id, country, version = '1.0.0', publisher = 'FreeOpenSourcePOS') {
  return {
    schemaVersion: 1,
    id,
    publisher,
    version,
    country,
    jurisdiction: '*',
    currency: 'SGD',
    effectiveFrom: '2024-01-01',
    publishedAt: '2026-08-24',
    minFloVersion: '2.4.0',
    taxPoint: 'finalized_at',
    inclusivePricingDefault: true,
    categories: [],
    rules: [],
  };
}

function catalogEntry(id, country, publisher = 'FreeOpenSourcePOS') {
  return {
    id,
    publisher,
    country,
    jurisdiction: '*',
    version: '1.0.0',
    publishedAt: '2026-08-24',
    minFloVersion: '2.4.0',
    downloadUrl: `https://example.test/${id}.json`,
    signatureUrl: `https://example.test/${id}.json.sig`,
    digest: '0'.repeat(64),
  };
}

test('signs and hashes the exact source artifact bytes', () => {
  const candidate = pack('community-singapore', 'SG');
  const artifactText = `${JSON.stringify(candidate, null, 2).replace(/\n/g, '\r\n')}  \r\n`;
  const result = prepare({ name: 'exact-bytes', pack: candidate, artifactText });
  const artifactBytes = fs.readFileSync(path.join(result.outputDirectory, result.packAssetName));
  const signatureText = fs.readFileSync(path.join(result.outputDirectory, result.signatureAssetName), 'utf8').trim();
  const tamperedBytes = Buffer.from(artifactBytes);
  tamperedBytes[tamperedBytes.length - 3] ^= 1;

  assert.deepEqual(artifactBytes, Buffer.from(artifactText));
  assert.equal(result.entry.digest, crypto.createHash('sha256').update(artifactBytes).digest('hex'));
  assert.equal(crypto.verify(null, artifactBytes, publicKey, Buffer.from(signatureText, 'base64')), true);
  assert.equal(crypto.verify(null, tamperedBytes, publicKey, Buffer.from(signatureText, 'base64')), false);
  assert.deepEqual(fs.readdirSync(result.outputDirectory).sort(), [
    'catalog.json', result.packAssetName, result.signatureAssetName,
  ].sort());
});

test('signs the exact full wrapper bytes for a country-pack plugin artifact', () => {
  const innerPack = pack('official-india', 'IN', '1.0.5');
  const wrapper = {
    artifactType: 'country-tax-pack-plugin',
    version: innerPack.version,
    taxPack: innerPack,
    printTemplates: [],
  };
  const artifactText = `${JSON.stringify(wrapper, null, 2).replace(/\n/g, '\r\n')}\r\n`;
  const result = prepare({ name: 'wrapper-bytes', pack: innerPack, artifactText });
  const artifactBytes = fs.readFileSync(path.join(result.outputDirectory, result.packAssetName));
  const signatureText = fs.readFileSync(path.join(result.outputDirectory, result.signatureAssetName), 'utf8').trim();

  assert.deepEqual(artifactBytes, Buffer.from(artifactText));
  assert.equal(result.entry.digest, crypto.createHash('sha256').update(artifactBytes).digest('hex'));
  assert.equal(crypto.verify(null, artifactBytes, publicKey, Buffer.from(signatureText, 'base64')), true);
});

test('rejects malformed release tags and wrapper version mismatches', () => {
  const candidate = pack('official-india', 'IN', '1.0.5');
  assert.throws(() => prepare({
    name: 'invalid-tag',
    pack: candidate,
    tag: 'tax-pack-official-india-v1.0',
  }), /Tag must match/);

  const mismatchedWrapper = {
    artifactType: 'country-tax-pack-plugin',
    version: '1.0.6',
    taxPack: candidate,
    printTemplates: [],
  };
  assert.throws(() => prepare({
    name: 'version-mismatch',
    pack: candidate,
    artifactText: JSON.stringify(mismatchedWrapper),
  }), /does not match/);
});

test('rejects a non-Ed25519 signing key', () => {
  const { privateKey: rsaKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  assert.throws(() => prepare({
    name: 'invalid-signing-key',
    pack: pack('community-singapore', 'SG'),
    signingKey: rsaKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  }), /must be an Ed25519 private key/);
});

test('an unrelated official release preserves the Singapore community entry', () => {
  const singapore = catalogEntry('community-singapore', 'SG');
  const previous = [
    singapore,
    catalogEntry('community-france', 'FR'),
    catalogEntry('official-india', 'IN'),
  ];
  const result = prepare({
    name: 'unrelated-official',
    pack: pack('official-france', 'FR'),
    existingPacks: previous,
  });

  assert.deepEqual(result.catalog.packs.map(({ id }) => id), [
    'community-singapore', 'official-france', 'official-india',
  ]);
  assert.deepEqual(result.catalog.packs.find(({ id }) => id === singapore.id), singapore);
});

test('an official release removes community entries only for its own country', () => {
  const singapore = catalogEntry('community-singapore', 'SG');
  const france = catalogEntry('community-france', 'FR');
  const previous = [
    singapore,
    france,
    catalogEntry('official-france-old', 'FR'),
    catalogEntry('official-india', 'IN'),
  ];
  const result = prepare({
    name: 'same-country-official',
    pack: pack('official-france', 'FR'),
    existingPacks: previous,
  });

  assert.deepEqual(result.catalog.packs.map(({ id }) => id), [
    'community-singapore', 'official-france', 'official-france-old', 'official-india',
  ]);
  assert.deepEqual(result.catalog.packs.find(({ id }) => id === singapore.id), singapore);
  assert.equal(result.catalog.packs.some(({ id }) => id === france.id), false);
});

test('a new version replaces its previous catalog entry and preserves other countries', () => {
  const singapore = catalogEntry('community-singapore', 'SG');
  const previous = [singapore, catalogEntry('official-india', 'IN'), catalogEntry('official-france', 'FR')];
  const result = prepare({
    name: 'new-version',
    pack: pack('official-india', 'IN', '1.0.1'),
    existingPacks: previous,
  });

  assert.equal(result.catalog.packs.filter(({ id }) => id === 'official-india').length, 1);
  assert.equal(result.catalog.packs.find(({ id }) => id === 'official-india').version, '1.0.1');
  assert.deepEqual(result.catalog.packs.find(({ id }) => id === singapore.id), singapore);
});
