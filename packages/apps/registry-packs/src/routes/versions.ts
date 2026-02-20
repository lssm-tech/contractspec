import { Elysia } from 'elysia';
import { getDb } from '../db/client.js';
import { VersionService } from '../services/version-service.js';
import { PackService } from '../services/pack-service.js';
import { LocalStorage } from '../storage/local.js';

/**
 * Version routes: GET /packs/:name/versions[/:version]
 */
export const versionRoutes = new Elysia({ prefix: '/packs' })
  .get('/:name/versions', async ({ params }) => {
    const db = getDb();
    const versionService = new VersionService(db);

    const versions = await versionService.list(params.name);
    return { versions };
  })
  .get('/:name/versions/:version', async ({ params, set }) => {
    const db = getDb();
    const versionService = new VersionService(db);

    const version = await versionService.get(params.name, params.version);
    if (!version) {
      set.status = 404;
      return {
        error: `Version "${params.version}" of pack "${params.name}" not found`,
      };
    }

    return version;
  })
  .get('/:name/versions/:version/download', async ({ params, set }) => {
    const db = getDb();
    const versionService = new VersionService(db);
    const packService = new PackService(db);

    const version = await versionService.get(params.name, params.version);
    if (!version) {
      set.status = 404;
      return { error: `Version not found` };
    }

    const storage = new LocalStorage();
    const data = await storage.get(params.name, params.version);
    if (!data) {
      set.status = 404;
      return { error: `Tarball not found` };
    }

    // Increment download count
    await packService.incrementDownloads(params.name);

    set.headers['content-type'] = 'application/gzip';
    set.headers['x-integrity'] = version.integrity;
    return data;
  });
