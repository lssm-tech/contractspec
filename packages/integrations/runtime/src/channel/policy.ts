import {
	explainMessagingPolicy,
	type MessagingPolicyExplanation,
} from './policy-contract';
import type {
	ChannelCompiledPlan,
	ChannelExecutionActor,
	ChannelInboundEvent,
	ChannelPolicyDecision,
} from './types';

export interface MessagingPolicyConfig {
	autoResolveMinConfidence: number;
	assistMinConfidence: number;
	blockedSignals: string[];
	highRiskSignals: string[];
	mediumRiskSignals: string[];
	safeAckTemplate: string;
	policyRef: {
		key: string;
		version: string;
	};
}

export const DEFAULT_MESSAGING_POLICY_CONFIG: MessagingPolicyConfig = {
	autoResolveMinConfidence: 0.85,
	assistMinConfidence: 0.65,
	blockedSignals: [
		'ignore previous instructions',
		'reveal secret',
		'api key',
		'password',
		'token',
		'drop table',
		'delete repository',
	],
	highRiskSignals: [
		'refund',
		'delete account',
		'cancel subscription',
		'permission',
		'admin access',
		'wire transfer',
		'bank account',
	],
	mediumRiskSignals: [
		'urgent',
		'legal',
		'compliance',
		'frustrated',
		'escalate',
		'outage',
	],
	safeAckTemplate:
		'Thanks for your message. We received it and are preparing the next step.',
	policyRef: {
		key: 'channel.messaging-policy',
		version: '1.0.0',
	},
};

export interface PolicyEvaluationInput {
	event: ChannelInboundEvent;
	receiptId?: string;
	threadId?: string;
	sessionId?: string;
	workflowId?: string;
	threadState?: Record<string, unknown>;
	compiledPlan?: ChannelCompiledPlan;
	actor?: ChannelExecutionActor;
}

export interface MessagingPolicyEvaluator {
	evaluate(input: PolicyEvaluationInput): ChannelPolicyDecision;
	explain?(input: PolicyEvaluationInput): MessagingPolicyExplanation;
}

export class MessagingPolicyEngine implements MessagingPolicyEvaluator {
	private readonly config: MessagingPolicyConfig;

	constructor(config?: Partial<MessagingPolicyConfig>) {
		this.config = {
			...DEFAULT_MESSAGING_POLICY_CONFIG,
			...(config ?? {}),
		};
	}

	evaluate(input: PolicyEvaluationInput): ChannelPolicyDecision {
		return this.explain(input).decision;
	}

	explain(input: PolicyEvaluationInput): MessagingPolicyExplanation {
		return explainMessagingPolicy({
			event: input.event,
			actor: input.actor,
			autoResolveMinConfidence: this.config.autoResolveMinConfidence,
			assistMinConfidence: this.config.assistMinConfidence,
			blockedSignals: this.config.blockedSignals,
			highRiskSignals: this.config.highRiskSignals,
			mediumRiskSignals: this.config.mediumRiskSignals,
			safeAckTemplate: this.config.safeAckTemplate,
		});
	}
}
