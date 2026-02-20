import { Elysia } from 'elysia';
import { createHash } from 'crypto';
import { getDb } from '../db/client.js';
import { PackService } from '../services/pack-service.js';
import { VersionService } from '../services/version-service.js';
import { LocalStorage } from '../storage/local.js';
import { extractAuth } from '../auth/middleware.js';

/**
 * Publish routes: POST /packs (authenticated)
 */
export const publishRoutes = new Elysia({ prefix: '/packs' }).post(
  '/',
  async ({ body, set, headers }) => {
    const auth = await extractAuth(headers);

    if (!auth) {
      set.status = 401;
      return { error: 'Authentication required' };
    }

    try {
      // Elysia auto-parses multipart bodies into { tarball: File, metadata: object|string }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed = body as any;
      const tarballFile = parsed?.tarball as Blob | null;
      const rawMetadata = parsed?.metadata;

      if (!tarballFile || !rawMetadata) {
        set.status = 400;
        return { error: 'Missing tarball or metadata' };
      }

      // metadata may already be parsed (Elysia auto-parse) or a raw string
      const metadata = (
        typeof rawMetadata === 'string' ? JSON.parse(rawMetadata) : rawMetadata
      ) as {
        name: string;
        version: string;
        manifest: Record<string, unknown>;
      };

      if (!metadata.name || !metadata.version) {
        set.status = 400;
        return { error: 'Missing name or version in metadata' };
      }

      const db = getDb();
      const packService = new PackService(db);
      const versionService = new VersionService(db);

      // Check if version already exists
      if (await versionService.exists(metadata.name, metadata.version)) {
        set.status = 409;
        return {
          error: `Version ${metadata.version} of ${metadata.name} already exists`,
        };
      }

      // Store tarball
      const tarballBuffer = Buffer.from(await tarballFile.arrayBuffer());
      const integrity = `sha256-${createHash('sha256').update(tarballBuffer).digest('hex')}`;

      const storage = new LocalStorage();
      const tarballUrl = await storage.put(
        metadata.name,
        metadata.version,
        tarballBuffer
      );

      // Create or update pack entry
      const existingPack = await packService.get(metadata.name);
      const manifest = metadata.manifest;

      if (!existingPack) {
        await packService.create({
          name: metadata.name,
          displayName: (manifest.name as string) ?? metadata.name,
          description: (manifest.description as string) ?? '',
          authorName: auth.username,
          tags: (manifest.tags as string[]) ?? [],
          targets: (manifest.targets as string[]) ?? [],
          features: (manifest.features as string[]) ?? [],
        });
      } else {
        await packService.update(metadata.name, {
          description:
            (manifest.description as string) ?? existingPack.description,
          tags: (manifest.tags as string[]) ?? existingPack.tags,
          targets: (manifest.targets as string[]) ?? existingPack.targets,
          features: (manifest.features as string[]) ?? existingPack.features,
        });
      }

      // Create version entry
      await versionService.create({
        packName: metadata.name,
        version: metadata.version,
        integrity,
        tarballUrl,
        tarballSize: tarballBuffer.length,
        packManifest: manifest,
        fileCount: 0,
        featureSummary: {},
      });

      set.status = 201;
      return {
        name: metadata.name,
        version: metadata.version,
        integrity,
      };
    } catch (err) {
      set.status = 500;
      return {
        error: 'Publish failed',
        message: err instanceof Error ? err.message : String(err),
      };
    }
  }
);
