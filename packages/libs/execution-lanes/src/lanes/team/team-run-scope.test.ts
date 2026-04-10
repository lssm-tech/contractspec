import { describe, expect, it } from 'bun:test';
import { createInMemoryTeamBackend } from '../../adapters/in-process';
import { RoleProfileRegistry } from '../../registry/role-profile-registry';
import { InMemoryLaneRuntimeStore } from '../../runtime/in-memory-store';
import { createTeamRun } from './team-run';

describe('team run write scopes', () => {
	it('rejects invalid worker write-scope assignments', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const roleRegistry = new RoleProfileRegistry();
		roleRegistry.register({
			key: 'scoped-executor',
			description: 'Writes in an isolated worktree.',
			routingRole: 'executor',
			posture: 'builder',
			allowedTools: ['read', 'analyze', 'execute', 'review'],
			writeScope: 'scoped-worktree',
			laneCompatibility: ['team.coordinated'],
			evidenceObligations: ['completion_record'],
			escalationTriggers: [],
		});
		const team = createTeamRun(store, createInMemoryTeamBackend(), {
			roleRegistry,
		});

		await expect(
			team.create({
				id: 'team-4',
				objective: 'Scoped writes',
				workers: [
					{
						workerId: 'worker-1',
						roleProfile: 'scoped-executor',
						concurrencyClass: 'parallel',
						worktreeMode: 'shared',
					},
				],
				backlog: [
					{
						taskId: 'task-1',
						title: 'Implement',
						description: 'Build the runtime',
						roleHint: 'scoped-executor',
						writePaths: ['src/runtime'],
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
			})
		).rejects.toThrow(/isolated worktree mode/);

		await expect(
			createTeamRun(store, createInMemoryTeamBackend()).create({
				id: 'team-5',
				objective: 'Role mismatch',
				workers: [
					{
						workerId: 'worker-1',
						roleProfile: 'verifier',
						concurrencyClass: 'parallel',
					},
				],
				backlog: [
					{
						taskId: 'task-1',
						title: 'Implement',
						description: 'Build the runtime',
						roleHint: 'verifier',
						writePaths: ['src/runtime'],
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
			})
		).rejects.toThrow(/cannot own write paths/);
	});
});
