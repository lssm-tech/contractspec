import { createHmac, timingSafeEqual } from 'node:crypto';

import type { ChannelInboundEvent } from './types';

export interface TwilioWebhookVerificationInput {
  authToken: string;
  signatureHeader: string | null;
  requestUrl: string;
  formBody: URLSearchParams;
}

export interface TwilioSignatureVerificationResult {
  valid: boolean;
  reason?: string;
}

export function verifyTwilioSignature(
  input: TwilioWebhookVerificationInput
): TwilioSignatureVerificationResult {
  if (!input.signatureHeader) {
    return { valid: false, reason: 'missing_signature' };
  }

  const sortedKeys = Array.from(input.formBody.keys()).sort();
  let payload = input.requestUrl;
  for (const key of sortedKeys) {
    const value = input.formBody.get(key) ?? '';
    payload += `${key}${value}`;
  }

  const expected = createHmac('sha1', input.authToken)
    .update(payload)
    .digest('base64');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const providedBuffer = Buffer.from(input.signatureHeader, 'utf8');
  if (expectedBuffer.length !== providedBuffer.length) {
    return { valid: false, reason: 'signature_length_mismatch' };
  }

  return timingSafeEqual(expectedBuffer, providedBuffer)
    ? { valid: true }
    : { valid: false, reason: 'signature_mismatch' };
}

export function parseTwilioFormPayload(rawBody: string): URLSearchParams {
  return new URLSearchParams(rawBody);
}

export function normalizeTwilioWhatsappInboundEvent(input: {
  workspaceId: string;
  formBody: URLSearchParams;
  signatureValid: boolean;
  traceId?: string;
  rawBody?: string;
}): ChannelInboundEvent | null {
  const messageSid = input.formBody.get('MessageSid');
  const from = input.formBody.get('From');
  const to = input.formBody.get('To');
  const body = input.formBody.get('Body');
  if (!messageSid || !from || !body) {
    return null;
  }

  return {
    workspaceId: input.workspaceId,
    providerKey: 'messaging.whatsapp.twilio',
    externalEventId: messageSid,
    eventType: 'whatsapp.twilio.message',
    occurredAt: new Date(),
    signatureValid: input.signatureValid,
    traceId: input.traceId,
    rawPayload: input.rawBody,
    thread: {
      externalThreadId: from,
      externalChannelId: to ?? undefined,
      externalUserId: from,
    },
    message: {
      text: body,
      externalMessageId: messageSid,
    },
    metadata: {
      accountSid: input.formBody.get('AccountSid') ?? '',
      profileName: input.formBody.get('ProfileName') ?? '',
    },
  };
}
