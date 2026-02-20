import { Elysia } from 'elysia';
import { getDb } from '../db/client.js';
import { VersionService } from '../services/version-service.js';
import { PackService } from '../services/pack-service.js';
import { LocalStorage } from '../storage/local.js';
import { extractAuth } from '../auth/middleware.js';

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

/**
 * Authenticated version routes: DELETE /packs/:name/versions/:version
 * Only the pack author (the user who published it) can delete a version.
 */
export const versionDeleteRoutes = new Elysia({ prefix: '/packs' }).delete(
  '/:name/versions/:version',
  async ({ params, set, headers }) => {
    const auth = await extractAuth(headers);

    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    const db = getDb();
    const packService = new PackService(db);
    const versionService = new VersionService(db);

    // Verify the pack exists
    const pack = await packService.get(params.name);
    if (!pack) {
      set.status = 404;
      return { error: `Pack "${params.name}" not found` };
    }

    // Only the pack author can delete versions
    if (pack.authorName !== auth.username) {
      set.status = 403;
      return { error: 'Only the pack author can delete versions' };
    }

    // Verify the version exists
    const version = await versionService.get(params.name, params.version);
    if (!version) {
      set.status = 404;
      return {
        error: `Version "${params.version}" of pack "${params.name}" not found`,
      };
    }

    // Delete tarball from storage
    const storage = new LocalStorage();
    await storage.delete(params.name, params.version);

    // Delete version record
    await versionService.delete(params.name, params.version);

    return {
      deleted: true,
      name: params.name,
      version: params.version,
    };
  }
);
