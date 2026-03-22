import { describe, expect, it } from 'bun:test';

import {
	buildChannelPlanTrace,
	compileChannelPlan,
	finalizeChannelPlan,
	resolveChannelExecutionActor,
} from './planner';
import type { ChannelInboundEvent } from './types';

function makeEvent(text: string): ChannelInboundEvent {
	return {
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
		metadata: {
			sessionId: 'sess-1',
			workflowId: 'wf-1',
			tenantId: 'tenant-1',
			capabilitySource: 'messaging.reply',
			capabilityGrants:
				'control-plane.channel-runtime.reply.autonomous,control-plane.approval.request',
		},
		message: { text },
	};
}

describe('channel planner', () => {
	it('compiles deterministic plan ids and step ids', () => {
		const event = makeEvent('Please send the docs link.');
		const actor = resolveChannelExecutionActor(event, {
			actorType: 'human',
			actorId: 'U123',
			capabilityGrants: [
				'control-plane.channel-runtime.reply.autonomous',
				'control-plane.approval.request',
			],
			capabilitySource: 'messaging.reply',
			tenantId: 'tenant-1',
		});
		const first = compileChannelPlan({
			event,
			receiptId: 'receipt-1',
			threadId: 'thread-record-1',
			actor,
			now: new Date('2026-03-22T10:00:00.000Z'),
		});
		const second = compileChannelPlan({
			event,
			receiptId: 'receipt-1',
			threadId: 'thread-record-1',
			actor,
			now: new Date('2026-03-22T10:00:00.000Z'),
		});

		expect(first.id).toBe(second.id);
		expect(first.traceId).toBe(second.traceId);
		expect(first.steps.map((step) => step.id)).toEqual(
			second.steps.map((step) => step.id)
		);
		expect(first.actor).toMatchObject({
			type: 'human',
			id: 'U123',
			tenantId: 'tenant-1',
			capabilitySource: 'messaging.reply',
			capabilityGrants: [
				'control-plane.channel-runtime.reply.autonomous',
				'control-plane.approval.request',
			],
		});
	});

	it('marks approval-required executions as blocked pending timeout fallback', () => {
		const event = makeEvent('Urgent legal escalation needed.');
		const actor = resolveChannelExecutionActor(event, {
			actorType: 'human',
			actorId: 'U123',
			capabilityGrants: ['control-plane.approval.request'],
			capabilitySource: 'messaging.reply',
		});
		const compiledPlan = compileChannelPlan({
			event,
			receiptId: 'receipt-2',
			threadId: 'thread-record-2',
			actor,
			now: new Date('2026-03-22T10:00:00.000Z'),
		});
		const finalizedPlan = finalizeChannelPlan({
			plan: compiledPlan,
			decision: {
				confidence: 0.74,
				riskTier: 'medium',
				verdict: 'assist',
				reasons: ['needs_human_review'],
				responseText:
					'Thanks for your message. We received it and are preparing the next step.',
				requiresApproval: true,
				policyRef: {
					key: 'channel.messaging-policy',
					version: '1.0.0',
				},
			},
			approvalTimeoutMs: 5 * 60 * 1000,
			now: new Date('2026-03-22T10:00:00.000Z'),
		});

		expect(finalizedPlan.approval).toMatchObject({
			required: true,
			status: 'pending',
			fallback: 'block_on_timeout',
			timeoutAt: '2026-03-22T10:05:00.000Z',
		});
		expect(finalizedPlan.steps[2]).toMatchObject({
			contractKey: 'controlPlane.execution.start',
			status: 'blocked',
		});
		expect(buildChannelPlanTrace(finalizedPlan)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					contractKey: 'controlPlane.plan.verify',
					status: 'completed',
				}),
				expect.objectContaining({
					contractKey: 'controlPlane.execution.start',
					status: 'blocked',
				}),
			])
		);
	});
});
