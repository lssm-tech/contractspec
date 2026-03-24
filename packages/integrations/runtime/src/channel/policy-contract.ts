import { ControlPlaneMessagingPolicy } from '@contractspec/lib.contracts-spec/control-plane';
import {
	PolicyEngine,
	PolicyRegistry,
} from '@contractspec/lib.contracts-spec/policy';
import type {
	ChannelExecutionActor,
	ChannelInboundEvent,
	ChannelPolicyDecision,
	ChannelRiskTier,
} from './types';

const messagingPolicyEngine = new PolicyEngine(
	new PolicyRegistry().register(ControlPlaneMessagingPolicy)
);

export interface MessagingPolicySignals {
	blockedMatches: string[];
	highRiskMatches: string[];
	mediumRiskMatches: string[];
	confidence: number;
	riskTier: ChannelRiskTier;
}

export interface MessagingPolicyContractInput {
	event: ChannelInboundEvent;
	actor?: ChannelExecutionActor;
	autoResolveMinConfidence: number;
	assistMinConfidence: number;
	blockedSignals: string[];
	highRiskSignals: string[];
	mediumRiskSignals: string[];
	safeAckTemplate: string;
}

export interface MessagingPolicyExplanation {
	decision: ChannelPolicyDecision;
	engine: ReturnType<typeof messagingPolicyEngine.decide>;
	signals: MessagingPolicySignals;
	policyRef: {
		key: string;
		version: string;
	};
}

export function explainMessagingPolicy(
	input: MessagingPolicyContractInput
): MessagingPolicyExplanation {
	const signals = assessMessagingPolicySignals(input);
	const engine = messagingPolicyEngine.decide({
		action: 'channel.reply',
		policies: [
			{
				key: ControlPlaneMessagingPolicy.meta.key,
				version: ControlPlaneMessagingPolicy.meta.version,
			},
		],
		resource: { type: 'control-plane.message' },
		subject: {
			roles: input.actor ? [input.actor.type] : ['service'],
			attributes: {
				actorId: input.actor?.id,
			},
		},
		context: {
			blockedSignalDetected: signals.blockedMatches.length > 0,
			highRiskDetected: signals.highRiskMatches.length > 0,
			mediumRiskDetected: signals.mediumRiskMatches.length > 0,
			confidence: signals.confidence,
			riskTier: signals.riskTier,
			autoResolveMinConfidence: input.autoResolveMinConfidence,
			assistMinConfidence: input.assistMinConfidence,
		},
	});
	return {
		decision: toChannelPolicyDecision(input, signals, engine),
		engine,
		signals,
		policyRef: {
			key: ControlPlaneMessagingPolicy.meta.key,
			version: ControlPlaneMessagingPolicy.meta.version,
		},
	};
}

function assessMessagingPolicySignals(
	input: MessagingPolicyContractInput
): MessagingPolicySignals {
	const text = (input.event.message?.text ?? '').toLowerCase();
	const blockedMatches = matchSignals(text, input.blockedSignals);
	const highRiskMatches = matchSignals(text, input.highRiskSignals);
	const mediumRiskMatches = matchSignals(text, input.mediumRiskSignals);
	const confidence = mediumRiskMatches.length > 0 ? 0.74 : 0.92;
	const riskTier =
		blockedMatches.length > 0
			? 'blocked'
			: highRiskMatches.length > 0
				? 'high'
				: mediumRiskMatches.length > 0
					? 'medium'
					: 'low';
	return {
		blockedMatches,
		highRiskMatches,
		mediumRiskMatches,
		confidence,
		riskTier,
	};
}

function matchSignals(text: string, candidates: string[]): string[] {
	return candidates.filter((candidate) => text.includes(candidate));
}

function toChannelPolicyDecision(
	input: MessagingPolicyContractInput,
	signals: MessagingPolicySignals,
	engine: ReturnType<typeof messagingPolicyEngine.decide>
): ChannelPolicyDecision {
	if (engine.effect === 'deny') {
		return {
			confidence: signals.confidence,
			riskTier: 'blocked',
			verdict: 'blocked',
			reasons: [engine.reason ?? 'policy_denied'],
			responseText: input.safeAckTemplate,
			requiresApproval: false,
			policyRef: {
				key: ControlPlaneMessagingPolicy.meta.key,
				version: ControlPlaneMessagingPolicy.meta.version,
			},
		};
	}

	if (engine.escalate === 'human_review') {
		return {
			confidence: signals.confidence,
			riskTier: signals.riskTier === 'low' ? 'medium' : signals.riskTier,
			verdict: 'assist',
			reasons: [engine.reason ?? 'needs_human_review'],
			responseText: input.safeAckTemplate,
			requiresApproval: true,
			policyRef: {
				key: ControlPlaneMessagingPolicy.meta.key,
				version: ControlPlaneMessagingPolicy.meta.version,
			},
		};
	}

	return {
		confidence: signals.confidence,
		riskTier: 'low',
		verdict: 'autonomous',
		reasons: [engine.reason ?? 'low_risk_high_confidence'],
		responseText: defaultResponseText(input.event, input.safeAckTemplate),
		requiresApproval: false,
		policyRef: {
			key: ControlPlaneMessagingPolicy.meta.key,
			version: ControlPlaneMessagingPolicy.meta.version,
		},
	};
}

function defaultResponseText(
	event: ChannelInboundEvent,
	safeAckTemplate: string
): string {
	if (!event.message?.text) {
		return safeAckTemplate;
	}
	return `Acknowledged: ${event.message.text.slice(0, 240)}`;
}
