/**
 * Integration tests for registry-packs route handlers.
 *
 * Uses `setupTestDb()` → `setDb()` to inject an in-memory DB, then
 * Elysia's `app.handle()` to test routes without starting a real server.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { app } from '../src/server.js';

let db: Db;

describe('Route integration tests', () => {
  beforeEach(() => {
    db = setupTestDb();
  });

  describe('GET /health', () => {
    test('returns healthy', async () => {
      const res = await app.handle(new Request('http://localhost/health'));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('healthy');
    });
  });

  describe('GET /', () => {
    test('returns route info', async () => {
      const res = await app.handle(new Request('http://localhost/'));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.name).toBe('agentpacks-registry');
    });
  });

  describe('GET /packs', () => {
    test('returns empty list initially', async () => {
      const res = await app.handle(new Request('http://localhost/packs'));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.packs).toEqual([]);
      expect(body.total).toBe(0);
    });

    test('returns packs after creation', async () => {
      db.insert(schema.packs)
        .values({
          name: 'test-pack',
          displayName: 'Test Pack',
          description: 'A test',
          authorName: 'tester',
        })
        .run();

      const res = await app.handle(new Request('http://localhost/packs'));
      const body = await res.json();
      expect(body.packs).toHaveLength(1);
      expect(body.packs[0].name).toBe('test-pack');
    });
  });

  describe('GET /packs/:name', () => {
    test('returns 404 for missing pack', async () => {
      const res = await app.handle(
        new Request('http://localhost/packs/nonexistent')
      );
      expect(res.status).toBe(404);
    });

    test('returns pack details', async () => {
      db.insert(schema.packs)
        .values({
          name: 'my-pack',
          displayName: 'My Pack',
          description: 'Details test',
          authorName: 'alice',
          tags: ['test'],
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/my-pack')
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.name).toBe('my-pack');
      expect(body.authorName).toBe('alice');
    });
  });

  describe('GET /packs/:name/versions', () => {
    test('returns versions for a pack', async () => {
      db.insert(schema.packs)
        .values({
          name: 'v-pack',
          displayName: 'V Pack',
          description: 'Version test',
          authorName: 'tester',
        })
        .run();

      db.insert(schema.packVersions)
        .values({
          packName: 'v-pack',
          version: '1.0.0',
          integrity: 'sha256-test',
          tarballUrl: '/download/v-pack/1.0.0',
          tarballSize: 512,
          packManifest: { name: 'v-pack' },
          createdAt: new Date().toISOString(),
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/v-pack/versions')
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.versions).toHaveLength(1);
      expect(body.versions[0].version).toBe('1.0.0');
    });
  });

  describe('GET /packs/:name/versions/:version', () => {
    test('returns 404 for missing version', async () => {
      const res = await app.handle(
        new Request('http://localhost/packs/no-pack/versions/1.0.0')
      );
      expect(res.status).toBe(404);
    });
  });

  describe('GET /featured', () => {
    test('returns featured packs only', async () => {
      db.insert(schema.packs)
        .values({
          name: 'feat-pack',
          displayName: 'Featured',
          description: 'Featured pack',
          authorName: 'tester',
          featured: true,
        })
        .run();

      db.insert(schema.packs)
        .values({
          name: 'normal-pack',
          displayName: 'Normal',
          description: 'Normal pack',
          authorName: 'tester',
          featured: false,
        })
        .run();

      const res = await app.handle(new Request('http://localhost/featured'));
      const body = await res.json();
      expect(body.packs).toHaveLength(1);
      expect(body.packs[0].name).toBe('feat-pack');
    });
  });

  describe('GET /stats', () => {
    test('returns global stats', async () => {
      db.insert(schema.packs)
        .values({
          name: 'stat-pack',
          displayName: 'Stat Pack',
          description: 'Stats test',
          authorName: 'tester',
          downloads: 100,
        })
        .run();

      const res = await app.handle(new Request('http://localhost/stats'));
      const body = await res.json();
      expect(body.totalPacks).toBe(1);
      expect(body.totalDownloads).toBe(100);
    });
  });

  describe('GET /tags', () => {
    test('returns tags with counts', async () => {
      db.insert(schema.packs)
        .values({
          name: 'tag-pack-1',
          displayName: 'Tag Pack 1',
          description: 'Test',
          authorName: 'tester',
          tags: ['typescript', 'testing'],
        })
        .run();

      db.insert(schema.packs)
        .values({
          name: 'tag-pack-2',
          displayName: 'Tag Pack 2',
          description: 'Test',
          authorName: 'tester',
          tags: ['typescript', 'react'],
        })
        .run();

      const res = await app.handle(new Request('http://localhost/tags'));
      const body = await res.json();
      expect(body.tags.length).toBeGreaterThan(0);
      const tsTag = body.tags.find((t: any) => t.tag === 'typescript');
      expect(tsTag?.count).toBe(2);
    });
  });

  describe('GET /targets/:targetId', () => {
    test('returns packs for a target', async () => {
      db.insert(schema.packs)
        .values({
          name: 'oc-pack',
          displayName: 'OC Pack',
          description: 'Test',
          authorName: 'tester',
          targets: ['opencode', 'cursor'],
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/targets/opencode')
      );
      const body = await res.json();
      expect(body.packs).toHaveLength(1);
      expect(body.packs[0].name).toBe('oc-pack');
    });

    test('returns empty for unknown target', async () => {
      const res = await app.handle(
        new Request('http://localhost/targets/unknown')
      );
      const body = await res.json();
      expect(body.packs).toHaveLength(0);
    });
  });

  describe('POST /packs (publish)', () => {
    test('returns 401 without auth', async () => {
      const form = new FormData();
      form.append('tarball', new Blob(['test']), 'pack.tgz');
      form.append(
        'metadata',
        JSON.stringify({ name: 'test', version: '1.0.0', manifest: {} })
      );

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          body: form,
        })
      );
      expect(res.status).toBe(401);
    });

    test('publishes with valid auth', async () => {
      // Create an auth token directly in the test DB
      const { hashToken, generateToken } = await import('../src/auth/token.js');
      const rawToken = generateToken();
      db.insert(schema.authTokens)
        .values({
          token: hashToken(rawToken),
          username: 'publisher',
          scope: 'publish',
        })
        .run();

      const form = new FormData();
      form.append(
        'tarball',
        new Blob([Buffer.alloc(100)]),
        'new-pack-1.0.0.tgz'
      );
      form.append(
        'metadata',
        JSON.stringify({
          name: 'new-pack',
          version: '1.0.0',
          manifest: {
            name: 'new-pack',
            description: 'Published via test',
            tags: ['test'],
            targets: ['opencode'],
          },
        })
      );

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${rawToken}` },
          body: form,
        })
      );

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.name).toBe('new-pack');
      expect(body.version).toBe('1.0.0');
      expect(body.integrity).toMatch(/^sha256-/);

      // Verify the pack was created
      const packRes = await app.handle(
        new Request('http://localhost/packs/new-pack')
      );
      expect(packRes.status).toBe(200);
      const packBody = await packRes.json();
      expect(packBody.authorName).toBe('publisher');
    });
  });

  describe('DELETE /packs/:name/versions/:version', () => {
    test('returns 401 without auth', async () => {
      const res = await app.handle(
        new Request('http://localhost/packs/test/versions/1.0.0', {
          method: 'DELETE',
        })
      );
      expect(res.status).toBe(401);
    });

    test('returns 403 for non-owner', async () => {
      // Pack owned by alice
      db.insert(schema.packs)
        .values({
          name: 'alice-pack',
          displayName: 'Alice Pack',
          description: 'Test',
          authorName: 'alice',
        })
        .run();

      db.insert(schema.packVersions)
        .values({
          packName: 'alice-pack',
          version: '1.0.0',
          integrity: 'sha256-test',
          tarballUrl: '/download',
          tarballSize: 100,
          packManifest: {},
          createdAt: new Date().toISOString(),
        })
        .run();

      // Auth as bob
      const { hashToken, generateToken } = await import('../src/auth/token.js');
      const rawToken = generateToken();
      db.insert(schema.authTokens)
        .values({
          token: hashToken(rawToken),
          username: 'bob',
          scope: 'publish',
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/alice-pack/versions/1.0.0', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${rawToken}` },
        })
      );
      expect(res.status).toBe(403);
    });

    test('deletes version as owner', async () => {
      db.insert(schema.packs)
        .values({
          name: 'owner-pack',
          displayName: 'Owner Pack',
          description: 'Test',
          authorName: 'owner',
        })
        .run();

      db.insert(schema.packVersions)
        .values({
          packName: 'owner-pack',
          version: '1.0.0',
          integrity: 'sha256-test',
          tarballUrl: '/download',
          tarballSize: 100,
          packManifest: {},
          createdAt: new Date().toISOString(),
        })
        .run();

      const { hashToken, generateToken } = await import('../src/auth/token.js');
      const rawToken = generateToken();
      db.insert(schema.authTokens)
        .values({
          token: hashToken(rawToken),
          username: 'owner',
          scope: 'publish',
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/owner-pack/versions/1.0.0', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${rawToken}` },
        })
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.deleted).toBe(true);

      // Verify deleted
      const vRes = await app.handle(
        new Request('http://localhost/packs/owner-pack/versions/1.0.0')
      );
      expect(vRes.status).toBe(404);
    });
  });
});
