import { describe, expect, it } from 'bun:test';
import { DEFAULT_LANES } from '../defaults';
import { ExecutionLaneRegistry } from '../registry/execution-lane-registry';
import { InMemoryLaneRuntimeStore } from './in-memory-store';
import { createLaneRuntime } from './lane-runtime';

describe('createLaneRuntime', () => {
	it('enforces lane handoffs and terminal completion rules when configured', async () => {
		const lanes = new ExecutionLaneRegistry();
		for (const lane of DEFAULT_LANES) {
			lanes.register(lane);
		}

		const store = new InMemoryLaneRuntimeStore();
		await store.createRun({
			runId: 'plan-enforced',
			lane: 'plan.consensus',
			objective: 'Plan a change.',
			sourceRequest: 'plan a change',
			scopeClass: 'medium',
			status: 'running',
			currentPhase: 'review',
			ownerRole: 'planner',
			authorityContext: { policyRefs: ['policy'], ruleContextRefs: ['rules'] },
			verificationPolicyKey: 'lane.plan.consensus',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		const runtime = createLaneRuntime(store, { laneRegistry: lanes });

		await expect(
			runtime.handoffToLane(
				'plan-enforced',
				'clarify',
				'Invalid backwards transition.'
			)
		).rejects.toThrow(/cannot transition/);
		await expect(
			runtime.markTerminal('plan-enforced', 'completed')
		).rejects.toThrow(/must record a next lane/);

		await runtime.transitionRun('plan-enforced', {
			recommendedNextLane: 'team.coordinated',
		});
		await runtime.appendArtifact('plan-enforced', {
			runId: 'plan-enforced',
			artifactType: 'plan_pack',
			createdAt: new Date().toISOString(),
			body: {
				meta: {
					id: 'plan-pack-1',
					createdAt: new Date().toISOString(),
					sourceRequest: 'plan a change',
					scopeClass: 'medium',
				},
				objective: 'Plan a change.',
				constraints: ['Keep the rollout reversible.'],
				assumptions: ['Policy refs are attached.'],
				nonGoals: [],
				tradeoffs: [
					{
						topic: 'fanout',
						tension: 'speed vs closure',
						chosenDirection: 'team.coordinated',
						rejectedAlternatives: ['complete.persistent'],
					},
				],
				staffing: {
					availableRoleProfiles: ['planner', 'architect', 'critic'],
					recommendedLanes: [
						{ lane: 'team.coordinated', why: 'parallel fanout justified' },
					],
					handoffRecommendation: {
						nextLane: 'team.coordinated',
						launchHints: [],
					},
				},
				planSteps: [
					{
						id: 'step-1',
						title: 'Implement',
						description: 'Ship the work.',
						acceptanceCriteria: ['Tests pass.'],
					},
				],
				verification: {
					requiredEvidence: ['plan_pack'],
					requiredApprovals: [],
					blockingRisks: [],
				},
				authorityContext: {
					policyRefs: ['policy'],
					ruleContextRefs: ['rules'],
				},
			},
		});
		await runtime.appendArtifact('plan-enforced', {
			runId: 'plan-enforced',
			artifactType: 'architect_review',
			createdAt: new Date().toISOString(),
			body: { reviewerRole: 'architect', verdict: 'approve' },
		});
		await runtime.appendArtifact('plan-enforced', {
			runId: 'plan-enforced',
			artifactType: 'critique_verdict',
			createdAt: new Date().toISOString(),
			body: { reviewerRole: 'critic', verdict: 'approve' },
		});
		await runtime.appendArtifact('plan-enforced', {
			runId: 'plan-enforced',
			artifactType: 'tradeoff_record',
			createdAt: new Date().toISOString(),
			body: [],
		});

		await expect(
			runtime.markTerminal('plan-enforced', 'completed')
		).resolves.toBeDefined();
	});

	it('rejects malformed handoff artifacts during terminal completion', async () => {
		const lanes = new ExecutionLaneRegistry();
		for (const lane of DEFAULT_LANES) {
			lanes.register(lane);
		}

		const store = new InMemoryLaneRuntimeStore();
		await store.createRun({
			runId: 'plan-invalid',
			lane: 'plan.consensus',
			objective: 'Plan a change.',
			sourceRequest: 'plan a change',
			scopeClass: 'medium',
			status: 'running',
			currentPhase: 'review',
			ownerRole: 'planner',
			authorityContext: { policyRefs: ['policy'], ruleContextRefs: ['rules'] },
			verificationPolicyKey: 'lane.plan.consensus',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			recommendedNextLane: 'complete.persistent',
		});

		const runtime = createLaneRuntime(store, { laneRegistry: lanes });
		await runtime.appendArtifact('plan-invalid', {
			runId: 'plan-invalid',
			artifactType: 'plan_pack',
			createdAt: new Date().toISOString(),
			body: {
				meta: {
					id: 'plan-pack-invalid',
					createdAt: new Date().toISOString(),
					sourceRequest: 'plan a change',
					scopeClass: 'medium',
				},
				objective: '',
				constraints: [],
				assumptions: [],
				nonGoals: [],
				tradeoffs: [],
				staffing: {
					availableRoleProfiles: ['planner'],
					recommendedLanes: [],
					handoffRecommendation: {
						nextLane: 'complete.persistent',
						launchHints: [],
					},
				},
				planSteps: [],
				verification: {
					requiredEvidence: [],
					requiredApprovals: [],
					blockingRisks: [],
				},
				authorityContext: {
					policyRefs: [],
					ruleContextRefs: [],
				},
			},
		});
		await runtime.appendArtifact('plan-invalid', {
			runId: 'plan-invalid',
			artifactType: 'architect_review',
			createdAt: new Date().toISOString(),
			body: { reviewerRole: 'architect', verdict: 'approve' },
		});
		await runtime.appendArtifact('plan-invalid', {
			runId: 'plan-invalid',
			artifactType: 'critique_verdict',
			createdAt: new Date().toISOString(),
			body: { reviewerRole: 'critic', verdict: 'approve' },
		});
		await runtime.appendArtifact('plan-invalid', {
			runId: 'plan-invalid',
			artifactType: 'tradeoff_record',
			createdAt: new Date().toISOString(),
			body: [],
		});

		await expect(
			runtime.markTerminal('plan-invalid', 'completed')
		).rejects.toThrow(/missing artifacts: plan_pack/);
	});
});
