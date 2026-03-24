import { applyResolvedApprovalStatus } from './approval-plan';
import {
	compileChannelPlan,
	finalizeChannelPlan,
	getExecutionStep,
} from './planner';
import type { ChannelRuntimeStore, ListDecisionsInput } from './store';
import type {
	ChannelDecisionRecord,
	ChannelDeliveryAttemptRecord,
	ChannelEventReceiptRecord,
	ChannelInboundEvent,
	ChannelOutboxActionRecord,
	ChannelPolicyDecision,
	ChannelThreadRecord,
	ChannelTraceEventRecord,
} from './types';

export interface ChannelTraceAction {
	action: ChannelOutboxActionRecord;
	attempts: ChannelDeliveryAttemptRecord[];
}

export interface ChannelExecutionTrace {
	receipt: ChannelEventReceiptRecord | null;
	thread: ChannelThreadRecord | null;
	decision: ChannelDecisionRecord;
	actions: ChannelTraceAction[];
	events: ChannelTraceEventRecord[];
	replay: {
		traceId: string;
		planId: string;
		approvalStatus: ChannelDecisionRecord['approvalStatus'];
		toolTrace: ChannelDecisionRecord['toolTrace'];
	};
}

export interface ChannelTraceReplayResult {
	matches: boolean;
	mismatches: string[];
	replayedPlanId: string;
	replayedTraceId: string;
}

export class ChannelTraceService {
	constructor(private readonly store: ChannelRuntimeStore) {}

	async getExecutionTrace(
		decisionId: string
	): Promise<ChannelExecutionTrace | null> {
		const decision = await this.store.getDecision(decisionId);
		if (!decision) {
			return null;
		}
		return buildExecutionTrace(this.store, decision);
	}

	async listExecutionTraces(
		input: ListDecisionsInput = {}
	): Promise<ChannelExecutionTrace[]> {
		const decisions = await this.store.listDecisions(input);
		return Promise.all(
			decisions.map((decision) => buildExecutionTrace(this.store, decision))
		);
	}

	async replayExecutionTrace(
		decisionId: string
	): Promise<ChannelTraceReplayResult | null> {
		const trace = await this.getExecutionTrace(decisionId);
		return trace ? replayExecutionTrace(trace) : null;
	}
}

async function buildExecutionTrace(
	store: ChannelRuntimeStore,
	decision: ChannelDecisionRecord
): Promise<ChannelExecutionTrace> {
	const [receipt, thread, actions, receiptEvents, decisionEvents] =
		await Promise.all([
			store.getReceipt(decision.receiptId),
			store.getThread(decision.threadId),
			store.listOutboxActionsForDecision(decision.id),
			store.listTraceEvents({
				traceId: decision.actionPlan.traceId,
				receiptId: decision.receiptId,
			}),
			store.listTraceEvents({
				traceId: decision.actionPlan.traceId,
				decisionId: decision.id,
			}),
		]);
	const enrichedActions = await Promise.all(
		actions.map(async (action) => ({
			action,
			attempts: await store.listDeliveryAttemptsForAction(action.id),
		}))
	);

	const events = Array.from(
		new Map(
			[...receiptEvents, ...decisionEvents].map((event) => [event.id, event])
		).values()
	).sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());

	return {
		receipt,
		thread,
		decision,
		actions: enrichedActions,
		events,
		replay: {
			traceId: decision.actionPlan.traceId,
			planId: decision.actionPlan.id,
			approvalStatus: decision.approvalStatus,
			toolTrace: decision.toolTrace,
		},
	};
}

