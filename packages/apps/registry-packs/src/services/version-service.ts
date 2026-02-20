import { eq, and, desc } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import {
  packVersions,
  type PackVersion,
  type NewPackVersion,
} from '../db/schema.js';

/**
 * Version management for packs.
 */
export class VersionService {
  constructor(private db: Db) {}

  /** Get a specific version. */
  async get(packName: string, version: string): Promise<PackVersion | null> {
    const result = await this.db
      .select()
      .from(packVersions)
      .where(
        and(
          eq(packVersions.packName, packName),
          eq(packVersions.version, version)
        )
      )
      .limit(1);
    return result[0] ?? null;
  }

  /** Get the latest version of a pack. */
  async getLatest(packName: string): Promise<PackVersion | null> {
    const result = await this.db
      .select()
      .from(packVersions)
      .where(eq(packVersions.packName, packName))
      .orderBy(desc(packVersions.createdAt))
      .limit(1);
    return result[0] ?? null;
  }

  /** List all versions for a pack. */
  async list(packName: string): Promise<PackVersion[]> {
    return this.db
      .select()
      .from(packVersions)
      .where(eq(packVersions.packName, packName))
      .orderBy(desc(packVersions.createdAt));
  }

  /** Create a new version. */
  async create(version: NewPackVersion): Promise<PackVersion> {
    const result = await this.db
      .insert(packVersions)
      .values(version)
      .returning();
    return result[0]!;
  }

  /** Delete a specific version. */
  async delete(packName: string, version: string): Promise<boolean> {
    const result = await this.db
      .delete(packVersions)
      .where(
        and(
          eq(packVersions.packName, packName),
          eq(packVersions.version, version)
        )
      );
    return result.changes > 0;
  }

  /** Check if a version already exists. */
  async exists(packName: string, version: string): Promise<boolean> {
    const result = await this.get(packName, version);
    return result !== null;
  }
}
