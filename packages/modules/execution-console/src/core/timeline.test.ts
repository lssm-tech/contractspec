import { describe, expect, it } from 'bun:test';
import { buildExecutionLaneTimeline } from './timeline';

describe('buildExecutionLaneTimeline', () => {
	it('normalizes a lane snapshot into a sorted timeline', () => {
		const items = buildExecutionLaneTimeline({
			run: {
				runId: 'run-1',
				lane: 'team.coordinated',
				objective: 'Ship it',
				sourceRequest: 'build',
				scopeClass: 'large',
				status: 'running',
				currentPhase: 'dispatch',
				ownerRole: 'planner',
				authorityContext: { policyRefs: [], ruleContextRefs: [] },
				verificationPolicyKey: 'team',
				blockingRisks: [],
				pendingApprovalRoles: [],
				evidenceBundleIds: [],
				createdAt: '2026-04-06T10:00:00.000Z',
				updatedAt: '2026-04-06T10:00:00.000Z',
			},
			events: [
				{
					id: 'evt-1',
					runId: 'run-1',
					type: 'dispatch.started',
					createdAt: '2026-04-06T10:01:00.000Z',
				},
			],
			transitions: [
				{
					id: 'transition-1',
					runId: 'run-1',
					from: 'plan.consensus',
					to: 'team.coordinated',
					reason: 'Fanout justified.',
					createdAt: '2026-04-06T10:00:30.000Z',
				},
			],
			artifacts: [],
			evidence: [],
			approvals: [],
		});
		expect(items[0]?.label).toBe('plan.consensus -> team.coordinated');
		expect(items[1]?.label).toBe('dispatch.started');
	});
});
