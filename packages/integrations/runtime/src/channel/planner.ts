import {
	buildChannelPlanDag,
	createStepIo,
	deterministicId,
	getExecutionStatus,
	resolveEventTraceId,
	summarizeIntent,
} from './plan-utils';
import type {
	CompileChannelPlanInput,
	FinalizeChannelPlanInput,
	ResolveChannelExecutionActorOptions,
} from './planner-types';
import type {
	ChannelCompiledPlan,
	ChannelExecutionActor,
	ChannelExecutionStartStep,
	ChannelInboundEvent,
	ChannelIntentSubmitStep,
	ChannelPlanStep,
	ChannelPlanVerifyStep,
} from './types';

export { buildChannelPlanTrace, getExecutionStep } from './plan-utils';
export type {
	CompileChannelPlanInput,
	FinalizeChannelPlanInput,
	ResolveChannelExecutionActorOptions,
} from './planner-types';

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
	const summary = summarizeIntent(input.event);
	const traceId = resolveEventTraceId(input.event);
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
	const steps: ChannelPlanStep[] = [
		{
			id: intentStepId,
			contractKey: 'controlPlane.intent.submit',
			title: 'Interpret inbound intent',
			kind: 'intent.submit',
			dependsOn: [],
			status: 'completed',
			io: createStepIo(
				'controlPlane.intent.submit',
				'ChannelIntentSubmitStepInput',
				'ChannelIntentSubmitStepOutput'
			),
			input: {
				eventType: input.event.eventType,
				externalEventId: input.event.externalEventId,
				providerKey: input.event.providerKey,
			},
			output: {
				summary,
			},
		} satisfies ChannelIntentSubmitStep,
		{
			id: verifyStepId,
			contractKey: 'controlPlane.plan.verify',
			title: 'Verify policy and execution eligibility',
			kind: 'plan.verify',
			dependsOn: [intentStepId],
			status: 'planned',
			io: createStepIo(
				'controlPlane.plan.verify',
				'ChannelPlanVerifyStepInput',
				'ChannelPlanVerifyStepOutput'
			),
			input: {
				receiptId: input.receiptId,
				threadId: input.threadId,
				traceId,
			},
		} satisfies ChannelPlanVerifyStep,
		{
			id: executionStepId,
			contractKey: 'controlPlane.execution.start',
			title: 'Queue outbound reply action',
			kind: 'execution.start',
			dependsOn: [verifyStepId],
			status: 'planned',
			io: createStepIo(
				'controlPlane.execution.start',
				'ChannelExecutionStartStepInput',
				'ChannelExecutionStartStepOutput'
			),
			input: {
				actionType: 'reply',
				workspaceId: input.event.workspaceId,
				providerKey: input.event.providerKey,
				externalThreadId: input.event.thread.externalThreadId,
				externalChannelId: input.event.thread.externalChannelId,
				externalUserId: input.event.thread.externalUserId,
			},
		} satisfies ChannelExecutionStartStep,
	];
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
			summary,
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
		dag: buildChannelPlanDag(steps),
		steps,
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
	const steps = input.plan.steps.map((step): ChannelPlanStep => {
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
	});

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
		dag: buildChannelPlanDag(steps),
		steps,
	};
}
