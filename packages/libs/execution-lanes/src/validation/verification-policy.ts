import type { VerificationPolicy, VerificationPolicySource } from '../types';
import {
	assertValid,
	type ExecutionLanesValidationIssue,
	pushIssue,
} from './issues';

export function validateVerificationPolicy(
	policy: VerificationPolicy
): ExecutionLanesValidationIssue[] {
	const issues: ExecutionLanesValidationIssue[] = [];
	if (!policy.key.trim()) {
		pushIssue(issues, 'key', 'Verification policy key is required.');
	}
	for (const requirement of policy.minimumApprovals) {
		if (!requirement.role.trim()) {
			pushIssue(
				issues,
				'minimumApprovals[].role',
				'Approval requirement role is required.'
			);
		}
	}
	if (
		policy.maxEvidenceAgeMinutes !== undefined &&
		policy.maxEvidenceAgeMinutes <= 0
	) {
		pushIssue(
			issues,
			'maxEvidenceAgeMinutes',
			'Maximum evidence age must be greater than zero.'
		);
	}
	return issues;
}

export function validateVerificationPolicySource(
	policy: VerificationPolicySource
): ExecutionLanesValidationIssue[] {
	if (typeof policy === 'string') {
		return policy.trim()
			? []
			: [{ path: 'key', message: 'Verification policy key is required.' }];
	}
	return validateVerificationPolicy(policy);
}

export function assertValidVerificationPolicy(
	policy: VerificationPolicy
): VerificationPolicy {
	assertValid(
		validateVerificationPolicy(policy),
		`Invalid verification policy "${policy.key}"`
	);
	return policy;
}
