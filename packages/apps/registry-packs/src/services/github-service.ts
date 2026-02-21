import { createHmac, timingSafeEqual } from 'crypto';
import type { Db } from '../db/client.js';
import { PackService } from './pack-service.js';
import { VersionService } from './version-service.js';
import { getStorage } from '../storage/factory.js';
import { createHash } from 'crypto';

/**
 * GitHub release event payload (subset of relevant fields).
 */
export interface GitHubReleasePayload {
  action: string; // "published", "created", etc.
  release: {
    tag_name: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    assets: Array<{
      name: string;
      browser_download_url: string;
      content_type: string;
      size: number;
    }>;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

/**
 * Configuration for GitHub App integration.
 */
export interface GitHubAppConfig {
  webhookSecret: string;
  /** Map of repository full_name → pack name for auto-publish. */
  repoPackMap: Map<string, string>;
}

/**
 * Result of processing a GitHub release event.
 */
export interface AutoPublishResult {
  success: boolean;
  packName: string;
  version: string;
  error?: string;
}

/**
 * Service for handling GitHub webhook events and auto-publishing
 * packs when release tags are created.
 */
export class GitHubService {
  constructor(
    private db: Db,
    private config: GitHubAppConfig
  ) {}

  /**
   * Verify that a webhook request came from GitHub using HMAC-SHA256.
   */
  verifySignature(payload: string, signature: string): boolean {
    if (!signature.startsWith('sha256=')) return false;
    const expected = createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex');
    const received = signature.slice(7); // strip 'sha256='
    try {
      return timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(received, 'hex')
      );
    } catch {
      return false;
    }
  }

  /**
   * Process a GitHub release webhook event.
   * Only handles "published" events for non-draft, non-prerelease releases.
   */
  async handleRelease(
    payload: GitHubReleasePayload
  ): Promise<AutoPublishResult | null> {
    // Only process published releases
    if (payload.action !== 'published') return null;
    if (payload.release.draft || payload.release.prerelease) return null;

    const repoFullName = payload.repository.full_name;
    const packName = this.config.repoPackMap.get(repoFullName);

    if (!packName) {
      return null; // No pack mapping for this repo
    }

    // Extract version from tag (strip leading 'v' if present)
    const tagName = payload.release.tag_name;
    const version = tagName.startsWith('v') ? tagName.slice(1) : tagName;

    if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
      return {
        success: false,
        packName,
        version: tagName,
        error: `Invalid semver tag: ${tagName}`,
      };
    }

    // Check if version already exists
    const versionService = new VersionService(this.db);
    if (await versionService.exists(packName, version)) {
      return {
        success: false,
        packName,
        version,
        error: `Version ${version} already exists`,
      };
    }

    // Find tarball asset in the release (look for .tgz or .tar.gz)
    const tarballAsset = payload.release.assets.find(
      (a) => a.name.endsWith('.tgz') || a.name.endsWith('.tar.gz')
    );

    if (!tarballAsset) {
      return {
        success: false,
        packName,
        version,
        error: 'No tarball asset (.tgz or .tar.gz) found in release',
      };
    }

    try {
      // Download the tarball from GitHub
      const tarballRes = await fetch(tarballAsset.browser_download_url);
      if (!tarballRes.ok) {
        return {
          success: false,
          packName,
          version,
          error: `Failed to download tarball: ${tarballRes.status}`,
        };
      }

      const tarballBuffer = Buffer.from(await tarballRes.arrayBuffer());
      const integrity = `sha256-${createHash('sha256').update(tarballBuffer).digest('hex')}`;

      // Store tarball
      const storage = getStorage();
      const tarballUrl = await storage.put(packName, version, tarballBuffer);

      // Create or update pack
      const packService = new PackService(this.db);
      const existingPack = await packService.get(packName);

      if (!existingPack) {
        await packService.create({
          name: packName,
          displayName: packName,
          description: payload.release.body?.slice(0, 200) ?? '',
          authorName: 'github-app',
          repository: payload.repository.html_url,
        });
      }

      // Create version
      await versionService.create({
        packName,
        version,
        integrity,
        tarballUrl,
        tarballSize: tarballBuffer.length,
        packManifest: {
          name: packName,
          version,
          repository: payload.repository.html_url,
          releaseTag: tagName,
        },
        fileCount: 0,
        featureSummary: {},
        changelog: payload.release.body ?? null,
      });

      return { success: true, packName, version };
    } catch (err) {
      return {
        success: false,
        packName,
        version,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
