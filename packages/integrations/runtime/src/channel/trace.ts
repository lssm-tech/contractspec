import { compileChannelPlan, finalizeChannelPlan } from './planner';
import type { ChannelRuntimeStore, ListDecisionsInput } from './store';
import type {
	ChannelDecisionRecord,
	ChannelDeliveryAttemptRecord,
	ChannelEventReceiptRecord,
	ChannelInboundEvent,
	ChannelOutboxActionRecord,
	ChannelPolicyDecision,
	ChannelThreadRecord,
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
	const [receipt, thread, actions] = await Promise.all([
		store.getReceipt(decision.receiptId),
		store.getThread(decision.threadId),
		store.listOutboxActionsForDecision(decision.id),
	]);
	const enrichedActions = await Promise.all(
		actions.map(async (action) => ({
			action,
			attempts: await store.listDeliveryAttemptsForAction(action.id),
		}))
	);

	return {
		receipt,
		thread,
		decision,
		actions: enrichedActions,
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
	const occurredAt = new Date(sourcePlan.intent.occurredAt);
	const replayedPlan = finalizeChannelPlan({
		plan: compileChannelPlan({
			event: toReplayEvent(sourcePlan),
			receiptId: sourcePlan.receiptId,
			threadId: sourcePlan.threadId,
			actor: sourcePlan.actor,
			now: occurredAt,
		}),
		decision: toReplayDecision(trace.decision),
		approvalTimeoutMs: getApprovalTimeoutMs(sourcePlan, occurredAt),
		now: occurredAt,
	});

	const mismatches = [
		compareField('planId', sourcePlan.id, replayedPlan.id),
		compareField('traceId', sourcePlan.traceId, replayedPlan.traceId),
		compareField(
			'actor',
			JSON.stringify(sourcePlan.actor),
			JSON.stringify(replayedPlan.actor)
		),
		compareField(
			'audit',
			JSON.stringify(sourcePlan.audit),
			JSON.stringify(replayedPlan.audit)
		),
		compareField(
			'intent',
			JSON.stringify(sourcePlan.intent),
			JSON.stringify(replayedPlan.intent)
		),
		compareField(
			'stepIds',
			sourcePlan.steps.map((step) => step.id).join(','),
			replayedPlan.steps.map((step) => step.id).join(',')
		),
		compareField(
			'policy',
			JSON.stringify(sourcePlan.policy ?? null),
			JSON.stringify(replayedPlan.policy ?? null)
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
	const executionStep = decision.actionPlan.steps.find(
		(step) => step.contractKey === 'controlPlane.execution.start'
	);
	return {
		confidence: decision.actionPlan.policy?.confidence ?? decision.confidence,
		riskTier: decision.actionPlan.policy?.riskTier ?? decision.riskTier,
		verdict:
			decision.actionPlan.policy?.verdict ??
			(decision.policyMode === 'suggest' ? 'assist' : decision.policyMode),
		reasons: decision.actionPlan.policy?.reasons ?? [],
		responseText: String(executionStep?.output?.['responseText'] ?? ''),
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
