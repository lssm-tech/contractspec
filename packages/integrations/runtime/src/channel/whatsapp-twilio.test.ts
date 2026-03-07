import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'bun:test';

import {
  normalizeTwilioWhatsappInboundEvent,
  parseTwilioFormPayload,
  verifyTwilioSignature,
} from './whatsapp-twilio';

describe('Twilio WhatsApp webhook helpers', () => {
  it('verifies valid Twilio signature', () => {
    const authToken = 'twilio-token';
    const requestUrl = 'https://example.com/webhooks/whatsapp/twilio';
    const params = new URLSearchParams();
    params.set('MessageSid', 'SM123');
    params.set('From', 'whatsapp:+15550001');
    params.set('Body', 'hi');

    const sortedKeys = Array.from(params.keys()).sort();
    let payload = requestUrl;
    for (const key of sortedKeys) {
      payload += `${key}${params.get(key) ?? ''}`;
    }
    const signature = createHmac('sha1', authToken)
      .update(payload)
      .digest('base64');

    const result = verifyTwilioSignature({
      authToken,
      signatureHeader: signature,
      requestUrl,
      formBody: params,
    });

    expect(result.valid).toBe(true);
  });

  it('normalizes Twilio inbound event', () => {
    const form = parseTwilioFormPayload(
      'MessageSid=SM123&From=whatsapp%3A%2B15550001&To=whatsapp%3A%2B15550002&Body=Need+help&AccountSid=AC123'
    );

    const event = normalizeTwilioWhatsappInboundEvent({
      workspaceId: 'workspace-1',
      formBody: form,
      signatureValid: true,
    });

    expect(event).not.toBeNull();
    expect(event?.providerKey).toBe('messaging.whatsapp.twilio');
    expect(event?.externalEventId).toBe('SM123');
    expect(event?.message?.text).toBe('Need help');
  });
});
