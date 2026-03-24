import { randomUUID } from 'node:crypto';
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

export class InMemoryChannelRuntimeStore implements ChannelRuntimeStore {
	public readonly receipts = new Map<string, ChannelEventReceiptRecord>();
	public readonly threads = new Map<string, ChannelThreadRecord>();
	public readonly decisions = new Map<string, ChannelDecisionRecord>();
	public readonly outbox = new Map<string, ChannelOutboxActionRecord>();
	public readonly traceEvents = new Map<string, ChannelTraceEventRecord>();
	public readonly skillInstallations = new Map<
		string,
		ControlPlaneSkillInstallationRecord
	>();
	public readonly deliveryAttempts = new Map<
		string,
		ChannelDeliveryAttemptRecord
	>();
	private readonly receiptKeyToId = new Map<string, string>();
	private readonly threadKeyToId = new Map<string, string>();
	private readonly outboxKeyToId = new Map<string, string>();
	private readonly skillKeyToId = new Map<string, string>();
	private deliveryAttemptSequence = 0;
	private traceEventSequence = 0;

	async claimEventReceipt(
		input: ClaimEventReceiptInput
	): Promise<ClaimEventReceiptResult> {
		const key = this.receiptKey(input);
		const existingId = this.receiptKeyToId.get(key);
		if (existingId) {
			const existing = this.receipts.get(existingId);
			if (existing) {
				if (
					(existing.status === 'failed' ||
						(existing.status === 'rejected' &&
							existing.signatureValid === false &&
							input.signatureValid)) &&
					input.signatureValid
				) {
					existing.status = 'accepted';
					existing.signatureValid = input.signatureValid;
					existing.payloadHash = input.payloadHash;
					existing.traceId = input.traceId;
					existing.errorCode = undefined;
					existing.errorMessage = undefined;
					existing.processedAt = undefined;
					existing.lastSeenAt = new Date();
					this.receipts.set(existing.id, existing);
					return {
						receiptId: existingId,
						duplicate: false,
					};
				}
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
			approvalStatus: input.approvalStatus,
			createdAt: new Date(),
		};
		this.decisions.set(id, record);
		return record;
	}

	async getReceipt(
		receiptId: string
	): Promise<ChannelEventReceiptRecord | null> {
		return this.receipts.get(receiptId) ?? null;
	}

	async getThread(threadId: string): Promise<ChannelThreadRecord | null> {
		return this.threads.get(threadId) ?? null;
	}

	async getDecision(decisionId: string): Promise<ChannelDecisionRecord | null> {
		return this.decisions.get(decisionId) ?? null;
	}

	async listDecisions(
		input: ListDecisionsInput = {}
	): Promise<ChannelDecisionRecord[]> {
		const decisions = Array.from(this.decisions.values())
			.filter((decision) =>
				input.workspaceId
					? decision.actionPlan.workspaceId === input.workspaceId
					: true
			)
			.filter((decision) =>
				input.providerKey
					? decision.actionPlan.providerKey === input.providerKey
					: true
			)
			.filter((decision) =>
				input.traceId ? decision.actionPlan.traceId === input.traceId : true
			)
			.filter((decision) =>
				input.receiptId ? decision.receiptId === input.receiptId : true
			)
			.filter((decision) =>
				input.externalEventId
					? decision.actionPlan.intent.externalEventId === input.externalEventId
					: true
			)
			.filter((decision) =>
				input.approvalStatus
					? decision.approvalStatus === input.approvalStatus
					: true
			)
			.filter((decision) =>
				input.actorId ? decision.actionPlan.actor.id === input.actorId : true
			)
			.filter((decision) =>
				input.sessionId
					? decision.actionPlan.audit.sessionId === input.sessionId
					: true
			)
			.filter((decision) =>
				input.workflowId
					? decision.actionPlan.audit.workflowId === input.workflowId
					: true
			)
			.filter((decision) =>
				input.createdAfter
					? decision.createdAt.getTime() >= input.createdAfter.getTime()
					: true
			)
			.filter((decision) =>
				input.createdBefore
					? decision.createdAt.getTime() <= input.createdBefore.getTime()
					: true
			)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

		const limit = Math.max(1, input.limit ?? (decisions.length || 1));
		return decisions.slice(0, limit);
	}

	async listPendingApprovals(
		input: ListPendingApprovalsInput = {}
	): Promise<ChannelDecisionRecord[]> {
		const decisions = Array.from(this.decisions.values())
			.filter((decision) => decision.approvalStatus === 'pending')
			.filter((decision) =>
				input.workspaceId
					? decision.actionPlan.workspaceId === input.workspaceId
					: true
			)
			.filter((decision) =>
				input.providerKey
					? decision.actionPlan.providerKey === input.providerKey
					: true
			)
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

		const limit = Math.max(1, input.limit ?? (decisions.length || 1));
		return decisions.slice(0, limit);
	}

	async resolveDecisionApproval(
		input: ResolveDecisionApprovalInput
	): Promise<ChannelDecisionRecord | null> {
		const record = this.decisions.get(input.decisionId);
		if (!record || record.approvalStatus !== 'pending') {
			return null;
		}

		record.approvalStatus = input.approvalStatus;
		record.approvalUpdatedAt = input.actedAt;
		record.approvalContext = input.approvalContext;
		record.actionPlan = input.actionPlan;
		record.toolTrace = input.toolTrace;
		if (input.approvalStatus === 'approved') {
			record.approvedBy = input.actorId;
			record.approvedAt = input.actedAt;
			record.rejectedBy = undefined;
			record.rejectedAt = undefined;
			record.rejectionReason = undefined;
		} else {
			record.rejectedBy = input.actorId;
			record.rejectedAt = input.actedAt;
			record.rejectionReason = input.reason;
		}

		this.decisions.set(record.id, record);
		return record;
	}

	async approveDecisionAndEnqueueOutbox(
		input: ApproveDecisionAndEnqueueOutboxInput
	): Promise<{
		decision: ChannelDecisionRecord;
		outboxAction: EnqueueOutboxActionResult;
	} | null> {
		const record = this.decisions.get(input.resolution.decisionId);
		if (!record || record.approvalStatus !== 'pending') {
			return null;
		}
		const existingOutboxId = this.outboxKeyToId.get(
			input.outbox.idempotencyKey
		);
		const outboxAction: EnqueueOutboxActionResult = existingOutboxId
			? {
					actionId: existingOutboxId,
					duplicate: true,
				}
			: this.createOutboxAction(input.outbox);

		record.approvalStatus = input.resolution.approvalStatus;
		record.approvalUpdatedAt = input.resolution.actedAt;
		record.approvalContext = input.resolution.approvalContext;
		record.actionPlan = input.resolution.actionPlan;
		record.toolTrace = input.resolution.toolTrace;
		record.approvedBy = input.resolution.actorId;
		record.approvedAt = input.resolution.actedAt;
		record.rejectedBy = undefined;
		record.rejectedAt = undefined;
		record.rejectionReason = undefined;

		this.decisions.set(record.id, record);
		return {
			decision: record,
			outboxAction,
		};
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

		return this.createOutboxAction(input);
	}

	private createOutboxAction(
		input: EnqueueOutboxActionInput
	): EnqueueOutboxActionResult {
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

	async listOutboxActionsForDecision(
		decisionId: string
	): Promise<ChannelOutboxActionRecord[]> {
		return Array.from(this.outbox.values())
			.filter((action) => action.decisionId === decisionId)
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
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

	async listDeliveryAttemptsForAction(
		actionId: string
	): Promise<ChannelDeliveryAttemptRecord[]> {
		return Array.from(this.deliveryAttempts.values())
			.filter((attempt) => attempt.actionId === actionId)
			.sort((a, b) => a.attempt - b.attempt);
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

	async appendTraceEvent(
		input: AppendTraceEventInput
	): Promise<ChannelTraceEventRecord> {
		this.traceEventSequence += 1;
		const record: ChannelTraceEventRecord = {
			id: this.traceEventSequence,
			stage: input.stage,
			status: input.status,
			workspaceId: input.workspaceId,
			providerKey: input.providerKey,
			receiptId: input.receiptId,
			decisionId: input.decisionId,
			actionId: input.actionId,
			sessionId: input.sessionId,
			workflowId: input.workflowId,
			traceId: input.traceId,
			latencyMs: input.latencyMs,
			attempt: input.attempt,
			metadata: input.metadata,
			createdAt: new Date(),
		};
		this.traceEvents.set(String(record.id), record);
		return record;
	}

	async listTraceEvents(
		input: ListTraceEventsInput = {}
	): Promise<ChannelTraceEventRecord[]> {
		const items = Array.from(this.traceEvents.values())
			.filter((event) =>
				input.traceId ? event.traceId === input.traceId : true
			)
			.filter((event) =>
				input.receiptId ? event.receiptId === input.receiptId : true
			)
			.filter((event) =>
				input.decisionId ? event.decisionId === input.decisionId : true
			)
			.filter((event) =>
				input.actionId ? event.actionId === input.actionId : true
			)
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

		const limit = Math.max(1, input.limit ?? (items.length || 1));
		return items.slice(0, limit);
	}

	async saveSkillInstallation(
		input: SaveSkillInstallationInput
	): Promise<ControlPlaneSkillInstallationRecord> {
		const key = `${input.skillKey}@${input.version}`;
		const existingId = this.skillKeyToId.get(key);
		const id = existingId ?? randomUUID();
		const record: ControlPlaneSkillInstallationRecord = {
			id,
			skillKey: input.skillKey,
			version: input.version,
			artifactDigest: input.artifactDigest,
			manifest: input.manifest,
			verificationReport: input.verificationReport,
			status: input.status,
			installedAt: input.installedAt,
			installedBy: input.installedBy,
			disabledAt: input.disabledAt,
			disabledBy: input.disabledBy,
		};
		this.skillInstallations.set(id, record);
		this.skillKeyToId.set(key, id);
		return record;
	}

	async getSkillInstallation(
		installationId: string
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		return this.skillInstallations.get(installationId) ?? null;
	}

	async findSkillInstallation(
		skillKey: string,
		version: string
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		const id = this.skillKeyToId.get(`${skillKey}@${version}`);
		return id ? (this.skillInstallations.get(id) ?? null) : null;
	}

	async listSkillInstallations(
		input: ListSkillInstallationsInput = {}
	): Promise<ListSkillInstallationsResult> {
		const filtered = Array.from(this.skillInstallations.values())
			.filter((record) =>
				input.includeDisabled ? true : record.status !== 'disabled'
			)
			.filter((record) =>
				input.skillKey ? record.skillKey === input.skillKey : true
			)
			.sort((a, b) => b.installedAt.getTime() - a.installedAt.getTime());
		const offset = Math.max(0, input.offset ?? 0);
		const limit = Math.max(1, input.limit ?? (filtered.length || 1));
		return {
			items: filtered.slice(offset, offset + limit),
			total: filtered.length,
		};
	}

	async disableSkillInstallation(
		input: DisableSkillInstallationInput
	): Promise<ControlPlaneSkillInstallationRecord | null> {
		const record = this.skillInstallations.get(input.installationId);
		if (!record || record.status !== 'installed') {
			return null;
		}
		record.status = 'disabled';
		record.disabledAt = input.disabledAt;
		record.disabledBy = input.disabledBy;
		this.skillInstallations.set(record.id, record);
		return record;
	}

	private receiptKey(input: ClaimEventReceiptInput): string {
		return `${input.workspaceId}:${input.providerKey}:${input.externalEventId}`;
	}

	private threadKey(input: UpsertThreadInput): string {
		return `${input.workspaceId}:${input.providerKey}:${input.externalThreadId}`;
	}
}
