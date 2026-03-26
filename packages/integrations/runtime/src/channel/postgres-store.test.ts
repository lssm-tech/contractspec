import { describe, expect, it } from 'bun:test';

import { PostgresChannelRuntimeStore } from './postgres-store';
import type { ChannelCompiledPlan } from './types';

const pendingPlan: ChannelCompiledPlan = {
	id: 'plan-1',
	workspaceId: 'workspace-1',
	providerKey: 'messaging.slack',
	traceId: 'trace-1',
	receiptId: 'receipt-1',
	threadId: 'thread-1',
	compiledAt: '2026-03-22T10:00:00.000Z',
	actor: { type: 'human', id: 'U123', capabilityGrants: [] },
	audit: {
		actorId: 'U123',
		actorType: 'human',
		capabilityGrants: [],
	},
	intent: {
		eventType: 'slack.message',
		externalEventId: 'evt-1',
		occurredAt: '2026-03-22T10:00:00.000Z',
		summary: 'Urgent legal escalation needed.',
		thread: {
			externalThreadId: 'thread-1',
		},
	},
	approval: {
		required: true,
		status: 'pending',
		fallback: 'block_on_timeout',
		timeoutAt: '2026-03-22T10:05:00.000Z',
	},
	dag: {
		rootStepIds: [],
		terminalStepIds: [],
		topologicalOrder: [],
		edges: [],
	},
	steps: [],
};

interface MockQueryResult<T = unknown> {
	rows: T[];
}

class MockPool {
	public readonly calls: { sql: string; params?: unknown[] }[] = [];
	private readonly queue: MockQueryResult[];

	constructor(queue: MockQueryResult[]) {
		this.queue = queue;
	}

	async query<T = unknown>(
		sql: string,
		params?: unknown[]
	): Promise<MockQueryResult<T>> {
		this.calls.push({ sql, params });
		const item = this.queue.shift();
		if (!item) {
			return { rows: [] };
		}
		return item as MockQueryResult<T>;
	}
}

