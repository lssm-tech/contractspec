import { describe, expect, it } from 'bun:test';

import {
	parseActorType,
	parseApprovalStatus,
	parseIntOption,
	toDecisionListInput,
} from './options';

describe('control-plane option parsing', () => {
	it('rejects invalid limit values', () => {
		expect(() => parseIntOption('abc')).toThrow('Invalid integer value');
	});

	it('rejects invalid date filters', () => {
		expect(() => toDecisionListInput({ createdAfter: 'not-a-date' })).toThrow(
			'Invalid ISO date value'
		);
	});

	it('rejects invalid actor types and approval statuses', () => {
		expect(() => parseActorType('robot')).toThrow('Invalid actor type');
		expect(() => parseApprovalStatus('queued')).toThrow(
			'Invalid approval status'
		);
	});
});
