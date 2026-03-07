import { Elysia } from 'elysia';

import {
  type GithubIssueCommentPayload,
  normalizeGithubInboundEvent,
  parseGithubWebhookPayload,
  verifyGithubSignature,
} from '@contractspec/integration.runtime/channel';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { getChannelRuntimeResources } from './channel-runtime-resources';
import { resolveGithubWorkspaceId } from './channel-workspace-resolver';

export const githubWebhookHandler = new Elysia().post(
  '/webhooks/github/events',
  async ({ request, set }) => {
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret) {
      set.status = 503;
      return {
        ok: false,
        error: 'github_webhook_not_configured',
      };
    }

    const rawBody = await request.text();
    const signatureResult = verifyGithubSignature({
      webhookSecret,
      signatureHeader: request.headers.get('x-hub-signature-256'),
      rawBody,
    });

    if (!signatureResult.valid) {
      set.status = 401;
      return {
        ok: false,
        error: 'invalid_signature',
        reason: signatureResult.reason,
      };
    }

    const deliveryId = request.headers.get('x-github-delivery');
    const eventName = request.headers.get('x-github-event') ?? 'unknown';
    if (!deliveryId) {
      set.status = 400;
      return {
        ok: false,
        error: 'missing_delivery_id',
      };
    }

    let payload: GithubIssueCommentPayload;
    try {
      payload = parseGithubWebhookPayload(rawBody);
    } catch (error) {
      set.status = 400;
      return {
        ok: false,
        error: 'invalid_payload',
        message: error instanceof Error ? error.message : String(error),
      };
    }

    const repositoryFullName =
      payload.repository?.full_name ??
      (payload.repository?.owner?.login && payload.repository?.name
        ? `${payload.repository.owner.login}/${payload.repository.name}`
        : undefined);
    const workspaceId = resolveGithubWorkspaceId(repositoryFullName);
    if (!workspaceId) {
      set.status = 403;
      return {
        ok: false,
        error: 'workspace_not_mapped',
      };
    }

    const event = normalizeGithubInboundEvent({
      workspaceId,
      payload,
      deliveryId,
      eventName,
      signatureValid: true,
      traceId: request.headers.get('x-github-request-id') ?? undefined,
      rawBody,
    });

    if (!event) {
      return {
        ok: true,
        ignored: true,
      };
    }

    try {
      const runtime = await getChannelRuntimeResources();
      const result = await runtime.service.ingest(event);
      return {
        ok: true,
        status: result.status,
        receiptId: result.receiptId,
      };
    } catch (error) {
      appLogger.error('GitHub webhook processing failed', {
        error: error instanceof Error ? error.message : String(error),
        deliveryId,
      });
      set.status = 500;
      return {
        ok: false,
        error: 'webhook_processing_failed',
      };
    }
  }
);
