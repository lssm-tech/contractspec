import { describe, expect, it } from 'bun:test';
import { InMemoryLaneRuntimeStore } from '../../runtime/in-memory-store';
import { createCompletionLoop } from './completion-loop';

describe('completion loop failure taxonomy', () => {
	it('classifies spec failure taxonomy and preserves normalized failure values', async () => {
		const loop = createCompletionLoop(new InMemoryLaneRuntimeStore());
		await loop.create({
			id: 'completion-5',
			ownerRole: 'executor',
			snapshotRef: 'snapshot://completion-5',
			delegateRoles: ['verifier'],
			progressLedgerRef: 'ledger://completion-5',
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
		});

		const retryable = await loop.recordFailure(
			'completion-5',
			'retryable',
			'Retryable legacy failures still normalize before persistence.'
		);
		expect(retryable.phase).toBe('remediating');
		expect(retryable.retryCount).toBe(1);
		expect(retryable.lastFailureClass).toBe('runtime_failure');

		const policyBlocked = await loop.recordFailure(
			'completion-5',
			'policy_blocked',
			'Policy denied the change.'
		);
		expect(policyBlocked.phase).toBe('blocked');
		expect(policyBlocked.lastFailureClass).toBe('policy_blocked');

		const runtimeFailure = await loop.recordFailure(
			'completion-5',
			'runtime_failure',
			'The runtime crashed permanently.'
		);
		expect(runtimeFailure.phase).toBe('failed');
		expect(runtimeFailure.lastFailureClass).toBe('runtime_failure');

		const workerTimeout = await loop.recordFailure(
			'completion-5',
			'worker_timeout',
			'A worker timed out.'
		);
		expect(workerTimeout.phase).toBe('remediating');
		expect(workerTimeout.retryCount).toBe(2);

		const leaseConflict = await loop.recordFailure(
			'completion-5',
			'lease_conflict',
			'A task lease was stolen and must be reclaimed.'
		);
		expect(leaseConflict.phase).toBe('remediating');
		expect(leaseConflict.retryCount).toBe(3);

		const aborted = await loop.finalize('completion-5', {
			status: 'aborted',
			approvalIds: [],
			unresolvedRisks: ['operator_abort'],
			terminalReason: 'Operator aborted the loop.',
		});
		expect(aborted.status).toBe('aborted');
		expect((await loop.getState('completion-5')).phase).toBe('aborted');
	});
});
