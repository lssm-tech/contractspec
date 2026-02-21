import { Elysia } from 'elysia';
import { getDb } from '../db/client.js';
import {
  GitHubService,
  type GitHubReleasePayload,
  type GitHubAppConfig,
} from '../services/github-service.js';
import { WebhookService } from '../services/webhook-service.js';

/**
 * Build the GitHub App config from environment variables.
 * GITHUB_WEBHOOK_SECRET — HMAC secret for verifying GitHub payloads
 * GITHUB_REPO_PACK_MAP — JSON mapping of "owner/repo" → "pack-name"
 */
function getGitHubConfig(): GitHubAppConfig | null {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return null;

  const mapJson = process.env.GITHUB_REPO_PACK_MAP ?? '{}';
  let mapObj: Record<string, string>;
  try {
    mapObj = JSON.parse(mapJson);
  } catch {
    mapObj = {};
  }

  return {
    webhookSecret: secret,
    repoPackMap: new Map(Object.entries(mapObj)),
  };
}

/**
 * GitHub webhook receiver: POST /github/webhook
 */
export const githubRoutes = new Elysia().post(
  '/github/webhook',
  async ({ body, headers, set }) => {
    const config = getGitHubConfig();
    if (!config) {
      set.status = 503;
      return { error: 'GitHub App integration not configured' };
    }

    const event = headers['x-github-event'];
    const signature = headers['x-hub-signature-256'] ?? '';
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);

    const db = getDb();
    const githubService = new GitHubService(db, config);

    // Verify signature
    if (!githubService.verifySignature(rawBody, signature)) {
      set.status = 401;
      return { error: 'Invalid signature' };
    }

    // Only handle release events
    if (event !== 'release') {
      return { ignored: true, reason: `Event type "${event}" not handled` };
    }

    const payload = (
      typeof body === 'string' ? JSON.parse(body) : body
    ) as GitHubReleasePayload;

    const result = await githubService.handleRelease(payload);
    if (!result) {
      return { ignored: true, reason: 'Release event not actionable' };
    }

    // If auto-publish succeeded, dispatch webhooks
    if (result.success) {
      const webhookService = new WebhookService(db);
      await webhookService.dispatch(
        result.packName,
        'publish',
        {
          version: result.version,
          source: 'github-auto-publish',
          repository: payload.repository.full_name,
        },
        result.version
      );
    }

    if (result.success) {
      set.status = 201;
    } else {
      set.status = 422;
    }

    return result;
  }
);
