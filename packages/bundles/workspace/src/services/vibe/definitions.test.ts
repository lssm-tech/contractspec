import { describe, expect, it } from 'bun:test';
import { builtinWorkflows } from './definitions';

describe('builtinWorkflows', () => {
	it('uses generate instead of the retired apply command', () => {
		const commands = builtinWorkflows.flatMap((workflow) =>
			workflow.steps.map((step) => step.command).filter(Boolean)
		);

		for (const command of commands) {
			expect(command).not.toContain('contractspec apply');
		}
		expect(commands).toContain('contractspec generate');
	});
});
