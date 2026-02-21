/**
 * Tests for QualityService — automated pack quality scoring.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { QualityService } from '../src/services/quality-service.js';
import { eq } from 'drizzle-orm';

let db: Db;
let qualityService: QualityService;

function seedPack(overrides: Partial<schema.NewPack> = {}) {
  const defaults: schema.NewPack = {
    name: 'test-pack',
    displayName: 'Test Pack',
    description: 'A test pack',
    authorName: 'tester',
    license: 'MIT',
    tags: ['testing', 'tools'],
    targets: ['cursor', 'opencode'],
    features: ['rules', 'agents', 'models'],
    repository: 'https://github.com/test/pack',
    homepage: 'https://test-pack.dev',
    dependencies: [],
    conflicts: [],
  };
  db.insert(schema.packs)
    .values({ ...defaults, ...overrides })
    .run();
}

function seedReadme(packName: string = 'test-pack') {
  db.insert(schema.packReadmes)
    .values({ packName, content: '# Test Pack\nA great pack.' })
    .run();
}

function seedVersions(packName: string, count: number) {
  for (let i = 0; i < count; i++) {
    db.insert(schema.packVersions)
      .values({
        packName,
        version: `1.${i}.0`,
        integrity: `sha256-v${i}`,
        tarballUrl: `/storage/${packName}/1.${i}.0.tgz`,
        tarballSize: 1000,
        packManifest: {},
      })
      .run();
  }
}

describe('QualityService', () => {
  beforeEach(() => {
    db = setupTestDb();
    qualityService = new QualityService(db);
  });

  describe('computeScore', () => {
    test('returns null for non-existent pack', async () => {
      const result = await qualityService.computeScore('nonexistent');
      expect(result).toBeNull();
    });

    test('computes perfect score for well-configured pack', async () => {
      seedPack();
      seedReadme();
      seedVersions('test-pack', 3); // Multiple versions

      const breakdown = await qualityService.computeScore('test-pack');
      expect(breakdown).not.toBeNull();
      expect(breakdown!.hasReadme).toBe(true); // +20
      expect(breakdown!.hasMultipleVersions).toBe(true); // +10
      expect(breakdown!.hasLicense).toBe(true); // +10
      expect(breakdown!.targetCoverage).toBe(2); // +10 (2/4 * 20)
      expect(breakdown!.featureCount).toBe(3); // +9 (3/5 * 15)
      expect(breakdown!.hasTags).toBe(true); // +10
      expect(breakdown!.hasRepository).toBe(true); // +5
      expect(breakdown!.hasHomepage).toBe(true); // +5
      expect(breakdown!.noConflicts).toBe(true); // +5
      expect(breakdown!.total).toBe(84); // 20+10+10+10+9+10+5+5+5
    });

    test('computes low score for minimal pack', async () => {
      seedPack({
        license: '',
        tags: [],
        targets: [],
        features: [],
        repository: undefined,
        homepage: undefined,
        conflicts: [],
      });

      const breakdown = await qualityService.computeScore('test-pack');
      expect(breakdown).not.toBeNull();
      expect(breakdown!.hasReadme).toBe(false);
      expect(breakdown!.hasMultipleVersions).toBe(false);
      expect(breakdown!.hasLicense).toBe(false);
      expect(breakdown!.hasTags).toBe(false);
      expect(breakdown!.total).toBe(5); // Only noConflicts +5
    });

    test('penalizes packs with conflicts', async () => {
      seedPack({
        conflicts: ['other-pack'],
      });
      seedReadme();

      const breakdown = await qualityService.computeScore('test-pack');
      expect(breakdown!.noConflicts).toBe(false);
    });

    test('caps target coverage at 4', async () => {
      seedPack({
        targets: ['cursor', 'opencode', 'claude', 'copilot', 'windsurf'],
      });

      const breakdown = await qualityService.computeScore('test-pack');
      expect(breakdown!.targetCoverage).toBe(4); // Capped at 4
    });

    test('caps feature count at 5', async () => {
      seedPack({
        features: ['rules', 'agents', 'models', 'settings', 'mcp', 'extras'],
      });

      const breakdown = await qualityService.computeScore('test-pack');
      expect(breakdown!.featureCount).toBe(5); // Capped at 5
    });
  });

  describe('updateScore', () => {
    test('persists quality score to packs table', async () => {
      seedPack();
      seedReadme();

      const score = await qualityService.updateScore('test-pack');
      expect(score).not.toBeNull();
      expect(score).toBeGreaterThan(0);

      const pack = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'test-pack'));
      expect(pack[0]!.qualityScore).toBe(score);
    });

    test('returns null for non-existent pack', async () => {
      const score = await qualityService.updateScore('nonexistent');
      expect(score).toBeNull();
    });
  });

  describe('recalculateAll', () => {
    test('updates scores for all packs', async () => {
      seedPack({ name: 'pack-a' });
      seedPack({ name: 'pack-b' });
      seedReadme('pack-a');

      const count = await qualityService.recalculateAll();
      expect(count).toBe(2);

      const packA = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'pack-a'));
      const packB = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'pack-b'));

      // pack-a has readme, pack-b doesn't — pack-a should score higher
      expect(packA[0]!.qualityScore).toBeGreaterThan(packB[0]!.qualityScore!);
    });
  });

  describe('getBadge', () => {
    test('returns correct badge labels', () => {
      expect(QualityService.getBadge(null)).toBe('unrated');
      expect(QualityService.getBadge(90)).toBe('excellent');
      expect(QualityService.getBadge(80)).toBe('excellent');
      expect(QualityService.getBadge(70)).toBe('good');
      expect(QualityService.getBadge(60)).toBe('good');
      expect(QualityService.getBadge(50)).toBe('fair');
      expect(QualityService.getBadge(40)).toBe('fair');
      expect(QualityService.getBadge(30)).toBe('needs-work');
      expect(QualityService.getBadge(0)).toBe('needs-work');
    });
  });
});

describe('Quality route', () => {
  let app: typeof import('../src/server.js').app;

  beforeEach(async () => {
    db = setupTestDb();
    qualityService = new QualityService(db);
    app = (await import('../src/server.js')).app;

    db.insert(schema.packs)
      .values({
        name: 'quality-pack',
        displayName: 'Quality Pack',
        description: 'For quality route tests',
        authorName: 'tester',
        tags: ['testing'],
        targets: ['cursor'],
        features: ['rules'],
      })
      .run();
  });

  test('GET /packs/:name/quality returns score breakdown', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/quality-pack/quality')
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.packName).toBe('quality-pack');
    expect(typeof body.score).toBe('number');
    expect(body.badge).toBeDefined();
    expect(body.breakdown).toBeDefined();
  });

  test('GET /packs/:name/quality returns 404 for unknown pack', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/nonexistent/quality')
    );
    expect(res.status).toBe(404);
  });

  test('GET /packs/:name/quality?recalculate=true updates stored score', async () => {
    const res = await app.handle(
      new Request(
        'http://localhost/packs/quality-pack/quality?recalculate=true'
      )
    );
    expect(res.status).toBe(200);
    const body = await res.json();

    // Check the stored score matches
    const pack = await db
      .select()
      .from(schema.packs)
      .where(eq(schema.packs.name, 'quality-pack'));
    expect(pack[0]!.qualityScore).toBe(body.score);
  });
});
