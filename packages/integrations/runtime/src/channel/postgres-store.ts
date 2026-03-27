import { randomUUID } from 'crypto';

import type { Pool, PoolClient } from 'pg';

import {
	CLAIM_EVENT_RECEIPT_SQL,
	CLAIM_PENDING_OUTBOX_SQL,
	COUNT_SKILL_INSTALLATIONS_SQL,
	DISABLE_SKILL_INSTALLATION_SQL,
	ENQUEUE_OUTBOX_SQL,
	FIND_SKILL_INSTALLATION_SQL,
	GET_DECISION_SQL,
	GET_RECEIPT_ID_BY_EXTERNAL_EVENT_SQL,
	GET_RECEIPT_SQL,
	GET_SKILL_INSTALLATION_SQL,
	GET_THREAD_SQL,
	INSERT_DECISION_SQL,
	INSERT_DELIVERY_ATTEMPT_SQL,
	INSERT_TRACE_EVENT_SQL,
	LIST_DECISIONS_SQL,
	LIST_DELIVERY_ATTEMPTS_FOR_ACTION_SQL,
	LIST_OUTBOX_ACTIONS_FOR_DECISION_SQL,
	LIST_PENDING_APPROVALS_SQL,
	LIST_SKILL_INSTALLATIONS_SQL,
	LIST_TRACE_EVENTS_SQL,
	MARK_OUTBOX_DEAD_LETTER_SQL,
	MARK_OUTBOX_RETRY_SQL,
	MARK_OUTBOX_SENT_SQL,
	MARK_RECEIPT_DUPLICATE_SQL,
	RECOVER_REJECTED_RECEIPT_SQL,
	RESOLVE_DECISION_APPROVAL_SQL,
	UPDATE_RECEIPT_STATUS_SQL,
	UPSERT_SKILL_INSTALLATION_SQL,
	UPSERT_THREAD_SQL,
} from './postgres-queries';
import { CHANNEL_RUNTIME_SCHEMA_STATEMENTS } from './postgres-schema';
import type {
	AppendTraceEventInput,
	ApproveDecisionAndEnqueueOutboxInput,
	ChannelRuntimeStore,
	ClaimEventReceiptInput,
	ClaimEventReceiptResult,
	DisableSkillInstallationInput,
	EnqueueOutboxActionInput,
	EnqueueOutboxActionResult,
	ListDecisionsInput,
	ListPendingApprovalsInput,
	ListSkillInstallationsInput,
	ListSkillInstallationsResult,
	ListTraceEventsInput,
	MarkOutboxDeadLetterInput,
	MarkOutboxRetryInput,
	RecordDeliveryAttemptInput,
	ResolveDecisionApprovalInput,
	SaveDecisionInput,
	SaveSkillInstallationInput,
	UpsertThreadInput,
} from './store';
import type {
	ChannelDecisionRecord,
	ChannelDeliveryAttemptRecord,
	ChannelEventReceiptRecord,
	ChannelOutboxActionRecord,
	ChannelThreadRecord,
	ChannelTraceEventRecord,
	ControlPlaneSkillInstallationRecord,
} from './types';

interface IdInsertedRow {
	id: string;
	inserted: boolean;
}

export class PostgresChannelRuntimeStore implements ChannelRuntimeStore {
	constructor(private readonly pool: Pool) {}

	async initializeSchema(): Promise<void> {
		for (const statement of CHANNEL_RUNTIME_SCHEMA_STATEMENTS) {
			await this.pool.query(statement);
		}
	}

