/**
 * Download stats service — daily aggregation and weekly rolling window.
 */
import { eq, sql, and, gte } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { downloadStats, packs } from '../db/schema.js';

export interface DailyStats {
  date: string;
  count: number;
}

export interface PackStats {
  packName: string;
  totalDownloads: number;
  weeklyDownloads: number;
  dailyStats: DailyStats[];
}

export class StatsService {
  constructor(private db: Db) {}

  /**
   * Record a download for a pack. Increments today's daily count
   * and the pack's total/weekly counters.
   */
  async recordDownload(packName: string): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);

    // Upsert daily stat
    const existing = await this.db
      .select()
      .from(downloadStats)
      .where(
        and(eq(downloadStats.packName, packName), eq(downloadStats.date, today))
      )
      .limit(1);

    if (existing.length > 0) {
      await this.db
        .update(downloadStats)
        .set({ count: sql`${downloadStats.count} + 1` })
        .where(
          and(
            eq(downloadStats.packName, packName),
            eq(downloadStats.date, today)
          )
        );
    } else {
      await this.db
        .insert(downloadStats)
        .values({ packName, date: today, count: 1 });
    }

    // Increment pack total downloads
    await this.db
      .update(packs)
      .set({ downloads: sql`${packs.downloads} + 1` })
      .where(eq(packs.name, packName));
  }

  /**
   * Get download stats for a pack.
   * Returns daily counts for the last 30 days + total/weekly summary.
   */
  async getPackStats(
    packName: string,
    days: number = 30
  ): Promise<PackStats | null> {
    const pack = await this.db
      .select({
        name: packs.name,
        downloads: packs.downloads,
        weeklyDownloads: packs.weeklyDownloads,
      })
      .from(packs)
      .where(eq(packs.name, packName))
      .limit(1);

    if (pack.length === 0) return null;

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().slice(0, 10);

    const daily = await this.db
      .select({
        date: downloadStats.date,
        count: downloadStats.count,
      })
      .from(downloadStats)
      .where(
        and(
          eq(downloadStats.packName, packName),
          gte(downloadStats.date, sinceStr)
        )
      )
      .orderBy(downloadStats.date);

    return {
      packName,
      totalDownloads: pack[0]!.downloads,
      weeklyDownloads: pack[0]!.weeklyDownloads,
      dailyStats: daily,
    };
  }

  /**
   * Recalculate weekly downloads for all packs.
   * Should be called by a daily cron/worker.
   */
  async recalculateWeekly(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sinceStr = sevenDaysAgo.toISOString().slice(0, 10);

    // Get weekly totals per pack
    const weeklyTotals = await this.db
      .select({
        packName: downloadStats.packName,
        weeklyTotal: sql<number>`coalesce(sum(${downloadStats.count}), 0)`,
      })
      .from(downloadStats)
      .where(gte(downloadStats.date, sinceStr))
      .groupBy(downloadStats.packName);

    // Reset all packs to 0 first
    await this.db.update(packs).set({ weeklyDownloads: 0 });

    // Update each pack with its weekly total
    let updated = 0;
    for (const { packName, weeklyTotal } of weeklyTotals) {
      await this.db
        .update(packs)
        .set({ weeklyDownloads: weeklyTotal })
        .where(eq(packs.name, packName));
      updated++;
    }

    return updated;
  }
}
