import { describe, expect, it } from 'bun:test';
import type {
	LaneRuntimeSnapshot,
	TeamStatusView,
} from '@contractspec/lib.execution-lanes';
import { renderToStaticMarkup } from 'react-dom/server';
import { TeamTaskTable } from './TeamTaskTable';
import { TeamWorkerBoard } from './TeamWorkerBoard';

describe('team execution lane views', () => {
	it('renders worker freshness and lease visibility', () => {
		const snapshot: LaneRuntimeSnapshot = {
			run: {
				runId: 'team-run',
				lane: 'team.coordinated',
				objective: 'Ship the team lane',
				sourceRequest: 'ship the team lane',
				scopeClass: 'large',
				status: 'running',
				currentPhase: 'dispatch',
				ownerRole: 'planner',
				authorityContext: {
					policyRefs: ['policy'],
					ruleContextRefs: ['rules'],
				},
				verificationPolicyKey: 'team',
				blockingRisks: ['verification backlog'],
				pendingApprovalRoles: [],
				evidenceBundleIds: ['evidence-1'],
				createdAt: '2026-04-06T12:00:00.000Z',
				updatedAt: '2026-04-06T12:05:00.000Z',
			},
			events: [],
			transitions: [],
			artifacts: [],
			evidence: [],
			approvals: [],
			team: {
				runId: 'team-run',
				spec: {
					id: 'team-run',
					objective: 'Ship the team lane',
					backendKey: 'tmux',
					workers: [
						{
							workerId: 'worker-1',
							roleProfile: 'executor',
							concurrencyClass: 'parallel',
						},
					],
					backlog: [
						{
							taskId: 'task-1',
							title: 'Implement runtime',
							description: 'Ship the runtime layer.',
						},
					],
					coordination: {
						mailbox: true,
						taskLeasing: true,
						heartbeats: true,
						rebalancing: true,
					},
					verificationLane: { required: true, ownerRole: 'verifier' },
					shutdownPolicy: {
						requireTerminalTasks: true,
						requireEvidenceGate: true,
					},
				},
				status: 'running',
				tasks: [
					{
						taskId: 'task-1',
						title: 'Implement runtime',
						description: 'Ship the runtime layer.',
						roleHint: 'executor',
						dependencies: [],
						status: 'running',
						claimedBy: 'worker-1',
						evidenceBundleIds: ['evidence-1'],
						retryHistory: ['lease expired'],
						lease: {
							workerId: 'worker-1',
							leasedAt: '2026-04-06T12:01:00.000Z',
							expiresAt: '2026-04-06T12:06:00.000Z',
							renewCount: 2,
						},
					},
				],
				workers: [
					{
						workerId: 'worker-1',
						roleProfile: 'executor',
						status: 'running',
						currentTaskId: 'task-1',
						lastHeartbeatAt: '2026-04-06T12:04:30.000Z',
						progressSummary: 'Running the verification queue.',
					},
				],
				mailbox: [],
				heartbeatLog: [],
				cleanup: {
					status: 'in_progress',
					requestedAt: '2026-04-06T12:05:00.000Z',
					failures: [],
				},
				evidenceBundleIds: ['evidence-1'],
				createdAt: '2026-04-06T12:00:00.000Z',
				updatedAt: '2026-04-06T12:05:00.000Z',
			},
		};
		const team: TeamStatusView = {
			runId: 'team-run',
			status: 'running',
			totalTasks: 1,
			completedTasks: 0,
			activeWorkers: 1,
			staleWorkers: 1,
			staleLeaseCount: 1,
			staleWorkerIds: ['worker-1'],
			pendingEvidence: 0,
			queueSkew: 0,
			verificationReady: true,
			cleanupStatus: 'in_progress',
			updatedAt: '2026-04-06T12:05:00.000Z',
		};

		const workerBoard = renderToStaticMarkup(
			<TeamWorkerBoard
				team={team}
				snapshot={snapshot}
				onNudgeWorker={() => {}}
			/>
		);
		const taskTable = renderToStaticMarkup(
			<TeamTaskTable snapshot={snapshot} />
		);

		expect(workerBoard).toContain('worker-1');
		expect(workerBoard).toContain('stale');
		expect(workerBoard).toContain('Running the verification queue.');
		expect(workerBoard).toContain('Nudge');
		expect(taskTable).toContain('2026-04-06T12:06:00.000Z');
		expect(taskTable).toContain('executor');
	});
});
