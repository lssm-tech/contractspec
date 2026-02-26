import { randomUUID } from 'node:crypto';

import type {
  ChannelDecisionRecord,
  ChannelDeliveryAttemptRecord,
  ChannelEventReceiptRecord,
  ChannelOutboxActionRecord,
  ChannelThreadRecord,
} from './types';
import type {
  ChannelRuntimeStore,
  ClaimEventReceiptInput,
  ClaimEventReceiptResult,
  EnqueueOutboxActionInput,
  EnqueueOutboxActionResult,
  MarkOutboxDeadLetterInput,
  MarkOutboxRetryInput,
  RecordDeliveryAttemptInput,
  SaveDecisionInput,
  UpsertThreadInput,
} from './store';

export class InMemoryChannelRuntimeStore implements ChannelRuntimeStore {
  public readonly receipts = new Map<string, ChannelEventReceiptRecord>();
  public readonly threads = new Map<string, ChannelThreadRecord>();
  public readonly decisions = new Map<string, ChannelDecisionRecord>();
  public readonly outbox = new Map<string, ChannelOutboxActionRecord>();
  public readonly deliveryAttempts = new Map<
    string,
    ChannelDeliveryAttemptRecord
  >();
  private readonly receiptKeyToId = new Map<string, string>();
  private readonly threadKeyToId = new Map<string, string>();
  private readonly outboxKeyToId = new Map<string, string>();
  private deliveryAttemptSequence = 0;

  async claimEventReceipt(
    input: ClaimEventReceiptInput
  ): Promise<ClaimEventReceiptResult> {
    const key = this.receiptKey(input);
    const existingId = this.receiptKeyToId.get(key);
    if (existingId) {
      const existing = this.receipts.get(existingId);
      if (existing) {
        existing.lastSeenAt = new Date();
        this.receipts.set(existing.id, existing);
      }
      return {
        receiptId: existingId,
        duplicate: true,
      };
    }

    const id = randomUUID();
    const now = new Date();
    this.receipts.set(id, {
      id,
      workspaceId: input.workspaceId,
      providerKey: input.providerKey,
      externalEventId: input.externalEventId,
      eventType: input.eventType,
      status: 'accepted',
      signatureValid: input.signatureValid,
      payloadHash: input.payloadHash,
      traceId: input.traceId,
      firstSeenAt: now,
      lastSeenAt: now,
    });
    this.receiptKeyToId.set(key, id);
    return { receiptId: id, duplicate: false };
  }

  async updateReceiptStatus(
    receiptId: string,
    status: ChannelEventReceiptRecord['status'],
    error?: { code: string; message: string }
  ): Promise<void> {
    const receipt = this.receipts.get(receiptId);
    if (!receipt) {
      return;
    }
    receipt.status = status;
    receipt.lastSeenAt = new Date();
    if (status === 'processed') {
      receipt.processedAt = new Date();
    }
    receipt.errorCode = error?.code;
    receipt.errorMessage = error?.message;
    this.receipts.set(receiptId, receipt);
  }

