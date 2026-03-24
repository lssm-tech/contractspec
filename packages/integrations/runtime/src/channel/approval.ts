import { createHash } from 'node:crypto';
import { applyResolvedApprovalStatus } from './approval-plan';
import {
	ChannelAuthorizationEngine,
	type ChannelAuthorizationEvaluator,
} from './authorization';
import { buildChannelPlanTrace, getExecutionStep } from './planner';
import type { ChannelRuntimeStore, ListPendingApprovalsInput } from './store';
import type { ChannelTelemetryEmitter } from './telemetry';
import { recordChannelTelemetry } from './telemetry-recorder';
import type {
	ChannelApprovalContext,
	ChannelDecisionRecord,
	ChannelExecutionActor,
} from './types';

export interface ChannelApprovalServiceOptions {
	now?: () => Date;
	telemetry?: ChannelTelemetryEmitter;
	authorization?: ChannelAuthorizationEvaluator;
}

export interface ApproveChannelDecisionInput {
	decisionId: string;
	approvedBy: string;
	approvedAt?: Date;
	capabilityGrants?: string[];
	actorType?: ChannelExecutionActor['type'];
	sessionId?: string;
	capabilitySource?: string;
}

export interface RejectChannelDecisionInput {
	decisionId: string;
	rejectedBy: string;
	rejectedAt?: Date;
	reason?: string;
	capabilityGrants?: string[];
	actorType?: ChannelExecutionActor['type'];
	sessionId?: string;
	capabilitySource?: string;
}

export interface ExpirePendingApprovalsInput {
	now?: Date;
	limit?: number;
	actorId?: string;
	capabilityGrants?: string[];
	actorType?: ChannelExecutionActor['type'];
	sessionId?: string;
	capabilitySource?: string;
}

export class ChannelApprovalService {
	private readonly now: () => Date;
	private readonly authorization: ChannelAuthorizationEvaluator;
	private readonly telemetry?: ChannelTelemetryEmitter;

	constructor(
		private readonly store: ChannelRuntimeStore,
		options: ChannelApprovalServiceOptions = {}
	) {
		this.now = options.now ?? (() => new Date());
		this.authorization =
			options.authorization ?? new ChannelAuthorizationEngine();
		this.telemetry = options.telemetry;
	}

	async listPendingApprovals(
		input: ListPendingApprovalsInput = {}
	): Promise<ChannelDecisionRecord[]> {
		return this.store.listPendingApprovals(input);
	}

	async approve(
		input: ApproveChannelDecisionInput
	): Promise<ChannelDecisionRecord> {
		const decision = await this.requirePendingDecision(input.decisionId);
		this.authorization.assertApprovalAction({
			action: 'approve',
			actorId: input.approvedBy,
			capabilityGrants: input.capabilityGrants,
		});
		const actedAt = input.approvedAt ?? this.now();
		if (decision.actionPlan.policy?.verdict === 'blocked') {
			throw new Error(
				`Decision ${decision.id} is blocked and cannot be approved for dispatch.`
			);
		}
		const actionPlan = applyResolvedApprovalStatus(
			decision.actionPlan,
			'approved'
		);
		const toolTrace = buildChannelPlanTrace(actionPlan);
		const approvalContext = toApprovalContext(input);

		const executionStep = getExecutionStep(actionPlan);
		const responseText = executionStep?.output?.responseText;
		if (!executionStep || typeof responseText !== 'string') {
			throw new Error(
				`Decision ${decision.id} is missing executable reply details.`
			);
		}

		const approved = await this.store.approveDecisionAndEnqueueOutbox({
			resolution: {
				decisionId: decision.id,
				approvalStatus: 'approved',
				actorId: input.approvedBy,
				actedAt,
				approvalContext,
				actionPlan,
				toolTrace,
			},
			outbox: {
				workspaceId: actionPlan.workspaceId,
				providerKey: actionPlan.providerKey,
				decisionId: decision.id,
				threadId: decision.threadId,
				actionType: 'reply',
				idempotencyKey: buildApprovalOutboxIdempotencyKey(
					actionPlan.id,
					executionStep.id,
					responseText
				),
				target: {
					externalThreadId: executionStep.input.externalThreadId,
					externalChannelId: executionStep.input.externalChannelId,
					externalUserId: executionStep.input.externalUserId,
				},
				payload: {
					text: responseText,
				},
			},
		});
		if (!approved) {
			throw new Error(`Decision ${decision.id} is no longer pending approval.`);
		}
		const { decision: updated, outboxAction } = approved;
		await recordChannelTelemetry(
			this.store,
			this.telemetry,
			{
				stage: 'outbox',
				status: 'accepted',
				workspaceId: actionPlan.workspaceId,
				providerKey: actionPlan.providerKey,
				receiptId: updated.receiptId,
				actionId: outboxAction.actionId,
				sessionId: actionPlan.audit.sessionId,
				workflowId: actionPlan.audit.workflowId,
				traceId: actionPlan.traceId,
				metadata: {
					actionType: 'reply',
					decisionId: updated.id,
					actorId: input.approvedBy,
				},
			},
			updated.id
		);

		await recordChannelTelemetry(
			this.store,
			this.telemetry,
			{
				stage: 'approval',
				status: 'approved',
				workspaceId: actionPlan.workspaceId,
				providerKey: actionPlan.providerKey,
				receiptId: updated.receiptId,
				sessionId: actionPlan.audit.sessionId,
				workflowId: actionPlan.audit.workflowId,
				traceId: actionPlan.traceId,
				metadata: {
					decisionId: updated.id,
					actorId: input.approvedBy,
					actorType: input.actorType ?? 'human',
					capabilitySource: input.capabilitySource ?? '',
					approvedBy: input.approvedBy,
				},
			},
			updated.id
		);

		return updated;
	}

