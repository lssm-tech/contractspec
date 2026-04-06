import { describe, expect, it } from 'bun:test';
import { createInMemoryTeamBackend } from '../../adapters/in-process';
import { InMemoryLaneRuntimeStore } from '../../runtime/in-memory-store';
import { createTeamRun } from './team-run';

describe('team run', () => {
	it('claims leases, records mailbox traffic, and finalizes with evidence', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const team = createTeamRun(store, createInMemoryTeamBackend());
		await team.create({
			id: 'team-1',
			objective: 'Parallel execution',
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
					description: 'Build the runtime',
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
		});
		await team.start('team-1');
		expect(
			(await team.require('team-1')).workers.every(
				(worker) => worker.status === 'running'
			)
		).toBe(true);
		await team.claimNextTask('team-1', 'worker-1', 1);
		await team.renewLease('team-1', 'task-1', 50);
		await team.heartbeat('team-1', 'worker-1', 'Running checks');
		await team.sendMessage('team-1', {
			from: 'leader',
			to: 'worker-1',
			scope: 'leader-worker',
			body: 'Focus on verification.',
		});
		await team.attachTaskEvidence('team-1', 'task-1', 'evidence-1');
		await team.attachRunEvidence('team-1', 'evidence-1');
		await team.completeTask('team-1', 'task-1');
		await team.shutdown(
			'team-1',
			'Workers can stop after evidence is packaged.'
		);
		const snapshot = await team.finalize(
			'team-1',
			'Persistent closer should polish the last mile.'
		);
		expect(snapshot.status).toBe('completed_with_followup_recommended');
		expect(snapshot.cleanupStatus).toBe('completed');
	});

	it('reclaims expired leases and stale workers during rebalance', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const team = createTeamRun(store, createInMemoryTeamBackend(), {
			heartbeatStaleMs: 10,
		});
		await team.create({
			id: 'team-2',
			objective: 'Parallel execution',
			workers: [
				{
					workerId: 'lead-1',
					roleProfile: 'planner',
					concurrencyClass: 'single',
				},
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
					description: 'Build the runtime',
				},
			],
			coordination: {
				mailbox: true,
				taskLeasing: true,
				heartbeats: true,
				rebalancing: true,
			},
			verificationLane: { required: false, ownerRole: 'verifier' },
			shutdownPolicy: {
				requireTerminalTasks: false,
				requireEvidenceGate: false,
			},
		});
		await team.start('team-2');
		await team.claimNextTask('team-2', 'worker-1', 1);
		await team.heartbeat('team-2', 'worker-1', 'Running checks');
		await team.rebalance(
			'team-2',
			'worker lease expired',
			new Date(Date.now() + 5_000)
		);
		const state = await team.require('team-2');
		expect(state.tasks[0]?.status).toBe('ready');
		expect(
			state.workers.find((worker) => worker.workerId === 'worker-1')?.status
		).toBe('offline');
		expect(state.mailbox.length).toBeGreaterThan(0);
	});

	it('requires verification-lane evidence before terminal completion', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const team = createTeamRun(store, createInMemoryTeamBackend());
		await team.create({
			id: 'team-3',
			objective: 'Parallel execution',
			backendKey: 'in-process',
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
					description: 'Build the runtime',
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
		});
		await team.start('team-3');
		await team.claimNextTask('team-3', 'worker-1', 1);
		await team.attachTaskEvidence('team-3', 'task-1', 'task-evidence');
		await team.completeTask('team-3', 'task-1');
		await team.shutdown('team-3');

		await expect(team.finalize('team-3')).rejects.toThrow(
			/missing required evidence/
		);
	});
});
