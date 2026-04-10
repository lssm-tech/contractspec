import { describe, expect, it } from 'bun:test';
import type { TeamRunState } from '@contractspec/lib.execution-lanes';
import { InMemoryExecutionLaneRuntimeStore } from './execution-lanes-memory-store';
import { ExecutionLaneOperatorService } from './execution-lanes-service';

describe('ExecutionLaneOperatorService', () => {
	it('persists operator actions and delegates team controls to registered backends', async () => {
		const store = new InMemoryExecutionLaneRuntimeStore();
		await store.createRun({
			runId: 'lane-1',
			lane: 'team.coordinated',
			objective: 'Ship the execution console.',
			sourceRequest: 'build it',
			scopeClass: 'large',
			status: 'running',
			currentPhase: 'dispatch',
			ownerRole: 'planner',
			authorityContext: { policyRefs: [], ruleContextRefs: [] },
			verificationPolicyKey: 'team',
			blockingRisks: [],
			pendingApprovalRoles: ['verifier'],
			evidenceBundleIds: ['evidence-1'],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		await store.saveEvidence({
			id: 'evidence-1',
			runId: 'lane-1',
			artifactIds: [],
			classes: ['verification_results'],
			createdAt: new Date().toISOString(),
			replayBundleUri: 'replay://lane-1',
		});
		await store.saveTeam(createTeamState('lane-1'));

		const calls: string[] = [];
		const service = new ExecutionLaneOperatorService(store, {
			teamBackends: {
				tmux: {
					key: 'tmux',
					async startWorker() {},
					async stopWorker(_runId, workerId) {
						calls.push(`stop:${workerId}`);
					},
					async pauseWorker(_runId, workerId) {
						calls.push(`pause:${workerId}`);
					},
					async resumeWorker(_runId, workerId) {
						calls.push(`resume:${workerId}`);
					},
					async nudgeWorker(_runId, workerId, message) {
						calls.push(`nudge:${workerId}:${message}`);
					},
				},
			},
		});

		expect((await service.list())[0]?.runId).toBe('lane-1');
		expect((await service.pause('lane-1'))?.run.status).toBe('paused');
		expect((await service.resume('lane-1'))?.run.status).toBe('running');
		expect(
			(await service.requestApproval('lane-1', { role: 'architect' })).state
		).toBe('requested');
		expect(
			(
				await service.nudge('lane-1', {
					workerId: 'worker-1',
					message: 'Focus on verification.',
				})
			)?.team?.mailbox.length
		).toBe(1);
		expect((await service.openReplay('lane-1')).primaryReplayBundleUri).toBe(
			'replay://lane-1'
		);
		expect((await service.shutdown('lane-1'))?.team?.cleanup.status).toBe(
			'completed'
		);
		expect(calls).toEqual([
			'pause:worker-1',
			'resume:worker-1',
			'nudge:worker-1:Focus on verification.',
			'stop:worker-1',
		]);

		const snapshot = await service.get('lane-1');
		expect(
			snapshot?.artifacts.filter(
				(artifact) => artifact.artifactType === 'operator_action'
			).length
		).toBe(5);
		expect(snapshot?.events.map((event) => event.type)).toEqual([
			'execution.pause',
			'execution.resume',
			'execution.request_approval',
			'execution.nudge',
			'execution.shutdown',
		]);
		expect((await service.exportEvidence('lane-1')).replayBundleUris).toEqual([
			'replay://lane-1',
		]);
	});

	it('rejects denied operator actions via authority hooks', async () => {
		const store = new InMemoryExecutionLaneRuntimeStore();
		await store.createRun({
			runId: 'lane-2',
			lane: 'complete.persistent',
			objective: 'Close the task.',
			sourceRequest: 'close it',
			scopeClass: 'medium',
			status: 'running',
			currentPhase: 'awaiting_signoff',
			ownerRole: 'executor',
			authorityContext: { policyRefs: [], ruleContextRefs: [] },
			verificationPolicyKey: 'complete',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		const service = new ExecutionLaneOperatorService(store, {
			hooks: {
				beforeAction(request) {
					if (request.action === 'abort') {
						throw new Error('policy denied');
					}
				},
			},
		});

		await expect(service.abort('lane-2')).rejects.toThrow(/policy denied/);
		expect((await service.get('lane-2'))?.run.status).toBe('running');
		expect((await service.get('lane-2'))?.artifacts).toHaveLength(0);
	});
});

function createTeamState(runId: string): TeamRunState {
	return {
		runId,
		spec: {
			id: runId,
			objective: 'Ship the execution console.',
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
					title: 'Build runtime',
					description: 'Implement runtime behavior.',
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
				requireTerminalTasks: false,
				requireEvidenceGate: true,
			},
		},
		status: 'running',
		tasks: [
			{
				taskId: 'task-1',
				title: 'Build runtime',
				description: 'Implement runtime behavior.',
				dependencies: [],
				status: 'running',
				claimedBy: 'worker-1',
				evidenceBundleIds: ['evidence-1'],
				retryHistory: [],
			},
		],
		workers: [
			{
				workerId: 'worker-1',
				roleProfile: 'executor',
				status: 'running',
				currentTaskId: 'task-1',
				lastHeartbeatAt: new Date().toISOString(),
			},
		],
		mailbox: [],
		heartbeatLog: [],
		cleanup: {
			status: 'not_requested',
			failures: [],
		},
		evidenceBundleIds: ['evidence-1'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}
