import { eq, desc, sql, and } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { reviews, packs, type Review } from '../db/schema.js';

/**
 * Review with author display info.
 */
export interface ReviewWithMeta extends Review {
  /** Formatted rating string, e.g. "4.0" */
  ratingDisplay: string;
}

/**
 * Result shape for listing reviews.
 */
export interface ReviewListResult {
  reviews: Review[];
  total: number;
  averageRating: number | null;
}

/**
 * Service for managing pack reviews and ratings.
 * Enforces one review per user per pack (upsert on conflict).
 */
export class ReviewService {
  constructor(private db: Db) {}

  /**
   * List reviews for a pack with pagination.
   */
  async list(
    packName: string,
    opts?: { limit?: number; offset?: number }
  ): Promise<ReviewListResult> {
    const limit = opts?.limit ?? 20;
    const offset = opts?.offset ?? 0;

    const results = await this.db
      .select()
      .from(reviews)
      .where(eq(reviews.packName, packName))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.packName, packName));
    const total = countResult[0]?.count ?? 0;

    const avgResult = await this.db
      .select({ avg: sql<number>`avg(${reviews.rating})` })
      .from(reviews)
      .where(eq(reviews.packName, packName));
    const averageRating =
      total > 0 ? Math.round((avgResult[0]?.avg ?? 0) * 10) / 10 : null;

    return { reviews: results, total, averageRating };
  }

  /**
   * Create or update a review (one per user per pack).
   * Returns the upserted review.
   */
  async upsert(input: {
    packName: string;
    username: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const now = new Date().toISOString();

    // Check if review already exists
    const existing = await this.db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.packName, input.packName),
          eq(reviews.username, input.username)
        )
      )
      .limit(1);

    if (existing[0]) {
      await this.db
        .update(reviews)
        .set({
          rating: input.rating,
          comment: input.comment ?? existing[0].comment,
          updatedAt: now,
        })
        .where(eq(reviews.id, existing[0].id));
    } else {
      await this.db.insert(reviews).values({
        packName: input.packName,
        username: input.username,
        rating: input.rating,
        comment: input.comment ?? null,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Recalculate average rating and count for the pack
    await this.recalculatePackRating(input.packName);

    // Return the review
    const result = await this.db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.packName, input.packName),
          eq(reviews.username, input.username)
        )
      )
      .limit(1);

    const review = result[0];
    if (!review) {
      throw new Error(
        `Failed to upsert review for ${input.packName} by ${input.username}`
      );
    }
    return review;
  }

  /**
   * Delete a review by the given user on a pack.
   * Returns true if a review was deleted.
   */
  async delete(packName: string, username: string): Promise<boolean> {
    const result = await this.db
      .delete(reviews)
      .where(
        and(eq(reviews.packName, packName), eq(reviews.username, username))
      );

    if ((result as unknown as { changes: number }).changes > 0) {
      await this.recalculatePackRating(packName);
      return true;
    }
    return false;
  }

  /**
   * Recalculate and cache average_rating + review_count on packs table.
   * Stores rating as 10x integer (e.g. 42 = 4.2 stars).
   */
  async recalculatePackRating(packName: string): Promise<void> {
    const stats = await this.db
      .select({
        avg: sql<number>`avg(${reviews.rating})`,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(eq(reviews.packName, packName));

    const count = stats[0]?.count ?? 0;
    const avg = stats[0]?.avg ?? 0;
    const scaledRating = count > 0 ? Math.round(avg * 10) : null;

    await this.db
      .update(packs)
      .set({
        averageRating: scaledRating,
        reviewCount: count,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(packs.name, packName));
  }

  /**
   * Get a specific user's review for a pack.
   */
  async getUserReview(
    packName: string,
    username: string
  ): Promise<Review | null> {
    const result = await this.db
      .select()
      .from(reviews)
      .where(
        and(eq(reviews.packName, packName), eq(reviews.username, username))
      )
      .limit(1);
    return result[0] ?? null;
  }
}
