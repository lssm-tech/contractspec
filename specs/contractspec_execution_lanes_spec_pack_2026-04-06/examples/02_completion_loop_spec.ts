import type { CompletionLoopSpec } from '../package-skeleton/src/types';

export const OAuthCompletionLoop: CompletionLoopSpec = {
	id: 'loop_oauth_cutover_001',
	ownerRole: 'executor',
	sourcePlanPackId: 'planpack_auth_migration_001',
	snapshotRef: 'snapshots/oauth-cutover-2026-04-06.json',
	iterationLimit: 12,
	delegateRoles: ['test-engineer', 'security-reviewer', 'writer'],
	progressLedgerRef: 'ledger/oauth-cutover-progress.json',
	verificationPolicy: 'verification.highRiskAuth',
	signoff: {
		verifierRole: 'verifier',
		requireArchitectReview: true,
		requireHumanApproval: true,
	},
	terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
};
