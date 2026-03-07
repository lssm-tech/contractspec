import { createHmac } from 'node:crypto';

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

import { InMemoryChannelRuntimeStore } from '@contractspec/integration.runtime/channel';
import app from '../index';
import {
  getChannelRuntimeStoreForTests,
  resetChannelRuntimeResourcesForTests,
} from './channel-runtime-resources';

const TEST_ENV_KEYS = [
  'CHANNEL_RUNTIME_STORAGE',
  'CHANNEL_RUNTIME_ASYNC_PROCESSING',
  'CHANNEL_DISPATCH_TOKEN',
  'CHANNEL_ALLOW_UNMAPPED_WORKSPACE',
  'CHANNEL_WORKSPACE_MAP_SLACK',
  'CHANNEL_WORKSPACE_MAP_GITHUB',
  'CHANNEL_WORKSPACE_MAP_WHATSAPP_META',
  'CHANNEL_WORKSPACE_MAP_WHATSAPP_TWILIO',
  'SLACK_SIGNING_SECRET',
  'SLACK_BOT_TOKEN',
  'SLACK_DEFAULT_CHANNEL_ID',
  'GITHUB_WEBHOOK_SECRET',
  'GITHUB_TOKEN',
  'WHATSAPP_META_APP_SECRET',
  'WHATSAPP_META_ACCESS_TOKEN',
  'WHATSAPP_META_PHONE_NUMBER_ID',
  'WHATSAPP_TWILIO_AUTH_TOKEN',
  'WHATSAPP_TWILIO_ACCOUNT_SID',
  'WHATSAPP_TWILIO_FROM_NUMBER',
  'WHATSAPP_TWILIO_WEBHOOK_URL',
];

const originalFetch = globalThis.fetch;

beforeEach(() => {
  resetChannelRuntimeResourcesForTests();
  for (const key of TEST_ENV_KEYS) {
    Reflect.deleteProperty(process.env, key);
  }
  process.env.CHANNEL_RUNTIME_STORAGE = 'memory';
  process.env.CHANNEL_RUNTIME_ASYNC_PROCESSING = '0';
  process.env.CHANNEL_DISPATCH_TOKEN = 'dispatch-token';
  process.env.CHANNEL_ALLOW_UNMAPPED_WORKSPACE = '0';
});

afterEach(() => {
  resetChannelRuntimeResourcesForTests();
  for (const key of TEST_ENV_KEYS) {
    Reflect.deleteProperty(process.env, key);
  }
  globalThis.fetch = originalFetch;
});

