import {
	type CompletionFailureClassInput,
	type CompletionLoopPhase,
	type ExecutionLaneFailureClass,
	isBlockingExecutionLaneFailureClass,
	isRetryableExecutionLaneFailureClass,
	normalizeExecutionLaneFailureClass,
} from '../../types';

export interface ResolvedCompletionFailure {
	normalized: ExecutionLaneFailureClass;
	phase: Extract<CompletionLoopPhase, 'remediating' | 'blocked' | 'failed'>;
	retryable: boolean;
}

export function resolveCompletionFailure(
	input: CompletionFailureClassInput
): ResolvedCompletionFailure {
	const normalized = normalizeExecutionLaneFailureClass(input);

	if (input === 'fatal') {
		return { normalized, phase: 'failed', retryable: false };
	}
	if (input === 'retryable') {
		return { normalized, phase: 'remediating', retryable: true };
	}
	if (isBlockingExecutionLaneFailureClass(normalized)) {
		return { normalized, phase: 'blocked', retryable: false };
	}
	if (normalized === 'runtime_failure') {
		return { normalized, phase: 'failed', retryable: false };
	}
	if (isRetryableExecutionLaneFailureClass(normalized)) {
		return { normalized, phase: 'remediating', retryable: true };
	}

	return { normalized, phase: 'failed', retryable: false };
}
