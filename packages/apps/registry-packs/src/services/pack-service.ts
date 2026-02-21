import { eq, desc, sql } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { packs, packReadmes, type Pack, type NewPack } from '../db/schema.js';

/**
 * CRUD operations for packs.
 */
export class PackService {
  constructor(private db: Db) {}

  /** Get a pack by name. */
  async get(name: string): Promise<Pack | null> {
    const result = await this.db
      .select()
      .from(packs)
      .where(eq(packs.name, name))
      .limit(1);
    return result[0] ?? null;
  }

  /** List packs with pagination. */
  async list(opts: {
    limit?: number;
    offset?: number;
    sort?: 'downloads' | 'updated' | 'name' | 'weekly';
  }): Promise<{ packs: Pack[]; total: number }> {
    const limit = opts.limit ?? 20;
    const offset = opts.offset ?? 0;

    const orderBy =
      opts.sort === 'downloads'
        ? desc(packs.downloads)
        : opts.sort === 'weekly'
          ? desc(packs.weeklyDownloads)
          : opts.sort === 'name'
            ? packs.name
            : desc(packs.updatedAt);

    const results = await this.db
      .select()
      .from(packs)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(packs);
    const total = countResult[0]?.count ?? 0;

    return { packs: results, total };
  }

  /** Create a new pack. */
  async create(pack: NewPack): Promise<Pack> {
    await this.db.insert(packs).values(pack);
    const created = await this.get(pack.name);
    if (!created) {
      throw new Error(`Failed to create pack: ${pack.name}`);
    }
    return created;
  }

  /** Update a pack. */
  async update(
    name: string,
    updates: Partial<Omit<NewPack, 'name'>>
  ): Promise<Pack | null> {
    await this.db
      .update(packs)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(packs.name, name));
    return this.get(name);
  }

  /** Delete a pack and all its versions/readme. */
  async delete(name: string): Promise<boolean> {
    const result = await this.db.delete(packs).where(eq(packs.name, name));
    return result.changes > 0;
  }

  /** Get featured packs. */
  async featured(limit?: number): Promise<Pack[]> {
    return this.db
      .select()
      .from(packs)
      .where(eq(packs.featured, true))
      .orderBy(desc(packs.downloads))
      .limit(limit ?? 10);
  }

  /** Increment download counter. */
  async incrementDownloads(name: string): Promise<void> {
    await this.db
      .update(packs)
      .set({
        downloads: sql`${packs.downloads} + 1`,
        weeklyDownloads: sql`${packs.weeklyDownloads} + 1`,
      })
      .where(eq(packs.name, name));
  }

  /** Get pack readme. */
  async getReadme(name: string): Promise<string | null> {
    const result = await this.db
      .select()
      .from(packReadmes)
      .where(eq(packReadmes.packName, name))
      .limit(1);
    return result[0]?.content ?? null;
  }

  /** Set pack readme. */
  async setReadme(name: string, content: string): Promise<void> {
    await this.db
      .insert(packReadmes)
      .values({ packName: name, content })
      .onConflictDoUpdate({
        target: packReadmes.packName,
        set: { content },
      });
  }
}
