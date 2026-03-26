import type {
	ChannelCompiledPlan,
	ChannelExecutionActor,
	ChannelInboundEvent,
	ChannelPolicyDecision,
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
