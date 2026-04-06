import { describe, expect, it } from 'bun:test';
import { InMemoryLaneRuntimeStore } from '@contractspec/lib.execution-lanes';
import { ChannelApprovalService } from './approval';
import { InMemoryConnectReviewQueueStore } from './connect-review-memory-store';
import { ConnectReviewBridgeService } from './connect-review-service';
import { ExecutionLaneOperatorService } from './execution-lanes-service';
import { InMemoryChannelRuntimeStore } from './memory-store';

describe('ConnectReviewBridgeService', () => {
	it('ingests review packets idempotently, preserves canon refs, and creates a plan lane', async () => {
		const channelStore = new InMemoryChannelRuntimeStore();
		channelStore.decisions.set('runtime-decision-1', {
			actionPlan: {
				id: 'plan-1',
				actor: { id: 'actor-1', type: 'service' },
				audit: {},
				intent: { externalEventId: 'evt-1' },
				providerKey: 'connect.local',
				traceId: 'trace-1',
				workspaceId: 'workspace-1',
			} as never,
			approvalStatus: 'pending',
			confidence: 0.8,
			createdAt: new Date('2026-04-06T10:00:00.000Z'),
			id: 'runtime-decision-1',
			modelName: 'test',
			policyMode: 'assist',
			policyVersion: '1.0.0',
			promptVersion: '1.0.0',
			receiptId: 'receipt-1',
			requiresApproval: true,
			riskTier: 'high',
			threadId: 'thread-1',
			toolTrace: [],
		});
		const laneStore = new InMemoryLaneRuntimeStore();
		const service = new ConnectReviewBridgeService(
			new InMemoryConnectReviewQueueStore(),
			{
				channelStore,
				laneStore,
			}
		);

		const first = await service.ingest(createReviewPayload());
		const second = await service.ingest({
			...createReviewPayload(),
			queue: 'connect-escalation',
		});
		const snapshot = await laneStore.getSnapshot(first.laneRunId!);

		expect(first.id).toBe('review-1');
		expect(second.id).toBe('review-1');
		expect(second.queue).toBe('connect-escalation');
		expect(first.canonPackRefs).toEqual(['team/platform@1.2.0']);
		expect(first.runtimeDecisionId).toBe('runtime-decision-1');
		expect(first.traceId).toBe('trace-1');
		expect(first.laneRunId).toBe('connect-review-connect-dec-1');
		expect(first.nextLane).toBe('complete.persistent');
		expect(first.status).toBe('pending');
		expect(snapshot?.run.lane).toBe('plan.consensus');
		expect(snapshot?.artifacts).toHaveLength(5);
	});

	it('requests lane approval for stale non-terminal review items and skips terminal ones', async () => {
		const laneStore = new InMemoryLaneRuntimeStore();
		const executionLaneService = new ExecutionLaneOperatorService(laneStore);
		const service = new ConnectReviewBridgeService(
			new InMemoryConnectReviewQueueStore(),
			{
				approvalService: new ChannelApprovalService(
					new InMemoryChannelRuntimeStore()
				),
				executionLaneService,
				laneStore,
			}
		);

		const pending = await service.ingest(createReviewPayload());
		const completed = await service.ingest({
			...createReviewPayload('connect-dec-2', 'review-2'),
		});
		await laneStore.updateRun(pending.laneRunId!, (current) => ({
			...current,
			updatedAt: new Date(Date.now() - 600_000).toISOString(),
		}));
		await laneStore.updateRun(completed.laneRunId!, (current) => ({
			...current,
			status: 'completed',
			currentPhase: 'completed',
			updatedAt: new Date(Date.now() - 600_000).toISOString(),
		}));

		const summary = await service.sweepPendingReviews({
			actorId: 'sweeper',
			nudgeMessage: 'Review still pending.',
			staleAfterMs: 0,
		});
		const snapshot = await executionLaneService.get(pending.laneRunId!);

		expect(summary.requestedApproval).toContain(pending.id);
		expect(summary.skipped).toContain(completed.id);
		expect(snapshot?.approvals).toHaveLength(1);
		expect(snapshot?.approvals[0]?.state).toBe('requested');
	});
});

function createReviewPayload(
	sourceDecisionId = 'connect-dec-1',
	reviewId = 'review-1'
) {
	return {
		contextPack: {
			acceptanceChecks: ['bun run typecheck'],
			actor: { id: 'cli:task-1', type: 'human' as const, traceId: 'trace-1' },
			affectedSurfaces: ['audit', 'runtime'],
			branch: 'main',
			configRefs: [{ kind: 'canon-pack', ref: 'team/platform@1.2.0' }],
			id: 'ctx-1',
			impactedContracts: [],
			knowledge: [
				{
					category: 'canonical' as const,
					source: 'connect.canonPacks',
					spaceKey: 'team/platform@1.2.0',
					trustLevel: 'high' as const,
				},
			],
			policyBindings: [],
			repoId: 'workspace-1',
			taskId: 'task-1',
		},
		decisionEnvelope: {
			connectDecisionId: sourceDecisionId,
			createdAt: '2026-04-06T10:00:00.000Z',
			runtimeLink: {
				approvalStatus: 'pending' as const,
				decisionId: 'runtime-decision-1',
				traceId: 'trace-1',
			},
			taskId: 'task-1',
			verdict: 'require_review' as const,
		},
		patchVerdict: {
			controlPlane: {
				approvalStatus: 'pending' as const,
				decisionId: 'runtime-decision-1',
				traceId: 'trace-1',
			},
			decisionId: sourceDecisionId,
			verdict: 'require_review' as const,
		},
		planPacket: {
			actor: { id: 'cli:task-1', type: 'human' as const },
			branch: 'main',
			id: 'plan-1',
			objective: 'Review Connect change',
			repoId: 'workspace-1',
			requiredApprovals: [
				{ capability: 'control-plane.execution.approve', reason: 'review' },
			],
			riskScore: 0.5,
			steps: [{ id: 'step-1', summary: 'Inspect change', paths: ['src/a.ts'] }],
			taskId: 'task-1',
			verificationStatus: 'review' as const,
		},
		queue: 'connect-review',
		reviewPacket: {
			controlPlane: {
				approvalStatus: 'pending' as const,
				decisionId: 'runtime-decision-1',
				traceId: 'trace-1',
			},
			evidence: [],
			id: reviewId,
			objective: 'Review Connect change',
			reason: 'Protected path requires review.',
			requiredApprovals: [
				{ capability: 'control-plane.execution.approve', reason: 'review' },
			],
			sourceDecisionId,
			studio: {
				enabled: true,
				mode: 'review-bridge' as const,
				queue: 'connect-review',
			},
			summary: {
				affectedSurfaces: ['audit', 'runtime'],
				impactedContracts: [],
				paths: ['src/a.ts'],
				requiredChecks: ['path-boundary'],
			},
		},
	};
}
