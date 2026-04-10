import { describe, expect, it } from 'bun:test';
import { executionLanesCommand } from './index';

describe('execution-lanes command', () => {
	it('exposes direct lane entrypoints', () => {
		expect(executionLanesCommand.commands.map((cmd) => cmd.name())).toEqual([
			'clarify',
			'plan',
			'complete',
			'team',
		]);
	});
});
