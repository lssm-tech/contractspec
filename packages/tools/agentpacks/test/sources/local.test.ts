import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { resolveLocalPack, isLocalPackRef } from '../../src/sources/local.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'local-test');

beforeAll(() => {
  mkdirSync(join(TEST_DIR, 'packs', 'my-pack'), { recursive: true });
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('isLocalPackRef', () => {
  test('identifies relative paths', () => {
    expect(isLocalPackRef('./packs/my-pack')).toBe(true);
    expect(isLocalPackRef('../shared-packs')).toBe(true);
  });

  test('identifies absolute paths', () => {
    expect(isLocalPackRef('/home/user/packs')).toBe(true);
  });

  test('rejects non-local refs', () => {
    expect(isLocalPackRef('acme/rules')).toBe(false);
    expect(isLocalPackRef('npm:some-pack')).toBe(false);
    expect(isLocalPackRef('@scope/pack')).toBe(false);
    expect(isLocalPackRef('github:acme/rules')).toBe(false);
  });
});

describe('resolveLocalPack', () => {
  test('resolves relative path to existing directory', () => {
    const result = resolveLocalPack('./packs/my-pack', TEST_DIR);
    expect(result).toBe(resolve(TEST_DIR, 'packs', 'my-pack'));
  });

  test('returns null for non-existent directory', () => {
    const result = resolveLocalPack('./packs/nonexistent', TEST_DIR);
    expect(result).toBeNull();
  });

  test('resolves absolute path', () => {
    const absPath = join(TEST_DIR, 'packs', 'my-pack');
    const result = resolveLocalPack(absPath, TEST_DIR);
    expect(result).toBe(absPath);
  });

  test('returns null for non-existent absolute path', () => {
    const result = resolveLocalPack('/nonexistent/path', TEST_DIR);
    expect(result).toBeNull();
  });
});
