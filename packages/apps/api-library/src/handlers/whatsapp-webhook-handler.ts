import { Elysia } from 'elysia';

import {
  type MetaWhatsappWebhookPayload,
  normalizeMetaWhatsappInboundEvents,
  normalizeTwilioWhatsappInboundEvent,
  parseMetaWebhookPayload,
  parseTwilioFormPayload,
  verifyMetaSignature,
  verifyTwilioSignature,
} from '@contractspec/integration.runtime/channel';
import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import { getChannelRuntimeResources } from './channel-runtime-resources';
import {
  resolveMetaWhatsappWorkspaceId,
  resolveTwilioWhatsappWorkspaceId,
} from './channel-workspace-resolver';

export const whatsappWebhookHandler = new Elysia()
  .get('/webhooks/whatsapp/meta', ({ query, set }) => {
    const mode = query['hub.mode'];
    const challenge = query['hub.challenge'];
    const verifyToken = query['hub.verify_token'];
    const expectedToken = process.env.WHATSAPP_META_VERIFY_TOKEN;

    if (!expectedToken) {
      set.status = 503;
      return 'whatsapp_meta_not_configured';
    }

    if (mode !== 'subscribe' || verifyToken !== expectedToken) {
      set.status = 403;
      return 'verification_failed';
    }

    return challenge ?? '';
  })
  .post('/webhooks/whatsapp/meta', async ({ request, set }) => {
    const appSecret = process.env.WHATSAPP_META_APP_SECRET;
    if (!appSecret) {
      set.status = 503;
      return {
        ok: false,
        error: 'whatsapp_meta_not_configured',
      };
    }

    const rawBody = await request.text();
    const signatureResult = verifyMetaSignature({
      appSecret,
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

    let payload: MetaWhatsappWebhookPayload;
    try {
      payload = parseMetaWebhookPayload(rawBody);
    } catch (error) {
      set.status = 400;
      return {
        ok: false,
        error: 'invalid_payload',
        message: error instanceof Error ? error.message : String(error),
      };
    }

    const workspaceId = resolveMetaWhatsappWorkspaceId([
      payload.entry?.[0]?.id ?? '',
      payload.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id ?? '',
    ]);
    if (!workspaceId) {
      set.status = 403;
      return {
        ok: false,
        error: 'workspace_not_mapped',
      };
    }

    const events = normalizeMetaWhatsappInboundEvents({
      workspaceId,
      payload,
      signatureValid: true,
      traceId: request.headers.get('x-request-id') ?? undefined,
      rawBody,
    });

    if (events.length === 0) {
      return {
        ok: true,
        ignored: true,
      };
    }

    try {
      const runtime = await getChannelRuntimeResources();
      const results = await Promise.all(
        events.map((event) => runtime.service.ingest(event))
      );
      return {
        ok: true,
        accepted: results.filter((result) => result.status === 'accepted')
          .length,
        duplicates: results.filter((result) => result.status === 'duplicate')
          .length,
      };
    } catch (error) {
      appLogger.error('WhatsApp Meta webhook processing failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      set.status = 500;
      return {
        ok: false,
        error: 'webhook_processing_failed',
      };
    }
  })
  .post('/webhooks/whatsapp/twilio', async ({ request, set }) => {
    const authToken = process.env.WHATSAPP_TWILIO_AUTH_TOKEN;
    if (!authToken) {
      set.status = 503;
      return {
        ok: false,
        error: 'whatsapp_twilio_not_configured',
      };
    }

    const rawBody = await request.text();
    const formBody = parseTwilioFormPayload(rawBody);
    const requestUrl = process.env.WHATSAPP_TWILIO_WEBHOOK_URL ?? request.url;
    const signatureResult = verifyTwilioSignature({
      authToken,
      signatureHeader: request.headers.get('x-twilio-signature'),
      requestUrl,
      formBody,
    });

    if (!signatureResult.valid) {
      set.status = 401;
      return {
        ok: false,
        error: 'invalid_signature',
        reason: signatureResult.reason,
      };
    }

    const workspaceId = resolveTwilioWhatsappWorkspaceId(
      formBody.get('AccountSid') ?? undefined
    );
    if (!workspaceId) {
      set.status = 403;
      return {
        ok: false,
        error: 'workspace_not_mapped',
      };
    }

    const event = normalizeTwilioWhatsappInboundEvent({
      workspaceId,
      formBody,
      signatureValid: true,
      traceId: request.headers.get('x-request-id') ?? undefined,
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
      appLogger.error('WhatsApp Twilio webhook processing failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      set.status = 500;
      return {
        ok: false,
        error: 'webhook_processing_failed',
      };
    }
  });
