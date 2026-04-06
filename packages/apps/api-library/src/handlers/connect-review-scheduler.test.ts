import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import {
	getChannelRuntimeResources,
	resetChannelRuntimeResourcesForTests,
} from './channel-runtime-resources';
import { runConnectReviewSweepOnce } from './connect-review-scheduler';

const TEST_ENV_KEYS = [
	'CHANNEL_RUNTIME_STORAGE',
	'CHANNEL_RUNTIME_ASYNC_PROCESSING',
	'CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS',
	'CHANNEL_DISPATCH_TOKEN',
	'CONNECT_REVIEW_SWEEP_ACTOR_ID',
	'CONNECT_REVIEW_SWEEP_LIMIT',
	'CONNECT_REVIEW_SWEEP_NUDGE_MESSAGE',
	'CONNECT_REVIEW_SWEEP_STALE_AFTER_MS',
	'CONTROL_PLANE_API_TOKEN',
	'CONTROL_PLANE_API_CAPABILITY_GRANTS',
] as const;

describe('connect review scheduler', () => {
	beforeEach(() => {
		resetChannelRuntimeResourcesForTests();
		for (const key of TEST_ENV_KEYS) {
			Reflect.deleteProperty(process.env, key);
		}
		process.env.CHANNEL_RUNTIME_STORAGE = 'memory';
		process.env.CHANNEL_RUNTIME_ASYNC_PROCESSING = '0';
		process.env.CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS =
			'control-plane.approval.request';
		process.env.CHANNEL_DISPATCH_TOKEN = 'dispatch-token';
		process.env.CONTROL_PLANE_API_TOKEN = 'control-plane-token';
		process.env.CONTROL_PLANE_API_CAPABILITY_GRANTS =
			'control-plane.audit,control-plane.approval';
		process.env.CONNECT_REVIEW_SWEEP_STALE_AFTER_MS = '0';
	});

	afterEach(() => {
		resetChannelRuntimeResourcesForTests();
		for (const key of TEST_ENV_KEYS) {
			Reflect.deleteProperty(process.env, key);
		}
	});

	it('only requests follow-up for stale non-terminal Connect review runs', async () => {
		const runtime = await getChannelRuntimeResources();
		const pending = await runtime.connectReviewService.ingest(
			createConnectReviewPayload('connect-sweep-1', 'review-sweep-1')
		);
		const completed = await runtime.connectReviewService.ingest(
			createConnectReviewPayload('connect-sweep-2', 'review-sweep-2')
		);
		await runtime.executionLaneStore.updateRun(
			pending.laneRunId!,
			(current) => ({
				...current,
				updatedAt: new Date(Date.now() - 10_000).toISOString(),
			})
		);
		await runtime.executionLaneStore.updateRun(
			completed.laneRunId!,
			(current) => ({
				...current,
				status: 'completed',
				currentPhase: 'completed',
				updatedAt: new Date(Date.now() - 10_000).toISOString(),
			})
		);

		const summary = await runConnectReviewSweepOnce();
		const pendingSnapshot = await runtime.executionLaneService.get(
			pending.laneRunId!
		);
		const completedSnapshot = await runtime.executionLaneService.get(
			completed.laneRunId!
		);

		expect(summary.requestedApproval).toContain(pending.id);
		expect(summary.skipped).toContain(completed.id);
		expect(pendingSnapshot?.approvals).toHaveLength(1);
		expect(completedSnapshot?.approvals).toHaveLength(0);
	});
});

function createConnectReviewPayload(
	sourceDecisionId: string,
	reviewId: string
) {
	return {
		contextPack: {
			acceptanceChecks: ['bun run typecheck'],
			actor: {
				id: 'cli:task-1',
				type: 'human' as const,
				traceId: `${sourceDecisionId}-trace`,
			},
			affectedSurfaces: ['audit', 'runtime'],
			branch: 'main',
			configRefs: [],
			id: `ctx-${reviewId}`,
			impactedContracts: [],
			knowledge: [],
			policyBindings: [],
			repoId: 'workspace-scheduler',
			taskId: `task-${reviewId}`,
		},
		decisionEnvelope: {
			connectDecisionId: sourceDecisionId,
			createdAt: '2026-04-06T10:00:00.000Z',
			taskId: `task-${reviewId}`,
			verdict: 'require_review' as const,
		},
		patchVerdict: {
			controlPlane: {
				approvalStatus: 'pending' as const,
				traceId: `${sourceDecisionId}-trace`,
			},
			decisionId: sourceDecisionId,
			verdict: 'require_review' as const,
		},
		planPacket: {
			actor: { id: 'cli:task-1', type: 'human' as const },
			branch: 'main',
			id: `plan-${reviewId}`,
			objective: 'Follow up Connect review',
			repoId: 'workspace-scheduler',
			requiredApprovals: [],
			riskScore: 0.5,
			steps: [{ id: 'step-1', summary: 'Inspect change', paths: ['src/a.ts'] }],
			taskId: `task-${reviewId}`,
			verificationStatus: 'review' as const,
		},
		queue: 'connect-review',
		reviewPacket: {
			controlPlane: {
				approvalStatus: 'pending' as const,
				traceId: `${sourceDecisionId}-trace`,
			},
			evidence: [],
			id: reviewId,
			objective: 'Follow up Connect review',
			reason: 'Pending review needs operator follow-up.',
			requiredApprovals: [],
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