describe('PostgresChannelRuntimeStore', () => {
	it('claims event receipts and reports duplicate state', async () => {
		const pool = new MockPool([
			{ rows: [{ id: 'receipt-1' }] },
			{ rows: [] },
			{ rows: [] },
			{ rows: [{ id: 'receipt-1' }] },
			{ rows: [] },
		]);
		const store = new PostgresChannelRuntimeStore(
			pool as unknown as ConstructorParameters<
				typeof PostgresChannelRuntimeStore
			>[0]
		);

		const first = await store.claimEventReceipt({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			externalEventId: 'evt-1',
			eventType: 'slack.message',
			signatureValid: true,
		});
		expect(first.duplicate).toBe(false);

		const second = await store.claimEventReceipt({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			externalEventId: 'evt-1',
			eventType: 'slack.message',
			signatureValid: true,
		});
		expect(second.duplicate).toBe(true);
	});

	it('deduplicates outbox by idempotency key', async () => {
		const pool = new MockPool([
			{ rows: [{ id: 'outbox-1', inserted: true }] },
			{ rows: [{ id: 'outbox-1', inserted: false }] },
		]);
		const store = new PostgresChannelRuntimeStore(
			pool as unknown as ConstructorParameters<
				typeof PostgresChannelRuntimeStore
			>[0]
		);

		const first = await store.enqueueOutboxAction({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			decisionId: 'decision-1',
			threadId: 'thread-1',
			actionType: 'reply',
			idempotencyKey: 'idem-1',
			target: { externalThreadId: 'thread-1' },
			payload: { text: 'ack' },
		});
		expect(first.duplicate).toBe(false);

		const second = await store.enqueueOutboxAction({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			decisionId: 'decision-1',
			threadId: 'thread-1',
			actionType: 'reply',
			idempotencyKey: 'idem-1',
			target: { externalThreadId: 'thread-1' },
			payload: { text: 'ack' },
		});
		expect(second.duplicate).toBe(true);
	});

	it('lists and resolves pending approvals', async () => {
		const pool = new MockPool([
			{
				rows: [
					{
						id: 'decision-1',
						receipt_id: 'receipt-1',
						thread_id: 'thread-1',
						policy_mode: 'assist',
						risk_tier: 'medium',
						confidence: 0.74,
						model_name: 'policy-heuristics-v1',
						prompt_version: 'channel-runtime.v1',
						policy_version: 'messaging-policy.v1',
						tool_trace: [],
						action_plan: pendingPlan,
						requires_approval: true,
						approval_status: 'pending',
						approval_updated_at: null,
						approval_context: null,
						approved_by: null,
						approved_at: null,
						rejected_by: null,
						rejected_at: null,
						rejection_reason: null,
						created_at: new Date('2026-03-22T10:00:00.000Z'),
					},
				],
			},
			{
				rows: [
					{
						id: 'decision-1',
						receipt_id: 'receipt-1',
						thread_id: 'thread-1',
						policy_mode: 'assist',
						risk_tier: 'medium',
						confidence: 0.74,
						model_name: 'policy-heuristics-v1',
						prompt_version: 'channel-runtime.v1',
						policy_version: 'messaging-policy.v1',
						tool_trace: [],
						action_plan: {
							...pendingPlan,
							approval: { ...pendingPlan.approval, status: 'approved' },
						},
						requires_approval: true,
						approval_status: 'approved',
						approval_updated_at: new Date('2026-03-22T10:01:00.000Z'),
						approval_context: null,
						approved_by: 'operator-1',
						approved_at: new Date('2026-03-22T10:01:00.000Z'),
						rejected_by: null,
						rejected_at: null,
						rejection_reason: null,
						created_at: new Date('2026-03-22T10:00:00.000Z'),
					},
				],
			},
		]);
		const store = new PostgresChannelRuntimeStore(
			pool as unknown as ConstructorParameters<
				typeof PostgresChannelRuntimeStore
			>[0]
		);

		const pending = await store.listPendingApprovals({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			limit: 10,
		});
		expect(pending[0]?.approvalStatus).toBe('pending');

		const resolved = await store.resolveDecisionApproval({
			decisionId: 'decision-1',
			approvalStatus: 'approved',
			actorId: 'operator-1',
			actedAt: new Date('2026-03-22T10:01:00.000Z'),
			actionPlan: {
				...pendingPlan,
				approval: { ...pendingPlan.approval, status: 'approved' },
			},
			toolTrace: [],
		});
		expect(resolved?.approvalStatus).toBe('approved');
		expect(resolved?.approvedBy).toBe('operator-1');
	});

	it('lists decisions with trace selectors', async () => {
		const pool = new MockPool([{ rows: [] }]);
		const store = new PostgresChannelRuntimeStore(
			pool as unknown as ConstructorParameters<
				typeof PostgresChannelRuntimeStore
			>[0]
		);

		await store.listDecisions({
			workspaceId: 'workspace-1',
			providerKey: 'messaging.slack',
			traceId: 'trace-1',
			receiptId: 'receipt-1',
			externalEventId: 'evt-1',
			approvalStatus: 'pending',
			actorId: 'U123',
			sessionId: 'sess-1',
			workflowId: 'wf-1',
			createdAfter: new Date('2026-03-22T09:00:00.000Z'),
			createdBefore: new Date('2026-03-22T11:00:00.000Z'),
			limit: 25,
		});

		expect(pool.calls[0]?.params).toEqual([
			'workspace-1',
			'messaging.slack',
			'trace-1',
			'receipt-1',
			'evt-1',
			'pending',
			'U123',
			'sess-1',
			'wf-1',
			new Date('2026-03-22T09:00:00.000Z'),
			new Date('2026-03-22T11:00:00.000Z'),
			25,
		]);
	});
});
