/**
 * Tests for GitHubService — signature verification and release handling.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { createHmac } from 'crypto';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import {
  GitHubService,
  type GitHubReleasePayload,
  type GitHubAppConfig,
} from '../src/services/github-service.js';

let db: Db;
const WEBHOOK_SECRET = 'test-webhook-secret';

function makeConfig(repoMap: Record<string, string> = {}): GitHubAppConfig {
  return {
    webhookSecret: WEBHOOK_SECRET,
    repoPackMap: new Map(Object.entries(repoMap)),
  };
}

function makeReleasePayload(
  overrides: Partial<GitHubReleasePayload> = {}
): GitHubReleasePayload {
  return {
    action: 'published',
    release: {
      tag_name: 'v1.0.0',
      name: 'Release 1.0.0',
      body: 'Initial release',
      draft: false,
      prerelease: false,
      assets: [
        {
          name: 'my-pack-1.0.0.tgz',
          browser_download_url: 'https://example.com/assets/pack.tgz',
          content_type: 'application/gzip',
          size: 1024,
        },
      ],
      ...overrides.release,
    },
    repository: {
      full_name: 'test-org/my-pack',
      html_url: 'https://github.com/test-org/my-pack',
      ...overrides.repository,
    },
    ...overrides,
  };
}

function seedPack(name: string) {
  db.insert(schema.packs)
    .values({
      name,
      displayName: name,
      description: 'Test pack',
      authorName: 'tester',
    })
    .run();
}

describe('GitHubService', () => {
  beforeEach(() => {
    db = setupTestDb();
  });

  describe('verifySignature', () => {
    test('verifies valid HMAC-SHA256 signature', () => {
      const config = makeConfig();
      const service = new GitHubService(db, config);

      const payload = '{"test": true}';
      const sig = createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

      expect(service.verifySignature(payload, `sha256=${sig}`)).toBe(true);
    });

    test('rejects invalid signature', () => {
      const config = makeConfig();
      const service = new GitHubService(db, config);

      expect(service.verifySignature('payload', 'sha256=invalid')).toBe(false);
    });

    test('rejects missing sha256= prefix', () => {
      const config = makeConfig();
      const service = new GitHubService(db, config);

      expect(service.verifySignature('payload', 'nope')).toBe(false);
    });
  });

  describe('handleRelease', () => {
    test('ignores non-published actions', async () => {
      const config = makeConfig({ 'test-org/my-pack': 'my-pack' });
      const service = new GitHubService(db, config);

      const result = await service.handleRelease(
        makeReleasePayload({ action: 'created' })
      );
      expect(result).toBeNull();
    });

    test('ignores draft releases', async () => {
      const config = makeConfig({ 'test-org/my-pack': 'my-pack' });
      const service = new GitHubService(db, config);

      const result = await service.handleRelease(
        makeReleasePayload({
          release: {
            ...makeReleasePayload().release,
            draft: true,
          },
        })
      );
      expect(result).toBeNull();
    });

    test('ignores prereleases', async () => {
      const config = makeConfig({ 'test-org/my-pack': 'my-pack' });
      const service = new GitHubService(db, config);

      const result = await service.handleRelease(
        makeReleasePayload({
          release: {
            ...makeReleasePayload().release,
            prerelease: true,
          },
        })
      );
      expect(result).toBeNull();
    });

    test('returns null for unmapped repository', async () => {
      const config = makeConfig({}); // No mappings
      const service = new GitHubService(db, config);

      const result = await service.handleRelease(makeReleasePayload());
      expect(result).toBeNull();
    });

    test('rejects invalid semver tag', async () => {
      const config = makeConfig({ 'test-org/my-pack': 'my-pack' });
      const service = new GitHubService(db, config);

      const result = await service.handleRelease(
        makeReleasePayload({
          release: {
            ...makeReleasePayload().release,
            tag_name: 'not-semver',
          },
        })
      );
      expect(result).not.toBeNull();
      expect(result!.success).toBe(false);
      expect(result!.error).toContain('Invalid semver');
    });

    test('rejects duplicate version', async () => {
      seedPack('my-pack');

      // Seed an existing version
      db.insert(schema.packVersions)
        .values({
          packName: 'my-pack',
          version: '1.0.0',
          integrity: 'sha256-existing',
          tarballUrl: '/storage/existing.tgz',
          tarballSize: 100,
          packManifest: {},
        })
        .run();

      const config = makeConfig({ 'test-org/my-pack': 'my-pack' });
      const service = new GitHubService(db, config);

      const result = await service.handleRelease(makeReleasePayload());
      expect(result!.success).toBe(false);
      expect(result!.error).toContain('already exists');
    });

    test('rejects release with no tarball asset', async () => {
      const config = makeConfig({ 'test-org/my-pack': 'my-pack' });
      const service = new GitHubService(db, config);

      const result = await service.handleRelease(
        makeReleasePayload({
          release: {
            ...makeReleasePayload().release,
            assets: [], // No assets
          },
        })
      );
      expect(result!.success).toBe(false);
      expect(result!.error).toContain('No tarball asset');
    });

    test('strips v prefix from tag for version', async () => {
      const config = makeConfig({ 'test-org/my-pack': 'my-pack' });
      const service = new GitHubService(db, config);

      // This will fail at download (no real server), but we check the version parsing
      const result = await service.handleRelease(
        makeReleasePayload({
          release: {
            ...makeReleasePayload().release,
            tag_name: 'v2.3.4',
          },
        })
      );

      // Will fail at fetch, but the version should be correctly parsed
      if (result) {
        expect(result.version).toBe('2.3.4');
      }
    });
  });
});

describe('GitHub route', () => {
  let app: typeof import('../src/server.js').app;

  beforeEach(async () => {
    db = setupTestDb();
    app = (await import('../src/server.js')).app;
  });

  test('POST /github/webhook returns 503 when not configured', async () => {
    const res = await app.handle(
      new Request('http://localhost/github/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
    );
    // Should be 503 since GITHUB_WEBHOOK_SECRET is not set
    expect(res.status).toBe(503);
  });
});
