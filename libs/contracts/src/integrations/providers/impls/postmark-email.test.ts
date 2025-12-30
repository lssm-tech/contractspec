import { describe, expect, it, vi } from 'bun:test';

import { PostmarkEmailProvider } from './postmark-email';

describe('PostmarkEmailProvider', () => {
  it('sends email via Postmark client', async () => {
    const client = createMockPostmarkClient();
    const provider = new PostmarkEmailProvider({
      serverToken: 'test',
      defaultFromEmail: 'from@example.com',
      client,
    });

    const result = await provider.sendEmail({
      from: { email: 'from@example.com', name: 'Sender' },
      to: [{ email: 'to@example.com', name: 'Recipient' }],
      subject: 'Hello',
      textBody: 'Plain text',
      htmlBody: '<strong>HTML</strong>',
    });

    expect(client.sendEmail).toHaveBeenCalled();
    expect(result.providerMessageId).toBe('message-1');
  });
});

function createMockPostmarkClient() {
  return {
    sendEmail: vi.fn(async () => ({
      MessageID: 'message-1',
      SubmittedAt: new Date().toISOString(),
      To: 'Recipient <to@example.com>',
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any;
}
