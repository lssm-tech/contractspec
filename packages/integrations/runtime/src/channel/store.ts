import type { ChannelTelemetryEvent } from './telemetry';
import type {
	ChannelApprovalContext,
	ChannelApprovalStatus,
	ChannelCompiledPlan,
	ChannelDecisionRecord,
	ChannelDeliveryAttemptRecord,
	ChannelEventReceiptRecord,
	ChannelOutboxActionRecord,
	ChannelPlanTraceEntry,
	ChannelThreadRecord,
	ChannelTraceEventRecord,
	ControlPlaneSkillInstallationRecord,
	ControlPlaneSkillInstallationStatus,
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
	policyMode: 'suggest' | 'assist' | 'autonomous' | 'blocked';
	riskTier: 'low' | 'medium' | 'high' | 'blocked';
	confidence: number;
	modelName: string;
	promptVersion: string;
	policyVersion: string;
	toolTrace?: ChannelPlanTraceEntry[];
	actionPlan: ChannelCompiledPlan;
	requiresApproval: boolean;
	approvalStatus: ChannelApprovalStatus;
}

export interface ListPendingApprovalsInput {
	workspaceId?: string;
	providerKey?: string;
	limit?: number;
}

export interface ListDecisionsInput {
	workspaceId?: string;
	providerKey?: string;
	traceId?: string;
	receiptId?: string;
	externalEventId?: string;
	approvalStatus?: ChannelApprovalStatus;
	actorId?: string;
	sessionId?: string;
	workflowId?: string;
	createdAfter?: Date;
	createdBefore?: Date;
	limit?: number;
}

export interface ResolveDecisionApprovalInput {
	decisionId: string;
	approvalStatus: Extract<
		ChannelApprovalStatus,
		'approved' | 'rejected' | 'expired'
	>;
	actorId?: string;
	actedAt: Date;
	reason?: string;
	approvalContext?: ChannelApprovalContext;
	actionPlan: ChannelCompiledPlan;
	toolTrace: ChannelPlanTraceEntry[];
}

export interface AppendTraceEventInput extends ChannelTelemetryEvent {
	decisionId?: string;
}

export interface ListTraceEventsInput {
	traceId?: string;
	receiptId?: string;
	decisionId?: string;
	actionId?: string;
	limit?: number;
}

export interface SaveSkillInstallationInput {
	skillKey: string;
	version: string;
	artifactDigest: string;
	manifest: ControlPlaneSkillInstallationRecord['manifest'];
	verificationReport: ControlPlaneSkillInstallationRecord['verificationReport'];
	status: ControlPlaneSkillInstallationStatus;
	installedAt: Date;
	installedBy?: string;
	disabledAt?: Date;
	disabledBy?: string;
}

export interface ListSkillInstallationsInput {
	includeDisabled?: boolean;
	limit?: number;
	offset?: number;
	skillKey?: string;
}

export interface ListSkillInstallationsResult {
	items: ControlPlaneSkillInstallationRecord[];
	total: number;
}

export interface DisableSkillInstallationInput {
	installationId: string;
	disabledAt: Date;
	disabledBy?: string;
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

export interface ApproveDecisionAndEnqueueOutboxInput {
	resolution: ResolveDecisionApprovalInput;
	outbox: EnqueueOutboxActionInput;
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
	getReceipt(receiptId: string): Promise<ChannelEventReceiptRecord | null>;
	getThread(threadId: string): Promise<ChannelThreadRecord | null>;
	getDecision(decisionId: string): Promise<ChannelDecisionRecord | null>;
	listDecisions(input?: ListDecisionsInput): Promise<ChannelDecisionRecord[]>;
	listPendingApprovals(
		input?: ListPendingApprovalsInput
	): Promise<ChannelDecisionRecord[]>;
	resolveDecisionApproval(
		input: ResolveDecisionApprovalInput
	): Promise<ChannelDecisionRecord | null>;
	approveDecisionAndEnqueueOutbox(
		input: ApproveDecisionAndEnqueueOutboxInput
	): Promise<{
		decision: ChannelDecisionRecord;
		outboxAction: EnqueueOutboxActionResult;
	} | null>;
	enqueueOutboxAction(
		input: EnqueueOutboxActionInput
	): Promise<EnqueueOutboxActionResult>;
	claimPendingOutboxActions(
		limit: number,
		now?: Date
	): Promise<ChannelOutboxActionRecord[]>;
	listOutboxActionsForDecision(
		decisionId: string
	): Promise<ChannelOutboxActionRecord[]>;
	recordDeliveryAttempt(
		input: RecordDeliveryAttemptInput
	): Promise<ChannelDeliveryAttemptRecord>;
	listDeliveryAttemptsForAction(
		actionId: string
	): Promise<ChannelDeliveryAttemptRecord[]>;
	markOutboxSent(actionId: string, providerMessageId?: string): Promise<void>;
	markOutboxRetry(input: MarkOutboxRetryInput): Promise<void>;
	markOutboxDeadLetter(input: MarkOutboxDeadLetterInput): Promise<void>;
	appendTraceEvent(
		input: AppendTraceEventInput
	): Promise<ChannelTraceEventRecord>;
	listTraceEvents(
		input?: ListTraceEventsInput
	): Promise<ChannelTraceEventRecord[]>;
	saveSkillInstallation(
		input: SaveSkillInstallationInput
	): Promise<ControlPlaneSkillInstallationRecord>;
	getSkillInstallation(
		installationId: string
	): Promise<ControlPlaneSkillInstallationRecord | null>;
	findSkillInstallation(
		skillKey: string,
		version: string
	): Promise<ControlPlaneSkillInstallationRecord | null>;
	listSkillInstallations(
		input?: ListSkillInstallationsInput
	): Promise<ListSkillInstallationsResult>;
	disableSkillInstallation(
		input: DisableSkillInstallationInput
	): Promise<ControlPlaneSkillInstallationRecord | null>;
}
