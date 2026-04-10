import { describe, expect, it } from 'bun:test';
import { createInProcessCompletionBackend } from '../adapters/in-process';
import { createCompletionLoop } from '../lanes/complete/completion-loop';
import { createTeamRun } from '../lanes/team/team-run';
import { InMemoryLaneRuntimeStore } from './in-memory-store';
import {
	createLanePersistenceFiles,
	hydrateLaneRuntimeStore,
} from './persistence-files';

describe('lane persistence files', () => {
	it('round-trips a plain lane snapshot through exact persistence filenames', async () => {
		const store = new InMemoryLaneRuntimeStore();
		await store.createRun({
			runId: 'plain-run',
			lane: 'plan.consensus',
			objective: 'Plan the work',
			sourceRequest: 'plan the work',
			scopeClass: 'medium',
			status: 'completed',
			currentPhase: 'completed',
			ownerRole: 'planner',
			authorityContext: { policyRefs: ['policy'], ruleContextRefs: ['rules'] },
			verificationPolicyKey: 'plan',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			recommendedNextLane: 'complete.persistent',
			createdAt: '2026-04-06T10:00:00.000Z',
			updatedAt: '2026-04-06T10:05:00.000Z',
		});
		await store.appendEvent({
			id: 'event-1',
			runId: 'plain-run',
			type: 'plan.completed',
			createdAt: '2026-04-06T10:05:00.000Z',
			message: 'Plan finished.',
		});
		const snapshot = await store.getSnapshot('plain-run');
		const files = createLanePersistenceFiles(snapshot!);
		const hydratedStore = new InMemoryLaneRuntimeStore();
		const hydrated = await hydrateLaneRuntimeStore(hydratedStore, files);

		expect(Object.keys(files).sort()).toEqual([
			'approvals.json',
			'artifacts.json',
			'events.ndjson',
			'evidence.json',
			'laneRun.json',
			'state.json',
			'transitions.json',
		]);
		expect(hydrated.run).toEqual(snapshot!.run);
		expect(hydrated.events).toEqual(snapshot!.events);
	});

	it('hydrates a completion loop snapshot and resumes on a fresh store', async () => {
		const store = new InMemoryLaneRuntimeStore();
		await store.createRun({
			runId: 'completion-run',
			lane: 'complete.persistent',
			objective: 'Finish the task',
			sourceRequest: 'finish the task',
			scopeClass: 'medium',
			status: 'running',
			currentPhase: 'working',
			ownerRole: 'executor',
			authorityContext: { policyRefs: ['policy'], ruleContextRefs: ['rules'] },
			verificationPolicyKey: 'completion',
			blockingRisks: [],
			pendingApprovalRoles: ['verifier'],
			evidenceBundleIds: [],
			createdAt: '2026-04-06T11:00:00.000Z',
			updatedAt: '2026-04-06T11:00:00.000Z',
		});
		const backend = createInProcessCompletionBackend();
		const loop = createCompletionLoop(store, { backend });
		await loop.create(
			{
				id: 'completion-run',
				ownerRole: 'executor',
				snapshotRef: 'snapshot://completion-run',
				delegateRoles: ['verifier'],
				progressLedgerRef: 'ledger://completion-run',
				verificationPolicy: {
					key: 'completion',
					requiredEvidence: ['verification_results'],
					minimumApprovals: [{ role: 'verifier', verdict: 'approve' }],
					failOnMissingEvidence: true,
					allowConditionalCompletion: false,
				},
				signoff: {
					verifierRole: 'verifier',
					requireArchitectReview: false,
				},
				terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
			},
			{ files: ['src/index.ts'] }
		);
		await loop.addProgress('completion-run', 'Implement the feature');
		const snapshot = await store.getSnapshot('completion-run');
		const files = createLanePersistenceFiles(snapshot!);
		const hydratedStore = new InMemoryLaneRuntimeStore();
		await hydrateLaneRuntimeStore(hydratedStore, files);

		const resumedLoop = createCompletionLoop(hydratedStore, {
			backend: {
				key: 'hydrated',
				async createSnapshot() {},
				async restoreSnapshot() {},
			},
		});
		const resumed = await resumedLoop.resume('completion-run');

		expect(resumed.phase).toBe('working');
		expect(resumed.progressLedger).toHaveLength(1);
	});

	it('hydrates a team snapshot with split worker/task files and continues operations', async () => {
		const store = new InMemoryLaneRuntimeStore();
		await store.createRun({
			runId: 'team-run',
			lane: 'team.coordinated',
			objective: 'Parallel execution',
			sourceRequest: 'parallel execution',
			scopeClass: 'large',
			status: 'running',
			currentPhase: 'dispatch',
			ownerRole: 'planner',
			authorityContext: { policyRefs: ['policy'], ruleContextRefs: ['rules'] },
			verificationPolicyKey: 'team',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: '2026-04-06T12:00:00.000Z',
			updatedAt: '2026-04-06T12:00:00.000Z',
		});
		const team = createTeamRun(store, {
			key: 'hydrated-team',
			async startWorker() {},
			async stopWorker() {},
		});
		await team.create({
			id: 'team-run',
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
		const snapshot = await store.getSnapshot('team-run');
		const files = createLanePersistenceFiles(snapshot!);
		const hydratedStore = new InMemoryLaneRuntimeStore();
		const hydrated = await hydrateLaneRuntimeStore(hydratedStore, files);
		const resumedTeam = createTeamRun(hydratedStore, {
			key: 'hydrated-team',
			async startWorker() {},
			async stopWorker() {},
		});

		await resumedTeam.start('team-run');
		await resumedTeam.claimNextTask('team-run', 'worker-1');
		const state = await resumedTeam.require('team-run');

		expect(hydrated.team?.workers).toHaveLength(1);
		expect(files['workers.json']).toBeDefined();
		expect(files['tasks.json']).toBeDefined();
		expect(files['leases.json']).toBeDefined();
		expect(state.tasks[0]?.claimedBy).toBe('worker-1');
	});
});
