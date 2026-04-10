export const EXECUTION_LANE_FAILURE_CLASSES = [
	'missing_evidence',
	'failing_evidence',
	'policy_blocked',
	'approval_denied',
	'runtime_failure',
	'worker_timeout',
	'lease_conflict',
] as const;

export type ExecutionLaneFailureClass =
	(typeof EXECUTION_LANE_FAILURE_CLASSES)[number];

export type LegacyExecutionLaneFailureAlias = 'retryable' | 'blocked' | 'fatal';

export type ExecutionLaneFailureClassInput =
	| ExecutionLaneFailureClass
	| LegacyExecutionLaneFailureAlias;

const FAILURE_CLASS_ALIASES: Record<
	LegacyExecutionLaneFailureAlias,
	ExecutionLaneFailureClass
> = {
	retryable: 'runtime_failure',
	blocked: 'policy_blocked',
	fatal: 'runtime_failure',
};

export function normalizeExecutionLaneFailureClass(
	value: ExecutionLaneFailureClassInput
): ExecutionLaneFailureClass {
	return isExecutionLaneFailureClass(value)
		? value
		: FAILURE_CLASS_ALIASES[value];
}

export function isExecutionLaneFailureClass(
	value: string
): value is ExecutionLaneFailureClass {
	return EXECUTION_LANE_FAILURE_CLASSES.includes(
		value as ExecutionLaneFailureClass
	);
}

export function isRetryableExecutionLaneFailureClass(
	value: ExecutionLaneFailureClassInput
): boolean {
	switch (normalizeExecutionLaneFailureClass(value)) {
		case 'missing_evidence':
		case 'failing_evidence':
		case 'runtime_failure':
		case 'worker_timeout':
		case 'lease_conflict':
			return true;
		default:
			return false;
	}
}

export function isBlockingExecutionLaneFailureClass(
	value: ExecutionLaneFailureClassInput
): boolean {
	switch (normalizeExecutionLaneFailureClass(value)) {
		case 'policy_blocked':
		case 'approval_denied':
			return true;
		default:
			return false;
	}
}
