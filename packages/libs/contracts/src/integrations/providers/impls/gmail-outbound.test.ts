import type { gmail_v1 } from 'googleapis';
import type { AuthClient } from 'google-auth-library';
import { describe, expect, it, vi } from 'vitest';

import { GmailOutboundProvider } from './gmail-outbound';

describe('GmailOutboundProvider', () => {
  it('sends email with correct payload', async () => {
    const gmail = createMockGmail();
    const provider = new GmailOutboundProvider({
      auth: {} as AuthClient,
      gmail,
    });

    const result = await provider.sendEmail({
      from: { email: 'sender@example.com', name: 'Sender' },
      to: [{ email: 'recipient@example.com', name: 'Recipient' }],
      subject: 'Test',
      textBody: 'Plain',
      htmlBody: '<strong>HTML</strong>',
    });

    expect(gmail.users.messages.send).toHaveBeenCalled();
    const call = gmail.users.messages.send.mock.calls[0][0];
    const raw = call.requestBody.raw;
    const decoded = Buffer.from(raw.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    expect(decoded).toContain('Subject: Test');
    expect(decoded).toContain('Content-Type: multipart/alternative');
    expect(result.id).toBe('sent-message');
  });
});

function createMockGmail() {
  return {
    users: {
      messages: {
        send: vi.fn(async () => ({
          data: { id: 'sent-message' },
        })),
      },
    },
  } as unknown as gmail_v1.Gmail;
}


