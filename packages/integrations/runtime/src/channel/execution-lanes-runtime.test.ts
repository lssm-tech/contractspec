import { describe, expect, it } from 'bun:test';
import type { TeamRunState } from '@contractspec/lib.execution-lanes';
import { createExecutionLaneOperatorRuntime } from './execution-lanes-runtime';

describe('createExecutionLaneOperatorRuntime', () => {
	it('keeps the default in-process backend wired', async () => {
		const runtime = await createExecutionLaneOperatorRuntime({
			storageMode: 'memory',
		});

		await runtime.store.createRun(
			createRun('lane-runtime-1', 'team.coordinated')
		);
		await runtime.store.saveTeam(
			createTeamState('lane-runtime-1', 'in-process')
		);

		const snapshot = await runtime.service.shutdown('lane-runtime-1');
		expect(snapshot?.team?.cleanup.status).toBe('completed');
		await runtime.dispose();
	});

	it('resolves injected non-default team backends through the shared runtime', async () => {
		const calls: string[] = [];
		const runtime = await createExecutionLaneOperatorRuntime({
			storageMode: 'memory',
			teamBackends: {
				queue: {
					key: 'queue',
					async startWorker() {},
					async stopWorker(_runId, workerId) {
						calls.push(`stop:${workerId}`);
					},
					async nudgeWorker(_runId, workerId, message) {
						calls.push(`nudge:${workerId}:${message}`);
					},
				},
			},
		});

		await runtime.store.createRun(
			createRun('lane-runtime-2', 'team.coordinated')
		);
		await runtime.store.saveTeam(createTeamState('lane-runtime-2', 'queue'));

		await runtime.service.nudge('lane-runtime-2', {
			workerId: 'worker-1',
			message: 'Check the verification lane.',
		});
		await runtime.service.shutdown('lane-runtime-2');

		expect(calls).toEqual([
			'nudge:worker-1:Check the verification lane.',
			'stop:worker-1',
		]);
		await runtime.dispose();
	});
});

function createRun(
	runId: string,
	lane: 'team.coordinated' | 'complete.persistent'
) {
	return {
		runId,
		lane,
		objective: 'Ship execution lanes.',
		sourceRequest: 'Ship execution lanes.',
		scopeClass: 'large' as const,
		status: 'running' as const,
		currentPhase: 'dispatch',
		ownerRole: 'planner',
		authorityContext: { policyRefs: [], ruleContextRefs: [] },
		verificationPolicyKey: lane,
		blockingRisks: [],
		pendingApprovalRoles: [],
		evidenceBundleIds: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

function createTeamState(runId: string, backendKey: string): TeamRunState {
	return {
		runId,
		spec: {
			id: runId,
			sourcePlanPackId: 'plan-runtime',
			objective: 'Ship execution lanes.',
			backendKey,
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
					title: 'Implement',
					description: 'Implement the runtime.',
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
				requireEvidenceGate: false,
			},
		},
		status: 'running',
		tasks: [
			{
				taskId: 'task-1',
				title: 'Implement',
				description: 'Implement the runtime.',
				dependencies: [],
				status: 'running',
				claimedBy: 'worker-1',
				evidenceBundleIds: [],
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
		evidenceBundleIds: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}
