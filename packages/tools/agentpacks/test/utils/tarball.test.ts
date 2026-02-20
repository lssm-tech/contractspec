import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import {
  createTarball,
  extractTarball,
  computeTarballIntegrity,
} from '../../src/utils/tarball.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'tarball-test'
);
const PACK_DIR = join(TEST_DIR, 'source-pack');
const EXTRACT_DIR = join(TEST_DIR, 'extracted');

beforeAll(() => {
  mkdirSync(join(PACK_DIR, 'rules'), { recursive: true });
  writeFileSync(
    join(PACK_DIR, 'pack.json'),
    JSON.stringify({ name: 'test-pack', version: '1.0.0' })
  );
  writeFileSync(
    join(PACK_DIR, 'rules', 'example.md'),
    '---\nroot: true\n---\n\nExample rule content.\n'
  );
  writeFileSync(
    join(PACK_DIR, 'rules', 'security.md'),
    '---\nroot: false\n---\n\nSecurity guidelines.\n'
  );
});

afterAll(() => {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

describe('createTarball', () => {
  test('creates tarball from pack directory', async () => {
    const data = await createTarball(PACK_DIR);
    expect(data).toBeInstanceOf(ArrayBuffer);
    expect(data.byteLength).toBeGreaterThan(0);
  });

  test('tarball contains gzip magic bytes', async () => {
    const data = await createTarball(PACK_DIR);
    const bytes = new Uint8Array(data);
    // gzip magic number: 0x1f 0x8b
    expect(bytes[0]).toBe(0x1f);
    expect(bytes[1]).toBe(0x8b);
  });
});

describe('extractTarball', () => {
  test('extracts tarball to target directory', async () => {
    const data = await createTarball(PACK_DIR);

    if (existsSync(EXTRACT_DIR)) {
      rmSync(EXTRACT_DIR, { recursive: true, force: true });
    }
    await extractTarball(data, EXTRACT_DIR);

    expect(existsSync(join(EXTRACT_DIR, 'pack.json'))).toBe(true);
    expect(existsSync(join(EXTRACT_DIR, 'rules', 'example.md'))).toBe(true);
    expect(existsSync(join(EXTRACT_DIR, 'rules', 'security.md'))).toBe(true);
  });

  test('extracted content matches original', async () => {
    const data = await createTarball(PACK_DIR);

    if (existsSync(EXTRACT_DIR)) {
      rmSync(EXTRACT_DIR, { recursive: true, force: true });
    }
    await extractTarball(data, EXTRACT_DIR);

    const originalManifest = readFileSync(join(PACK_DIR, 'pack.json'), 'utf-8');
    const extractedManifest = readFileSync(
      join(EXTRACT_DIR, 'pack.json'),
      'utf-8'
    );
    expect(extractedManifest).toBe(originalManifest);
  });
});

describe('computeTarballIntegrity', () => {
  test('returns sha256 prefixed hash', async () => {
    const data = await createTarball(PACK_DIR);
    const integrity = computeTarballIntegrity(data);
    expect(integrity).toMatch(/^sha256-[a-f0-9]{64}$/);
  });

  test('same content produces same hash', async () => {
    const data = await createTarball(PACK_DIR);
    const hash1 = computeTarballIntegrity(data);
    const hash2 = computeTarballIntegrity(data);
    expect(hash1).toBe(hash2);
  });

  test('different content produces different hash', () => {
    const buf1 = new ArrayBuffer(8);
    const buf2 = new ArrayBuffer(16);
    new Uint8Array(buf2).fill(0xff);
    expect(computeTarballIntegrity(buf1)).not.toBe(
      computeTarballIntegrity(buf2)
    );
  });
});
