import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'bun:test';

import {
  normalizeMetaWhatsappInboundEvents,
  parseMetaWebhookPayload,
  verifyMetaSignature,
} from './whatsapp-meta';

describe('Meta WhatsApp webhook helpers', () => {
  it('verifies valid signature', () => {
    const secret = 'meta-secret';
    const rawBody = JSON.stringify({ object: 'whatsapp_business_account' });
    const signature = `sha256=${createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')}`;

    const result = verifyMetaSignature({
      appSecret: secret,
      signatureHeader: signature,
      rawBody,
    });

    expect(result.valid).toBe(true);
  });

  it('normalizes inbound text messages', () => {
    const payload = parseMetaWebhookPayload(
      JSON.stringify({
        entry: [
          {
            changes: [
              {
                value: {
                  metadata: { phone_number_id: 'phone-1' },
                  messages: [
                    {
                      id: 'wamid.1',
                      from: '15551234567',
                      timestamp: '1730000200',
                      type: 'text',
                      text: { body: 'Hello there' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      })
    );

    const events = normalizeMetaWhatsappInboundEvents({
      workspaceId: 'workspace-1',
      payload,
      signatureValid: true,
    });

    expect(events.length).toBe(1);
    expect(events[0]?.providerKey).toBe('messaging.whatsapp.meta');
    expect(events[0]?.externalEventId).toBe('wamid.1');
    expect(events[0]?.message?.text).toBe('Hello there');
  });
});
