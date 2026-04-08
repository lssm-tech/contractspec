export interface BuilderValidationIssue {
	path: string;
	message: string;
}

export function pushBuilderIssue(
	issues: BuilderValidationIssue[],
	path: string,
	message: string
): void {
	issues.push({ path, message });
}
