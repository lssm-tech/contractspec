import { describe, expect, it } from 'bun:test';
import { createLaneSelector } from './selector';

describe('createLaneSelector', () => {
	it('defaults post-plan execution to the persistent completion lane', () => {
		const selector = createLaneSelector();

		expect(selector.select({ hasPlanPack: true })).toBe('complete.persistent');
		expect(
			selector.select({
				hasPlanPack: true,
				parallelizableTaskCount: 4,
			})
		).toBe('team.coordinated');
	});
});
