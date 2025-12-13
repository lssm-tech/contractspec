import { describe, expect, it, vi } from 'bun:test';

import { TwilioSmsProvider } from './twilio-sms';

describe('TwilioSmsProvider', () => {
  it('sends sms messages', async () => {
    const client = createMockTwilioClient();
    const provider = new TwilioSmsProvider({
      accountSid: 'sid',
      authToken: 'token',
      fromNumber: '+10000000000',
      client,
    });

    const message = await provider.sendSms({
      to: '+12223334444',
      body: 'Hello',
    });

    expect(client.messages.create).toHaveBeenCalled();
    expect(message.id).toBe('SM123');
    expect(message.status).toBe('sent');
  });

  it('fetches delivery status', async () => {
    const client = createMockTwilioClient();
    const provider = new TwilioSmsProvider({
      accountSid: 'sid',
      authToken: 'token',
      fromNumber: '+10000000000',
      client,
    });

    const status = await provider.getDeliveryStatus('SM123');
    expect(client.messages).toHaveBeenCalledWith('SM123');
    expect(status.status).toBe('delivered');
  });
});

function createMockTwilioClient() {
  const messageInstance = {
    sid: 'SM123',
    to: '+12223334444',
    from: '+10000000000',
    body: 'Hello',
    status: 'sent',
    dateCreated: new Date().toISOString(),
    price: '-0.0075',
    priceUnit: 'USD',
    errorCode: null,
    errorMessage: null,
  };

  const fetchInstance = {
    status: 'delivered',
    errorCode: null,
    errorMessage: null,
    dateUpdated: new Date().toISOString(),
  };

  const messagesFn = vi.fn(() => ({
    fetch: vi.fn(async () => fetchInstance),
  }));

  return {
    messages: Object.assign(messagesFn, {
      create: vi.fn(async () => messageInstance),
    }),
  } as unknown as any;
}
