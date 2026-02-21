import { Elysia } from 'elysia';
import { getDb } from '../db/client.js';
import { DependencyService } from '../services/dependency-service.js';

/**
 * Dependency graph routes: /packs/:name/dependencies, /packs/:name/dependents
 */
export const dependencyRoutes = new Elysia({ prefix: '/packs' })
  .get('/:name/dependencies', async ({ params, set, query }) => {
    const db = getDb();
    const depService = new DependencyService(db);
    const maxDepth = query.depth ? Number(query.depth) : 10;
    const format = query.format ?? 'json';

    const graph = await depService.buildGraph(params.name, maxDepth);
    if (!graph) {
      set.status = 404;
      return { error: `Pack "${params.name}" not found` };
    }

    const cycles = DependencyService.detectCycles(graph);

    if (format === 'mermaid') {
      return {
        mermaid: DependencyService.toMermaid(graph),
        cycles,
      };
    }

    return {
      graph,
      cycles,
    };
  })
  .get('/:name/dependents', async ({ params }) => {
    const db = getDb();
    const depService = new DependencyService(db);

    const dependents = await depService.getReverseDependencies(params.name);
    return {
      packName: params.name,
      dependents,
      total: dependents.length,
    };
  });