	async claimEventReceipt(
		input: ClaimEventReceiptInput
	): Promise<ClaimEventReceiptResult> {
		const id = randomUUID();
		const inserted = await this.pool.query<{ id: string }>(
			CLAIM_EVENT_RECEIPT_SQL,
			[
				id,
				input.workspaceId,
				input.providerKey,
				input.externalEventId,
				input.eventType,
				input.signatureValid,
				input.payloadHash ?? null,
				input.traceId ?? null,
			]
		);
		const insertedRow = inserted.rows[0];
		if (insertedRow) {
			return {
				receiptId: insertedRow.id,
				duplicate: false,
			};
		}

		const recovered = await this.pool.query<{ id: string }>(
			RECOVER_REJECTED_RECEIPT_SQL,
			[
				input.workspaceId,
				input.providerKey,
				input.externalEventId,
				input.signatureValid,
				input.payloadHash ?? null,
				input.traceId ?? null,
			]
		);
		const recoveredRow = recovered.rows[0];
		if (recoveredRow) {
			return {
				receiptId: recoveredRow.id,
				duplicate: false,
			};
		}

		const existing = await this.pool.query<{ id: string }>(
			GET_RECEIPT_ID_BY_EXTERNAL_EVENT_SQL,
			[input.workspaceId, input.providerKey, input.externalEventId]
		);
		const existingRow = existing.rows[0];
		if (!existingRow) {
			throw new Error('Failed to claim event receipt');
		}
		await this.pool.query(MARK_RECEIPT_DUPLICATE_SQL, [existingRow.id]);

		return {
			receiptId: existingRow.id,
			duplicate: true,
		};
	}

	async updateReceiptStatus(
		receiptId: string,
		status: ChannelEventReceiptRecord['status'],
		error?: { code: string; message: string }
	): Promise<void> {
		await this.pool.query(UPDATE_RECEIPT_STATUS_SQL, [
			receiptId,
			status,
			error?.code ?? null,
			error?.message ?? null,
		]);
	}

	async upsertThread(input: UpsertThreadInput): Promise<ChannelThreadRecord> {
		const id = randomUUID();
		const result = await this.pool.query<{
			id: string;
			workspace_id: string;
			provider_key: string;
			external_thread_id: string;
			external_channel_id: string | null;
			external_user_id: string | null;
			state: Record<string, unknown>;
			last_provider_event_ts: Date | null;
			created_at: Date;
			updated_at: Date;
		}>(UPSERT_THREAD_SQL, [
			id,
			input.workspaceId,
			input.providerKey,
			input.externalThreadId,
			input.externalChannelId ?? null,
			input.externalUserId ?? null,
			JSON.stringify(input.state ?? {}),
			input.occurredAt ?? null,
		]);

		const row = result.rows[0];
		if (!row) {
			throw new Error('Failed to upsert channel thread');
		}

		return {
			id: row.id,
			workspaceId: row.workspace_id,
			providerKey: row.provider_key,
			externalThreadId: row.external_thread_id,
			externalChannelId: row.external_channel_id ?? undefined,
			externalUserId: row.external_user_id ?? undefined,
			state: row.state,
			lastProviderEventAt: row.last_provider_event_ts ?? undefined,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
		};
	}

	async saveDecision(input: SaveDecisionInput): Promise<ChannelDecisionRecord> {
		const id = randomUUID();
		await this.pool.query(INSERT_DECISION_SQL, [
			id,
			input.receiptId,
			input.threadId,
			input.policyMode,
			input.riskTier,
			input.confidence,
			input.modelName,
			input.promptVersion,
			input.policyVersion,
			JSON.stringify(input.toolTrace ?? []),
			JSON.stringify(input.actionPlan),
			input.requiresApproval,
			input.approvalStatus,
		]);

		return {
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
			approvalStatus: input.approvalStatus,
			createdAt: new Date(),
		};
	}

	async getReceipt(
		receiptId: string
	): Promise<ChannelEventReceiptRecord | null> {
		const result = await this.pool.query<ReceiptRow>(GET_RECEIPT_SQL, [
			receiptId,
		]);
		const row = result.rows[0];
		return row ? mapReceiptRow(row) : null;
	}

