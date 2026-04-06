import { describe, expect, it } from 'bun:test';
import { InMemoryLaneRuntimeStore } from '../../runtime/in-memory-store';
import { createCompletionLoop } from './completion-loop';

describe('completion loop authority hooks', () => {
	it('blocks prohibited progress updates before state is mutated', async () => {
		const store = new InMemoryLaneRuntimeStore();
		const loop = createCompletionLoop(store, {
			hooks: {
				beforeAction(request) {
					if (request.action === 'complete.progress') {
						throw new Error('completion progress blocked');
					}
				},
			},
		});
		await loop.create({
			id: 'completion-authority',
			ownerRole: 'executor',
			snapshotRef: 'snapshot://completion-authority',
			delegateRoles: ['verifier'],
			progressLedgerRef: 'ledger://completion-authority',
			verificationPolicy: {
				key: 'completion',
				requiredEvidence: ['verification_results'],
				minimumApprovals: [],
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
			loop.addProgress(
				'completion-authority',
				'Mutate the ledger despite policy.'
			)
		).rejects.toThrow('completion progress blocked');

		const state = await loop.getState('completion-authority');
		expect(state.iteration).toBe(0);
		expect(state.progressLedger).toHaveLength(0);
	});
});
