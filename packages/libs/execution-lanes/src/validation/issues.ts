export interface ExecutionLanesValidationIssue {
	path: string;
	message: string;
}

export function pushIssue(
	issues: ExecutionLanesValidationIssue[],
	path: string,
	message: string
) {
	issues.push({ path, message });
}

export function assertValid(
	issues: ExecutionLanesValidationIssue[],
	message: string
) {
	if (issues.length === 0) {
		return;
	}

	const details = issues
		.map((issue) => `${issue.path}: ${issue.message}`)
		.join('; ');
	throw new Error(`${message}: ${details}`);
}
