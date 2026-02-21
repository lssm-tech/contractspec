import { Elysia, t } from 'elysia';
import { getDb } from '../db/client.js';
import { PackService } from '../services/pack-service.js';
import { extractAuth } from '../auth/middleware.js';

/**
 * Deprecation routes: POST /packs/:name/deprecate (authenticated, owner-only)
 */
export const deprecationRoutes = new Elysia({ prefix: '/packs' }).post(
  '/:name/deprecate',
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

    // Only the pack author can deprecate it
    if (pack.authorName !== auth.username) {
      set.status = 403;
      return { error: 'Only the pack author can deprecate a pack' };
    }

    const { deprecated, message } = body as {
      deprecated: boolean;
      message?: string;
    };

    await packService.update(params.name, {
      deprecated,
      deprecationMessage: deprecated ? (message ?? null) : null,
    });

    return {
      name: params.name,
      deprecated,
      message: deprecated ? (message ?? null) : null,
    };
  },
  {
    body: t.Object({
      deprecated: t.Boolean(),
      message: t.Optional(t.String()),
    }),
  }
);
