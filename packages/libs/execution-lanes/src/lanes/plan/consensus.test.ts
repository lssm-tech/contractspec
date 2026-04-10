import { describe, expect, it } from 'bun:test';
import { createConsensusPlanningLane } from './consensus';

describe('consensus planning lane', () => {
	it('persists review artifacts and supports deliberate mode', async () => {
		const persisted: string[] = [];
		const lane = createConsensusPlanningLane({
			mode: 'deliberate',
			artifactSink: {
				async persist(artifact) {
					persisted.push(artifact.type);
				},
			},
			planner: {
				async draft() {
					return {
						meta: {
							id: 'plan-1',
							createdAt: new Date().toISOString(),
							sourceRequest: 'ship it',
							scopeClass: 'high-risk',
						},
						objective: 'Plan the execution lane rollout.',
						constraints: ['Rollback path must stay explicit.'],
						assumptions: ['Regression tests are available.'],
						nonGoals: [],
						tradeoffs: [],
						staffing: {
							availableRoleProfiles: ['planner', 'architect', 'critic'],
							recommendedLanes: [
								{ lane: 'team.coordinated', why: 'parallel work' },
							],
							handoffRecommendation: {
								nextLane: 'team.coordinated',
								launchHints: [],
							},
						},
						planSteps: [
							{
								id: 'step-1',
								title: 'Plan',
								description: 'Draft the plan',
								acceptanceCriteria: [
									'Regression tests are identified.',
									'Rollback acceptance criteria are explicit.',
								],
							},
						],
						verification: {
							requiredEvidence: ['plan_pack'],
							requiredApprovals: ['verifier', 'architect', 'human'],
							blockingRisks: ['Missing rollback proof'],
						},
						authorityContext: {
							policyRefs: ['policy.execution-lanes'],
							ruleContextRefs: ['rules.execution-lanes'],
						},
					};
				},
				async revise({ currentPlan }) {
					return currentPlan;
				},
			},
			architect: {
				async review() {
					return {
						reviewerRole: 'architect',
						verdict: 'approve',
						findings: [],
						recommendedChanges: [],
						createdAt: new Date().toISOString(),
					};
				},
			},
			critic: {
				async review() {
					return {
						reviewerRole: 'critic',
						verdict: 'approve',
						findings: [],
						recommendedChanges: [],
						createdAt: new Date().toISOString(),
					};
				},
			},
		});

		const result = await lane.run();
		expect(result.mode).toBe('deliberate');
		expect(result.approved).toBe(true);
		expect(result.artifacts.map((artifact) => artifact.type)).toContain(
			'plan_pack'
		);
		expect(persisted).toContain('architect_review');
		expect(persisted).toContain('critique_verdict');
	});

	it('revises on critique and enforces purity hooks', async () => {
		const purityCalls: string[] = [];
		let iteration = 0;
		const lane = createConsensusPlanningLane({
			enforceReadOnly: true,
			purityGuard: {
				capture() {
					purityCalls.push('before');
					return 'baseline';
				},
				assertUnchanged() {
					purityCalls.push('after');
				},
			},
			planner: {
				async draft() {
					return {
						meta: {
							id: 'plan-2',
							createdAt: new Date().toISOString(),
							sourceRequest: 'ship it',
							scopeClass: 'medium',
						},
						objective: 'Plan the rollout.',
						constraints: ['Preserve safety checks.'],
						assumptions: ['Authority refs are attached.'],
						nonGoals: [],
						tradeoffs: [],
						staffing: {
							availableRoleProfiles: ['planner', 'architect', 'critic'],
							recommendedLanes: [
								{ lane: 'complete.persistent', why: 'single owner' },
							],
							handoffRecommendation: {
								nextLane: 'complete.persistent',
								launchHints: [],
							},
						},
						planSteps: [
							{
								id: 'step-1',
								title: 'Plan',
								description: 'Draft the plan',
								acceptanceCriteria: ['done'],
							},
						],
						verification: {
							requiredEvidence: ['plan_pack'],
							requiredApprovals: [],
							blockingRisks: [],
						},
						authorityContext: {
							policyRefs: ['policy.execution-lanes'],
							ruleContextRefs: ['rules.execution-lanes'],
						},
					};
				},
				async revise({ currentPlan }) {
					iteration += 1;
					return {
						...currentPlan,
						assumptions: [`revision-${iteration}`],
					};
				},
			},
			architect: {
				async review() {
					return {
						reviewerRole: 'architect',
						verdict: 'approve',
						findings: [],
						recommendedChanges: [],
						createdAt: new Date().toISOString(),
					};
				},
			},
			critic: {
				async review() {
					return {
						reviewerRole: 'critic',
						verdict: iteration === 0 ? 'revise' : 'approve',
						findings: iteration === 0 ? ['Need a revision'] : [],
						recommendedChanges: iteration === 0 ? ['Revise once'] : [],
						createdAt: new Date().toISOString(),
					};
				},
			},
		});

		const result = await lane.run();
		expect(result.iterations).toBe(2);
		expect(result.plan.assumptions).toEqual(['revision-1']);
		expect(purityCalls).toEqual(['before', 'after']);
	});

	it('fails when the read-only purity baseline changes', async () => {
		const lane = createConsensusPlanningLane({
			enforceReadOnly: true,
			purityGuard: {
				capture() {
					return 'baseline';
				},
				assertUnchanged() {
					throw new Error('workspace drift detected');
				},
			},
			planner: {
				async draft() {
					return {
						meta: {
							id: 'plan-3',
							createdAt: new Date().toISOString(),
							sourceRequest: 'ship it',
							scopeClass: 'medium',
						},
						objective: 'Plan the rollout.',
						constraints: ['Stay read-only.'],
						assumptions: ['Authority refs are attached.'],
						nonGoals: [],
						tradeoffs: [],
						staffing: {
							availableRoleProfiles: ['planner', 'architect', 'critic'],
							recommendedLanes: [
								{ lane: 'complete.persistent', why: 'single owner' },
							],
							handoffRecommendation: {
								nextLane: 'complete.persistent',
								launchHints: [],
							},
						},
						planSteps: [
							{
								id: 'step-1',
								title: 'Plan',
								description: 'Draft the plan',
								acceptanceCriteria: ['done'],
							},
						],
						verification: {
							requiredEvidence: ['plan_pack'],
							requiredApprovals: [],
							blockingRisks: [],
						},
						authorityContext: {
							policyRefs: ['policy.execution-lanes'],
							ruleContextRefs: ['rules.execution-lanes'],
						},
					};
				},
				async revise({ currentPlan }) {
					return currentPlan;
				},
			},
			architect: {
				async review() {
					return {
						reviewerRole: 'architect',
						verdict: 'approve',
						findings: [],
						recommendedChanges: [],
						createdAt: new Date().toISOString(),
					};
				},
			},
			critic: {
				async review() {
					return {
						reviewerRole: 'critic',
						verdict: 'approve',
						findings: [],
						recommendedChanges: [],
						createdAt: new Date().toISOString(),
					};
				},
			},
		});

		await expect(lane.run()).rejects.toThrow(/workspace drift detected/);
	});
});
