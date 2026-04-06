import { describe, expect, it } from 'bun:test';
import {
	validateClarificationArtifact,
	validateCompletionLoopSpec,
	validateTeamRunSpec,
	validateVerificationPolicy,
} from '..';

describe('execution-lane contract validators', () => {
	it('flags invalid clarification and verification policy shapes', () => {
		expect(
			validateClarificationArtifact({
				meta: {
					id: '',
					createdAt: new Date().toISOString(),
					sourceRequest: '',
					scopeClass: 'small',
					ambiguityScore: 2,
					recommendedNextLane: 'plan.consensus',
				},
				objective: '',
				constraints: [],
				assumptions: [],
				openQuestions: [],
				conflictSignals: [],
				authorityContext: { policyRefs: [], ruleContextRefs: [] },
			}).length
		).toBeGreaterThan(0);
		expect(
			validateVerificationPolicy({
				key: '',
				requiredEvidence: [],
				minimumApprovals: [{ role: '', verdict: 'approve' }],
				failOnMissingEvidence: true,
				allowConditionalCompletion: false,
				maxEvidenceAgeMinutes: 0,
			}).length
		).toBeGreaterThan(0);
	});

	it('flags invalid completion and team specs', () => {
		expect(
			validateCompletionLoopSpec({
				id: '',
				ownerRole: '',
				snapshotRef: '',
				delegateRoles: [],
				progressLedgerRef: '',
				verificationPolicy: '',
				signoff: {
					verifierRole: '',
					requireArchitectReview: false,
				},
				terminalConditions: [],
			}).length
		).toBeGreaterThan(0);
		expect(
			validateTeamRunSpec({
				id: '',
				objective: '',
				workers: [],
				backlog: [
					{
						taskId: 'task-1',
						title: '',
						description: 'Build the runtime',
						roleHint: 'missing-worker',
						dependencies: ['missing-task'],
						writePaths: [''],
					},
				],
				coordination: {
					mailbox: true,
					taskLeasing: true,
					heartbeats: true,
					rebalancing: true,
				},
				verificationLane: { required: true, ownerRole: '' },
				shutdownPolicy: {
					requireTerminalTasks: true,
					requireEvidenceGate: true,
				},
			}).length
		).toBeGreaterThan(0);
	});
});
