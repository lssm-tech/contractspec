import { describe, expect, it } from 'bun:test';
import { createLanePersistenceBundle } from './persistence-bundle';

describe('createLanePersistenceBundle', () => {
	it('includes transitions and state slices in the export bundle', () => {
		const bundle = createLanePersistenceBundle({
			run: {
				runId: 'run-1',
				lane: 'plan.consensus',
				objective: 'Plan work',
				sourceRequest: 'plan',
				scopeClass: 'medium',
				status: 'completed',
				currentPhase: 'done',
				ownerRole: 'planner',
				authorityContext: { policyRefs: [], ruleContextRefs: [] },
				verificationPolicyKey: 'plan',
				blockingRisks: [],
				pendingApprovalRoles: [],
				evidenceBundleIds: [],
				createdAt: '2026-04-06T10:00:00.000Z',
				updatedAt: '2026-04-06T10:00:00.000Z',
			},
			events: [],
			transitions: [
				{
					id: 'transition-1',
					runId: 'run-1',
					from: 'plan.consensus',
					to: 'team.coordinated',
					reason: 'Fanout justified',
					createdAt: '2026-04-06T10:01:00.000Z',
				},
			],
			artifacts: [],
			evidence: [],
			approvals: [],
		});
		expect(bundle.transitions).toHaveLength(1);
		expect(bundle.run.runId).toBe('run-1');
	});
});
