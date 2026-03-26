import { describe, expect, it } from 'bun:test';

import {
	CHANNEL_APPROVAL_REQUEST_CAPABILITY,
	CHANNEL_APPROVE_CAPABILITY,
	CHANNEL_AUTONOMOUS_REPLY_CAPABILITY,
	ChannelAuthorizationEngine,
	resolveCapabilityGrants,
} from './authorization';
import { compileChannelPlan } from './planner';
import type { ChannelInboundEvent, ChannelPolicyDecision } from './types';

const event: ChannelInboundEvent = {
	workspaceId: 'workspace-1',
	providerKey: 'messaging.slack',
	externalEventId: 'evt-1',
	eventType: 'slack.message',
	occurredAt: new Date('2026-03-22T10:00:00.000Z'),
	signatureValid: true,
	thread: {
		externalThreadId: 'thread-1',
		externalChannelId: 'C123',
		externalUserId: 'U123',
	},
	message: { text: 'Please send the docs link.' },
};

const baseDecision: ChannelPolicyDecision = {
	confidence: 0.92,
	riskTier: 'low',
	verdict: 'autonomous',
	reasons: ['low_risk_high_confidence'],
	responseText: 'Acknowledged: Please send the docs link.',
	requiresApproval: false,
	policyRef: {
		key: 'channel.messaging-policy',
		version: '1.0.0',
	},
};

describe('ChannelAuthorizationEngine', () => {
	it('downgrades autonomous replies to assist when only approval grants exist', () => {
		const engine = new ChannelAuthorizationEngine();
		const decision = engine.authorizePlan({
			actor: {
				type: 'human',
				id: 'U123',
				capabilityGrants: [CHANNEL_APPROVAL_REQUEST_CAPABILITY],
			},
			plan: compileChannelPlan({
				event,
				receiptId: 'receipt-1',
				threadId: 'thread-record-1',
				actor: {
					type: 'human',
					id: 'U123',
					capabilityGrants: [CHANNEL_APPROVAL_REQUEST_CAPABILITY],
					capabilitySource: 'messaging.reply',
				},
			}),
			decision: baseDecision,
		});

		expect(decision.verdict).toBe('assist');
		expect(decision.requiresApproval).toBe(true);
		expect(decision.reasons).toContain(
			'missing_capability_grant.autonomous_reply'
		);
	});

	it('allows explicit approval actions only with matching capability grants', () => {
		const engine = new ChannelAuthorizationEngine();
		expect(() =>
			engine.assertApprovalAction({
				action: 'approve',
				actorId: 'operator-1',
				capabilityGrants: [CHANNEL_APPROVE_CAPABILITY],
			})
		).not.toThrow();
		expect(() =>
			engine.assertApprovalAction({
				action: 'approve',
				actorId: 'operator-1',
				capabilityGrants: [],
			})
		).toThrow('Missing capability grant');
	});

	it('merges explicit and default capability grants deterministically', () => {
		expect(
			resolveCapabilityGrants(CHANNEL_AUTONOMOUS_REPLY_CAPABILITY, [
				CHANNEL_APPROVAL_REQUEST_CAPABILITY,
				CHANNEL_AUTONOMOUS_REPLY_CAPABILITY,
			])
		).toEqual([
			CHANNEL_AUTONOMOUS_REPLY_CAPABILITY,
			CHANNEL_APPROVAL_REQUEST_CAPABILITY,
		]);
	});
});
