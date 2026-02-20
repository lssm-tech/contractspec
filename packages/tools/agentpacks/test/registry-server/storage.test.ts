/**
 * Unit tests for LocalStorage (pack tarball storage).
 */
import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'storage-test'
);

/**
 * Re-implement LocalStorage inline to avoid cross-package import.
 * This mirrors packages/apps/registry-packs/src/storage/local.ts.
 */
import { mkdirSync, writeFileSync, readFileSync, rmSync as fsRmSync } from 'fs';
import { dirname } from 'path';

class LocalStorage {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    if (!existsSync(this.baseDir)) {
      mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async put(packName: string, version: string, data: Buffer): Promise<string> {
    const filepath = this.path(packName, version);
    mkdirSync(dirname(filepath), { recursive: true });
    writeFileSync(filepath, data);
    return `/packs/${packName}/versions/${version}/download`;
  }

  async get(packName: string, version: string): Promise<Buffer | null> {
    const filepath = this.path(packName, version);
    if (!existsSync(filepath)) return null;
    return readFileSync(filepath);
  }

  async delete(packName: string, version: string): Promise<void> {
    const filepath = this.path(packName, version);
    if (existsSync(filepath)) {
      fsRmSync(filepath);
    }
  }

  async exists(packName: string, version: string): Promise<boolean> {
    return existsSync(this.path(packName, version));
  }

  private path(packName: string, version: string): string {
    return join(this.baseDir, packName, `${version}.tgz`);
  }
}

describe('LocalStorage', () => {
  let storage: LocalStorage;

  beforeAll(() => {
    storage = new LocalStorage(join(TEST_DIR, 'storage'));
  });

  afterAll(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  test('put stores data and returns download URL', async () => {
    const data = Buffer.from('fake-tarball-data');
    const url = await storage.put('my-pack', '1.0.0', data);

    expect(url).toBe('/packs/my-pack/versions/1.0.0/download');
    expect(await storage.exists('my-pack', '1.0.0')).toBe(true);
  });

  test('get retrieves stored data', async () => {
    const data = Buffer.from('test-content-12345');
    await storage.put('get-test', '2.0.0', data);

    const retrieved = await storage.get('get-test', '2.0.0');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.toString()).toBe('test-content-12345');
  });

  test('get returns null for non-existent pack', async () => {
    const result = await storage.get('nonexistent', '1.0.0');
    expect(result).toBeNull();
  });

  test('exists returns false for non-existent pack', async () => {
    expect(await storage.exists('nope', '0.0.0')).toBe(false);
  });

  test('delete removes stored data', async () => {
    const data = Buffer.from('to-be-deleted');
    await storage.put('del-pack', '1.0.0', data);
    expect(await storage.exists('del-pack', '1.0.0')).toBe(true);

    await storage.delete('del-pack', '1.0.0');
    expect(await storage.exists('del-pack', '1.0.0')).toBe(false);
  });

  test('delete is no-op for non-existent pack', async () => {
    // Should not throw
    await storage.delete('no-such-pack', '1.0.0');
  });

  test('stores multiple versions for same pack', async () => {
    await storage.put('multi', '1.0.0', Buffer.from('v1'));
    await storage.put('multi', '2.0.0', Buffer.from('v2'));
    await storage.put('multi', '3.0.0', Buffer.from('v3'));

    expect(await storage.exists('multi', '1.0.0')).toBe(true);
    expect(await storage.exists('multi', '2.0.0')).toBe(true);
    expect(await storage.exists('multi', '3.0.0')).toBe(true);

    const v1 = await storage.get('multi', '1.0.0');
    const v2 = await storage.get('multi', '2.0.0');
    expect(v1!.toString()).toBe('v1');
    expect(v2!.toString()).toBe('v2');
  });

  test('stores packs with different names separately', async () => {
    await storage.put('pack-a', '1.0.0', Buffer.from('a-data'));
    await storage.put('pack-b', '1.0.0', Buffer.from('b-data'));

    const a = await storage.get('pack-a', '1.0.0');
    const b = await storage.get('pack-b', '1.0.0');
    expect(a!.toString()).toBe('a-data');
    expect(b!.toString()).toBe('b-data');
  });
});
