import { describe, expect, it } from 'bun:test';
import { harnessCommand } from './index';

describe('harness command', () => {
	it('exposes eval flags for OSS harness verification', () => {
		expect(harnessCommand.commands.map((command) => command.name())).toEqual([
			'eval',
		]);
		const evaluate = harnessCommand.commands.find(
			(command) => command.name() === 'eval'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--registry'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--scenario'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain('--suite');
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--target-url'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--browser-engine'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--auth-profile'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--update-baselines'
		);
	});
});
