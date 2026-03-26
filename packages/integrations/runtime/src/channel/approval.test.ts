import { describe, expect, it } from 'bun:test';

import { ChannelApprovalService } from './approval';
import { InMemoryChannelRuntimeStore } from './memory-store';
import {
	compileChannelPlan,
	finalizeChannelPlan,
	resolveChannelExecutionActor,
} from './planner';
import type { ChannelInboundEvent } from './types';

function makeEvent(text: string): ChannelInboundEvent {
	return {
		workspaceId: 'workspace-1',
		providerKey: 'messaging.slack',
		externalEventId: 'evt-approval',
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
			capabilityGrants: 'control-plane.approval.request',
		},
		message: { text },
	};
}

async function seedPendingDecision(
	store: InMemoryChannelRuntimeStore
): Promise<string> {
	const event = makeEvent('Urgent legal escalation needed.');
	const plan = finalizeChannelPlan({
		plan: compileChannelPlan({
			event,
			receiptId: 'receipt-1',
			threadId: 'thread-record-1',
			actor: resolveChannelExecutionActor(event),
			now: new Date('2026-03-22T10:00:00.000Z'),
		}),
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

	const decision = await store.saveDecision({
		receiptId: 'receipt-1',
		threadId: 'thread-record-1',
		policyMode: 'assist',
		riskTier: 'medium',
		confidence: 0.74,
		modelName: 'policy-heuristics-v1',
		promptVersion: 'channel-runtime.v1',
		policyVersion: 'messaging-policy.v1',
		toolTrace: [],
		actionPlan: plan,
		requiresApproval: true,
		approvalStatus: 'pending',
	});

	return decision.id;
}

describe('ChannelApprovalService', () => {
	it('lists and approves pending decisions generically', async () => {
		const store = new InMemoryChannelRuntimeStore();
		const decisionId = await seedPendingDecision(store);
		const service = new ChannelApprovalService(store, {
			now: () => new Date('2026-03-22T10:01:00.000Z'),
		});

		const pending = await service.listPendingApprovals();
		expect(pending.map((decision) => decision.id)).toEqual([decisionId]);

		const approved = await service.approve({
			decisionId,
			approvedBy: 'operator-1',
			capabilityGrants: ['control-plane.execution.approve'],
		});

		expect(approved.approvalStatus).toBe('approved');
		expect(approved.approvedBy).toBe('operator-1');
		expect(approved.actionPlan.approval.status).toBe('approved');
		expect(approved.actionPlan.steps[2]?.status).toBe('completed');
		expect(store.outbox.size).toBe(1);
	});

	it('rejects pending decisions without dispatching side effects', async () => {
		const store = new InMemoryChannelRuntimeStore();
		const decisionId = await seedPendingDecision(store);
		const service = new ChannelApprovalService(store);

		const rejected = await service.reject({
			decisionId,
			rejectedBy: 'operator-2',
			reason: 'needs escalation',
			capabilityGrants: ['control-plane.execution.reject'],
		});

		expect(rejected.approvalStatus).toBe('rejected');
		expect(rejected.rejectedBy).toBe('operator-2');
		expect(rejected.rejectionReason).toBe('needs escalation');
		expect(store.outbox.size).toBe(0);
	});

	it('expires approvals after timeout with an explicit fallback state', async () => {
		const store = new InMemoryChannelRuntimeStore();
		await seedPendingDecision(store);
		const service = new ChannelApprovalService(store);

		const expired = await service.expirePendingApprovals({
			now: new Date('2026-03-22T10:06:00.000Z'),
			actorId: 'system:timeout',
			capabilityGrants: ['control-plane.execution.expire'],
		});

		expect(expired).toHaveLength(1);
		expect(expired[0]?.approvalStatus).toBe('expired');
		expect(expired[0]?.rejectedBy).toBe('system:timeout');
		expect(expired[0]?.actionPlan.approval.status).toBe('expired');
	});
});
