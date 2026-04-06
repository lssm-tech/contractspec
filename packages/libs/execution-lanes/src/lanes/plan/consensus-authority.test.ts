import { describe, expect, it } from 'bun:test';
import { createConsensusPlanningLane } from './consensus';

describe('consensus planning authority hooks', () => {
	it('blocks artifact persistence when authority disallows planning side effects', async () => {
		const persisted: string[] = [];
		const lane = createConsensusPlanningLane({
			planner: {
				async draft() {
					return {
						meta: {
							id: 'plan-1',
							createdAt: new Date().toISOString(),
							sourceRequest: 'Plan the work',
							scopeClass: 'medium',
						},
						objective: 'Plan the work',
						constraints: ['Keep the rollout reversible.'],
						assumptions: ['Policy refs are attached.'],
						nonGoals: [],
						tradeoffs: [
							{
								topic: 'throughput',
								tension: 'speed vs simplicity',
								chosenDirection: 'complete.persistent',
								rejectedAlternatives: ['team.coordinated'],
							},
						],
						staffing: {
							availableRoleProfiles: ['planner', 'architect', 'critic'],
							recommendedLanes: [
								{
									lane: 'complete.persistent',
									why: 'A single closer is sufficient.',
								},
							],
							handoffRecommendation: {
								nextLane: 'complete.persistent',
								launchHints: ['Keep one accountable owner.'],
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
			artifactSink: {
				persist(artifact) {
					persisted.push(artifact.type);
				},
			},
			authority: {
				runId: 'plan-1',
				hooks: {
					beforeAction(request) {
						if (request.action === 'append_artifact') {
							throw new Error('planning side effects blocked');
						}
					},
				},
			},
		});

		await expect(lane.run()).rejects.toThrow('planning side effects blocked');
		expect(persisted).toEqual([]);
	});
});
