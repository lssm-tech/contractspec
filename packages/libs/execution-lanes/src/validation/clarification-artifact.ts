import type { ClarificationArtifact } from '../types';
import {
	assertValid,
	type ExecutionLanesValidationIssue,
	pushIssue,
} from './issues';

export function validateClarificationArtifact(
	artifact: ClarificationArtifact
): ExecutionLanesValidationIssue[] {
	const issues: ExecutionLanesValidationIssue[] = [];
	if (!artifact.meta.id.trim()) {
		pushIssue(issues, 'meta.id', 'Clarification artifact id is required.');
	}
	if (!artifact.meta.sourceRequest.trim()) {
		pushIssue(
			issues,
			'meta.sourceRequest',
			'Clarification source request is required.'
		);
	}
	if (artifact.meta.ambiguityScore < 0 || artifact.meta.ambiguityScore > 1) {
		pushIssue(
			issues,
			'meta.ambiguityScore',
			'Clarification ambiguity score must be between 0 and 1.'
		);
	}
	if (!artifact.objective.trim()) {
		pushIssue(issues, 'objective', 'Clarification objective is required.');
	}
	if (!artifact.meta.recommendedNextLane) {
		pushIssue(
			issues,
			'meta.recommendedNextLane',
			'Clarification next lane is required.'
		);
	}
	return issues;
}

export function assertValidClarificationArtifact(
	artifact: ClarificationArtifact
): ClarificationArtifact {
	assertValid(
		validateClarificationArtifact(artifact),
		'Invalid clarification artifact'
	);
	return artifact;
}