describe('channel runtime integration', () => {
  it('processes Slack webhook and dispatches outbox message', async () => {
    process.env.CHANNEL_WORKSPACE_MAP_SLACK = JSON.stringify({
      T123: 'workspace-slack',
    });
    process.env.SLACK_SIGNING_SECRET = 'slack-secret';
    process.env.SLACK_BOT_TOKEN = 'xoxb-test';

    const timestamp = Math.floor(Date.now() / 1000);
    const payload = {
      type: 'event_callback',
      team_id: 'T123',
      event_id: 'Ev123',
      event_time: timestamp,
      event: {
        type: 'message',
        user: 'U123',
        text: 'Can you share onboarding docs?',
        ts: `${timestamp}.000001`,
        channel: 'C123',
      },
    };
    const rawBody = JSON.stringify(payload);
    const requestTimestamp = String(timestamp);
    const signature = `v0=${createHmac('sha256', 'slack-secret')
      .update(`v0:${requestTimestamp}:${rawBody}`)
      .digest('hex')}`;

    const ingestResponse = await app.handle(
      new Request('http://localhost/webhooks/slack/events', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-slack-request-timestamp': requestTimestamp,
          'x-slack-signature': signature,
        },
        body: rawBody,
      })
    );

    expect(ingestResponse.status).toBe(200);
    const ingestJson = (await ingestResponse.json()) as {
      ok: boolean;
      status: string;
    };
    expect(ingestJson.ok).toBe(true);
    expect(ingestJson.status).toBe('accepted');

    const store = getChannelRuntimeStoreForTests();
    expect(store).toBeInstanceOf(InMemoryChannelRuntimeStore);
    const memoryStore = store as InMemoryChannelRuntimeStore;
    expect(memoryStore.outbox.size).toBe(1);

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('chat.postMessage')) {
        return new Response(
          JSON.stringify({
            ok: true,
            ts: '1740001000.000001',
            channel: 'C123',
          }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }
        );
      }
      return new Response('{}', { status: 200 });
    }) as typeof fetch;

    const dispatchResponse = await app.handle(
      new Request('http://localhost/internal/channel/dispatch', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-channel-dispatch-token': 'dispatch-token',
        },
        body: JSON.stringify({}),
      })
    );

    expect(dispatchResponse.status).toBe(200);
    const dispatchJson = (await dispatchResponse.json()) as {
      ok: boolean;
      summary: { sent: number };
    };
    expect(dispatchJson.ok).toBe(true);
    expect(dispatchJson.summary.sent).toBe(1);
    expect(Array.from(memoryStore.outbox.values())[0]?.status).toBe('sent');
  });

  it('processes GitHub webhook and dispatches issue comment', async () => {
    process.env.CHANNEL_WORKSPACE_MAP_GITHUB = JSON.stringify({
      'lssm-tech/contractspec': 'workspace-github',
    });
    process.env.GITHUB_WEBHOOK_SECRET = 'github-secret';
    process.env.GITHUB_TOKEN = 'ghp-test';

    const payload = {
      action: 'created',
      repository: {
        full_name: 'lssm-tech/contractspec',
        name: 'contractspec',
        owner: { login: 'lssm-tech' },
      },
      issue: {
        number: 42,
      },
      comment: {
        id: 301,
        body: 'Please summarize this PR',
      },
      sender: {
        login: 'tboutron',
      },
    };
    const rawBody = JSON.stringify(payload);
    const signature = `sha256=${createHmac('sha256', 'github-secret')
      .update(rawBody)
      .digest('hex')}`;

    const ingestResponse = await app.handle(
      new Request('http://localhost/webhooks/github/events', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-hub-signature-256': signature,
          'x-github-delivery': 'delivery-123',
          'x-github-event': 'issue_comment',
        },
        body: rawBody,
      })
    );

    expect(ingestResponse.status).toBe(200);
    const store =
      getChannelRuntimeStoreForTests() as InMemoryChannelRuntimeStore;
    expect(store.outbox.size).toBe(1);

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/issues/42/comments')) {
        return new Response(
          JSON.stringify({
            id: 9001,
            node_id: 'IC_kwDOA',
            html_url:
              'https://github.com/lssm-tech/contractspec/issues/42#issuecomment-9001',
          }),
          {
            status: 201,
            headers: { 'content-type': 'application/json' },
          }
        );
      }
      return new Response('{}', { status: 200 });
    }) as typeof fetch;

    const dispatchResponse = await app.handle(
      new Request('http://localhost/internal/channel/dispatch', {
        method: 'GET',
        headers: {
          authorization: 'Bearer dispatch-token',
        },
      })
    );

    expect(dispatchResponse.status).toBe(200);
    const dispatchJson = (await dispatchResponse.json()) as {
      ok: boolean;
      summary: { sent: number };
    };
    expect(dispatchJson.ok).toBe(true);
    expect(dispatchJson.summary.sent).toBe(1);
    expect(Array.from(store.outbox.values())[0]?.status).toBe('sent');
  });

  it('processes Twilio WhatsApp webhook and dispatches outbound message', async () => {
    process.env.CHANNEL_WORKSPACE_MAP_WHATSAPP_TWILIO = JSON.stringify({
      AC123: 'workspace-whatsapp',
    });
    process.env.WHATSAPP_TWILIO_AUTH_TOKEN = 'twilio-secret';
    process.env.WHATSAPP_TWILIO_ACCOUNT_SID = 'AC123';
    process.env.WHATSAPP_TWILIO_FROM_NUMBER = 'whatsapp:+15550002';

    const form = new URLSearchParams();
    form.set('AccountSid', 'AC123');
    form.set('MessageSid', 'SM123');
    form.set('From', 'whatsapp:+15550001');
    form.set('To', 'whatsapp:+15550002');
    form.set('Body', 'Need support quickly');

    const requestUrl = 'http://localhost/webhooks/whatsapp/twilio';
    process.env.WHATSAPP_TWILIO_WEBHOOK_URL = requestUrl;
    const sortedKeys = Array.from(form.keys()).sort();
    let signaturePayload = requestUrl;
    for (const key of sortedKeys) {
      signaturePayload += `${key}${form.get(key) ?? ''}`;
    }
    const signature = createHmac('sha1', 'twilio-secret')
      .update(signaturePayload)
      .digest('base64');

    const ingestResponse = await app.handle(
      new Request(requestUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-twilio-signature': signature,
        },
        body: form.toString(),
      })
    );

    expect(ingestResponse.status).toBe(200);
    const store =
      getChannelRuntimeStoreForTests() as InMemoryChannelRuntimeStore;
    expect(store.outbox.size).toBe(1);

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (
        url.includes('api.twilio.com/2010-04-01/Accounts/AC123/Messages.json')
      ) {
        return new Response(JSON.stringify({ sid: 'SM999', status: 'sent' }), {
          status: 201,
          headers: { 'content-type': 'application/json' },
        });
      }
      return new Response('{}', { status: 200 });
    }) as typeof fetch;

    const dispatchResponse = await app.handle(
      new Request('http://localhost/internal/channel/dispatch', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-channel-dispatch-token': 'dispatch-token',
        },
        body: '{}',
      })
    );

    expect(dispatchResponse.status).toBe(200);
    const dispatchJson = (await dispatchResponse.json()) as {
      ok: boolean;
      summary: { sent: number };
    };
    expect(dispatchJson.ok).toBe(true);
    expect(dispatchJson.summary.sent).toBe(1);
    expect(Array.from(store.outbox.values())[0]?.status).toBe('sent');
  });

  it('processes Meta WhatsApp webhook and dispatches outbound message', async () => {
    process.env.CHANNEL_WORKSPACE_MAP_WHATSAPP_META = JSON.stringify({
      '120000000001': 'workspace-whatsapp-meta',
    });
    process.env.WHATSAPP_META_APP_SECRET = 'meta-secret';
    process.env.WHATSAPP_META_ACCESS_TOKEN = 'meta-access-token';
    process.env.WHATSAPP_META_PHONE_NUMBER_ID = '120000000001';

    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'waba-001',
          changes: [
            {
              field: 'messages',
              value: {
                metadata: {
                  phone_number_id: '120000000001',
                  display_phone_number: '+15550002',
                },
                contacts: [
                  {
                    wa_id: '15550001',
                    profile: { name: 'Test User' },
                  },
                ],
                messages: [
                  {
                    id: 'wamid.HBgNMTU1NTAwMDE',
                    from: '15550001',
                    timestamp: String(Math.floor(Date.now() / 1000)),
                    type: 'text',
                    text: { body: 'Need account support' },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const rawBody = JSON.stringify(payload);
    const signature = `sha256=${createHmac('sha256', 'meta-secret')
      .update(rawBody)
      .digest('hex')}`;

    const ingestResponse = await app.handle(
      new Request('http://localhost/webhooks/whatsapp/meta', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-hub-signature-256': signature,
        },
        body: rawBody,
      })
    );

    expect(ingestResponse.status).toBe(200);
    const store =
      getChannelRuntimeStoreForTests() as InMemoryChannelRuntimeStore;
    expect(store.outbox.size).toBe(1);

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/120000000001/messages')) {
        return new Response(
          JSON.stringify({
            messages: [{ id: 'wamid.HBgNMTU1NTAwMDI' }],
          }),
          {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }
        );
      }
      return new Response('{}', { status: 200 });
    }) as typeof fetch;

    const dispatchResponse = await app.handle(
      new Request('http://localhost/internal/channel/dispatch', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-channel-dispatch-token': 'dispatch-token',
        },
        body: '{}',
      })
    );

    expect(dispatchResponse.status).toBe(200);
    const dispatchJson = (await dispatchResponse.json()) as {
      ok: boolean;
      summary: { sent: number };
    };
    expect(dispatchJson.ok).toBe(true);
    expect(dispatchJson.summary.sent).toBe(1);
    expect(Array.from(store.outbox.values())[0]?.status).toBe('sent');
  });
});
