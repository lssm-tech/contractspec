import { describe, expect, it } from 'bun:test';
import { createInProcessCompletionBackend } from '../../adapters/in-process';
import { createEvidenceBundle } from '../../evidence/bundle';
import { VerificationPolicyRegistry } from '../../registry/verification-policy-registry';
import { InMemoryLaneRuntimeStore } from '../../runtime/in-memory-store';
import { createCompletionLoop } from './completion-loop';

describe('completion loop', () => {
	it('blocks progress when evidence is missing and can resume later', async () => {
		const store = new InMemoryLaneRuntimeStore();
		await store.createRun({
			runId: 'completion-1',
			lane: 'complete.persistent',
			objective: 'Finish the run',
			sourceRequest: 'complete',
			scopeClass: 'medium',
			status: 'initialized',
			currentPhase: 'initialized',
			ownerRole: 'executor',
			authorityContext: {
				policyRefs: ['policy.execution-lanes'],
				ruleContextRefs: ['rules.execution-lanes'],
			},
			verificationPolicyKey: 'completion.policy',
			blockingRisks: [],
			pendingApprovalRoles: [],
			evidenceBundleIds: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		const policies = new VerificationPolicyRegistry().register({
			key: 'completion.policy',
			requiredEvidence: ['verification_results'],
			minimumApprovals: [{ role: 'verifier', verdict: 'approve' }],
			failOnMissingEvidence: true,
			allowConditionalCompletion: false,
		});
		const loop = createCompletionLoop(store, {
			policyRegistry: policies,
			backend: createInProcessCompletionBackend(),
		});
		await loop.create({
			id: 'completion-1',
			ownerRole: 'executor',
			snapshotRef: 'snapshot://completion-1',
			delegateRoles: ['verifier'],
			progressLedgerRef: 'ledger://completion-1',
			verificationPolicy: 'completion.policy',
			signoff: {
				verifierRole: 'verifier',
				requireArchitectReview: false,
			},
			terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
		});

		const missing = await loop.evaluateEvidence('completion-1');
		expect(missing.passed).toBe(false);
		expect((await loop.getState('completion-1')).phase).toBe('remediating');
		expect((await loop.getState('completion-1')).lastFailureClass).toBe(
			'missing_evidence'
		);

		await loop.attachEvidence(
			'completion-1',
			createEvidenceBundle({
				runId: 'completion-1',
				classes: ['verification_results'],
				artifacts: [],
			})
		);
		expect((await loop.resume('completion-1')).phase).toBe('remediating');
		expect((await store.getRun('completion-1'))?.currentPhase).toBe(
			'remediating'
		);
	});

	it('records rejected approvals and requires full sign-off before finalize', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const loop = createCompletionLoop(store);
		await loop.create({
			id: 'completion-2',
			ownerRole: 'executor',
			snapshotRef: 'snapshot://completion-2',
			delegateRoles: ['verifier', 'architect'],
			progressLedgerRef: 'ledger://completion-2',
			verificationPolicy: {
				key: 'completion',
				requiredEvidence: ['verification_results'],
				minimumApprovals: [{ role: 'verifier', verdict: 'approve' }],
				failOnMissingEvidence: true,
				allowConditionalCompletion: false,
			},
			signoff: {
				verifierRole: 'verifier',
				requireArchitectReview: true,
				requireHumanApproval: true,
			},
			terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
		});

		await loop.decideApproval('completion-2', {
			role: 'human',
			verdict: 'approve',
			state: 'rejected',
			comment: 'Not enough proof',
			decidedAt: new Date().toISOString(),
		});
		expect((await loop.getState('completion-2')).phase).toBe('blocked');
		expect((await loop.getState('completion-2')).lastFailureClass).toBe(
			'approval_denied'
		);

		await loop.decideApproval('completion-2', {
			role: 'verifier',
			verdict: 'approve',
			state: 'approved',
			decidedAt: new Date().toISOString(),
		});
		await loop.decideApproval('completion-2', {
			role: 'architect',
			verdict: 'approve',
			state: 'approved',
			decidedAt: new Date().toISOString(),
		});
		await loop.decideApproval('completion-2', {
			role: 'human',
			verdict: 'approve',
			state: 'approved',
			decidedAt: new Date().toISOString(),
		});
		await loop.attachEvidence(
			'completion-2',
			createEvidenceBundle({
				runId: 'completion-2',
				classes: ['verification_results'],
				artifacts: [],
			})
		);
		const record = await loop.finalize('completion-2', {
			status: 'completed',
			approvalIds: ['verifier', 'architect', 'human'],
			unresolvedRisks: [],
		});
		expect(record.status).toBe('completed');
	});

	it('rejects terminal success when evidence is missing or stale', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const loop = createCompletionLoop(store);
		await loop.create({
			id: 'completion-3',
			ownerRole: 'executor',
			snapshotRef: 'snapshot://completion-3',
			delegateRoles: ['verifier'],
			progressLedgerRef: 'ledger://completion-3',
			verificationPolicy: {
				key: 'completion',
				requiredEvidence: ['verification_results'],
				minimumApprovals: [{ role: 'verifier', verdict: 'approve' }],
				failOnMissingEvidence: true,
				allowConditionalCompletion: false,
				maxEvidenceAgeMinutes: 1,
			},
			signoff: {
				verifierRole: 'verifier',
				requireArchitectReview: false,
			},
			terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
		});
		await loop.decideApproval('completion-3', {
			role: 'verifier',
			verdict: 'approve',
			state: 'approved',
			decidedAt: new Date().toISOString(),
		});
		await expect(
			loop.finalize('completion-3', {
				status: 'completed',
				approvalIds: ['verifier'],
				unresolvedRisks: [],
			})
		).rejects.toThrow(/missing evidence/);

		await loop.attachEvidence('completion-3', {
			id: 'stale-evidence',
			runId: 'completion-3',
			artifactIds: [],
			classes: ['verification_results'],
			createdAt: new Date('2026-04-06T09:00:00.000Z').toISOString(),
			freshUntil: new Date('2026-04-06T09:05:00.000Z').toISOString(),
		});
		await expect(
			loop.finalize('completion-3', {
				status: 'completed',
				approvalIds: ['verifier'],
				unresolvedRisks: [],
			})
		).rejects.toThrow(/stale evidence/);
	});

	it('allows conditional completion when the verification policy permits it', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const loop = createCompletionLoop(store);
		await loop.create({
			id: 'completion-4',
			ownerRole: 'executor',
			snapshotRef: 'snapshot://completion-4',
			delegateRoles: ['verifier'],
			progressLedgerRef: 'ledger://completion-4',
			verificationPolicy: {
				key: 'completion',
				requiredEvidence: ['verification_results'],
				minimumApprovals: [{ role: 'verifier', verdict: 'approve' }],
				failOnMissingEvidence: true,
				allowConditionalCompletion: true,
			},
			signoff: {
				verifierRole: 'verifier',
				requireArchitectReview: false,
			},
			terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
		});
		await loop.decideApproval('completion-4', {
			role: 'verifier',
			verdict: 'approve',
			state: 'approved',
			decidedAt: new Date().toISOString(),
		});
		const gate = await loop.evaluateEvidence('completion-4');
		expect(gate.passed).toBe(false);
		expect(gate.conditionallyPassed).toBe(true);

		const record = await loop.finalize('completion-4', {
			status: 'completed',
			approvalIds: ['verifier'],
			unresolvedRisks: [],
		});
		expect(record.status).toBe('completed');
	});
});
