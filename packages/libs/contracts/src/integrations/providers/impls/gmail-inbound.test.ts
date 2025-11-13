import type { gmail_v1 } from 'googleapis';
import type { AuthClient } from 'google-auth-library';
import { describe, expect, it, vi } from 'vitest';

import { GmailInboundProvider } from './gmail-inbound';

const now = Date.now();

describe('GmailInboundProvider', () => {
  it('lists and transforms threads', async () => {
    const gmail = createMockGmail();
    const provider = new GmailInboundProvider({
      auth: {} as AuthClient,
      gmail,
    });

    const threads = await provider.listThreads();
    expect(gmail.users.threads.list).toHaveBeenCalled();
    expect(threads).toHaveLength(1);
    const thread = threads[0];
    expect(thread.id).toBe('thread-1');
    expect(thread.subject).toBe('Hello');
    expect(thread.messages[0].textBody).toBe('Plain text body');
    expect(thread.messages[0].htmlBody).toContain('<p>');
  });

  it('retrieves messages since a timestamp', async () => {
    const gmail = createMockGmail();
    const provider = new GmailInboundProvider({
      auth: {} as AuthClient,
      gmail,
    });

    const result = await provider.listMessagesSince({
      label: 'INBOX',
      since: new Date(now - 1000),
    });

    expect(gmail.users.messages.list).toHaveBeenCalled();
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].subject).toBe('Hello');
  });
});

function createMockGmail() {
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
  return gmail;
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


