import { describe, expect, it } from 'bun:test';

import { ChannelOutboxDispatcher } from './dispatcher';
import { InMemoryChannelRuntimeStore } from './memory-store';
import type { ChannelTelemetryEvent } from './telemetry';

describe('ChannelOutboxDispatcher', () => {
  it('marks actions as sent when provider succeeds', async () => {
    const store = new InMemoryChannelRuntimeStore();
    await store.enqueueOutboxAction({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.slack',
      decisionId: 'decision-1',
      threadId: 'thread-1',
      actionType: 'reply',
      idempotencyKey: 'idem-sent',
      target: { externalThreadId: 'thread-1' },
      payload: { text: 'hello' },
    });

    const dispatcher = new ChannelOutboxDispatcher(store, {
      batchSize: 10,
      maxRetries: 3,
      baseBackoffMs: 50,
      jitter: false,
    });

    const summary = await dispatcher.dispatchBatch(async () => ({
      send: async () => ({ providerMessageId: 'provider-message-1' }),
    }));

    expect(summary.claimed).toBe(1);
    expect(summary.sent).toBe(1);
    expect(summary.retried).toBe(0);
    expect(summary.deadLettered).toBe(0);

    const outbox = Array.from(store.outbox.values())[0];
    expect(outbox?.status).toBe('sent');
    expect(outbox?.providerMessageId).toBe('provider-message-1');
  });

  it('marks actions for retry on transient failures', async () => {
    const store = new InMemoryChannelRuntimeStore();
    await store.enqueueOutboxAction({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.github',
      decisionId: 'decision-2',
      threadId: 'thread-2',
      actionType: 'reply',
      idempotencyKey: 'idem-retry',
      target: { externalThreadId: 'thread-2' },
      payload: { text: 'hello' },
    });

    const dispatcher = new ChannelOutboxDispatcher(store, {
      batchSize: 10,
      maxRetries: 3,
      baseBackoffMs: 50,
      jitter: false,
    });

    const summary = await dispatcher.dispatchBatch(async () => ({
      send: async () => {
        throw new Error('temporary outage');
      },
    }));

    expect(summary.claimed).toBe(1);
    expect(summary.sent).toBe(0);
    expect(summary.retried).toBe(1);
    expect(summary.deadLettered).toBe(0);

    const outbox = Array.from(store.outbox.values())[0];
    expect(outbox?.status).toBe('retryable');
    expect(outbox?.lastErrorCode).toBe('DISPATCH_FAILED');
  });

  it('marks actions as dead letter after max retries', async () => {
    const store = new InMemoryChannelRuntimeStore();
    const action = await store.enqueueOutboxAction({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.whatsapp.meta',
      decisionId: 'decision-3',
      threadId: 'thread-3',
      actionType: 'reply',
      idempotencyKey: 'idem-dead',
      target: { externalThreadId: 'thread-3' },
      payload: { text: 'hello' },
    });
    await store.claimPendingOutboxActions(1);
    await store.markOutboxRetry({
      actionId: action.actionId,
      nextAttemptAt: new Date(0),
      lastErrorCode: 'PREVIOUS_FAILURE',
      lastErrorMessage: 'previous',
    });
    await store.claimPendingOutboxActions(1);
    await store.markOutboxRetry({
      actionId: action.actionId,
      nextAttemptAt: new Date(0),
      lastErrorCode: 'PREVIOUS_FAILURE',
      lastErrorMessage: 'previous',
    });

    const dispatcher = new ChannelOutboxDispatcher(store, {
      batchSize: 10,
      maxRetries: 3,
      baseBackoffMs: 50,
      jitter: false,
    });

    const summary = await dispatcher.dispatchBatch(async () => ({
      send: async () => {
        throw Object.assign(new Error('terminal failure'), {
          code: 'TERMINAL',
        });
      },
    }));

    expect(summary.claimed).toBe(1);
    expect(summary.sent).toBe(0);
    expect(summary.retried).toBe(0);
    expect(summary.deadLettered).toBe(1);

    const outbox = Array.from(store.outbox.values())[0];
    expect(outbox?.status).toBe('dead_letter');
    expect(outbox?.lastErrorCode).toBe('TERMINAL');
  });

  it('emits telemetry for successful dispatch', async () => {
    const store = new InMemoryChannelRuntimeStore();
    await store.enqueueOutboxAction({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.slack',
      decisionId: 'decision-telemetry',
      threadId: 'thread-telemetry',
      actionType: 'reply',
      idempotencyKey: 'idem-telemetry',
      target: { externalThreadId: 'thread-telemetry' },
      payload: { text: 'hello' },
    });

    const telemetryEvents: ChannelTelemetryEvent[] = [];
    const dispatcher = new ChannelOutboxDispatcher(store, {
      telemetry: {
        record(event) {
          telemetryEvents.push(event);
        },
      },
      jitter: false,
    });

    await dispatcher.dispatchBatch(async () => ({
      send: async () => ({ providerMessageId: 'ok' }),
    }));

    expect(
      telemetryEvents.some(
        (event) => event.stage === 'dispatch' && event.status === 'sent'
      )
    ).toBe(true);
  });
});
