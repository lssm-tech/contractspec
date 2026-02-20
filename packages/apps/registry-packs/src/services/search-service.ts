import { like, desc, sql } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { packs, type Pack } from '../db/schema.js';

/**
 * Search parameters.
 */
export interface SearchParams {
  q?: string;
  tags?: string[];
  targets?: string[];
  features?: string[];
  author?: string;
  sort?: 'downloads' | 'updated' | 'name' | 'weekly';
  limit?: number;
  offset?: number;
}

/**
 * Search service for packs.
 */
export class SearchService {
  constructor(private db: Db) {}

  /** Search packs with filters. */
  async search(params: SearchParams): Promise<{
    packs: Pack[];
    total: number;
  }> {
    const limit = Math.min(params.limit ?? 20, 100);
    const offset = params.offset ?? 0;

    // Build dynamic query
    let query = this.db.select().from(packs).$dynamic();

    // Text search on name + description
    if (params.q) {
      const pattern = `%${params.q}%`;
      query = query.where(
        sql`(${packs.name} LIKE ${pattern} OR ${packs.description} LIKE ${pattern} OR ${packs.displayName} LIKE ${pattern})`
      );
    }

    // Tag filter (JSON contains)
    if (params.tags?.length) {
      for (const tag of params.tags) {
        query = query.where(sql`json_each.value = ${tag}`);
      }
    }

    // Author filter
    if (params.author) {
      query = query.where(like(packs.authorName, `%${params.author}%`));
    }

    // Sort
    const orderBy =
      params.sort === 'downloads'
        ? desc(packs.downloads)
        : params.sort === 'weekly'
          ? desc(packs.weeklyDownloads)
          : params.sort === 'name'
            ? packs.name
            : desc(packs.updatedAt);

    const results = await query.orderBy(orderBy).limit(limit).offset(offset);

    // Count total
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(packs);
    const total = countResult[0]?.count ?? 0;

    return { packs: results, total };
  }

  /** Get all unique tags with counts. */
  async getTags(): Promise<{ tag: string; count: number }[]> {
    const result = await this.db.all<{ tag: string; count: number }>(
      sql`SELECT json_each.value as tag, count(*) as count FROM packs, json_each(packs.tags) GROUP BY json_each.value ORDER BY count DESC`
    );
    return result;
  }

  /** Get packs by target. */
  async getByTarget(targetId: string, limit = 20): Promise<Pack[]> {
    const result = await this.db.all<Pack>(
      sql`SELECT packs.* FROM packs, json_each(packs.targets) WHERE json_each.value = ${targetId} ORDER BY packs.downloads DESC LIMIT ${limit}`
    );
    return result;
  }

  /** Get global stats. */
  async getStats(): Promise<{
    totalPacks: number;
    totalDownloads: number;
    totalVersions: number;
  }> {
    const packCount = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(packs);

    const downloadSum = await this.db
      .select({ sum: sql<number>`coalesce(sum(${packs.downloads}), 0)` })
      .from(packs);

    return {
      totalPacks: packCount[0]?.count ?? 0,
      totalDownloads: downloadSum[0]?.sum ?? 0,
      totalVersions: 0, // TODO: count from pack_versions
    };
  }
}
