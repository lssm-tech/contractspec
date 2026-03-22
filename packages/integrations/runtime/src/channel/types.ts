export type ChannelProviderKey =
	| 'messaging.slack'
	| 'messaging.github'
	| 'messaging.telegram'
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

export type ChannelActorType = 'human' | 'service' | 'agent' | 'tool';

export type ChannelPlanStepKind =
	| 'intent.submit'
	| 'plan.verify'
	| 'execution.start';

export type ChannelPlanStepStatus = 'planned' | 'completed' | 'blocked';

export type ChannelApprovalStatus =
	| 'not_required'
	| 'pending'
	| 'approved'
	| 'rejected'
	| 'expired';

export interface ChannelExecutionActor {
	type: ChannelActorType;
	id: string;
	tenantId?: string;
	sessionId?: string;
	capabilitySource?: string;
	capabilityGrants: string[];
}

export interface ChannelApprovalContext {
	actorType?: ChannelActorType;
	sessionId?: string;
	capabilitySource?: string;
	capabilityGrants?: string[];
}

export interface ChannelPlanStep {
	id: string;
	contractKey: string;
	title: string;
	kind: ChannelPlanStepKind;
	dependsOn: string[];
	status: ChannelPlanStepStatus;
	input: Record<string, unknown>;
	output?: Record<string, unknown>;
}

export interface ChannelPlanTraceEntry {
	stepId: string;
	contractKey: string;
	status: ChannelPlanStepStatus;
	metadata?: Record<string, string | number | boolean>;
}

export interface ChannelCompiledPlan {
	id: string;
	workspaceId: string;
	providerKey: ChannelProviderKey;
	traceId: string;
	receiptId: string;
	threadId: string;
	compiledAt: string;
	actor: ChannelExecutionActor;
	audit: {
		actorId: string;
		actorType: ChannelActorType;
		capabilityGrants: string[];
		tenantId?: string;
		sessionId?: string;
		workflowId?: string;
		capabilitySource?: string;
	};
	intent: {
		eventType: string;
		externalEventId: string;
		occurredAt: string;
		messageText?: string;
		summary: string;
		rawPayload?: string;
		metadata?: Record<string, string>;
		thread: {
			externalThreadId: string;
			externalChannelId?: string;
			externalUserId?: string;
		};
	};
	approval: {
		required: boolean;
		status: ChannelApprovalStatus;
		fallback: 'block_on_timeout';
		timeoutAt?: string;
	};
	policy?: {
		verdict: ChannelPolicyVerdict;
		riskTier: ChannelRiskTier;
		confidence: number;
		reasons: string[];
		policyRef?: {
			key: string;
			version: string;
		};
	};
	steps: ChannelPlanStep[];
}

export interface ChannelPolicyDecision {
	confidence: number;
	riskTier: ChannelRiskTier;
	verdict: ChannelPolicyVerdict;
	reasons: string[];
	responseText: string;
	requiresApproval: boolean;
	policyRef?: {
		key: string;
		version: string;
	};
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
