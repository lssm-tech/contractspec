import { Elysia, t } from 'elysia';
import { getDb } from '../db/client.js';
import { ReviewService } from '../services/review-service.js';
import { PackService } from '../services/pack-service.js';
import { extractAuth } from '../auth/middleware.js';

/**
 * Review routes: GET/POST /packs/:name/reviews
 */
export const reviewRoutes = new Elysia({ prefix: '/packs' })
  .get(
    '/:name/reviews',
    async ({ params, query, set }) => {
      const db = getDb();
      const packService = new PackService(db);

      const pack = await packService.get(params.name);
      if (!pack) {
        set.status = 404;
        return { error: `Pack "${params.name}" not found` };
      }

      const reviewService = new ReviewService(db);
      return reviewService.list(params.name, {
        limit: query.limit ? Number(query.limit) : undefined,
        offset: query.offset ? Number(query.offset) : undefined,
      });
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/:name/reviews',
    async ({ params, body, set, headers }) => {
      const auth = await extractAuth(headers);
      if (!auth) {
        set.status = 401;
        return { error: 'Authentication required' };
      }

      const db = getDb();
      const packService = new PackService(db);

      const pack = await packService.get(params.name);
      if (!pack) {
        set.status = 404;
        return { error: `Pack "${params.name}" not found` };
      }

      // Validate rating
      const rating = Number(body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        set.status = 400;
        return { error: 'Rating must be an integer between 1 and 5' };
      }

      // Prevent self-review
      if (auth.username === pack.authorName) {
        set.status = 403;
        return { error: 'Cannot review your own pack' };
      }

      const reviewService = new ReviewService(db);
      const review = await reviewService.upsert({
        packName: params.name,
        username: auth.username,
        rating,
        comment: body.comment,
      });

      set.status = 201;
      return review;
    },
    {
      body: t.Object({
        rating: t.Number(),
        comment: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:name/reviews', async ({ params, set, headers }) => {
    const auth = await extractAuth(headers);
    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    const db = getDb();
    const reviewService = new ReviewService(db);
    const deleted = await reviewService.delete(params.name, auth.username);

    if (!deleted) {
      set.status = 404;
      return { error: 'Review not found' };
    }

    return { deleted: true };
  });
