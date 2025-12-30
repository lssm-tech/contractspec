import type { gmail_v1 } from 'googleapis';
import { describe, expect, it, vi } from 'bun:test';

import { GmailInboundProvider } from './gmail-inbound';

const now = Date.now();

describe('GmailInboundProvider', () => {
  it('lists and transforms threads', async () => {
    const { gmail } = createMockGmail();
    const provider = new GmailInboundProvider({
      auth: {} as gmail_v1.Options['auth'],
      gmail,
    });

    const threads = await provider.listThreads();
    expect(gmail.users.threads.list).toHaveBeenCalled();
    expect(threads).toHaveLength(1);
    const thread = threads[0];
    if (!thread) {
      throw new Error('Expected a thread to be returned for assertions.');
    }
    expect(thread.id).toBe('thread-1');
    expect(thread.subject).toBe('Hello');
    const firstMessage = thread.messages[0];
    if (!firstMessage) {
      throw new Error('Expected the thread to include at least one message.');
    }
    expect(firstMessage.textBody).toBe('Plain text body');
    expect(firstMessage.htmlBody).toContain('<p>');
  });

  it('retrieves messages since a timestamp', async () => {
    const { gmail } = createMockGmail();
    const provider = new GmailInboundProvider({
      auth: {} as gmail_v1.Options['auth'],
      gmail,
    });

    const result = await provider.listMessagesSince({
      label: 'INBOX',
      since: new Date(now - 1000),
    });

    expect(gmail.users.messages.list).toHaveBeenCalled();
    expect(result.messages).toHaveLength(1);
    const firstMessage = result.messages[0];
    if (!firstMessage) {
      throw new Error('Expected at least one message in the result');
    }
    expect(firstMessage.subject).toBe('Hello');
  });
});

function createMockGmail(): {
  gmail: gmail_v1.Gmail;
} {
  const message = buildMessage();
  const gmail = {
    users: {
      threads: {
        list: vi.fn(async () => ({
          data: { threads: [{ id: 'thread-1' }] },
        })),
        get: vi.fn(async () => ({
          data: { id: 'thread-1', messages: [message] },
        })),
      },
      messages: {
        list: vi.fn(async () => ({
          data: { messages: [{ id: 'msg-1' }] },
        })),
        get: vi.fn(async () => ({
          data: message,
        })),
      },
    },
  } as unknown as gmail_v1.Gmail;
  return { gmail };
}

function buildMessage(): gmail_v1.Schema$Message {
  return {
    id: 'msg-1',
    threadId: 'thread-1',
    internalDate: String(now),
    labelIds: ['INBOX'],
    payload: {
      mimeType: 'multipart/alternative',
      headers: [
        { name: 'Subject', value: 'Hello' },
        { name: 'From', value: 'Sender <sender@example.com>' },
        { name: 'To', value: 'Recipient <recipient@example.com>' },
      ],
      parts: [
        {
          mimeType: 'text/plain',
          body: { data: encodeBase64Url('Plain text body') },
        },
        {
          mimeType: 'text/html',
          body: { data: encodeBase64Url('<p>HTML body</p>') },
        },
      ],
    },
  };
}

function encodeBase64Url(content: string) {
  return Buffer.from(content, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
