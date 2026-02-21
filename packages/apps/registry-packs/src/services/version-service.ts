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
    const created = result[0];
    if (!created) {
      throw new Error(
        `Failed to create version ${version.version} for ${version.packName}`
      );
    }
    return created;
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

  /**
   * Compute the next patch version for a pack.
   * If no versions exist, returns "1.0.0".
   * Otherwise, bumps the patch component of the latest version.
   *
   * @example "1.2.3" → "1.2.4", null → "1.0.0"
   */
  async getNextVersion(packName: string): Promise<string> {
    const latest = await this.getLatest(packName);
    if (!latest) return '1.0.0';

    return bumpPatch(latest.version);
  }
}

/**
 * Bump the patch component of a semver string.
 * Handles pre-release/build metadata by stripping them first.
 */
export function bumpPatch(version: string): string {
  // Strip pre-release / build metadata
  const clean = version.replace(/[-+].*$/, '');
  const parts = clean.split('.');

  if (parts.length < 3) {
    // Malformed — pad with zeros
    while (parts.length < 3) parts.push('0');
  }

  const [majorPart = '0', minorPart = '0', patchPart = '0'] = parts;
  const major = parseInt(majorPart, 10) || 0;
  const minor = parseInt(minorPart, 10) || 0;
  const patch = parseInt(patchPart, 10) || 0;

  return `${major}.${minor}.${patch + 1}`;
}
