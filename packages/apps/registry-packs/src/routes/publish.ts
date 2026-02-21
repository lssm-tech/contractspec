import { Elysia } from 'elysia';
import { createHash } from 'crypto';
import { getDb } from '../db/client.js';
import { PackService } from '../services/pack-service.js';
import { VersionService } from '../services/version-service.js';
import { WebhookService } from '../services/webhook-service.js';
import { getStorage } from '../storage/factory.js';
import { extractAuth } from '../auth/middleware.js';
import {
  publishLimiter,
  getClientIp,
  checkRateLimit,
} from '../middleware/rate-limit.js';
import { validatePackName } from '../utils/reserved-names.js';

/** Maximum tarball size in bytes (10 MB). */
const MAX_TARBALL_SIZE = 10 * 1024 * 1024;

/**
 * Publish routes: POST /packs (authenticated)
 */
export const publishRoutes = new Elysia({ prefix: '/packs' }).post(
  '/',
  async ({ body, set, headers }) => {
    // Rate limiting (publish tier)
    const ip = getClientIp(headers);
    const rateLimitError = checkRateLimit(publishLimiter, ip, set);
    if (rateLimitError) return rateLimitError;

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

      // Enforce tarball size limit
      if (tarballFile.size > MAX_TARBALL_SIZE) {
        set.status = 413;
        return {
          error: `Tarball exceeds maximum size of ${MAX_TARBALL_SIZE / (1024 * 1024)}MB`,
          maxSize: MAX_TARBALL_SIZE,
          actualSize: tarballFile.size,
        };
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

      // Validate pack name (squatting prevention)
      const nameValidation = validatePackName(metadata.name);
      if (!nameValidation.valid) {
        set.status = 400;
        return {
          error: `Invalid pack name: ${nameValidation.reason}`,
        };
      }

      const db = getDb();
      const packService = new PackService(db);
      const versionService = new VersionService(db);

      // Auto-bump version if "auto" is specified
      if (metadata.version === 'auto') {
        metadata.version = await versionService.getNextVersion(metadata.name);
      }

      // Check if version already exists
      if (await versionService.exists(metadata.name, metadata.version)) {
        set.status = 409;
        return {
          error: `Version ${metadata.version} of ${metadata.name} already exists`,
        };
      }

      // Store tarball
      const tarballBuffer = Buffer.from(await tarballFile.arrayBuffer());

      // Double-check buffer size (defense in depth)
      if (tarballBuffer.length > MAX_TARBALL_SIZE) {
        set.status = 413;
        return {
          error: `Tarball exceeds maximum size of ${MAX_TARBALL_SIZE / (1024 * 1024)}MB`,
        };
      }

      const integrity = `sha256-${createHash('sha256').update(tarballBuffer).digest('hex')}`;

      const storage = getStorage();
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

      // Dispatch webhooks (fire-and-forget)
      const webhookService = new WebhookService(db);
      const webhookEvent = existingPack ? 'update' : 'publish';
      webhookService
        .dispatch(
          metadata.name,
          webhookEvent,
          {
            version: metadata.version,
            integrity,
            publisher: auth.username,
          },
          metadata.version
        )
        .catch(() => undefined); // Swallow webhook errors

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
