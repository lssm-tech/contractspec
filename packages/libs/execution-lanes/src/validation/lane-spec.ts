import type { ExecutionLaneSpec } from '../types';
import { type ExecutionLanesValidationIssue, pushIssue } from './issues';

export function validateExecutionLaneSpec(
	spec: ExecutionLaneSpec
): ExecutionLanesValidationIssue[] {
	const issues: ExecutionLanesValidationIssue[] = [];
	if (!spec.key) {
		pushIssue(issues, 'key', 'Lane key is required.');
	}
	if (!spec.description.trim()) {
		pushIssue(issues, 'description', 'Description is required.');
	}
	if (spec.allowedTransitions.includes(spec.key)) {
		pushIssue(
			issues,
			'allowedTransitions',
			'A lane cannot directly transition to itself.'
		);
	}
	if (spec.requiredArtifacts.length === 0) {
		pushIssue(
			issues,
			'requiredArtifacts',
			'At least one required artifact must be declared.'
		);
	}
	if (
		typeof spec.verificationPolicy === 'string'
			? !spec.verificationPolicy.trim()
			: !spec.verificationPolicy.key
	) {
		pushIssue(
			issues,
			'verificationPolicy',
			'Verification policy key is required.'
		);
	}
	return issues;
}
