import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { packRoutes } from './routes/packs.js';
import { versionRoutes } from './routes/versions.js';
import { publishRoutes } from './routes/publish.js';
import { getDb } from './db/client.js';
import { PackService } from './services/pack-service.js';
import { SearchService } from './services/search-service.js';

const PORT = Number(process.env.PORT ?? 8091);

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
      featured: '/featured',
      tags: '/tags',
      targets: '/targets/:targetId',
      stats: '/stats',
      health: '/health',
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
  // Mount route groups
  .use(packRoutes)
  .use(versionRoutes)
  .use(publishRoutes)
  .listen(PORT);

console.log(`agentpacks-registry running on http://localhost:${PORT}`);

export type App = typeof app;