	async reject(
		input: RejectChannelDecisionInput
	): Promise<ChannelDecisionRecord> {
		const decision = await this.requirePendingDecision(input.decisionId);
		this.authorization.assertApprovalAction({
			action: 'reject',
			actorId: input.rejectedBy,
			capabilityGrants: input.capabilityGrants,
		});
		const actionPlan = applyResolvedApprovalStatus(
			decision.actionPlan,
			'rejected'
		);
		const approvalContext = toApprovalContext(input);
		const updated = await this.store.resolveDecisionApproval({
			decisionId: decision.id,
			approvalStatus: 'rejected',
			actorId: input.rejectedBy,
			actedAt: input.rejectedAt ?? this.now(),
			reason: input.reason,
			approvalContext,
			actionPlan,
			toolTrace: buildChannelPlanTrace(actionPlan),
		});
		if (!updated) {
			throw new Error(`Decision ${decision.id} is no longer pending approval.`);
		}

		await recordChannelTelemetry(
			this.store,
			this.telemetry,
			{
				stage: 'approval',
				status: 'rejected',
				workspaceId: actionPlan.workspaceId,
				providerKey: actionPlan.providerKey,
				receiptId: updated.receiptId,
				sessionId: actionPlan.audit.sessionId,
				workflowId: actionPlan.audit.workflowId,
				traceId: actionPlan.traceId,
				metadata: {
					decisionId: updated.id,
					actorId: input.rejectedBy,
					actorType: input.actorType ?? 'human',
					capabilitySource: input.capabilitySource ?? '',
					rejectedBy: input.rejectedBy,
				},
			},
			updated.id
		);

		return updated;
	}

	async expirePendingApprovals(
		input: ExpirePendingApprovalsInput = {}
	): Promise<ChannelDecisionRecord[]> {
		const now = input.now ?? this.now();
		this.authorization.assertApprovalAction({
			action: 'expire',
			actorId: input.actorId,
			capabilityGrants: input.capabilityGrants,
		});
		const pending = await this.store.listPendingApprovals({
			limit: input.limit,
		});
		const approvalContext = toApprovalContext(input);
		const expired = pending.filter((decision) => {
			const timeoutAt = decision.actionPlan.approval.timeoutAt;
			return (
				typeof timeoutAt === 'string' &&
				new Date(timeoutAt).getTime() <= now.getTime()
			);
		});

		const results: ChannelDecisionRecord[] = [];
		for (const decision of expired) {
			const actionPlan = applyResolvedApprovalStatus(
				decision.actionPlan,
				'expired'
			);
			const updated = await this.store.resolveDecisionApproval({
				decisionId: decision.id,
				approvalStatus: 'expired',
				actorId: input.actorId,
				actedAt: now,
				reason: 'approval_timeout',
				approvalContext,
				actionPlan,
				toolTrace: buildChannelPlanTrace(actionPlan),
			});
			if (updated) {
				await recordChannelTelemetry(
					this.store,
					this.telemetry,
					{
						stage: 'approval',
						status: 'expired',
						workspaceId: actionPlan.workspaceId,
						providerKey: actionPlan.providerKey,
						receiptId: updated.receiptId,
						sessionId: actionPlan.audit.sessionId,
						workflowId: actionPlan.audit.workflowId,
						traceId: actionPlan.traceId,
						metadata: {
							decisionId: updated.id,
							actorId: input.actorId ?? 'system:timeout',
							actorType: input.actorType ?? 'service',
							capabilitySource: input.capabilitySource ?? '',
						},
					},
					updated.id
				);
				results.push(updated);
			}
		}

		return results;
	}

	private async requirePendingDecision(
		decisionId: string
	): Promise<ChannelDecisionRecord> {
		const decision = await this.store.getDecision(decisionId);
		if (!decision) {
			throw new Error(`Decision ${decisionId} was not found.`);
		}
		if (decision.approvalStatus !== 'pending') {
			throw new Error(
				`Decision ${decisionId} is not pending approval (current status: ${decision.approvalStatus}).`
			);
		}
		return decision;
	}
}

function toApprovalContext(
	input:
		| ApproveChannelDecisionInput
		| RejectChannelDecisionInput
		| ExpirePendingApprovalsInput
): ChannelApprovalContext {
	return {
		actorType: input.actorType,
		sessionId: input.sessionId,
		capabilitySource: input.capabilitySource,
		capabilityGrants: input.capabilityGrants,
	};
}

function buildApprovalOutboxIdempotencyKey(
	planId: string,
	stepId: string,
	responseText: string
): string {
	return createHash('sha256')
		.update(`${planId}:${stepId}:reply:${responseText}`)
		.digest('hex');
}
