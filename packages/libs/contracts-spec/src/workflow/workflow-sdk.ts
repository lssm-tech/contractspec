import {
	type ContractProblem,
	ContractSpecError,
	normalizeContractError,
} from '../results';

export interface WorkflowSdkErrorConstructors {
	FatalError: new (message: string, options?: Record<string, unknown>) => Error;
	RetryableError: new (
		message: string,
		options?: Record<string, unknown>
	) => Error;
}

export function toWorkflowSdkError(
	error: unknown,
	constructors: WorkflowSdkErrorConstructors
): Error {
	const failure = normalizeContractError(error, {
		source: { service: 'workflow' },
	});
	return problemToWorkflowSdkError(failure.problem, constructors);
}

export function problemToWorkflowSdkError(
	problem: ContractProblem<string, Record<string, unknown>>,
	constructors: WorkflowSdkErrorConstructors
): Error {
	const message = problem.detail ?? problem.title;
	const options = {
		code: problem.code,
		status: problem.status,
		retryAfter: problem.retryAfter,
		problem,
	};

	if (problem.retryable) {
		return new constructors.RetryableError(message, options);
	}
	return new constructors.FatalError(message, options);
}

export function throwWorkflowSdkError(
	error: unknown,
	constructors: WorkflowSdkErrorConstructors
): never {
	throw toWorkflowSdkError(
		error instanceof ContractSpecError ? error.problem : error,
		constructors
	);
}
