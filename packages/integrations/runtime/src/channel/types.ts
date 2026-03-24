import type {
	ChannelApprovalContext,
	ChannelApprovalStatus,
	ChannelRiskTier,
} from './base-types';
import type { ChannelCompiledPlan, ChannelPlanTraceEntry } from './plan-types';

export * from './base-types';
export * from './control-plane-types';
export * from './plan-types';

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
	policyMode: 'suggest' | 'assist' | 'autonomous' | 'blocked';
	riskTier: ChannelRiskTier;
	confidence: number;
	modelName: string;
	promptVersion: string;
	policyVersion: string;
	toolTrace: ChannelPlanTraceEntry[];
	actionPlan: ChannelCompiledPlan;
	requiresApproval: boolean;
	approvalStatus: ChannelApprovalStatus;
	approvalUpdatedAt?: Date;
	approvedBy?: string;
	approvedAt?: Date;
	rejectedBy?: string;
	rejectedAt?: Date;
	rejectionReason?: string;
	approvalContext?: ChannelApprovalContext;
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
	status: 'accepted' | 'duplicate' | 'rejected';
	receiptId: string;
}
