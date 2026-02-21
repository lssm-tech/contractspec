/**
 * Tests for auto-bump version and version service enhancements.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { createTestDb, type TestDb } from './db-fixture.js';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { VersionService, bumpPatch } from '../src/services/version-service.js';
import { app } from '../src/server.js';
import {
  publishLimiter,
  generalLimiter,
} from '../src/middleware/rate-limit.js';

describe('bumpPatch', () => {
  test('bumps patch version', () => {
    expect(bumpPatch('1.2.3')).toBe('1.2.4');
  });

  test('bumps from zero', () => {
    expect(bumpPatch('0.0.0')).toBe('0.0.1');
  });

  test('handles large numbers', () => {
    expect(bumpPatch('1.0.99')).toBe('1.0.100');
  });

  test('strips pre-release metadata', () => {
    expect(bumpPatch('1.2.3-beta.1')).toBe('1.2.4');
  });

  test('strips build metadata', () => {
    expect(bumpPatch('1.2.3+build.123')).toBe('1.2.4');
  });

  test('handles short version strings', () => {
    expect(bumpPatch('1')).toBe('1.0.1');
    expect(bumpPatch('1.0')).toBe('1.0.1');
  });
});

describe('VersionService.getNextVersion', () => {
  let db: TestDb;

  beforeEach(() => {
    db = createTestDb();
  });

  test('returns 1.0.0 for new pack', async () => {
    const service = new VersionService(db as unknown as Db);
    const next = await service.getNextVersion('nonexistent-pack');
    expect(next).toBe('1.0.0');
  });

  test('bumps from latest version', async () => {
    db.insert(schema.packs)
      .values({
        name: 'bump-pack',
        displayName: 'Bump Pack',
        description: 'Test',
        authorName: 'tester',
      })
      .run();

    db.insert(schema.packVersions)
      .values({
        packName: 'bump-pack',
        version: '1.2.3',
        integrity: 'sha256-test',
        tarballUrl: '/test',
        tarballSize: 100,
        packManifest: {},
        createdAt: new Date().toISOString(),
      })
      .run();

    const service = new VersionService(db as unknown as Db);
    const next = await service.getNextVersion('bump-pack');
    expect(next).toBe('1.2.4');
  });

  test('uses the chronologically latest version', async () => {
    db.insert(schema.packs)
      .values({
        name: 'multi-ver',
        displayName: 'Multi',
        description: 'Test',
        authorName: 'tester',
      })
      .run();

    // Insert older version first
    db.insert(schema.packVersions)
      .values({
        packName: 'multi-ver',
        version: '1.0.0',
        integrity: 'sha256-old',
        tarballUrl: '/old',
        tarballSize: 100,
        packManifest: {},
        createdAt: '2025-01-01T00:00:00.000Z',
      })
      .run();

    // Insert newer version
    db.insert(schema.packVersions)
      .values({
        packName: 'multi-ver',
        version: '2.1.0',
        integrity: 'sha256-new',
        tarballUrl: '/new',
        tarballSize: 200,
        packManifest: {},
        createdAt: '2026-01-01T00:00:00.000Z',
      })
      .run();

    const service = new VersionService(db as unknown as Db);
    const next = await service.getNextVersion('multi-ver');
    expect(next).toBe('2.1.1');
  });
});

describe('Auto-bump via publish route', () => {
  let db: Db;

  beforeEach(() => {
    db = setupTestDb();
    publishLimiter.clear();
    generalLimiter.clear();
  });

  async function createToken(username: string): Promise<string> {
    const { hashToken, generateToken } = await import('../src/auth/token.js');
    const rawToken = generateToken();
    db.insert(schema.authTokens)
      .values({
        token: hashToken(rawToken),
        username,
        scope: 'publish',
      })
      .run();
    return rawToken;
  }

  test('auto-bumps to 1.0.0 for new pack', async () => {
    const token = await createToken('auto-bumper');

    const form = new FormData();
    form.append('tarball', new Blob([Buffer.alloc(50)]), 'auto-pack.tgz');
    form.append(
      'metadata',
      JSON.stringify({
        name: 'auto-pack',
        version: 'auto',
        manifest: { name: 'auto-pack', description: 'Auto version' },
      })
    );

    const res = await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.version).toBe('1.0.0');
  });

  test('auto-bumps from existing version', async () => {
    const token = await createToken('auto-bumper-2');

    // First publish with explicit version
    const form1 = new FormData();
    form1.append('tarball', new Blob([Buffer.alloc(50)]), 'auto-pack-2.tgz');
    form1.append(
      'metadata',
      JSON.stringify({
        name: 'auto-pack-2',
        version: '1.5.0',
        manifest: { name: 'auto-pack-2' },
      })
    );

    await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form1,
      })
    );

    // Second publish with auto-bump
    const form2 = new FormData();
    form2.append('tarball', new Blob([Buffer.alloc(75)]), 'auto-pack-2.tgz');
    form2.append(
      'metadata',
      JSON.stringify({
        name: 'auto-pack-2',
        version: 'auto',
        manifest: { name: 'auto-pack-2' },
      })
    );

    const res = await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form2,
      })
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.version).toBe('1.5.1');
  });
});
