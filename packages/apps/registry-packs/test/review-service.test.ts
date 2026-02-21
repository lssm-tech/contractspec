/**
 * Tests for ReviewService — ratings, comments, and pack rating cache.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { ReviewService } from '../src/services/review-service.js';
import { eq } from 'drizzle-orm';
import { hashToken } from '../src/auth/token.js';

let db: Db;
let reviewService: ReviewService;

function seedPack(name: string = 'test-pack', authorName: string = 'author') {
  db.insert(schema.packs)
    .values({
      name,
      displayName: 'Test Pack',
      description: 'A test pack',
      authorName,
    })
    .run();
}

function seedAuth(username: string, token: string = 'test-token') {
  db.insert(schema.authTokens)
    .values({
      token: hashToken(token),
      username,
      scope: 'publish',
    })
    .run();
}

describe('ReviewService', () => {
  beforeEach(() => {
    db = setupTestDb();
    reviewService = new ReviewService(db);
  });

  describe('upsert', () => {
    test('creates a new review', async () => {
      seedPack();
      const review = await reviewService.upsert({
        packName: 'test-pack',
        username: 'reviewer1',
        rating: 4,
        comment: 'Great pack!',
      });

      expect(review.packName).toBe('test-pack');
      expect(review.username).toBe('reviewer1');
      expect(review.rating).toBe(4);
      expect(review.comment).toBe('Great pack!');
    });

    test('updates existing review for same user+pack', async () => {
      seedPack();
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'reviewer1',
        rating: 3,
        comment: 'OK',
      });

      const updated = await reviewService.upsert({
        packName: 'test-pack',
        username: 'reviewer1',
        rating: 5,
        comment: 'Actually amazing!',
      });

      expect(updated.rating).toBe(5);
      expect(updated.comment).toBe('Actually amazing!');

      // Should still be only one review
      const { total } = await reviewService.list('test-pack');
      expect(total).toBe(1);
    });

    test('updates cached averageRating on packs table', async () => {
      seedPack();
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'user1',
        rating: 4,
      });
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'user2',
        rating: 2,
      });

      const pack = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'test-pack'));

      // Average of 4 and 2 = 3.0, stored as 30
      expect(pack[0]!.averageRating).toBe(30);
      expect(pack[0]!.reviewCount).toBe(2);
    });
  });

  describe('list', () => {
    test('returns empty for pack with no reviews', async () => {
      seedPack();
      const result = await reviewService.list('test-pack');
      expect(result.reviews).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.averageRating).toBeNull();
    });

    test('returns reviews with average rating', async () => {
      seedPack();
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'user1',
        rating: 5,
        comment: 'Excellent',
      });
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'user2',
        rating: 3,
        comment: 'Decent',
      });

      const result = await reviewService.list('test-pack');
      expect(result.reviews).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.averageRating).toBe(4); // (5+3)/2
    });

    test('paginates reviews', async () => {
      seedPack();
      for (let i = 0; i < 5; i++) {
        await reviewService.upsert({
          packName: 'test-pack',
          username: `user${i}`,
          rating: 3,
        });
      }

      const page1 = await reviewService.list('test-pack', {
        limit: 2,
        offset: 0,
      });
      expect(page1.reviews).toHaveLength(2);
      expect(page1.total).toBe(5);

      const page2 = await reviewService.list('test-pack', {
        limit: 2,
        offset: 2,
      });
      expect(page2.reviews).toHaveLength(2);
    });
  });

  describe('delete', () => {
    test('deletes a review and recalculates rating', async () => {
      seedPack();
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'user1',
        rating: 5,
      });
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'user2',
        rating: 1,
      });

      const deleted = await reviewService.delete('test-pack', 'user2');
      expect(deleted).toBe(true);

      const pack = await db
        .select()
        .from(schema.packs)
        .where(eq(schema.packs.name, 'test-pack'));

      // Only user1's review (5) remains → 50
      expect(pack[0]!.averageRating).toBe(50);
      expect(pack[0]!.reviewCount).toBe(1);
    });

    test('returns false for non-existent review', async () => {
      seedPack();
      const deleted = await reviewService.delete('test-pack', 'nobody');
      expect(deleted).toBe(false);
    });
  });

  describe('getUserReview', () => {
    test('returns null when no review exists', async () => {
      seedPack();
      const review = await reviewService.getUserReview('test-pack', 'user1');
      expect(review).toBeNull();
    });

    test('returns the user review', async () => {
      seedPack();
      await reviewService.upsert({
        packName: 'test-pack',
        username: 'user1',
        rating: 4,
        comment: 'Nice',
      });

      const review = await reviewService.getUserReview('test-pack', 'user1');
      expect(review).not.toBeNull();
      expect(review!.rating).toBe(4);
      expect(review!.comment).toBe('Nice');
    });
  });
});

describe('Review routes', () => {
  let app: typeof import('../src/server.js').app;

  beforeEach(async () => {
    setupTestDb();
    // Re-import app so it picks up the test DB
    app = (await import('../src/server.js')).app;

    // Seed a pack and auth token
    const db2 = (await import('../src/db/client.js')).getDb();
    db2
      .insert(schema.packs)
      .values({
        name: 'route-pack',
        displayName: 'Route Pack',
        description: 'For route tests',
        authorName: 'pack-author',
      })
      .run();
    db2
      .insert(schema.authTokens)
      .values({
        token: hashToken('reviewer-token'),
        username: 'reviewer',
        scope: 'publish',
      })
      .run();
  });

  test('GET /packs/:name/reviews returns empty reviews', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/route-pack/reviews')
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reviews).toEqual([]);
    expect(body.total).toBe(0);
  });

  test('POST /packs/:name/reviews creates a review', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/route-pack/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer reviewer-token',
        },
        body: JSON.stringify({ rating: 4, comment: 'Solid pack' }),
      })
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.rating).toBe(4);
    expect(body.username).toBe('reviewer');
  });

  test('POST /packs/:name/reviews rejects invalid rating', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/route-pack/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer reviewer-token',
        },
        body: JSON.stringify({ rating: 6 }),
      })
    );
    expect(res.status).toBe(400);
  });

  test('POST /packs/:name/reviews requires auth', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/route-pack/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 3 }),
      })
    );
    expect(res.status).toBe(401);
  });

  test('POST /packs/:name/reviews prevents self-review', async () => {
    // Create a token for the pack author
    const db2 = (await import('../src/db/client.js')).getDb();
    db2
      .insert(schema.authTokens)
      .values({
        token: hashToken('author-token'),
        username: 'pack-author',
        scope: 'publish',
      })
      .run();

    const res = await app.handle(
      new Request('http://localhost/packs/route-pack/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer author-token',
        },
        body: JSON.stringify({ rating: 5 }),
      })
    );
    expect(res.status).toBe(403);
  });

  test('DELETE /packs/:name/reviews deletes own review', async () => {
    // First create a review
    await app.handle(
      new Request('http://localhost/packs/route-pack/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer reviewer-token',
        },
        body: JSON.stringify({ rating: 3 }),
      })
    );

    const res = await app.handle(
      new Request('http://localhost/packs/route-pack/reviews', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer reviewer-token' },
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.deleted).toBe(true);
  });
});
