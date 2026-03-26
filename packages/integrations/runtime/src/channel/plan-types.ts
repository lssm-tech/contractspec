import type {
	ChannelActorType,
	ChannelApprovalStatus,
	ChannelExecutionActor,
	ChannelPolicyVerdict,
	ChannelProviderKey,
	ChannelRiskTier,
} from './base-types';

export type ChannelPlanStepKind =
	| 'intent.submit'
	| 'plan.verify'
	| 'execution.start';

export type ChannelPlanStepStatus = 'planned' | 'completed' | 'blocked';

export interface ChannelPlanStepContractRef {
	key: string;
	version: string;
}

export interface ChannelPlanStepSchemaRef {
	name: string;
}

export interface ChannelPlanStepIo {
	contract: ChannelPlanStepContractRef;
	inputSchema: ChannelPlanStepSchemaRef;
	outputSchema?: ChannelPlanStepSchemaRef;
}

export interface ChannelPlanDagEdge {
	from: string;
	to: string;
}

export interface ChannelPlanDag {
	rootStepIds: string[];
	terminalStepIds: string[];
	topologicalOrder: string[];
	edges: ChannelPlanDagEdge[];
}

export interface ChannelIntentSubmitStepInput {
	eventType: string;
	externalEventId: string;
	providerKey: ChannelProviderKey;
}

export interface ChannelIntentSubmitStepOutput {
	summary: string;
}

export interface ChannelPlanVerifyStepInput {
	receiptId: string;
	threadId: string;
	traceId: string;
}

export interface ChannelPlanVerifyStepOutput {
	verdict: ChannelPolicyVerdict;
	riskTier: ChannelRiskTier;
	confidence: number;
	requiresApproval: boolean;
}

export interface ChannelExecutionStartStepInput {
	actionType: 'reply';
	workspaceId: string;
	providerKey: ChannelProviderKey;
	externalThreadId: string;
	externalChannelId?: string;
	externalUserId?: string;
}

export interface ChannelExecutionStartStepOutput {
	actionType: 'reply';
	responseText: string;
	requiresApproval: boolean;
	fallback: 'block_on_timeout' | 'none';
}

export interface ChannelPlanStepBase<
	TContractKey extends string,
	TKind extends ChannelPlanStepKind,
	TInput extends object,
	TOutput extends object | undefined,
> {
	id: string;
	contractKey: TContractKey;
	title: string;
	kind: TKind;
	dependsOn: string[];
	status: ChannelPlanStepStatus;
	io: ChannelPlanStepIo;
	input: TInput;
	output?: TOutput;
}

export type ChannelIntentSubmitStep = ChannelPlanStepBase<
	'controlPlane.intent.submit',
	'intent.submit',
	ChannelIntentSubmitStepInput,
	ChannelIntentSubmitStepOutput
>;

export type ChannelPlanVerifyStep = ChannelPlanStepBase<
	'controlPlane.plan.verify',
	'plan.verify',
	ChannelPlanVerifyStepInput,
	ChannelPlanVerifyStepOutput
>;

export type ChannelExecutionStartStep = ChannelPlanStepBase<
	'controlPlane.execution.start',
	'execution.start',
	ChannelExecutionStartStepInput,
	ChannelExecutionStartStepOutput
>;

export type ChannelPlanStep =
	| ChannelIntentSubmitStep
	| ChannelPlanVerifyStep
	| ChannelExecutionStartStep;

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
	dag: ChannelPlanDag;
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