	async getThread(threadId: string): Promise<ChannelThreadRecord | null> {
		const result = await this.pool.query<ThreadRow>(GET_THREAD_SQL, [threadId]);
		const row = result.rows[0];
		return row ? mapThreadRow(row) : null;
	}

	async getDecision(decisionId: string): Promise<ChannelDecisionRecord | null> {
		const result = await this.pool.query<DecisionRow>(GET_DECISION_SQL, [
			decisionId,
		]);
		const row = result.rows[0];
		return row ? mapDecisionRow(row) : null;
	}

	async listDecisions(
		input: ListDecisionsInput = {}
	): Promise<ChannelDecisionRecord[]> {
		const limit = Math.max(1, input.limit ?? 100);
		const result = await this.pool.query<DecisionRow>(LIST_DECISIONS_SQL, [
			input.workspaceId ?? null,
			input.providerKey ?? null,
			input.traceId ?? null,
			input.receiptId ?? null,
			input.externalEventId ?? null,
			input.approvalStatus ?? null,
			input.actorId ?? null,
			input.sessionId ?? null,
			input.workflowId ?? null,
			input.createdAfter ?? null,
			input.createdBefore ?? null,
			limit,
		]);
		return result.rows.map(mapDecisionRow);
	}

	async listPendingApprovals(
		input: ListPendingApprovalsInput = {}
	): Promise<ChannelDecisionRecord[]> {
		const limit = Math.max(1, input.limit ?? 100);
		const result = await this.pool.query<DecisionRow>(
			LIST_PENDING_APPROVALS_SQL,
			[input.workspaceId ?? null, input.providerKey ?? null, limit]
		);
		return result.rows.map(mapDecisionRow);
	}

	async resolveDecisionApproval(
		input: ResolveDecisionApprovalInput
	): Promise<ChannelDecisionRecord | null> {
		const result = await this.pool.query<DecisionRow>(
			RESOLVE_DECISION_APPROVAL_SQL,
			[
				input.decisionId,
				input.approvalStatus,
				input.actedAt,
				input.actorId ?? null,
				input.reason ?? null,
				JSON.stringify(input.approvalContext ?? null),
				JSON.stringify(input.actionPlan),
				JSON.stringify(input.toolTrace),
			]
		);
		const row = result.rows[0];
		return row ? mapDecisionRow(row) : null;
	}

