import type {
	ChannelCompiledPlan,
	ChannelExecutionActor,
	ChannelPolicyDecision,
} from './types';

export const CHANNEL_AUTONOMOUS_REPLY_CAPABILITY =
	'control-plane.channel-runtime.reply.autonomous';
export const CHANNEL_APPROVAL_REQUEST_CAPABILITY =
	'control-plane.approval.request';
export const CHANNEL_APPROVE_CAPABILITY = 'control-plane.execution.approve';
export const CHANNEL_REJECT_CAPABILITY = 'control-plane.execution.reject';
export const CHANNEL_EXPIRE_CAPABILITY = 'control-plane.execution.expire';

export interface ChannelPlanAuthorizationInput {
	actor: ChannelExecutionActor;
	plan: ChannelCompiledPlan;
	decision: ChannelPolicyDecision;
}

export interface ChannelApprovalAuthorizationInput {
	action: 'approve' | 'reject' | 'expire';
	actorId?: string;
	capabilityGrants?: string[];
}

export interface ChannelAuthorizationEvaluator {
	authorizePlan(input: ChannelPlanAuthorizationInput): ChannelPolicyDecision;
	assertApprovalAction(input: ChannelApprovalAuthorizationInput): void;
}

export class ChannelAuthorizationEngine
	implements ChannelAuthorizationEvaluator
{
	authorizePlan(input: ChannelPlanAuthorizationInput): ChannelPolicyDecision {
		if (!input.actor.id.trim()) {
			return blockedDecision(input.decision, ['missing_actor_identity']);
		}

		const grants = new Set(input.actor.capabilityGrants);
		if (input.decision.verdict === 'autonomous') {
			if (grants.has(CHANNEL_AUTONOMOUS_REPLY_CAPABILITY)) {
				return input.decision;
			}

			if (grants.has(CHANNEL_APPROVAL_REQUEST_CAPABILITY)) {
				return {
					...input.decision,
					verdict: 'assist',
					riskTier:
						input.decision.riskTier === 'low'
							? 'medium'
							: input.decision.riskTier,
					requiresApproval: true,
					reasons: [
						...input.decision.reasons,
						'missing_capability_grant.autonomous_reply',
					],
				};
			}

			return blockedDecision(input.decision, [
				'missing_capability_grant.autonomous_reply',
				'missing_capability_grant.approval_request',
			]);
		}

		if (
			input.decision.requiresApproval &&
			!grants.has(CHANNEL_APPROVAL_REQUEST_CAPABILITY)
		) {
			return blockedDecision(input.decision, [
				'missing_capability_grant.approval_request',
			]);
		}

		return input.decision;
	}

	assertApprovalAction(input: ChannelApprovalAuthorizationInput): void {
		const grants = new Set(input.capabilityGrants ?? []);
		if (input.action !== 'expire' && !input.actorId?.trim()) {
			throw new Error(`Missing actor identity for ${input.action} action.`);
		}
		const requiredCapability =
			input.action === 'approve'
				? CHANNEL_APPROVE_CAPABILITY
				: input.action === 'reject'
					? CHANNEL_REJECT_CAPABILITY
					: CHANNEL_EXPIRE_CAPABILITY;

		if (input.action === 'expire' && input.actorId?.startsWith('system:')) {
			return;
		}

		if (!grants.has(requiredCapability)) {
			throw new Error(
				`Missing capability grant ${requiredCapability} for ${input.action} action.`
			);
		}
	}
}

export function resolveCapabilityGrants(
	value: string | undefined,
	defaultCapabilityGrants: string[] = []
): string[] {
	const explicitGrants = value
		?.split(',')
		.map((grant) => grant.trim())
		.filter(Boolean);

	return [...new Set([...(explicitGrants ?? []), ...defaultCapabilityGrants])];
}

function blockedDecision(
	decision: ChannelPolicyDecision,
	reasons: string[]
): ChannelPolicyDecision {
	return {
		...decision,
		verdict: 'blocked',
		riskTier: 'blocked',
		requiresApproval: false,
		reasons: [...decision.reasons, ...reasons],
	};
}
