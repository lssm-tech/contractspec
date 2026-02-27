import { createHmac, timingSafeEqual } from 'node:crypto';

import type { ChannelInboundEvent } from './types';

export interface MetaWhatsappWebhookPayload {
  object?: string;
  entry?: {
    id?: string;
    changes?: {
      field?: string;
      value?: {
        metadata?: {
          phone_number_id?: string;
          display_phone_number?: string;
        };
        contacts?: {
          wa_id?: string;
          profile?: { name?: string };
        }[];
        messages?: {
          id?: string;
          from?: string;
          timestamp?: string;
          type?: string;
          text?: { body?: string };
        }[];
        statuses?: {
          id?: string;
          recipient_id?: string;
          status?: string;
          timestamp?: string;
        }[];
      };
    }[];
  }[];
}

export interface MetaSignatureVerificationInput {
  appSecret: string;
  signatureHeader: string | null;
  rawBody: string;
}

export interface MetaSignatureVerificationResult {
  valid: boolean;
  reason?: string;
}

export function verifyMetaSignature(
  input: MetaSignatureVerificationInput
): MetaSignatureVerificationResult {
  if (!input.signatureHeader) {
    return { valid: false, reason: 'missing_signature' };
  }
  const expected = `sha256=${createHmac('sha256', input.appSecret)
    .update(input.rawBody)
    .digest('hex')}`;
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const providedBuffer = Buffer.from(input.signatureHeader, 'utf8');
  if (expectedBuffer.length !== providedBuffer.length) {
    return { valid: false, reason: 'signature_length_mismatch' };
  }
  return timingSafeEqual(expectedBuffer, providedBuffer)
    ? { valid: true }
    : { valid: false, reason: 'signature_mismatch' };
}

export function parseMetaWebhookPayload(
  rawBody: string
): MetaWhatsappWebhookPayload {
  return JSON.parse(rawBody) as MetaWhatsappWebhookPayload;
}

export function normalizeMetaWhatsappInboundEvents(input: {
  workspaceId: string;
  payload: MetaWhatsappWebhookPayload;
  signatureValid: boolean;
  traceId?: string;
  rawBody?: string;
}): ChannelInboundEvent[] {
  const events: ChannelInboundEvent[] = [];
  for (const entry of input.payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;
      const phoneNumberId = value.metadata?.phone_number_id;
      for (const message of value.messages ?? []) {
        const from = message.from;
        const messageId = message.id;
        const text = message.text?.body;
        if (!from || !messageId || !text) continue;
        const occurredAt = message.timestamp
          ? new Date(Number(message.timestamp) * 1000)
          : new Date();
        events.push({
          workspaceId: input.workspaceId,
          providerKey: 'messaging.whatsapp.meta',
          externalEventId: messageId,
          eventType: 'whatsapp.meta.message',
          occurredAt,
          signatureValid: input.signatureValid,
          traceId: input.traceId,
          rawPayload: input.rawBody,
          thread: {
            externalThreadId: from,
            externalChannelId: phoneNumberId,
            externalUserId: from,
          },
          message: {
            text,
            externalMessageId: messageId,
          },
          metadata: {
            messageType: message.type ?? 'text',
            phoneNumberId: phoneNumberId ?? '',
          },
        });
      }
    }
  }
  return events;
}
