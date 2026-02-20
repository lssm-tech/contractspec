/**
 * Tests for StatsService — download tracking and aggregation.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { StatsService } from '../src/services/stats-service.js';
import { eq } from 'drizzle-orm';

let db: Db;
let statsService: StatsService;

function seedPack(name: string = 'test-pack') {
  db.insert(schema.packs)
    .values({
      name,
      displayName: 'Test Pack',
      description: 'A test pack',
      authorName: 'tester',
    })
    .run();
}

describe('StatsService', () => {
  beforeEach(() => {
    db = setupTestDb();
    statsService = new StatsService(db);
  });

  describe('recordDownload', () => {
    test('creates a daily stat entry', async () => {
      seedPack();
      await statsService.recordDownload('test-pack');

      const stats = await db
        .select()
        .from(schema.downloadStats)
        .where(eq(schema.downloadStats.packName, 'test-pack'));

      expect(stats).toHaveLength(1);
      expect(stats[0]!.count).toBe(1);
    });

    test('increments existing daily stat', async () => {
      seedPack();
      await statsService.recordDownload('test-pack');
      await statsService.recordDownload('test-pack');
      await statsService.recordDownload('test-pack');

      const stats = await db
        .select()
        .from(schema.downloadStats)
        .where(eq(schema.downloadStats.packName, 'test-pack'));

      expect(stats).toHaveLength(1);
      expect(stats[0]!.count).toBe(3);
    });

    test('increments pack total download counter', async () => {
      seedPack();
      await statsService.recordDownload('test-pack');
      await statsService.recordDownload('test-pack');

      const pack = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'test-pack'));

      expect(pack[0]!.downloads).toBe(2);
    });
  });

  describe('getPackStats', () => {
    test('returns null for non-existent pack', async () => {
      const result = await statsService.getPackStats('nonexistent');
      expect(result).toBeNull();
    });

    test('returns empty dailyStats for new pack', async () => {
      seedPack();
      const result = await statsService.getPackStats('test-pack');

      expect(result).not.toBeNull();
      expect(result!.packName).toBe('test-pack');
      expect(result!.totalDownloads).toBe(0);
      expect(result!.dailyStats).toEqual([]);
    });

    test('returns daily stats after downloads', async () => {
      seedPack();
      await statsService.recordDownload('test-pack');
      await statsService.recordDownload('test-pack');

      const result = await statsService.getPackStats('test-pack');

      expect(result).not.toBeNull();
      expect(result!.totalDownloads).toBe(2);
      expect(result!.dailyStats).toHaveLength(1);
      expect(result!.dailyStats[0]!.count).toBe(2);
    });
  });

  describe('recalculateWeekly', () => {
    test('updates weekly downloads from daily stats', async () => {
      seedPack();

      // Insert some daily stats for the past few days
      const today = new Date();
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        db.insert(schema.downloadStats)
          .values({
            packName: 'test-pack',
            date: date.toISOString().slice(0, 10),
            count: 10,
          })
          .run();
      }

      const updated = await statsService.recalculateWeekly();
      expect(updated).toBe(1);

      const pack = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'test-pack'));

      expect(pack[0]!.weeklyDownloads).toBe(50); // 5 days * 10 per day
    });

    test('resets weekly for packs with no recent downloads', async () => {
      seedPack('active-pack');
      seedPack('inactive-pack');

      // Set some initial weekly downloads
      db.update(schema.packs)
        .set({ weeklyDownloads: 100 })
        .where(eq(schema.packs.name, 'inactive-pack'))
        .run();

      // Only active pack has recent downloads
      db.insert(schema.downloadStats)
        .values({
          packName: 'active-pack',
          date: new Date().toISOString().slice(0, 10),
          count: 5,
        })
        .run();

      await statsService.recalculateWeekly();

      const active = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'active-pack'));

      const inactive = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'inactive-pack'));

      expect(active[0]!.weeklyDownloads).toBe(5);
      expect(inactive[0]!.weeklyDownloads).toBe(0);
    });
  });
});
