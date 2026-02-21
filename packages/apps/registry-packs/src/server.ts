import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { packRoutes } from './routes/packs.js';
import { versionRoutes, versionDeleteRoutes } from './routes/versions.js';
import { publishRoutes } from './routes/publish.js';
import { reviewRoutes } from './routes/reviews.js';
import { orgRoutes, orgMemberRoutes } from './routes/orgs.js';
import { webhookRoutes } from './routes/webhooks.js';
import { dependencyRoutes } from './routes/dependencies.js';
import { githubRoutes } from './routes/github.js';
import { deprecationRoutes } from './routes/deprecation.js';
import { createRegistryMcpHandler } from './mcp/handler.js';
import { getDb } from './db/client.js';
import { PackService } from './services/pack-service.js';
import { SearchService } from './services/search-service.js';
import { QualityService } from './services/quality-service.js';
import {
  generalLimiter,
  getClientIp,
  checkRateLimit,
} from './middleware/rate-limit.js';

/**
 * Create the Elysia app (without listening).
 * Exported separately so tests can import the app without starting a server.
 */
export const app = new Elysia()
  .use(cors())
  .use(serverTiming())
  // Global rate limiting for all read endpoints
  .onBeforeHandle(({ headers, set, path }) => {
    // Skip rate limiting for health checks
    if (path === '/health') return;
    // Skip for publish (has its own stricter limiter)
    if (path === '/packs' && set.status === undefined) {
      // POST /packs is handled by publishRoutes with publishLimiter
      // We can't distinguish HTTP method here, so publish adds its own check
    }
    const ip = getClientIp(headers);
    const rateLimitError = checkRateLimit(generalLimiter, ip, set);
    if (rateLimitError) return rateLimitError;
  })
  // Health
  .get('/health', () => ({ status: 'healthy' }))
  // Root info
  .get('/', () => ({
    name: 'agentpacks-registry',
    version: '0.2.0',
    routes: {
      packs: '/packs',
      packDetail: '/packs/:name',
      versions: '/packs/:name/versions',
      download: '/packs/:name/versions/:version/download',
      publish: 'POST /packs',
      deleteVersion: 'DELETE /packs/:name/versions/:version',
      deprecate: 'POST /packs/:name/deprecate',
      featured: '/featured',
      tags: '/tags',
      targets: '/targets/:targetId',
      stats: '/stats',
      packStats: '/packs/:name/stats',
      packReviews: '/packs/:name/reviews',
      packQuality: '/packs/:name/quality',
      packDependencies: '/packs/:name/dependencies',
      packDependents: '/packs/:name/dependents',
      packWebhooks: '/packs/:name/webhooks',
      orgs: '/orgs',
      orgMembers: '/orgs/:name/members',
      github: 'POST /github/webhook',
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
  .use(webhookRoutes)
  .use(dependencyRoutes)
  .use(githubRoutes)
  .use(deprecationRoutes)
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
