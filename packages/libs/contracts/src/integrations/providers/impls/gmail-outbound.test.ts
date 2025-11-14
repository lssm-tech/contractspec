import type { gmail_v1 } from 'googleapis';
import { describe, expect, it, vi } from 'vitest';

import { GmailOutboundProvider } from './gmail-outbound';

describe('GmailOutboundProvider', () => {
  it('sends email with correct payload', async () => {
    const { gmail, send } = createMockGmail();
    const provider = new GmailOutboundProvider({
      auth: {} as gmail_v1.Options['auth'],
      gmail,
    });

    const result = await provider.sendEmail({
      from: { email: 'sender@example.com', name: 'Sender' },
      to: [{ email: 'recipient@example.com', name: 'Recipient' }],
      subject: 'Test',
      textBody: 'Plain',
      htmlBody: '<strong>HTML</strong>',
    });

    expect(send).toHaveBeenCalled();
    const [firstCall] = send.mock.calls;
    if (!firstCall) {
      throw new Error('Expected Gmail send to be called at least once');
    }
    const [call] = firstCall;
    if (!call?.requestBody?.raw) {
      throw new Error('Expected Gmail payload to include raw content');
    }
    const raw = call.requestBody.raw;
    const decoded = Buffer.from(raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    expect(decoded).toContain('Subject: Test');
    expect(decoded).toContain('Content-Type: multipart/alternative');
    expect(result.id).toBe('sent-message');
  });
});

function createMockGmail() {
  const send = vi.fn<
    [gmail_v1.Params$Resource$Users$Messages$Send],
    Promise<{ data: { id: string } }>
  >(async () => ({
    data: { id: 'sent-message' },
  }));
  const gmail = {
    users: {
      messages: {
        send,
      },
    },
  } as unknown as gmail_v1.Gmail;
  return { gmail, send };
}


