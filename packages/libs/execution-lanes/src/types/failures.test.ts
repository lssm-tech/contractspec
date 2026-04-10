import { describe, expect, it } from 'bun:test';
import {
	isBlockingExecutionLaneFailureClass,
	isRetryableExecutionLaneFailureClass,
	normalizeExecutionLaneFailureClass,
} from './failures';

describe('execution lane failure taxonomy', () => {
	it('normalizes legacy aliases to spec-aligned values', () => {
		expect(normalizeExecutionLaneFailureClass('retryable')).toBe(
			'runtime_failure'
		);
		expect(normalizeExecutionLaneFailureClass('blocked')).toBe(
			'policy_blocked'
		);
		expect(normalizeExecutionLaneFailureClass('fatal')).toBe('runtime_failure');
	});

	it('distinguishes retryable and blocking classes', () => {
		expect(isRetryableExecutionLaneFailureClass('worker_timeout')).toBe(true);
		expect(isRetryableExecutionLaneFailureClass('lease_conflict')).toBe(true);
		expect(isBlockingExecutionLaneFailureClass('policy_blocked')).toBe(true);
		expect(isBlockingExecutionLaneFailureClass('approval_denied')).toBe(true);
	});
});
