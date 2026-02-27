import type {
  ChannelDecisionRecord,
  ChannelDeliveryAttemptRecord,
  ChannelEventReceiptRecord,
  ChannelOutboxActionRecord,
  ChannelThreadRecord,
} from './types';

export interface ClaimEventReceiptInput {
  workspaceId: string;
  providerKey: string;
  externalEventId: string;
  eventType: string;
  signatureValid: boolean;
  payloadHash?: string;
  traceId?: string;
}

export interface ClaimEventReceiptResult {
  receiptId: string;
  duplicate: boolean;
}

export interface UpsertThreadInput {
  workspaceId: string;
  providerKey: string;
  externalThreadId: string;
  externalChannelId?: string;
  externalUserId?: string;
  state?: Record<string, unknown>;
  occurredAt?: Date;
}

export interface SaveDecisionInput {
  receiptId: string;
  threadId: string;
  policyMode: 'suggest' | 'assist' | 'autonomous';
  riskTier: 'low' | 'medium' | 'high' | 'blocked';
  confidence: number;
  modelName: string;
  promptVersion: string;
  policyVersion: string;
  toolTrace?: Record<string, unknown>[];
  actionPlan: Record<string, unknown>;
  requiresApproval: boolean;
}

export interface EnqueueOutboxActionInput {
  workspaceId: string;
  providerKey: string;
  decisionId: string;
  threadId: string;
  actionType: string;
  idempotencyKey: string;
  target: Record<string, unknown>;
  payload: Record<string, unknown>;
}

export interface EnqueueOutboxActionResult {
  actionId: string;
  duplicate: boolean;
}

export interface RecordDeliveryAttemptInput {
  actionId: string;
  attempt: number;
  responseStatus?: number;
  responseBody?: string;
  latencyMs?: number;
}

export interface MarkOutboxRetryInput {
  actionId: string;
  nextAttemptAt: Date;
  lastErrorCode: string;
  lastErrorMessage: string;
}

export interface MarkOutboxDeadLetterInput {
  actionId: string;
  lastErrorCode: string;
  lastErrorMessage: string;
}

export interface ChannelRuntimeStore {
  claimEventReceipt(
    input: ClaimEventReceiptInput
  ): Promise<ClaimEventReceiptResult>;
  updateReceiptStatus(
    receiptId: string,
    status: ChannelEventReceiptRecord['status'],
    error?: { code: string; message: string }
  ): Promise<void>;
  upsertThread(input: UpsertThreadInput): Promise<ChannelThreadRecord>;
  saveDecision(input: SaveDecisionInput): Promise<ChannelDecisionRecord>;
  enqueueOutboxAction(
    input: EnqueueOutboxActionInput
  ): Promise<EnqueueOutboxActionResult>;
  claimPendingOutboxActions(
    limit: number,
    now?: Date
  ): Promise<ChannelOutboxActionRecord[]>;
  recordDeliveryAttempt(
    input: RecordDeliveryAttemptInput
  ): Promise<ChannelDeliveryAttemptRecord>;
  markOutboxSent(actionId: string, providerMessageId?: string): Promise<void>;
  markOutboxRetry(input: MarkOutboxRetryInput): Promise<void>;
  markOutboxDeadLetter(input: MarkOutboxDeadLetterInput): Promise<void>;
}
