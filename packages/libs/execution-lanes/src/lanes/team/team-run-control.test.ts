import { describe, expect, it } from 'bun:test';
import { InMemoryLaneRuntimeStore } from '../../runtime/in-memory-store';
import { createTeamRun } from './team-run';

describe('team run control plane', () => {
	it('pauses and resumes active workers without dropping leases', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const team = createTeamRun(store, {
			key: 'controllable',
			async startWorker() {},
			async stopWorker() {},
			async pauseWorker() {},
			async resumeWorker() {},
		});
		await team.create({
			id: 'team-pause',
			objective: 'Pause and resume',
			backendKey: 'controllable',
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
					description: 'Ship the feature',
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
		await team.start('team-pause');
		await team.claimNextTask('team-pause', 'worker-1', 60_000);

		const paused = await team.pause('team-pause');
		expect(paused.status).toBe('paused');
		expect(paused.tasks[0]?.lease).toBeDefined();
		expect(paused.workers[0]?.status).toBe('paused');

		const resumed = await team.resume('team-pause');
		expect(resumed.status).toBe('running');
		expect(resumed.workers[0]?.status).toBe('running');
	});

	it('records a worker nudge in the mailbox and calls the backend when available', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const nudges: string[] = [];
		const team = createTeamRun(store, {
			key: 'nudger',
			async startWorker() {},
			async stopWorker() {},
			async nudgeWorker(runId, workerId, message) {
				nudges.push(`${runId}:${workerId}:${message}`);
			},
		});
		await team.create({
			id: 'team-nudge',
			objective: 'Nudge a worker',
			backendKey: 'nudger',
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
					description: 'Ship the feature',
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

		const message = await team.nudge(
			'team-nudge',
			'worker-1',
			'Check your mailbox and continue.'
		);
		const state = await team.require('team-nudge');

		expect(message.from).toBe('system');
		expect(message.to).toBe('worker-1');
		expect(state.mailbox.at(-1)?.body).toBe('Check your mailbox and continue.');
		expect(nudges).toEqual([
			'team-nudge:worker-1:Check your mailbox and continue.',
		]);
	});

	it('throws explicit errors when the backend cannot pause, resume, or nudge', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const pausable = createTeamRun(store, {
			key: 'pause-only',
			async startWorker() {},
			async stopWorker() {},
			async pauseWorker() {},
		});
		await pausable.create({
			id: 'team-unsupported',
			objective: 'Unsupported controls',
			backendKey: 'pause-only',
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
					description: 'Ship the feature',
				},
			],
			coordination: {
				mailbox: false,
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
		await pausable.start('team-unsupported');
		await pausable.claimNextTask('team-unsupported', 'worker-1');
		await pausable.pause('team-unsupported');

		await expect(pausable.resume('team-unsupported')).rejects.toThrow(
			/does not support resuming workers/
		);
		await expect(
			pausable.nudge('team-unsupported', 'worker-1', 'Wake up')
		).rejects.toThrow(/does not support nudging workers/);

		const unpausable = createTeamRun(new InMemoryLaneRuntimeStore(), {
			key: 'unpausable',
			async startWorker() {},
			async stopWorker() {},
		});
		await unpausable.create({
			id: 'team-unpausable',
			objective: 'Pause failure',
			backendKey: 'unpausable',
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
					description: 'Ship the feature',
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
		await unpausable.start('team-unpausable');
		await unpausable.claimNextTask('team-unpausable', 'worker-1');

		await expect(unpausable.pause('team-unpausable')).rejects.toThrow(
			/does not support pausing workers/
		);
	});
});