	async approveDecisionAndEnqueueOutbox(
		input: ApproveDecisionAndEnqueueOutboxInput
	): Promise<{
		decision: ChannelDecisionRecord;
		outboxAction: EnqueueOutboxActionResult;
	} | null> {
		const client = await this.pool.connect();
		try {
			await client.query('BEGIN');
			const decisionResult = await client.query<DecisionRow>(
				RESOLVE_DECISION_APPROVAL_SQL,
				[
					input.resolution.decisionId,
					input.resolution.approvalStatus,
					input.resolution.actedAt,
					input.resolution.actorId ?? null,
					input.resolution.reason ?? null,
					JSON.stringify(input.resolution.approvalContext ?? null),
					JSON.stringify(input.resolution.actionPlan),
					JSON.stringify(input.resolution.toolTrace),
				]
			);
			const decisionRow = decisionResult.rows[0];
			if (!decisionRow) {
				await client.query('ROLLBACK');
				return null;
			}
			const outboxAction = await this.enqueueOutboxActionWithClient(
				client,
				input.outbox
			);
			await client.query('COMMIT');
			return {
				decision: mapDecisionRow(decisionRow),
				outboxAction,
			};
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}

	async enqueueOutboxAction(
		input: EnqueueOutboxActionInput
	): Promise<EnqueueOutboxActionResult> {
		return this.enqueueOutboxActionWithClient(this.pool, input);
	}

	private async enqueueOutboxActionWithClient(
		client: Pick<Pool, 'query'> | PoolClient,
		input: EnqueueOutboxActionInput
	): Promise<EnqueueOutboxActionResult> {
		const id = randomUUID();
		const result = await client.query<IdInsertedRow>(ENQUEUE_OUTBOX_SQL, [
			id,
			input.workspaceId,
			input.providerKey,
			input.decisionId,
			input.threadId,
			input.actionType,
			input.idempotencyKey,
			JSON.stringify(input.target),
			JSON.stringify(input.payload),
		]);

		const row = result.rows[0];
		if (!row) {
			throw new Error('Failed to enqueue outbox action');
		}

		return {
			actionId: row.id,
			duplicate: !row.inserted,
		};
	}

	async claimPendingOutboxActions(
		limit: number,
		now: Date = new Date()
	): Promise<ChannelOutboxActionRecord[]> {
		const result = await this.pool.query<{
			id: string;
			workspace_id: string;
			provider_key: string;
			decision_id: string;
			thread_id: string;
			action_type: string;
			idempotency_key: string;
			target: Record<string, unknown>;
			payload: Record<string, unknown>;
			status: ChannelOutboxActionRecord['status'];
			attempt_count: number;
			next_attempt_at: Date;
			provider_message_id: string | null;
			last_error_code: string | null;
			last_error_message: string | null;
			created_at: Date;
			updated_at: Date;
			sent_at: Date | null;
		}>(CLAIM_PENDING_OUTBOX_SQL, [Math.max(1, limit), now]);

		return result.rows.map((row) => ({
			...mapOutboxRow(row),
		}));
	}

	async listOutboxActionsForDecision(
		decisionId: string
	): Promise<ChannelOutboxActionRecord[]> {
		const result = await this.pool.query<OutboxRow>(
			LIST_OUTBOX_ACTIONS_FOR_DECISION_SQL,
			[decisionId]
		);
		return result.rows.map(mapOutboxRow);
	}

	async recordDeliveryAttempt(
		input: RecordDeliveryAttemptInput
	): Promise<ChannelDeliveryAttemptRecord> {
		const result = await this.pool.query<{
			id: number;
			action_id: string;
			attempt: number;
			response_status: number | null;
			response_body: string | null;
			latency_ms: number | null;
			created_at: Date;
		}>(INSERT_DELIVERY_ATTEMPT_SQL, [
			input.actionId,
			input.attempt,
			input.responseStatus ?? null,
			input.responseBody ?? null,
			input.latencyMs ?? null,
		]);

		const row = result.rows[0];
		if (!row) {
			throw new Error('Failed to record delivery attempt');
		}

		return {
			...mapDeliveryAttemptRow(row),
		};
	}

	async listDeliveryAttemptsForAction(
		actionId: string
	): Promise<ChannelDeliveryAttemptRecord[]> {
		const result = await this.pool.query<DeliveryAttemptRow>(
			LIST_DELIVERY_ATTEMPTS_FOR_ACTION_SQL,
			[actionId]
		);
		return result.rows.map(mapDeliveryAttemptRow);
	}

	async markOutboxSent(
		actionId: string,
		providerMessageId?: string
	): Promise<void> {
		await this.pool.query(MARK_OUTBOX_SENT_SQL, [
			actionId,
			providerMessageId ?? null,
		]);
	}

	async markOutboxRetry(input: MarkOutboxRetryInput): Promise<void> {
		await this.pool.query(MARK_OUTBOX_RETRY_SQL, [
			input.actionId,
			input.nextAttemptAt,
			input.lastErrorCode,
			input.lastErrorMessage,
		]);
	}

	async markOutboxDeadLetter(input: MarkOutboxDeadLetterInput): Promise<void> {
		await this.pool.query(MARK_OUTBOX_DEAD_LETTER_SQL, [
			input.actionId,
			input.lastErrorCode,
			input.lastErrorMessage,
		]);
	}

	async appendTraceEvent(
		input: AppendTraceEventInput
	): Promise<ChannelTraceEventRecord> {
		const result = await this.pool.query<TraceEventRow>(
			INSERT_TRACE_EVENT_SQL,
			[
				input.traceId ?? null,
				input.receiptId ?? null,
				input.decisionId ?? null,
				input.actionId ?? null,
				input.workspaceId ?? null,
				input.providerKey ?? null,
				input.stage,
				input.status,
				input.sessionId ?? null,
				input.workflowId ?? null,
				input.latencyMs ?? null,
				input.attempt ?? null,
				JSON.stringify(input.metadata ?? null),
			]
		);
		const row = result.rows[0];
		if (!row) {
			throw new Error('Failed to append trace event');
		}
		return mapTraceEventRow(row);
	}

	async listTraceEvents(
		input: ListTraceEventsInput = {}
	): Promise<ChannelTraceEventRecord[]> {
		const limit = Math.max(1, input.limit ?? 500);
		const result = await this.pool.query<TraceEventRow>(LIST_TRACE_EVENTS_SQL, [
			input.traceId ?? null,
			input.receiptId ?? null,
			input.decisionId ?? null,
			input.actionId ?? null,
			limit,
		]);
		return result.rows.map(mapTraceEventRow);
	}

	async saveSkillInstallation(
		input: SaveSkillInstallationInput
	): Promise<ControlPlaneSkillInstallationRecord> {
		const result = await this.pool.query<SkillInstallationRow>(
			UPSERT_SKILL_INSTALLATION_SQL,
			[
				randomUUID(),
				input.skillKey,
				input.version,
				input.artifactDigest,
				JSON.stringify(input.manifest),
				JSON.stringify(input.verificationReport),
				input.status,
				input.installedBy ?? null,
				input.installedAt,
				input.disabledBy ?? null,
				input.disabledAt ?? null,
			]
		);
		const row = result.rows[0];
		if (!row) {
			throw new Error('Failed to save skill installation');
		}
		return mapSkillInstallationRow(row);
	}

	async getSkillInstallation(
		installationId: string
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		const result = await this.pool.query<SkillInstallationRow>(
			GET_SKILL_INSTALLATION_SQL,
			[installationId]
		);
		const row = result.rows[0];
		return row ? mapSkillInstallationRow(row) : null;
	}

	async findSkillInstallation(
		skillKey: string,
		version: string
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		const result = await this.pool.query<SkillInstallationRow>(
			FIND_SKILL_INSTALLATION_SQL,
			[skillKey, version]
		);
		const row = result.rows[0];
		return row ? mapSkillInstallationRow(row) : null;
	}

	async listSkillInstallations(
		input: ListSkillInstallationsInput = {}
	): Promise<ListSkillInstallationsResult> {
		const limit = Math.max(1, input.limit ?? 100);
		const offset = Math.max(0, input.offset ?? 0);
		const result = await this.pool.query<
			SkillInstallationRow & { total_count: string }
		>(LIST_SKILL_INSTALLATIONS_SQL, [
			input.includeDisabled ?? false,
			input.skillKey ?? null,
			limit,
			offset,
		]);
		if (result.rows[0]) {
			return {
				items: result.rows.map(mapSkillInstallationRow),
				total: Number.parseInt(result.rows[0].total_count, 10),
			};
		}
		const countResult = await this.pool.query<{ total_count: string }>(
			COUNT_SKILL_INSTALLATIONS_SQL,
			[input.includeDisabled ?? false, input.skillKey ?? null]
		);
		return {
			items: [],
			total: Number.parseInt(countResult.rows[0]?.total_count ?? '0', 10),
		};
	}

	async disableSkillInstallation(
		input: DisableSkillInstallationInput
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		const result = await this.pool.query<SkillInstallationRow>(
			DISABLE_SKILL_INSTALLATION_SQL,
			[input.installationId, input.disabledBy ?? null, input.disabledAt]
		);
		const row = result.rows[0];
		return row ? mapSkillInstallationRow(row) : null;
	}
}

interface DecisionRow {
	id: string;
	receipt_id: string;
	thread_id: string;
	policy_mode: ChannelDecisionRecord['policyMode'];
	risk_tier: ChannelDecisionRecord['riskTier'];
	confidence: number;
	model_name: string;
	prompt_version: string;
	policy_version: string;
	tool_trace: ChannelDecisionRecord['toolTrace'];
	action_plan: ChannelDecisionRecord['actionPlan'];
	requires_approval: boolean;
	approval_status: ChannelDecisionRecord['approvalStatus'];
	approval_updated_at: Date | null;
	approval_context: ChannelDecisionRecord['approvalContext'] | null;
	approved_by: string | null;
	approved_at: Date | null;
	rejected_by: string | null;
	rejected_at: Date | null;
	rejection_reason: string | null;
	created_at: Date;
}

interface ReceiptRow {
	id: string;
	workspace_id: string;
	provider_key: string;
	external_event_id: string;
	event_type: string;
	status: ChannelEventReceiptRecord['status'];
	signature_valid: boolean;
	payload_hash: string | null;
	trace_id: string | null;
	first_seen_at: Date;
	last_seen_at: Date;
	processed_at: Date | null;
	error_code: string | null;
	error_message: string | null;
}

interface ThreadRow {
	id: string;
	workspace_id: string;
	provider_key: string;
	external_thread_id: string;
	external_channel_id: string | null;
	external_user_id: string | null;
	state: Record<string, unknown>;
	last_provider_event_ts: Date | null;
	created_at: Date;
	updated_at: Date;
}

interface OutboxRow {
	id: string;
	workspace_id: string;
	provider_key: string;
	decision_id: string;
	thread_id: string;
	action_type: string;
	idempotency_key: string;
	target: Record<string, unknown>;
	payload: Record<string, unknown>;
	status: ChannelOutboxActionRecord['status'];
	attempt_count: number;
	next_attempt_at: Date;
	provider_message_id: string | null;
	last_error_code: string | null;
	last_error_message: string | null;
	created_at: Date;
	updated_at: Date;
	sent_at: Date | null;
}

interface DeliveryAttemptRow {
	id: number;
	action_id: string;
	attempt: number;
	response_status: number | null;
	response_body: string | null;
	latency_ms: number | null;
	created_at: Date;
}

interface TraceEventRow {
	id: number;
	trace_id: string | null;
	receipt_id: string | null;
	decision_id: string | null;
	action_id: string | null;
	workspace_id: string | null;
	provider_key: string | null;
	stage: ChannelTraceEventRecord['stage'];
	status: ChannelTraceEventRecord['status'];
	session_id: string | null;
	workflow_id: string | null;
	latency_ms: number | null;
	attempt: number | null;
	metadata: Record<string, string | number | boolean> | null;
	created_at: Date;
}

interface SkillInstallationRow {
	id: string;
	skill_key: string;
	version: string;
	artifact_digest: string;
	manifest: ControlPlaneSkillInstallationRecord['manifest'];
	verification_report: ControlPlaneSkillInstallationRecord['verificationReport'];
	status: ControlPlaneSkillInstallationRecord['status'];
	installed_by: string | null;
	installed_at: Date;
	disabled_by: string | null;
	disabled_at: Date | null;
}

function mapReceiptRow(row: ReceiptRow): ChannelEventReceiptRecord {
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		providerKey: row.provider_key,
		externalEventId: row.external_event_id,
		eventType: row.event_type,
		status: row.status,
		signatureValid: row.signature_valid,
		payloadHash: row.payload_hash ?? undefined,
		traceId: row.trace_id ?? undefined,
		firstSeenAt: row.first_seen_at,
		lastSeenAt: row.last_seen_at,
		processedAt: row.processed_at ?? undefined,
		errorCode: row.error_code ?? undefined,
		errorMessage: row.error_message ?? undefined,
	};
}

