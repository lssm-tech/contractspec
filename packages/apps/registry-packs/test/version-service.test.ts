import { describe, test, expect, beforeEach } from 'bun:test';
import { createTestDb, type TestDb } from './db-fixture.js';
import { PackService } from '../src/services/pack-service.js';
import { VersionService } from '../src/services/version-service.js';

describe('VersionService', () => {
  let db: TestDb;
  let packService: PackService;
  let versionService: VersionService;

  beforeEach(async () => {
    db = createTestDb();
    packService = new PackService(db as any);
    versionService = new VersionService(db as any);

    // Create a parent pack for version tests
    await packService.create({
      name: 'my-pack',
      displayName: 'My Pack',
      description: 'Test pack',
      authorName: 'tester',
    });
  });

  test('create and get a version', async () => {
    const version = await versionService.create({
      packName: 'my-pack',
      version: '1.0.0',
      integrity: 'sha256-abc123',
      tarballUrl: '/packs/my-pack/versions/1.0.0/download',
      tarballSize: 1024,
      packManifest: { name: 'my-pack' },
    });

    expect(version.version).toBe('1.0.0');
    expect(version.packName).toBe('my-pack');
    expect(version.integrity).toBe('sha256-abc123');

    const found = await versionService.get('my-pack', '1.0.0');
    expect(found).not.toBeNull();
    expect(found!.version).toBe('1.0.0');
  });

  test('get returns null for missing version', async () => {
    const result = await versionService.get('my-pack', '9.9.9');
    expect(result).toBeNull();
  });

  test('list versions ordered by createdAt desc', async () => {
    // Insert with explicit timestamps to ensure ordering
    const { packVersions } = await import('../src/db/schema.js');
    (db as any)
      .insert(packVersions)
      .values({
        packName: 'my-pack',
        version: '1.0.0',
        integrity: 'sha256-aaa',
        tarballUrl: '/packs/my-pack/versions/1.0.0/download',
        tarballSize: 1024,
        packManifest: { name: 'my-pack' },
        createdAt: '2025-01-01T00:00:00.000Z',
      })
      .run();

    (db as any)
      .insert(packVersions)
      .values({
        packName: 'my-pack',
        version: '1.1.0',
        integrity: 'sha256-bbb',
        tarballUrl: '/packs/my-pack/versions/1.1.0/download',
        tarballSize: 2048,
        packManifest: { name: 'my-pack' },
        createdAt: '2025-06-01T00:00:00.000Z',
      })
      .run();

    const versions = await versionService.list('my-pack');
    expect(versions).toHaveLength(2);
    // Most recent first
    expect(versions[0]!.version).toBe('1.1.0');
    expect(versions[1]!.version).toBe('1.0.0');
  });

  test('getLatest returns most recent version by createdAt', async () => {
    // Insert with explicit timestamps to ensure ordering
    const { packVersions } = await import('../src/db/schema.js');
    (db as any)
      .insert(packVersions)
      .values({
        packName: 'my-pack',
        version: '1.0.0',
        integrity: 'sha256-aaa',
        tarballUrl: '/packs/my-pack/versions/1.0.0/download',
        tarballSize: 1024,
        packManifest: { name: 'my-pack' },
        createdAt: '2025-01-01T00:00:00.000Z',
      })
      .run();

    (db as any)
      .insert(packVersions)
      .values({
        packName: 'my-pack',
        version: '2.0.0',
        integrity: 'sha256-ccc',
        tarballUrl: '/packs/my-pack/versions/2.0.0/download',
        tarballSize: 3072,
        packManifest: { name: 'my-pack' },
        createdAt: '2025-06-01T00:00:00.000Z',
      })
      .run();

    const latest = await versionService.getLatest('my-pack');
    expect(latest).not.toBeNull();
    expect(latest!.version).toBe('2.0.0');
  });

  test('getLatest returns null for pack with no versions', async () => {
    const latest = await versionService.getLatest('my-pack');
    expect(latest).toBeNull();
  });

  test('delete a version', async () => {
    await versionService.create({
      packName: 'my-pack',
      version: '1.0.0',
      integrity: 'sha256-aaa',
      tarballUrl: '/packs/my-pack/versions/1.0.0/download',
      tarballSize: 1024,
      packManifest: { name: 'my-pack' },
    });

    const deleted = await versionService.delete('my-pack', '1.0.0');
    expect(deleted).toBe(true);

    const found = await versionService.get('my-pack', '1.0.0');
    expect(found).toBeNull();
  });

  test('delete returns false for missing version', async () => {
    const deleted = await versionService.delete('my-pack', '9.9.9');
    expect(deleted).toBe(false);
  });

  test('exists returns correct boolean', async () => {
    expect(await versionService.exists('my-pack', '1.0.0')).toBe(false);

    await versionService.create({
      packName: 'my-pack',
      version: '1.0.0',
      integrity: 'sha256-aaa',
      tarballUrl: '/packs/my-pack/versions/1.0.0/download',
      tarballSize: 1024,
      packManifest: { name: 'my-pack' },
    });

    expect(await versionService.exists('my-pack', '1.0.0')).toBe(true);
  });

  test('cascade delete removes versions when pack is deleted', async () => {
    await versionService.create({
      packName: 'my-pack',
      version: '1.0.0',
      integrity: 'sha256-aaa',
      tarballUrl: '/packs/my-pack/versions/1.0.0/download',
      tarballSize: 1024,
      packManifest: { name: 'my-pack' },
    });

    // Delete the parent pack
    await packService.delete('my-pack');

    // Versions should be cascade-deleted
    const versions = await versionService.list('my-pack');
    expect(versions).toHaveLength(0);
  });
});
