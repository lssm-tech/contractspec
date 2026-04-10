import type { CompletionLoopSpec } from '../types';
import {
	assertValid,
	type ExecutionLanesValidationIssue,
	pushIssue,
} from './issues';
import { validateVerificationPolicySource } from './verification-policy';

export function validateCompletionLoopSpec(
	spec: CompletionLoopSpec
): ExecutionLanesValidationIssue[] {
	const issues: ExecutionLanesValidationIssue[] = [];
	if (!spec.id.trim()) {
		pushIssue(issues, 'id', 'Completion loop id is required.');
	}
	if (!spec.ownerRole.trim()) {
		pushIssue(issues, 'ownerRole', 'Completion loop owner role is required.');
	}
	if (!spec.snapshotRef.trim()) {
		pushIssue(
			issues,
			'snapshotRef',
			'Completion loop snapshot ref is required.'
		);
	}
	if (!spec.progressLedgerRef.trim()) {
		pushIssue(
			issues,
			'progressLedgerRef',
			'Completion loop progress ledger ref is required.'
		);
	}
	if (!spec.signoff.verifierRole.trim()) {
		pushIssue(
			issues,
			'signoff.verifierRole',
			'Completion loop verifier role is required.'
		);
	}
	if (spec.terminalConditions.length === 0) {
		pushIssue(
			issues,
			'terminalConditions',
			'Completion loop terminal conditions are required.'
		);
	}
	for (const issue of validateVerificationPolicySource(
		spec.verificationPolicy
	)) {
		pushIssue(issues, `verificationPolicy.${issue.path}`, issue.message);
	}
	return issues;
}

export function assertValidCompletionLoopSpec(
	spec: CompletionLoopSpec
): CompletionLoopSpec {
	assertValid(
		validateCompletionLoopSpec(spec),
		`Invalid completion loop "${spec.id}"`
	);
	return spec;
}