function mapThreadRow(row: ThreadRow): ChannelThreadRecord {
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		providerKey: row.provider_key,
		externalThreadId: row.external_thread_id,
		externalChannelId: row.external_channel_id ?? undefined,
		externalUserId: row.external_user_id ?? undefined,
		state: row.state,
		lastProviderEventAt: row.last_provider_event_ts ?? undefined,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

function mapOutboxRow(row: OutboxRow): ChannelOutboxActionRecord {
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		providerKey: row.provider_key,
		decisionId: row.decision_id,
		threadId: row.thread_id,
		actionType: row.action_type,
		idempotencyKey: row.idempotency_key,
		target: row.target,
		payload: row.payload,
		status: row.status,
		attemptCount: row.attempt_count,
		nextAttemptAt: row.next_attempt_at,
		providerMessageId: row.provider_message_id ?? undefined,
		lastErrorCode: row.last_error_code ?? undefined,
		lastErrorMessage: row.last_error_message ?? undefined,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		sentAt: row.sent_at ?? undefined,
	};
}

function mapDeliveryAttemptRow(
	row: DeliveryAttemptRow
): ChannelDeliveryAttemptRecord {
	return {
		id: row.id,
		actionId: row.action_id,
		attempt: row.attempt,
		responseStatus: row.response_status ?? undefined,
		responseBody: row.response_body ?? undefined,
		latencyMs: row.latency_ms ?? undefined,
		createdAt: row.created_at,
	};
}

