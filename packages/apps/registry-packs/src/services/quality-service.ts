import { eq, sql } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { packs, packReadmes, packVersions } from '../db/schema.js';

/**
 * Breakdown of how a quality score was computed.
 */
export interface QualityBreakdown {
  hasReadme: boolean; // +20
  hasMultipleVersions: boolean; // +10
  hasLicense: boolean; // +10
  targetCoverage: number; // +20 (proportional to targets count, max 4)
  featureCount: number; // +15 (proportional, max 5)
  hasTags: boolean; // +10
  hasRepository: boolean; // +5
  hasHomepage: boolean; // +5
  noConflicts: boolean; // +5
  total: number;
}

/**
 * Service for computing automated pack quality scores (0-100).
 *
 * Scoring rubric:
 * - Has README: +20
 * - Has multiple versions (semver maturity): +10
 * - License present: +10
 * - Target coverage (proportional, max 4 targets): +20
 * - Feature count (proportional, max 5 features): +15
 * - Has tags: +10
 * - Has repository link: +5
 * - Has homepage link: +5
 * - No conflicts declared: +5
 */
export class QualityService {
  constructor(private db: Db) {}

  /**
   * Compute quality score for a single pack.
   * Returns the breakdown and total, or null if pack doesn't exist.
   */
  async computeScore(packName: string): Promise<QualityBreakdown | null> {
    const packResult = await this.db
      .select()
      .from(packs)
      .where(eq(packs.name, packName))
      .limit(1);
    const pack = packResult[0];
    if (!pack) return null;

    // Check README
    const readmeResult = await this.db
      .select({ content: packReadmes.content })
      .from(packReadmes)
      .where(eq(packReadmes.packName, packName))
      .limit(1);
    const hasReadme = !!readmeResult[0]?.content;

    // Check version count
    const versionCount = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(packVersions)
      .where(eq(packVersions.packName, packName));
    const hasMultipleVersions = (versionCount[0]?.count ?? 0) > 1;

    // Parse JSON arrays safely
    const targets = this.parseJsonArray(pack.targets);
    const features = this.parseJsonArray(pack.features);
    const tags = this.parseJsonArray(pack.tags);
    const conflicts = this.parseJsonArray(pack.conflicts);

    const breakdown: QualityBreakdown = {
      hasReadme,
      hasMultipleVersions,
      hasLicense: !!pack.license && pack.license !== '',
      targetCoverage: Math.min(targets.length, 4),
      featureCount: Math.min(features.length, 5),
      hasTags: tags.length > 0,
      hasRepository: !!pack.repository,
      hasHomepage: !!pack.homepage,
      noConflicts: conflicts.length === 0,
      total: 0,
    };

    // Calculate total
    let total = 0;
    if (breakdown.hasReadme) total += 20;
    if (breakdown.hasMultipleVersions) total += 10;
    if (breakdown.hasLicense) total += 10;
    total += Math.round((breakdown.targetCoverage / 4) * 20);
    total += Math.round((breakdown.featureCount / 5) * 15);
    if (breakdown.hasTags) total += 10;
    if (breakdown.hasRepository) total += 5;
    if (breakdown.hasHomepage) total += 5;
    if (breakdown.noConflicts) total += 5;

    breakdown.total = Math.min(total, 100);
    return breakdown;
  }

  /**
   * Compute and persist quality score for a pack.
   * Returns the computed score.
   */
  async updateScore(packName: string): Promise<number | null> {
    const breakdown = await this.computeScore(packName);
    if (!breakdown) return null;

    await this.db
      .update(packs)
      .set({
        qualityScore: breakdown.total,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(packs.name, packName));

    return breakdown.total;
  }

  /**
   * Recalculate quality scores for all packs.
   * Returns the number of packs updated.
   */
  async recalculateAll(): Promise<number> {
    const allPacks = await this.db.select({ name: packs.name }).from(packs);
    let count = 0;
    for (const pack of allPacks) {
      const score = await this.updateScore(pack.name);
      if (score !== null) count++;
    }
    return count;
  }

  /**
   * Get a quality badge label based on score.
   */
  static getBadge(score: number | null): string {
    if (score === null) return 'unrated';
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'needs-work';
  }

  /**
   * Safely parse a JSON array field that might already be an array
   * or might be a JSON string.
   */
  private parseJsonArray(value: unknown): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}
