import { Elysia, t } from 'elysia';
import { getDb } from '../db/client.js';
import { PackService } from '../services/pack-service.js';
import { VersionService } from '../services/version-service.js';
import { SearchService } from '../services/search-service.js';
import { StatsService } from '../services/stats-service.js';

/**
 * Pack routes: GET /packs, GET /packs/:name
 */
export const packRoutes = new Elysia({ prefix: '/packs' })
  .get(
    '/',
    async ({ query }) => {
      const db = getDb();
      const search = new SearchService(db);
      return search.search({
        q: query.q,
        tags: query.tags?.split(','),
        targets: query.targets?.split(','),
        features: query.features?.split(','),
        author: query.author,
        sort: query.sort as 'downloads' | 'updated' | 'name' | 'weekly',
        limit: query.limit ? Number(query.limit) : undefined,
        offset: query.offset ? Number(query.offset) : undefined,
      });
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
        tags: t.Optional(t.String()),
        targets: t.Optional(t.String()),
        features: t.Optional(t.String()),
        author: t.Optional(t.String()),
        sort: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
      }),
    }
  )
  .get('/:name', async ({ params, set }) => {
    const db = getDb();
    const packService = new PackService(db);
    const versionService = new VersionService(db);

    const pack = await packService.get(params.name);
    if (!pack) {
      set.status = 404;
      return { error: `Pack "${params.name}" not found` };
    }

    const versions = await versionService.list(params.name);
    const readme = await packService.getReadme(params.name);

    return {
      ...pack,
      versions: versions.map((v) => ({
        version: v.version,
        createdAt: v.createdAt,
        fileCount: v.fileCount,
        tarballSize: v.tarballSize,
      })),
      readme,
    };
  })
  .get('/:name/readme', async ({ params, set }) => {
    const db = getDb();
    const packService = new PackService(db);

    const readme = await packService.getReadme(params.name);
    if (!readme) {
      set.status = 404;
      return { error: `README for "${params.name}" not found` };
    }

    return { content: readme };
  })
  .get('/:name/stats', async ({ params, set, query }) => {
    const db = getDb();
    const statsService = new StatsService(db);
    const days = query.days ? Number(query.days) : 30;

    const stats = await statsService.getPackStats(params.name, days);
    if (!stats) {
      set.status = 404;
      return { error: `Pack "${params.name}" not found` };
    }

    return stats;
  });
