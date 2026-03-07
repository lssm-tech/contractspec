import { Elysia } from 'elysia';

import {
  type SlackWebhookEnvelope,
  isSlackUrlVerificationPayload,
  normalizeSlackInboundEvent,
  parseSlackWebhookPayload,
  verifySlackSignature,
} from '@contractspec/integration.runtime/channel';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { getChannelRuntimeResources } from './channel-runtime-resources';
import { resolveSlackWorkspaceId } from './channel-workspace-resolver';

export const slackWebhookHandler = new Elysia().post(
  '/webhooks/slack/events',
  async ({ request, set }) => {
    const signingSecret = process.env.SLACK_SIGNING_SECRET;
    if (!signingSecret) {
      set.status = 503;
      return {
        ok: false,
        error: 'slack_webhook_not_configured',
      };
    }

    const rawBody = await request.text();
    const signatureResult = verifySlackSignature({
      signingSecret,
      requestTimestamp: request.headers.get('x-slack-request-timestamp'),
      requestSignature: request.headers.get('x-slack-signature'),
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

    let payload: SlackWebhookEnvelope;
    try {
      payload = parseSlackWebhookPayload(rawBody);
    } catch (error) {
      set.status = 400;
      return {
        ok: false,
        error: 'invalid_payload',
        message: error instanceof Error ? error.message : String(error),
      };
    }

    if (isSlackUrlVerificationPayload(payload)) {
      return {
        challenge: payload.challenge ?? '',
      };
    }

    const workspaceId = resolveSlackWorkspaceId(payload.team_id);
    if (!workspaceId) {
      set.status = 403;
      return {
        ok: false,
        error: 'workspace_not_mapped',
      };
    }

    const event = normalizeSlackInboundEvent({
      workspaceId,
      payload,
      signatureValid: true,
      traceId: request.headers.get('x-slack-request-id') ?? undefined,
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
      appLogger.error('Slack webhook processing failed', {
        error: error instanceof Error ? error.message : String(error),
        eventId: event.externalEventId,
      });
      set.status = 500;
      return {
        ok: false,
        error: 'webhook_processing_failed',
      };
    }
  }
);
