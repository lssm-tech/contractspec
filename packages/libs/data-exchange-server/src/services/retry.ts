import type { RetryDecision } from '../types';

export function classifyRetryDecision(input: {
	status?: number;
	error?: unknown;
	attempt?: number;
	baseDelayMs?: number;
}): RetryDecision {
	const baseDelayMs = input.baseDelayMs ?? 1_000;
	const attempt = input.attempt ?? 0;

	if (typeof input.status === 'number') {
		if ([408, 425, 429].includes(input.status) || input.status >= 500) {
			return {
				retryable: true,
				reason: `HTTP ${input.status} is retryable.`,
				nextDelayMs: baseDelayMs * 2 ** attempt,
			};
		}
		return {
			retryable: false,
			reason: `HTTP ${input.status} is not retryable.`,
		};
	}

	if (input.error instanceof Error) {
		const message = input.error.message.toLowerCase();
		if (
			message.includes('timeout') ||
			message.includes('temporar') ||
			message.includes('reset')
		) {
			return {
				retryable: true,
				reason: `Transient error detected: ${input.error.message}`,
				nextDelayMs: baseDelayMs * 2 ** attempt,
			};
		}
	}

	return {
		retryable: false,
		reason: 'No retry classification matched.',
	};
}
