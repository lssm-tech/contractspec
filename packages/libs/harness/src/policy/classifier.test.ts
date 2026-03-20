import { describe, expect, it } from 'bun:test';
import {
	classifyHarnessStep,
	HARNESS_POLICY_REPLAY_FIXTURES,
} from './classifier';

describe('classifyHarnessStep', () => {
	for (const fixture of HARNESS_POLICY_REPLAY_FIXTURES) {
		it(`matches fixture: ${fixture.name}`, () => {
			const result = classifyHarnessStep({
				scenario: fixture.scenario as never,
				step: fixture.scenario.steps[0] as never,
			});
			expect(result.verdict).toBe(fixture.expected.verdict);
			expect(result.requiresApproval).toBe(fixture.expected.requiresApproval);
		});
	}

	it('blocks undeclared action classes', () => {
		const result = classifyHarnessStep({
			scenario: {
				target: {},
				allowedModes: ['deterministic-browser'],
				steps: [],
			} as never,
			step: {
				key: 'x',
				description: 'bad',
				actionClass: 'unknown',
				intent: 'bad',
			} as never,
		});

		expect(result.verdict).toBe('blocked');
	});
});
