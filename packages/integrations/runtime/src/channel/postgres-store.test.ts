import { describe, expect, it } from 'bun:test';

import { PostgresChannelRuntimeStore } from './postgres-store';

interface MockQueryResult<T = unknown> {
  rows: T[];
}

class MockPool {
  public readonly calls: Array<{ sql: string; params?: unknown[] }> = [];
  private readonly queue: MockQueryResult[];

  constructor(queue: MockQueryResult[]) {
    this.queue = queue;
  }

  async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<MockQueryResult<T>> {
    this.calls.push({ sql, params });
    const item = this.queue.shift();
    if (!item) {
      return { rows: [] };
    }
    return item as MockQueryResult<T>;
  }
}

describe('PostgresChannelRuntimeStore', () => {
  it('claims event receipts and reports duplicate state', async () => {
    const pool = new MockPool([
      { rows: [{ id: 'receipt-1', inserted: true }] },
      { rows: [{ id: 'receipt-1', inserted: false }] },
      { rows: [] },
    ]);
    const store = new PostgresChannelRuntimeStore(
      pool as unknown as ConstructorParameters<
        typeof PostgresChannelRuntimeStore
      >[0]
    );

    const first = await store.claimEventReceipt({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.slack',
      externalEventId: 'evt-1',
      eventType: 'slack.message',
      signatureValid: true,
    });
    expect(first.duplicate).toBe(false);

    const second = await store.claimEventReceipt({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.slack',
      externalEventId: 'evt-1',
      eventType: 'slack.message',
      signatureValid: true,
    });
    expect(second.duplicate).toBe(true);
  });

  it('deduplicates outbox by idempotency key', async () => {
    const pool = new MockPool([
      { rows: [{ id: 'outbox-1', inserted: true }] },
      { rows: [{ id: 'outbox-1', inserted: false }] },
    ]);
    const store = new PostgresChannelRuntimeStore(
      pool as unknown as ConstructorParameters<
        typeof PostgresChannelRuntimeStore
      >[0]
    );

    const first = await store.enqueueOutboxAction({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.slack',
      decisionId: 'decision-1',
      threadId: 'thread-1',
      actionType: 'reply',
      idempotencyKey: 'idem-1',
      target: { externalThreadId: 'thread-1' },
      payload: { text: 'ack' },
    });
    expect(first.duplicate).toBe(false);

    const second = await store.enqueueOutboxAction({
      workspaceId: 'workspace-1',
      providerKey: 'messaging.slack',
      decisionId: 'decision-1',
      threadId: 'thread-1',
      actionType: 'reply',
      idempotencyKey: 'idem-1',
      target: { externalThreadId: 'thread-1' },
      payload: { text: 'ack' },
    });
    expect(second.duplicate).toBe(true);
  });
});
