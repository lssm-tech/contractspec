import { describe, expect, it } from 'bun:test';
import { InMemoryLaneRuntimeStore } from './in-memory-store';
import { createLaneRuntime } from './lane-runtime';

describe('lane runtime authority hooks', () => {
	it('blocks prohibited runtime mutations before they hit the store', async () => {
		const store = new InMemoryLaneRuntimeStore();
		await store.createRun({
			runId: 'authority-run',
			lane: 'plan.consensus',
			objective: 'Guard mutations',
			sourceRequest: 'guard mutations',
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
		const runtime = createLaneRuntime(store, {
			hooks: {
				beforeAction(request) {
					if (request.action === 'append_artifact') {
						throw new Error('artifact writes blocked');
					}
				},
			},
		});

		await expect(
			runtime.appendArtifact('authority-run', {
				runId: 'authority-run',
				artifactType: 'plan_pack',
				createdAt: new Date().toISOString(),
				body: {},
			})
		).rejects.toThrow('artifact writes blocked');

		expect((await store.getSnapshot('authority-run'))?.artifacts).toHaveLength(
			0
		);
	});
});