function mapTraceEventRow(row: TraceEventRow): ChannelTraceEventRecord {
	return {
		id: row.id,
		stage: row.stage,
		status: row.status,
		workspaceId: row.workspace_id ?? undefined,
		providerKey: row.provider_key ?? undefined,
		receiptId: row.receipt_id ?? undefined,
		decisionId: row.decision_id ?? undefined,
		actionId: row.action_id ?? undefined,
		sessionId: row.session_id ?? undefined,
		workflowId: row.workflow_id ?? undefined,
		traceId: row.trace_id ?? undefined,
		latencyMs: row.latency_ms ?? undefined,
		attempt: row.attempt ?? undefined,
		metadata: row.metadata ?? undefined,
		createdAt: row.created_at,
	};
}

function mapSkillInstallationRow(
	row: SkillInstallationRow
): ControlPlaneSkillInstallationRecord {
	return {
		id: row.id,
		skillKey: row.skill_key,
		version: row.version,
		artifactDigest: row.artifact_digest,
		manifest: row.manifest,
		verificationReport: row.verification_report,
		status: row.status,
		installedAt: row.installed_at,
		installedBy: row.installed_by ?? undefined,
		disabledAt: row.disabled_at ?? undefined,
		disabledBy: row.disabled_by ?? undefined,
	};
}

function mapDecisionRow(row: DecisionRow): ChannelDecisionRecord {
	return {
		id: row.id,
		receiptId: row.receipt_id,
		threadId: row.thread_id,
		policyMode: row.policy_mode,
		riskTier: row.risk_tier,
		confidence: row.confidence,
		modelName: row.model_name,
		promptVersion: row.prompt_version,
		policyVersion: row.policy_version,
		toolTrace: row.tool_trace,
		actionPlan: row.action_plan,
		requiresApproval: row.requires_approval,
		approvalStatus: row.approval_status,
		approvalUpdatedAt: row.approval_updated_at ?? undefined,
		approvalContext: row.approval_context ?? undefined,
		approvedBy: row.approved_by ?? undefined,
		approvedAt: row.approved_at ?? undefined,
		rejectedBy: row.rejected_by ?? undefined,
		rejectedAt: row.rejected_at ?? undefined,
		rejectionReason: row.rejection_reason ?? undefined,
		createdAt: row.created_at,
	};
}
