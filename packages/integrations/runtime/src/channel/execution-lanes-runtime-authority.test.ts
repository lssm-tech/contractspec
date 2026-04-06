import { describe, expect, it } from 'bun:test';
import {
	createCompletionLoop,
	createInMemoryTeamBackend,
	createLaneRuntime,
	createTeamRun,
} from '@contractspec/lib.execution-lanes';
import { InMemoryExecutionLaneRuntimeStore } from './execution-lanes-memory-store';

describe('execution lane runtime authority', () => {
	it('applies shared authority hooks to direct lane runtime mutations', async () => {
		const store = new InMemoryExecutionLaneRuntimeStore();
		const hooks = {
			beforeAction(request: { action: string }) {
				if (
					request.action === 'append_artifact' ||
					request.action === 'complete.progress' ||
					request.action === 'team.create'
				) {
					throw new Error(`denied ${request.action}`);
				}
			},
		};

		const runtime = createLaneRuntime(store, { hooks });
		await runtime.startRun({
			runId: 'lane-3',
			lane: 'clarify',
			objective: 'Clarify the task.',
			sourceRequest: 'clarify it',
			scopeClass: 'small',
			status: 'initialized',
			currentPhase: 'initialized',
			ownerRole: 'planner',
			authorityContext: { policyRefs: [], ruleContextRefs: [] },
			verificationPolicyKey: 'lane.clarify',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		await expect(
			runtime.appendArtifact('lane-3', {
				runId: 'lane-3',
				artifactType: 'clarification_artifact',
				createdAt: new Date().toISOString(),
				body: {
					meta: {
						id: 'clarify-1',
						createdAt: new Date().toISOString(),
						sourceRequest: 'clarify it',
						scopeClass: 'small',
						ambiguityScore: 0.5,
						recommendedNextLane: 'plan.consensus',
					},
					objective: 'Clarify the task.',
					constraints: [],
					assumptions: [],
					openQuestions: [],
					conflictSignals: [],
					authorityContext: { policyRefs: [], ruleContextRefs: [] },
				},
			})
		).rejects.toThrow(/denied append_artifact/);

		await store.createRun({
			runId: 'lane-4',
			lane: 'complete.persistent',
			objective: 'Complete the task.',
			sourceRequest: 'complete it',
			scopeClass: 'medium',
			status: 'running',
			currentPhase: 'working',
			ownerRole: 'executor',
			authorityContext: { policyRefs: [], ruleContextRefs: [] },
			verificationPolicyKey: 'lane.complete.persistent',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		const loop = createCompletionLoop(store, { hooks });
		await loop.create({
			id: 'lane-4',
			ownerRole: 'executor',
			snapshotRef: 'snapshot://lane-4',
			delegateRoles: ['verifier'],
			progressLedgerRef: 'ledger://lane-4',
			verificationPolicy: {
				key: 'complete',
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
		});
		await expect(
			loop.addProgress('lane-4', 'Implement the task.')
		).rejects.toThrow(/denied complete.progress/);

		const team = createTeamRun(store, createInMemoryTeamBackend(), { hooks });
		await expect(
			team.create({
				id: 'lane-5',
				objective: 'Fan out the work.',
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
			})
		).rejects.toThrow(/denied team.create/);
	});
});