  async upsertThread(input: UpsertThreadInput): Promise<ChannelThreadRecord> {
    const key = this.threadKey(input);
    const existingId = this.threadKeyToId.get(key);
    if (existingId) {
      const existing = this.threads.get(existingId);
      if (!existing) {
        throw new Error('Corrupted thread state');
      }
      existing.externalChannelId =
        input.externalChannelId ?? existing.externalChannelId;
      existing.externalUserId = input.externalUserId ?? existing.externalUserId;
      existing.lastProviderEventAt =
        input.occurredAt ?? existing.lastProviderEventAt;
      existing.updatedAt = new Date();
      if (input.state) {
        existing.state = {
          ...existing.state,
          ...input.state,
        };
      }
      this.threads.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const now = new Date();
    const record: ChannelThreadRecord = {
      id,
      workspaceId: input.workspaceId,
      providerKey: input.providerKey,
      externalThreadId: input.externalThreadId,
      externalChannelId: input.externalChannelId,
      externalUserId: input.externalUserId,
      state: input.state ?? {},
      lastProviderEventAt: input.occurredAt,
      createdAt: now,
      updatedAt: now,
    };
    this.threads.set(id, record);
    this.threadKeyToId.set(key, id);
    return record;
  }

  async saveDecision(input: SaveDecisionInput): Promise<ChannelDecisionRecord> {
    const id = randomUUID();
    const record: ChannelDecisionRecord = {
      id,
      receiptId: input.receiptId,
      threadId: input.threadId,
      policyMode: input.policyMode,
      riskTier: input.riskTier,
      confidence: input.confidence,
      modelName: input.modelName,
      promptVersion: input.promptVersion,
      policyVersion: input.policyVersion,
      toolTrace: input.toolTrace ?? [],
      actionPlan: input.actionPlan,
      requiresApproval: input.requiresApproval,
      createdAt: new Date(),
    };
    this.decisions.set(id, record);
    return record;
  }

  async enqueueOutboxAction(
    input: EnqueueOutboxActionInput
  ): Promise<EnqueueOutboxActionResult> {
    const existingId = this.outboxKeyToId.get(input.idempotencyKey);
    if (existingId) {
      return {
        actionId: existingId,
        duplicate: true,
      };
    }

    const id = randomUUID();
    const now = new Date();
    this.outbox.set(id, {
      id,
      workspaceId: input.workspaceId,
      providerKey: input.providerKey,
      decisionId: input.decisionId,
      threadId: input.threadId,
      actionType: input.actionType,
      idempotencyKey: input.idempotencyKey,
      target: input.target,
      payload: input.payload,
      status: 'pending',
      attemptCount: 0,
      nextAttemptAt: now,
      createdAt: now,
      updatedAt: now,
    });
    this.outboxKeyToId.set(input.idempotencyKey, id);
    return {
      actionId: id,
      duplicate: false,
    };
  }

  async claimPendingOutboxActions(
    limit: number,
    now: Date = new Date()
  ): Promise<ChannelOutboxActionRecord[]> {
    const items = Array.from(this.outbox.values())
      .filter(
        (item) =>
          (item.status === 'pending' || item.status === 'retryable') &&
          item.nextAttemptAt.getTime() <= now.getTime()
      )
      .sort((a, b) => a.nextAttemptAt.getTime() - b.nextAttemptAt.getTime())
      .slice(0, Math.max(1, limit));

    const claimed: ChannelOutboxActionRecord[] = [];
    for (const item of items) {
      const updated: ChannelOutboxActionRecord = {
        ...item,
        status: 'sending',
        attemptCount: item.attemptCount + 1,
        updatedAt: new Date(),
      };
      this.outbox.set(updated.id, updated);
      claimed.push(updated);
    }

    return claimed;
  }

  async recordDeliveryAttempt(
    input: RecordDeliveryAttemptInput
  ): Promise<ChannelDeliveryAttemptRecord> {
    this.deliveryAttemptSequence += 1;
    const record: ChannelDeliveryAttemptRecord = {
      id: this.deliveryAttemptSequence,
      actionId: input.actionId,
      attempt: input.attempt,
      responseStatus: input.responseStatus,
      responseBody: input.responseBody,
      latencyMs: input.latencyMs,
      createdAt: new Date(),
    };
    this.deliveryAttempts.set(`${input.actionId}:${input.attempt}`, record);
    return record;
  }

  async markOutboxSent(
    actionId: string,
    providerMessageId?: string
  ): Promise<void> {
    const item = this.outbox.get(actionId);
    if (!item) return;
    item.status = 'sent';
    item.providerMessageId = providerMessageId;
    item.sentAt = new Date();
    item.lastErrorCode = undefined;
    item.lastErrorMessage = undefined;
    item.updatedAt = new Date();
    this.outbox.set(actionId, item);
  }

  async markOutboxRetry(input: MarkOutboxRetryInput): Promise<void> {
    const item = this.outbox.get(input.actionId);
    if (!item) return;
    item.status = 'retryable';
    item.nextAttemptAt = input.nextAttemptAt;
    item.lastErrorCode = input.lastErrorCode;
    item.lastErrorMessage = input.lastErrorMessage;
    item.updatedAt = new Date();
    this.outbox.set(input.actionId, item);
  }

  async markOutboxDeadLetter(input: MarkOutboxDeadLetterInput): Promise<void> {
    const item = this.outbox.get(input.actionId);
    if (!item) return;
    item.status = 'dead_letter';
    item.lastErrorCode = input.lastErrorCode;
    item.lastErrorMessage = input.lastErrorMessage;
    item.updatedAt = new Date();
    this.outbox.set(input.actionId, item);
  }

  private receiptKey(input: ClaimEventReceiptInput): string {
    return `${input.workspaceId}:${input.providerKey}:${input.externalEventId}`;
  }

  private threadKey(input: UpsertThreadInput): string {
    return `${input.workspaceId}:${input.providerKey}:${input.externalThreadId}`;
  }
}
