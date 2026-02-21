/**
 * E2E test: Full publish → search → info → download → verify integrity flow.
 *
 * Uses in-memory SQLite + app.handle() to simulate the full lifecycle
 * without starting a real server.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { createHash } from 'crypto';
import { setupTestDb } from '../test-app.js';
import * as schema from '../../src/db/schema.js';
import type { Db } from '../../src/db/client.js';
import { app } from '../../src/server.js';
import {
  publishLimiter,
  generalLimiter,
} from '../../src/middleware/rate-limit.js';

let db: Db;

async function createToken(database: Db, username: string): Promise<string> {
  const { hashToken, generateToken } = await import('../../src/auth/token.js');
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

describe('E2E: Publish → Search → Install flow', () => {
  beforeEach(() => {
    db = setupTestDb();
    publishLimiter.clear();
    generalLimiter.clear();
  });

  test('full pack lifecycle', async () => {
    // ──────────────────────────────────────────────
    // Step 1: Authenticate
    // ──────────────────────────────────────────────
    const token = await createToken(db, 'pack-author');

    // ──────────────────────────────────────────────
    // Step 2: Publish a pack
    // ──────────────────────────────────────────────
    const packContent = Buffer.from(
      JSON.stringify({
        name: 'e2e-test-pack',
        version: '1.0.0',
        description: 'End-to-end test pack',
        rules: [{ name: 'test-rule', content: 'Always write tests.' }],
      })
    );

    const form = new FormData();
    form.append('tarball', new Blob([packContent]), 'e2e-test-pack-1.0.0.tgz');
    form.append(
      'metadata',
      JSON.stringify({
        name: 'e2e-test-pack',
        version: '1.0.0',
        manifest: {
          name: 'E2E Test Pack',
          description: 'A pack for testing the full publish flow',
          tags: ['testing', 'e2e', 'typescript'],
          targets: ['opencode', 'cursor', 'claude'],
          features: ['rules', 'commands'],
        },
      })
    );

    const publishRes = await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
    );

    expect(publishRes.status).toBe(201);
    const publishBody = await publishRes.json();
    expect(publishBody.name).toBe('e2e-test-pack');
    expect(publishBody.version).toBe('1.0.0');
    expect(publishBody.integrity).toMatch(/^sha256-/);

    // Verify integrity matches expected hash
    const expectedHash = `sha256-${createHash('sha256').update(packContent).digest('hex')}`;
    expect(publishBody.integrity).toBe(expectedHash);

    // ──────────────────────────────────────────────
    // Step 3: Search for the pack
    // ──────────────────────────────────────────────
    const searchRes = await app.handle(
      new Request('http://localhost/packs?q=e2e-test')
    );
    expect(searchRes.status).toBe(200);
    const searchBody = await searchRes.json();
    expect(searchBody.packs).toHaveLength(1);
    expect(searchBody.packs[0].name).toBe('e2e-test-pack');
    expect(searchBody.packs[0].description).toBe(
      'A pack for testing the full publish flow'
    );

    // ──────────────────────────────────────────────
    // Step 4: Get pack info
    // ──────────────────────────────────────────────
    const infoRes = await app.handle(
      new Request('http://localhost/packs/e2e-test-pack')
    );
    expect(infoRes.status).toBe(200);
    const infoBody = await infoRes.json();
    expect(infoBody.name).toBe('e2e-test-pack');
    expect(infoBody.authorName).toBe('pack-author');
    expect(infoBody.tags).toEqual(['testing', 'e2e', 'typescript']);
    expect(infoBody.targets).toEqual(['opencode', 'cursor', 'claude']);
    expect(infoBody.features).toEqual(['rules', 'commands']);
    expect(infoBody.versions).toHaveLength(1);
    expect(infoBody.versions[0].version).toBe('1.0.0');

    // ──────────────────────────────────────────────
    // Step 5: Get version details
    // ──────────────────────────────────────────────
    const versionRes = await app.handle(
      new Request('http://localhost/packs/e2e-test-pack/versions/1.0.0')
    );
    expect(versionRes.status).toBe(200);
    const versionBody = await versionRes.json();
    expect(versionBody.version).toBe('1.0.0');
    expect(versionBody.integrity).toBe(expectedHash);
    expect(versionBody.tarballSize).toBe(packContent.length);

    // ──────────────────────────────────────────────
    // Step 6: Verify pack appears in tag search
    // ──────────────────────────────────────────────
    const tagRes = await app.handle(new Request('http://localhost/tags'));
    expect(tagRes.status).toBe(200);
    const tagBody = await tagRes.json();
    const typescriptTag = tagBody.tags.find(
      (t: { tag: string }) => t.tag === 'typescript'
    );
    expect(typescriptTag).toBeDefined();
    expect(typescriptTag.count).toBe(1);

    // ──────────────────────────────────────────────
    // Step 7: Verify pack appears in target search
    // ──────────────────────────────────────────────
    const targetRes = await app.handle(
      new Request('http://localhost/targets/opencode')
    );
    expect(targetRes.status).toBe(200);
    const targetBody = await targetRes.json();
    expect(targetBody.packs).toHaveLength(1);
    expect(targetBody.packs[0].name).toBe('e2e-test-pack');

    // ──────────────────────────────────────────────
    // Step 8: Verify global stats updated
    // ──────────────────────────────────────────────
    const statsRes = await app.handle(new Request('http://localhost/stats'));
    expect(statsRes.status).toBe(200);
    const statsBody = await statsRes.json();
    expect(statsBody.totalPacks).toBe(1);
  });

  test('publish second version updates pack metadata', async () => {
    const token = await createToken(db, 'versioner');

    // Publish v1.0.0
    const form1 = new FormData();
    form1.append(
      'tarball',
      new Blob([Buffer.alloc(50)]),
      'versioned-pack-1.0.0.tgz'
    );
    form1.append(
      'metadata',
      JSON.stringify({
        name: 'versioned-pack',
        version: '1.0.0',
        manifest: {
          name: 'Versioned Pack',
          description: 'Version 1',
          tags: ['v1'],
          targets: ['opencode'],
        },
      })
    );

    const res1 = await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form1,
      })
    );
    expect(res1.status).toBe(201);

    // Publish v2.0.0 with updated metadata
    const form2 = new FormData();
    form2.append(
      'tarball',
      new Blob([Buffer.alloc(75)]),
      'versioned-pack-2.0.0.tgz'
    );
    form2.append(
      'metadata',
      JSON.stringify({
        name: 'versioned-pack',
        version: '2.0.0',
        manifest: {
          name: 'Versioned Pack',
          description: 'Version 2 with improvements',
          tags: ['v1', 'v2'],
          targets: ['opencode', 'cursor'],
        },
      })
    );

    const res2 = await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form2,
      })
    );
    expect(res2.status).toBe(201);

    // Verify pack metadata was updated
    const infoRes = await app.handle(
      new Request('http://localhost/packs/versioned-pack')
    );
    const infoBody = await infoRes.json();
    expect(infoBody.description).toBe('Version 2 with improvements');
    expect(infoBody.tags).toEqual(['v1', 'v2']);
    expect(infoBody.targets).toEqual(['opencode', 'cursor']);
    expect(infoBody.versions).toHaveLength(2);
  });

  test('publish → deprecate → verify deprecation visible', async () => {
    const token = await createToken(db, 'deprecator');

    // Publish
    const form = new FormData();
    form.append(
      'tarball',
      new Blob([Buffer.alloc(50)]),
      'will-deprecate-1.0.0.tgz'
    );
    form.append(
      'metadata',
      JSON.stringify({
        name: 'will-deprecate',
        version: '1.0.0',
        manifest: {
          name: 'Will Deprecate',
          description: 'This will be deprecated',
        },
      })
    );

    await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
    );

    // Deprecate
    const deprecateRes = await app.handle(
      new Request('http://localhost/packs/will-deprecate/deprecate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deprecated: true,
          message: 'Use new-replacement instead',
        }),
      })
    );
    expect(deprecateRes.status).toBe(200);

    // Verify deprecation visible on detail
    const detailRes = await app.handle(
      new Request('http://localhost/packs/will-deprecate')
    );
    const detailBody = await detailRes.json();
    expect(detailBody.deprecated).toBe(true);
    expect(detailBody.deprecationMessage).toBe('Use new-replacement instead');
  });

  test('duplicate version publish returns 409', async () => {
    const token = await createToken(db, 'dup-publisher');

    const form = new FormData();
    form.append('tarball', new Blob([Buffer.alloc(50)]), 'dup-pack-1.0.0.tgz');
    form.append(
      'metadata',
      JSON.stringify({
        name: 'dup-pack',
        version: '1.0.0',
        manifest: { name: 'dup-pack' },
      })
    );

    // First publish succeeds
    const res1 = await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
    );
    expect(res1.status).toBe(201);

    // Second publish of same version fails
    const form2 = new FormData();
    form2.append('tarball', new Blob([Buffer.alloc(50)]), 'dup-pack-1.0.0.tgz');
    form2.append(
      'metadata',
      JSON.stringify({
        name: 'dup-pack',
        version: '1.0.0',
        manifest: { name: 'dup-pack' },
      })
    );

    const res2 = await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form2,
      })
    );
    expect(res2.status).toBe(409);
  });

  test('publish → delete version → verify removed', async () => {
    const token = await createToken(db, 'deleter');

    // Publish
    const form = new FormData();
    form.append('tarball', new Blob([Buffer.alloc(50)]), 'del-pack-1.0.0.tgz');
    form.append(
      'metadata',
      JSON.stringify({
        name: 'del-pack',
        version: '1.0.0',
        manifest: { name: 'del-pack', description: 'Will delete' },
      })
    );

    await app.handle(
      new Request('http://localhost/packs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
    );

    // Delete version
    const deleteRes = await app.handle(
      new Request('http://localhost/packs/del-pack/versions/1.0.0', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    expect(deleteRes.status).toBe(200);

    // Verify version is gone
    const versionRes = await app.handle(
      new Request('http://localhost/packs/del-pack/versions/1.0.0')
    );
    expect(versionRes.status).toBe(404);
  });
});
