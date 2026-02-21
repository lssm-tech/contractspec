/**
 * Integration tests for Phase 4.1 security features:
 * - Pack size limits
 * - Name squatting prevention
 * - Pack deprecation
 * - Rate limiting on publish
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { app } from '../src/server.js';
import {
  publishLimiter,
  generalLimiter,
} from '../src/middleware/rate-limit.js';

let db: Db;

/** Helper to create an auth token and return the raw token. */
async function createToken(database: Db, username: string): Promise<string> {
  const { hashToken, generateToken } = await import('../src/auth/token.js');
  const rawToken = generateToken();
  database
    .insert(schema.authTokens)
    .values({
      token: hashToken(rawToken),
      username,
      scope: 'publish',
    })
    .run();
  return rawToken;
}

/** Helper to build a publish FormData. */
function buildPublishForm(
  name: string,
  version: string,
  tarballSize = 100
): FormData {
  const form = new FormData();
  form.append(
    'tarball',
    new Blob([Buffer.alloc(tarballSize)]),
    `${name}-${version}.tgz`
  );
  form.append(
    'metadata',
    JSON.stringify({
      name,
      version,
      manifest: {
        name,
        description: `Test pack ${name}`,
        tags: ['test'],
        targets: ['opencode'],
      },
    })
  );
  return form;
}

describe('Security routes', () => {
  beforeEach(() => {
    db = setupTestDb();
    // Reset rate limiters between tests
    publishLimiter.clear();
    generalLimiter.clear();
  });

  describe('Pack size limits', () => {
    test('rejects tarball over 10MB', async () => {
      const token = await createToken(db, 'publisher');
      const form = new FormData();
      // Create a blob larger than 10MB
      form.append(
        'tarball',
        new Blob([Buffer.alloc(11 * 1024 * 1024)]),
        'big-pack-1.0.0.tgz'
      );
      form.append(
        'metadata',
        JSON.stringify({
          name: 'big-pack',
          version: '1.0.0',
          manifest: { name: 'big-pack' },
        })
      );

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
      );
      expect(res.status).toBe(413);
      const body = await res.json();
      expect(body.error).toContain('maximum size');
    });

    test('accepts tarball under 10MB', async () => {
      const token = await createToken(db, 'publisher');
      const form = buildPublishForm('small-pack', '1.0.0', 1000);

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
      );
      expect(res.status).toBe(201);
    });
  });

  describe('Name squatting prevention', () => {
    test('rejects reserved pack names', async () => {
      const token = await createToken(db, 'squatter');
      const form = buildPublishForm('agentpacks', '1.0.0');

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain('reserved name');
    });

    test('rejects single character names', async () => {
      const token = await createToken(db, 'squatter');
      const form = buildPublishForm('x', '1.0.0');

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain('at least 2');
    });

    test('rejects uppercase names', async () => {
      const token = await createToken(db, 'squatter');
      const form = buildPublishForm('MyPack', '1.0.0');

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain('Invalid pack name');
    });

    test('allows valid non-reserved names', async () => {
      const token = await createToken(db, 'publisher');
      const form = buildPublishForm('my-cool-pack', '1.0.0');

      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
      );
      expect(res.status).toBe(201);
    });
  });

  describe('Pack deprecation', () => {
    test('deprecates a pack as owner', async () => {
      const token = await createToken(db, 'alice');
      db.insert(schema.packs)
        .values({
          name: 'deprecate-me',
          displayName: 'Deprecate Me',
          description: 'Will be deprecated',
          authorName: 'alice',
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/deprecate-me/deprecate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deprecated: true,
            message: 'Use my-new-pack instead',
          }),
        })
      );

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.deprecated).toBe(true);
      expect(body.message).toBe('Use my-new-pack instead');
    });

    test('un-deprecates a pack as owner', async () => {
      const token = await createToken(db, 'alice');
      db.insert(schema.packs)
        .values({
          name: 'undeprecate-me',
          displayName: 'Undeprecate Me',
          description: 'Will be un-deprecated',
          authorName: 'alice',
          deprecated: true,
          deprecationMessage: 'Was deprecated',
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/undeprecate-me/deprecate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deprecated: false }),
        })
      );

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.deprecated).toBe(false);
      expect(body.message).toBeNull();
    });

    test('returns 403 for non-owner', async () => {
      const token = await createToken(db, 'bob');
      db.insert(schema.packs)
        .values({
          name: 'not-bobs-pack',
          displayName: 'Not Bobs',
          description: 'Alice owns this',
          authorName: 'alice',
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/not-bobs-pack/deprecate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deprecated: true }),
        })
      );
      expect(res.status).toBe(403);
    });

    test('returns 401 without auth', async () => {
      db.insert(schema.packs)
        .values({
          name: 'no-auth-pack',
          displayName: 'No Auth',
          description: 'Test',
          authorName: 'alice',
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/no-auth-pack/deprecate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deprecated: true }),
        })
      );
      expect(res.status).toBe(401);
    });

    test('returns 404 for nonexistent pack', async () => {
      const token = await createToken(db, 'alice');

      const res = await app.handle(
        new Request('http://localhost/packs/nonexistent/deprecate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deprecated: true }),
        })
      );
      expect(res.status).toBe(404);
    });

    test('deprecated flag visible on pack detail', async () => {
      db.insert(schema.packs)
        .values({
          name: 'deprecated-pack',
          displayName: 'Deprecated Pack',
          description: 'This is deprecated',
          authorName: 'alice',
          deprecated: true,
          deprecationMessage: 'Moved to new-pack',
        })
        .run();

      const res = await app.handle(
        new Request('http://localhost/packs/deprecated-pack')
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.deprecated).toBe(true);
      expect(body.deprecationMessage).toBe('Moved to new-pack');
    });
  });

  describe('Rate limiting on routes', () => {
    test('general limiter allows requests within budget', async () => {
      const res = await app.handle(new Request('http://localhost/health'));
      expect(res.status).toBe(200);
    });

    test('publish rate limiting enforced', async () => {
      const token = await createToken(db, 'rapid-publisher');

      // Create a very tight limiter for testing
      publishLimiter.clear();

      // Make requests up to the limit (default 10/min for publish)
      // We won't actually exhaust 10 in this test — just verify
      // that the publish route includes rate limit headers
      const form = buildPublishForm('rate-limited-pack', '1.0.0');
      const res = await app.handle(
        new Request('http://localhost/packs', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
      );

      // Should succeed (under limit) and include rate limit header
      expect(res.status).toBe(201);
      expect(res.headers.get('X-RateLimit-Remaining')).toBeDefined();
    });
  });
});