export function replayExecutionTrace(
	trace: ChannelExecutionTrace
): ChannelTraceReplayResult {
	const sourcePlan = trace.decision.actionPlan;
	const compiledAt = new Date(sourcePlan.compiledAt);
	const finalizedPlan = finalizeChannelPlan({
		plan: compileChannelPlan({
			event: toReplayEvent(sourcePlan),
			receiptId: sourcePlan.receiptId,
			threadId: sourcePlan.threadId,
			actor: sourcePlan.actor,
			now: compiledAt,
		}),
		decision: toReplayDecision(trace.decision),
		approvalTimeoutMs: getApprovalTimeoutMs(sourcePlan, compiledAt),
		now: compiledAt,
	});
	const replayedPlan =
		trace.decision.approvalStatus === 'approved' ||
		trace.decision.approvalStatus === 'rejected' ||
		trace.decision.approvalStatus === 'expired'
			? applyResolvedApprovalStatus(
					finalizedPlan,
					trace.decision.approvalStatus
				)
			: finalizedPlan;

	const mismatches = [
		compareField('planId', sourcePlan.id, replayedPlan.id),
		compareField('traceId', sourcePlan.traceId, replayedPlan.traceId),
		compareField(
			'actor',
			stableSerialize(sourcePlan.actor),
			stableSerialize(replayedPlan.actor)
		),
		compareField(
			'audit',
			stableSerialize(sourcePlan.audit),
			stableSerialize(replayedPlan.audit)
		),
		compareField(
			'intent',
			stableSerialize(sourcePlan.intent),
			stableSerialize(replayedPlan.intent)
		),
		compareField(
			'approval',
			stableSerialize(sourcePlan.approval),
			stableSerialize(replayedPlan.approval)
		),
		compareField(
			'stepIds',
			sourcePlan.steps.map((step) => step.id).join(','),
			replayedPlan.steps.map((step) => step.id).join(',')
		),
		compareField(
			'steps',
			stableSerialize(sourcePlan.steps),
			stableSerialize(replayedPlan.steps)
		),
		compareField(
			'dag',
			stableSerialize(sourcePlan.dag),
			stableSerialize(replayedPlan.dag)
		),
		compareField(
			'policy',
			stableSerialize(sourcePlan.policy ?? null),
			stableSerialize(replayedPlan.policy ?? null)
		),
	].filter((mismatch): mismatch is string => Boolean(mismatch));

	return {
		matches: mismatches.length === 0,
		mismatches,
		replayedPlanId: replayedPlan.id,
		replayedTraceId: replayedPlan.traceId,
	};
}

function toReplayEvent(
	plan: ChannelExecutionTrace['decision']['actionPlan']
): ChannelInboundEvent {
	return {
		workspaceId: plan.workspaceId,
		providerKey: plan.providerKey,
		externalEventId: plan.intent.externalEventId,
		eventType: plan.intent.eventType,
		occurredAt: new Date(plan.intent.occurredAt),
		signatureValid: true,
		traceId: plan.traceId,
		rawPayload: plan.intent.rawPayload,
		thread: plan.intent.thread,
		metadata: plan.intent.metadata,
		message: plan.intent.messageText
			? { text: plan.intent.messageText }
			: undefined,
	};
}

function toReplayDecision(
	decision: ChannelDecisionRecord
): ChannelPolicyDecision {
	const executionStep = getExecutionStep(decision.actionPlan);
	return {
		confidence: decision.actionPlan.policy?.confidence ?? decision.confidence,
		riskTier: decision.actionPlan.policy?.riskTier ?? decision.riskTier,
		verdict:
			decision.actionPlan.policy?.verdict ??
			(decision.policyMode === 'suggest' ? 'assist' : decision.policyMode),
		reasons: decision.actionPlan.policy?.reasons ?? [],
		responseText: executionStep?.output?.responseText ?? '',
		requiresApproval: decision.requiresApproval,
		policyRef: decision.actionPlan.policy?.policyRef,
	};
}

function getApprovalTimeoutMs(
	plan: ChannelExecutionTrace['decision']['actionPlan'],
	occurredAt: Date
): number {
	if (!plan.approval.timeoutAt) {
		return 0;
	}
	return Math.max(
		0,
		new Date(plan.approval.timeoutAt).getTime() - occurredAt.getTime()
	);
}

function compareField(
	name: string,
	expected: string,
	actual: string
): string | null {
	return expected === actual
		? null
		: `${name} mismatch: expected ${expected}, got ${actual}`;
}

function stableSerialize(value: unknown): string {
	return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((entry) => sortValue(entry));
	}
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>)
				.sort(([left], [right]) => left.localeCompare(right))
				.map(([key, entry]) => [key, sortValue(entry)])
		);
	}
	return value;
}
