import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { packRoutes } from './routes/packs.js';
import { versionRoutes, versionDeleteRoutes } from './routes/versions.js';
import { publishRoutes } from './routes/publish.js';
import { reviewRoutes } from './routes/reviews.js';
import { orgRoutes, orgMemberRoutes } from './routes/orgs.js';
import { createRegistryMcpHandler } from './mcp/handler.js';
import { getDb } from './db/client.js';
import { PackService } from './services/pack-service.js';
import { SearchService } from './services/search-service.js';
import { QualityService } from './services/quality-service.js';

/**
 * Create the Elysia app (without listening).
 * Exported separately so tests can import the app without starting a server.
 */
export const app = new Elysia()
  .use(cors())
  .use(serverTiming())
  // Health
  .get('/health', () => ({ status: 'healthy' }))
  // Root info
  .get('/', () => ({
    name: 'agentpacks-registry',
    version: '0.1.0',
    routes: {
      packs: '/packs',
      packDetail: '/packs/:name',
      versions: '/packs/:name/versions',
      download: '/packs/:name/versions/:version/download',
      publish: 'POST /packs',
      deleteVersion: 'DELETE /packs/:name/versions/:version',
      featured: '/featured',
      tags: '/tags',
      targets: '/targets/:targetId',
      stats: '/stats',
      packStats: '/packs/:name/stats',
      packReviews: '/packs/:name/reviews',
      packQuality: '/packs/:name/quality',
      orgs: '/orgs',
      orgMembers: '/orgs/:name/members',
      health: '/health',
      mcp: '/mcp',
    },
  }))
  // Featured packs
  .get('/featured', async ({ query }) => {
    const db = getDb();
    const packService = new PackService(db);
    const limit = query.limit ? Number(query.limit) : undefined;
    const packs = await packService.featured(limit);
    return { packs };
  })
  // Tags
  .get('/tags', async () => {
    const db = getDb();
    const search = new SearchService(db);
    const tags = await search.getTags();
    return { tags };
  })
  // Targets
  .get('/targets/:targetId', async ({ params }) => {
    const db = getDb();
    const search = new SearchService(db);
    const packs = await search.getByTarget(params.targetId);
    return { packs };
  })
  // Stats
  .get('/stats', async () => {
    const db = getDb();
    const search = new SearchService(db);
    return search.getStats();
  })
  // Quality score endpoint
  .get('/packs/:name/quality', async ({ params, set, query }) => {
    const db = getDb();
    const qualityService = new QualityService(db);
    const recalculate = query.recalculate === 'true';

    if (recalculate) {
      await qualityService.updateScore(params.name);
    }

    const breakdown = await qualityService.computeScore(params.name);
    if (!breakdown) {
      set.status = 404;
      return { error: `Pack "${params.name}" not found` };
    }

    return {
      packName: params.name,
      score: breakdown.total,
      badge: QualityService.getBadge(breakdown.total),
      breakdown,
    };
  })
  // Mount route groups
  .use(packRoutes)
  .use(versionRoutes)
  .use(versionDeleteRoutes)
  .use(publishRoutes)
  .use(reviewRoutes)
  .use(orgRoutes)
  .use(orgMemberRoutes)
  // MCP endpoint
  .use(createRegistryMcpHandler());

export type App = typeof app;

/**
 * Start the server if this file is the entry point.
 * When imported by tests, the server is NOT started.
 */
export function startServer(port?: number) {
  const PORT = port ?? Number(process.env.PORT ?? 8091);
  app.listen(PORT);
  console.log(`agentpacks-registry running on http://localhost:${PORT}`);
  return app;
}
