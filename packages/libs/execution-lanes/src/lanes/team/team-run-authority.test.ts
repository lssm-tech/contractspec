import { describe, expect, it } from 'bun:test';
import { InMemoryLaneRuntimeStore } from '../../runtime/in-memory-store';
import { createTeamRun } from './team-run';

describe('team run authority hooks', () => {
	it('blocks control-plane operations before they corrupt runtime state', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const team = createTeamRun(
			store,
			{
				key: 'controllable',
				async startWorker() {},
				async stopWorker() {},
				async pauseWorker() {},
			},
			{
				hooks: {
					beforeAction(request) {
						if (request.action === 'pause') {
							throw new Error('pause blocked');
						}
					},
				},
			}
		);

		await team.create({
			id: 'team-authority',
			objective: 'Guard pause',
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
					description: 'Ship the change.',
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
		await team.start('team-authority');
		await team.claimNextTask('team-authority', 'worker-1');

		await expect(team.pause('team-authority')).rejects.toThrow('pause blocked');
		expect((await team.require('team-authority')).status).toBe('running');
	});
});
