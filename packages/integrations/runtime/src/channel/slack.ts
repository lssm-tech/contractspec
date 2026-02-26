import { createHmac, timingSafeEqual } from 'node:crypto';

import type { ChannelInboundEvent } from './types';

export interface SlackWebhookEnvelope {
  type: string;
  team_id?: string;
  api_app_id?: string;
  event_id?: string;
  event_time?: number;
  challenge?: string;
  event?: {
    type?: string;
    user?: string;
    text?: string;
    ts?: string;
    thread_ts?: string;
    channel?: string;
    subtype?: string;
    bot_id?: string;
  };
}

export interface SlackSignatureVerificationInput {
  signingSecret: string;
  requestTimestamp: string | null;
  requestSignature: string | null;
  rawBody: string;
  nowMs?: number;
  toleranceSeconds?: number;
}

export interface SignatureVerificationResult {
  valid: boolean;
  reason?: string;
}

export function verifySlackSignature(
  input: SlackSignatureVerificationInput
): SignatureVerificationResult {
  if (!input.requestTimestamp || !input.requestSignature) {
    return { valid: false, reason: 'missing_signature_headers' };
  }

  const timestamp = Number.parseInt(input.requestTimestamp, 10);
  if (!Number.isFinite(timestamp)) {
    return { valid: false, reason: 'invalid_timestamp' };
  }

  const nowMs = input.nowMs ?? Date.now();
  const toleranceMs = (input.toleranceSeconds ?? 300) * 1000;
  if (Math.abs(nowMs - timestamp * 1000) > toleranceMs) {
    return { valid: false, reason: 'timestamp_out_of_range' };
  }

  const base = `v0:${input.requestTimestamp}:${input.rawBody}`;
  const expected = `v0=${createHmac('sha256', input.signingSecret).update(base).digest('hex')}`;

  const receivedBuffer = Buffer.from(input.requestSignature, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  if (receivedBuffer.length !== expectedBuffer.length) {
    return { valid: false, reason: 'signature_length_mismatch' };
  }

  const valid = timingSafeEqual(receivedBuffer, expectedBuffer);
  return valid
    ? { valid: true }
    : { valid: false, reason: 'signature_mismatch' };
}

export function parseSlackWebhookPayload(
  rawBody: string
): SlackWebhookEnvelope {
  const parsed = JSON.parse(rawBody) as SlackWebhookEnvelope;
  return parsed;
}

export function isSlackUrlVerificationPayload(
  payload: SlackWebhookEnvelope
): boolean {
  return payload.type === 'url_verification';
}

export interface NormalizeSlackEventInput {
  workspaceId: string;
  payload: SlackWebhookEnvelope;
  signatureValid: boolean;
  traceId?: string;
  rawBody?: string;
}

export function normalizeSlackInboundEvent(
  input: NormalizeSlackEventInput
): ChannelInboundEvent | null {
  if (input.payload.type !== 'event_callback') {
    return null;
  }

  const event = input.payload.event;
  if (!event?.type) {
    return null;
  }

  if (event.subtype === 'bot_message' || event.bot_id) {
    return null;
  }

  const externalEventId = input.payload.event_id ?? event.ts;
  if (!externalEventId) {
    return null;
  }

  const threadId = event.thread_ts ?? event.ts ?? externalEventId;
  if (!threadId) {
    return null;
  }

  return {
    workspaceId: input.workspaceId,
    providerKey: 'messaging.slack',
    externalEventId,
    eventType: `slack.${event.type}`,
    occurredAt: input.payload.event_time
      ? new Date(input.payload.event_time * 1000)
      : new Date(),
    signatureValid: input.signatureValid,
    traceId: input.traceId,
    rawPayload: input.rawBody,
    thread: {
      externalThreadId: threadId,
      externalChannelId: event.channel,
      externalUserId: event.user,
    },
    message: event.text
      ? {
          text: event.text,
          externalMessageId: event.ts,
        }
      : undefined,
    metadata: {
      slackEventType: event.type,
      slackTeamId: input.payload.team_id ?? input.workspaceId,
    },
  };
}
