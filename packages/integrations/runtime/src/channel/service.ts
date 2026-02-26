import { createHash, randomUUID } from 'node:crypto';

import { MessagingPolicyEngine } from './policy';
import type { ChannelInboundEvent, ChannelIngestResult } from './types';
import type { ChannelRuntimeStore } from './store';
import type { ChannelTelemetryEmitter } from './telemetry';

export interface ChannelRuntimeServiceOptions {
  policy?: MessagingPolicyEngine;
  asyncProcessing?: boolean;
  processInBackground?: (task: () => Promise<void>) => void;
  modelName?: string;
  promptVersion?: string;
  policyVersion?: string;
  telemetry?: ChannelTelemetryEmitter;
}

export class ChannelRuntimeService {
  private readonly policy: MessagingPolicyEngine;
  private readonly asyncProcessing: boolean;
  private readonly processInBackground: (task: () => Promise<void>) => void;
  private readonly modelName: string;
  private readonly promptVersion: string;
  private readonly policyVersion: string;
  private readonly telemetry?: ChannelTelemetryEmitter;

  constructor(
    private readonly store: ChannelRuntimeStore,
    options: ChannelRuntimeServiceOptions = {}
  ) {
    this.policy = options.policy ?? new MessagingPolicyEngine();
    this.asyncProcessing = options.asyncProcessing ?? true;
    this.processInBackground =
      options.processInBackground ??
      ((task) => {
        setTimeout(() => {
          void task();
        }, 0);
      });
    this.modelName = options.modelName ?? 'policy-heuristics-v1';
    this.promptVersion = options.promptVersion ?? 'channel-runtime.v1';
    this.policyVersion = options.policyVersion ?? 'messaging-policy.v1';
    this.telemetry = options.telemetry;
  }

  async ingest(event: ChannelInboundEvent): Promise<ChannelIngestResult> {
    const startedAtMs = Date.now();
    const claim = await this.store.claimEventReceipt({
      workspaceId: event.workspaceId,
      providerKey: event.providerKey,
      externalEventId: event.externalEventId,
      eventType: event.eventType,
      signatureValid: event.signatureValid,
      payloadHash: event.rawPayload ? sha256(event.rawPayload) : undefined,
      traceId: event.traceId,
    });

    if (claim.duplicate) {
      this.telemetry?.record({
        stage: 'ingest',
        status: 'duplicate',
        workspaceId: event.workspaceId,
        providerKey: event.providerKey,
        receiptId: claim.receiptId,
        traceId: event.traceId,
        latencyMs: Date.now() - startedAtMs,
      });
      return {
        status: 'duplicate',
        receiptId: claim.receiptId,
      };
    }

    this.telemetry?.record({
      stage: 'ingest',
      status: 'accepted',
      workspaceId: event.workspaceId,
      providerKey: event.providerKey,
      receiptId: claim.receiptId,
      traceId: event.traceId,
      latencyMs: Date.now() - startedAtMs,
    });

    const task = async () => {
      await this.processAcceptedEvent(claim.receiptId, event);
    };

    if (this.asyncProcessing) {
      this.processInBackground(task);
    } else {
      await task();
    }

    return {
      status: 'accepted',
      receiptId: claim.receiptId,
    };
  }

  private async processAcceptedEvent(
    receiptId: string,
    event: ChannelInboundEvent
  ): Promise<void> {
    try {
      await this.store.updateReceiptStatus(receiptId, 'processing');

      const thread = await this.store.upsertThread({
        workspaceId: event.workspaceId,
        providerKey: event.providerKey,
        externalThreadId: event.thread.externalThreadId,
        externalChannelId: event.thread.externalChannelId,
        externalUserId: event.thread.externalUserId,
        occurredAt: event.occurredAt,
      });

      const policyDecision = this.policy.evaluate({ event });
      this.telemetry?.record({
        stage: 'decision',
        status: 'processed',
        workspaceId: event.workspaceId,
        providerKey: event.providerKey,
        receiptId,
        traceId: event.traceId,
        metadata: {
          verdict: policyDecision.verdict,
          riskTier: policyDecision.riskTier,
          confidence: policyDecision.confidence,
        },
      });
      const decision = await this.store.saveDecision({
        receiptId,
        threadId: thread.id,
        policyMode:
          policyDecision.verdict === 'autonomous' ? 'autonomous' : 'assist',
        riskTier: policyDecision.riskTier,
        confidence: policyDecision.confidence,
        modelName: this.modelName,
        promptVersion: this.promptVersion,
        policyVersion: this.policyVersion,
        actionPlan: {
          verdict: policyDecision.verdict,
          reasons: policyDecision.reasons,
        },
        requiresApproval: policyDecision.requiresApproval,
      });

      if (policyDecision.verdict === 'autonomous') {
        await this.store.enqueueOutboxAction({
          workspaceId: event.workspaceId,
          providerKey: event.providerKey,
          decisionId: decision.id,
          threadId: thread.id,
          actionType: 'reply',
          idempotencyKey: buildOutboxIdempotencyKey(
            event,
            policyDecision.responseText
          ),
          target: {
            externalThreadId: event.thread.externalThreadId,
            externalChannelId: event.thread.externalChannelId,
            externalUserId: event.thread.externalUserId,
          },
          payload: {
            id: randomUUID(),
            text: policyDecision.responseText,
          },
        });
        this.telemetry?.record({
          stage: 'outbox',
          status: 'accepted',
          workspaceId: event.workspaceId,
          providerKey: event.providerKey,
          receiptId,
          traceId: event.traceId,
          metadata: {
            actionType: 'reply',
          },
        });
      }

      await this.store.updateReceiptStatus(receiptId, 'processed');
      this.telemetry?.record({
        stage: 'ingest',
        status: 'processed',
        workspaceId: event.workspaceId,
        providerKey: event.providerKey,
        receiptId,
        traceId: event.traceId,
      });
    } catch (error) {
      await this.store.updateReceiptStatus(receiptId, 'failed', {
        code: 'PROCESSING_FAILED',
        message: error instanceof Error ? error.message : String(error),
      });
      this.telemetry?.record({
        stage: 'ingest',
        status: 'failed',
        workspaceId: event.workspaceId,
        providerKey: event.providerKey,
        receiptId,
        traceId: event.traceId,
        metadata: {
          errorCode: 'PROCESSING_FAILED',
        },
      });
    }
  }
}

function buildOutboxIdempotencyKey(
  event: ChannelInboundEvent,
  responseText: string
): string {
  return sha256(
    `${event.workspaceId}:${event.providerKey}:${event.externalEventId}:reply:${responseText}`
  );
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
