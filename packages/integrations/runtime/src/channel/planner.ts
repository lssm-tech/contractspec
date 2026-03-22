import { createHash } from 'node:crypto';

import type {
	ChannelCompiledPlan,
	ChannelExecutionActor,
	ChannelInboundEvent,
	ChannelPlanStep,
	ChannelPlanTraceEntry,
	ChannelPolicyDecision,
	ChannelPolicyVerdict,
} from './types';

export interface ResolveChannelExecutionActorOptions {
	capabilityGrants?: string[];
	capabilitySource?: string;
	tenantId?: string;
	sessionId?: string;
	actorId?: string;
	actorType?: ChannelExecutionActor['type'];
}
export interface CompileChannelPlanInput {
	event: ChannelInboundEvent;
	receiptId: string;
	threadId: string;
	actor: ChannelExecutionActor;
	now?: Date;
}

export interface FinalizeChannelPlanInput {
	plan: ChannelCompiledPlan;
	decision: ChannelPolicyDecision;
	approvalTimeoutMs: number;
	now?: Date;
}
export function resolveChannelExecutionActor(
	event: ChannelInboundEvent,
	options: ResolveChannelExecutionActorOptions = {}
): ChannelExecutionActor {
	const rawActorType = options.actorType;
	const type =
		rawActorType === 'service' ||
		rawActorType === 'agent' ||
		rawActorType === 'tool' ||
		rawActorType === 'human'
			? rawActorType
			: 'service';

	return {
		type,
		id: options.actorId ?? `runtime:${event.providerKey}:${event.workspaceId}`,
		tenantId: options.tenantId ?? event.workspaceId,
		sessionId: options.sessionId ?? event.metadata?.['sessionId'],
		capabilitySource: options.capabilitySource,
		capabilityGrants: [...(options.capabilityGrants ?? [])],
	};
}
export function compileChannelPlan(
	input: CompileChannelPlanInput
): ChannelCompiledPlan {
	const traceId =
		input.event.traceId ??
		deterministicId(
			'trace',
			input.event.workspaceId,
			input.event.providerKey,
			input.event.externalEventId
		);
	const planId = deterministicId(
		'plan',
		input.event.workspaceId,
		input.event.providerKey,
		input.event.externalEventId,
		input.receiptId,
		input.threadId
	);
	const intentStepId = deterministicId(planId, 'controlPlane.intent.submit');
	const verifyStepId = deterministicId(planId, 'controlPlane.plan.verify');
	const executionStepId = deterministicId(
		planId,
		'controlPlane.execution.start'
	);
	const compiledAt = (input.now ?? new Date()).toISOString();
	return {
		id: planId,
		workspaceId: input.event.workspaceId,
		providerKey: input.event.providerKey,
		traceId,
		receiptId: input.receiptId,
		threadId: input.threadId,
		compiledAt,
		actor: input.actor,
		audit: {
			actorId: input.actor.id,
			actorType: input.actor.type,
			capabilityGrants: [...input.actor.capabilityGrants],
			tenantId: input.actor.tenantId,
			sessionId: input.actor.sessionId,
			workflowId: input.event.metadata?.['workflowId'],
			capabilitySource: input.actor.capabilitySource,
		},
		intent: {
			eventType: input.event.eventType,
			externalEventId: input.event.externalEventId,
			occurredAt: input.event.occurredAt.toISOString(),
			messageText: input.event.message?.text,
			summary: summarizeIntent(input.event),
			rawPayload: input.event.rawPayload,
			metadata: input.event.metadata,
			thread: {
				externalThreadId: input.event.thread.externalThreadId,
				externalChannelId: input.event.thread.externalChannelId,
				externalUserId: input.event.thread.externalUserId,
			},
		},
		approval: {
			required: false,
			status: 'not_required',
			fallback: 'block_on_timeout',
		},
		steps: [
			{
				id: intentStepId,
				contractKey: 'controlPlane.intent.submit',
				title: 'Interpret inbound intent',
				kind: 'intent.submit',
				dependsOn: [],
				status: 'completed',
				input: {
					eventType: input.event.eventType,
					externalEventId: input.event.externalEventId,
					providerKey: input.event.providerKey,
				},
				output: {
					summary: summarizeIntent(input.event),
				},
			},
			{
				id: verifyStepId,
				contractKey: 'controlPlane.plan.verify',
				title: 'Verify policy and execution eligibility',
				kind: 'plan.verify',
				dependsOn: [intentStepId],
				status: 'planned',
				input: {
					receiptId: input.receiptId,
					threadId: input.threadId,
					traceId,
				},
			},
			{
				id: executionStepId,
				contractKey: 'controlPlane.execution.start',
				title: 'Queue outbound reply action',
				kind: 'execution.start',
				dependsOn: [verifyStepId],
				status: 'planned',
				input: {
					actionType: 'reply',
					workspaceId: input.event.workspaceId,
					providerKey: input.event.providerKey,
					externalThreadId: input.event.thread.externalThreadId,
					externalChannelId: input.event.thread.externalChannelId,
					externalUserId: input.event.thread.externalUserId,
				},
			},
		],
	};
}
export function finalizeChannelPlan(
	input: FinalizeChannelPlanInput
): ChannelCompiledPlan {
	const approvalRequired = input.decision.requiresApproval;
	const timeoutAt = approvalRequired
		? new Date(
				(input.now ?? new Date()).getTime() +
					Math.max(0, input.approvalTimeoutMs)
			).toISOString()
		: undefined;
	const executionStatus = getExecutionStatus(input.decision.verdict);

	return {
		...input.plan,
		approval: {
			required: approvalRequired,
			status: approvalRequired ? 'pending' : 'not_required',
			fallback: 'block_on_timeout',
			timeoutAt,
		},
		policy: {
			verdict: input.decision.verdict,
			riskTier: input.decision.riskTier,
			confidence: input.decision.confidence,
			reasons: [...input.decision.reasons],
			policyRef: input.decision.policyRef,
		},
		steps: input.plan.steps.map((step) => {
			if (step.contractKey === 'controlPlane.plan.verify') {
				return {
					...step,
					status: 'completed',
					output: {
						verdict: input.decision.verdict,
						riskTier: input.decision.riskTier,
						confidence: input.decision.confidence,
						requiresApproval: input.decision.requiresApproval,
					},
				};
			}

			if (step.contractKey === 'controlPlane.execution.start') {
				return {
					...step,
					status: executionStatus,
					output: {
						actionType: 'reply',
						responseText: input.decision.responseText,
						requiresApproval: input.decision.requiresApproval,
						fallback: approvalRequired ? 'block_on_timeout' : 'none',
					},
				};
			}

			return step;
		}),
	};
}
export function buildChannelPlanTrace(
	plan: ChannelCompiledPlan
): ChannelPlanTraceEntry[] {
	return plan.steps.map((step) => ({
		stepId: step.id,
		contractKey: step.contractKey,
		status: step.status,
		metadata: {
			planId: plan.id,
			actorType: plan.actor.type,
			requiresApproval: plan.approval.required,
			...(plan.policy
				? {
						verdict: plan.policy.verdict,
						riskTier: plan.policy.riskTier,
					}
				: {}),
		},
	}));
}
export function getExecutionStep(
	plan: ChannelCompiledPlan
): ChannelPlanStep | undefined {
	return plan.steps.find(
		(step) => step.contractKey === 'controlPlane.execution.start'
	);
}
function summarizeIntent(event: ChannelInboundEvent): string {
	const text = event.message?.text?.trim();
	return text
		? text.slice(0, 240)
		: `Received ${event.eventType} via ${event.providerKey}.`;
}
function deterministicId(...parts: string[]): string {
	return createHash('sha256')
		.update(parts.join(':'))
		.digest('hex')
		.slice(0, 24);
}
function getExecutionStatus(
	verdict: ChannelPolicyVerdict
): ChannelPlanStep['status'] {
	return verdict === 'autonomous' ? 'completed' : 'blocked';
}
