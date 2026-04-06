import type { RoleProfile } from '../types';
import { type ExecutionLanesValidationIssue, pushIssue } from './issues';

export function validateRoleProfile(
	profile: RoleProfile
): ExecutionLanesValidationIssue[] {
	const issues: ExecutionLanesValidationIssue[] = [];
	if (!profile.key.trim()) {
		pushIssue(issues, 'key', 'Role key is required.');
	}
	if (!profile.description.trim()) {
		pushIssue(issues, 'description', 'Description is required.');
	}
	if (profile.allowedTools.length === 0) {
		pushIssue(
			issues,
			'allowedTools',
			'At least one tool permission is required.'
		);
	}
	if (profile.laneCompatibility.length === 0) {
		pushIssue(
			issues,
			'laneCompatibility',
			'At least one compatible lane is required.'
		);
	}
	return issues;
}
