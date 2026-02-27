export type ChannelProviderKey =
  | 'messaging.slack'
  | 'messaging.github'
  | 'messaging.whatsapp.meta'
  | 'messaging.whatsapp.twilio'
  | (string & {});

export interface ChannelThreadRef {
  externalThreadId: string;
  externalChannelId?: string;
  externalUserId?: string;
}

export interface InboundMessage {
  text: string;
  externalMessageId?: string;
}

export interface ChannelInboundEvent {
  workspaceId: string;
  providerKey: ChannelProviderKey;
  externalEventId: string;
  eventType: string;
  occurredAt: Date;
  signatureValid: boolean;
  traceId?: string;
  thread: ChannelThreadRef;
  message?: InboundMessage;
  metadata?: Record<string, string>;
  rawPayload?: string;
}

export type ChannelRiskTier = 'low' | 'medium' | 'high' | 'blocked';

export type ChannelPolicyVerdict = 'autonomous' | 'assist' | 'blocked';

export interface ChannelPolicyDecision {
  confidence: number;
  riskTier: ChannelRiskTier;
  verdict: ChannelPolicyVerdict;
  reasons: string[];
  responseText: string;
  requiresApproval: boolean;
}

export interface ChannelEventReceiptRecord {
  id: string;
  workspaceId: string;
  providerKey: string;
  externalEventId: string;
  eventType: string;
  status:
    | 'accepted'
    | 'processing'
    | 'processed'
    | 'duplicate'
    | 'failed'
    | 'rejected';
  signatureValid: boolean;
  payloadHash?: string;
  traceId?: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  processedAt?: Date;
  errorCode?: string;
  errorMessage?: string;
}

export interface ChannelThreadRecord {
  id: string;
  workspaceId: string;
  providerKey: string;
  externalThreadId: string;
  externalChannelId?: string;
  externalUserId?: string;
  state: Record<string, unknown>;
  lastProviderEventAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelDecisionRecord {
  id: string;
  receiptId: string;
  threadId: string;
  policyMode: 'suggest' | 'assist' | 'autonomous';
  riskTier: ChannelRiskTier;
  confidence: number;
  modelName: string;
  promptVersion: string;
  policyVersion: string;
  toolTrace: Record<string, unknown>[];
  actionPlan: Record<string, unknown>;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export interface ChannelOutboxActionRecord {
  id: string;
  workspaceId: string;
  providerKey: string;
  decisionId: string;
  threadId: string;
  actionType: string;
  idempotencyKey: string;
  target: Record<string, unknown>;
  payload: Record<string, unknown>;
  status:
    | 'pending'
    | 'sending'
    | 'sent'
    | 'retryable'
    | 'failed'
    | 'dead_letter'
    | 'cancelled';
  attemptCount: number;
  nextAttemptAt: Date;
  providerMessageId?: string;
  lastErrorCode?: string;
  lastErrorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
}

export interface ChannelDeliveryAttemptRecord {
  id: number;
  actionId: string;
  attempt: number;
  responseStatus?: number;
  responseBody?: string;
  latencyMs?: number;
  createdAt: Date;
}

export interface ChannelIngestResult {
  status: 'accepted' | 'duplicate';
  receiptId: string;
}
