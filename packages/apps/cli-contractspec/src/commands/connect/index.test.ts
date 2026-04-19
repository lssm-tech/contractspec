import { describe, expect, it } from 'bun:test';
import { connectCommand } from './index';
import { connectErrorExitCode, exitCodeForVerdict } from './io';

describe('connect command', () => {
	it('exposes the implemented subcommand family', () => {
		expect(connectCommand.commands.map((command) => command.name())).toEqual([
			'init',
			'context',
			'plan',
			'verify',
			'adoption',
			'hook',
			'review',
			'replay',
			'eval',
		]);
		expect(
			connectCommand.commands
				.find((command) => command.name() === 'review')
				?.commands.map((command) => command.name())
		).toEqual(['list', 'sync']);
	});

	it('keeps operator-facing flags for context, verify, and eval flows', () => {
		const context = connectCommand.commands.find(
			(command) => command.name() === 'context'
		);
		const verify = connectCommand.commands.find(
			(command) => command.name() === 'verify'
		);
		const hook = connectCommand.commands.find(
			(command) => command.name() === 'hook'
		);
		const adoption = connectCommand.commands.find(
			(command) => command.name() === 'adoption'
		);
		const evaluate = connectCommand.commands.find(
			(command) => command.name() === 'eval'
		);

		expect(context?.options.map((option) => option.long)).toContain('--paths');
		expect(verify?.options.map((option) => option.long)).toContain('--tool');
		expect(verify?.options.map((option) => option.long)).toContain('--stdin');
		expect(
			hook?.commands
				.find((command) => command.name() === 'contracts-spec')
				?.commands.map((command) => command.name())
		).toEqual([
			'before-file-edit',
			'before-shell-execution',
			'after-file-edit',
		]);
		expect(adoption?.commands.map((command) => command.name())).toEqual([
			'sync',
			'resolve',
		]);
		expect(
			hook?.commands
				.find((command) => command.name() === 'adoption')
				?.commands.map((command) => command.name())
		).toEqual([
			'before-file-edit',
			'before-shell-execution',
			'after-file-edit',
		]);
		expect(evaluate?.description()).toContain('Run harness evaluation');
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--registry'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain(
			'--scenario'
		);
		expect(evaluate?.options.map((option) => option.long)).toContain('--suite');
		expect(
			connectCommand.commands
				.find((command) => command.name() === 'review')
				?.commands.find((command) => command.name() === 'sync')
				?.options.map((option) => option.long)
		).toContain('--decision');
		expect(
			connectCommand.commands
				.find((command) => command.name() === 'review')
				?.commands.find((command) => command.name() === 'sync')
				?.options.map((option) => option.long)
		).toContain('--all');
		expect(
			connectCommand.commands
				.find((command) => command.name() === 'init')
				?.options.map((option) => option.long)
		).toContain('--gitignore');
		expect(
			connectCommand.commands
				.find((command) => command.name() === 'init')
				?.options.map((option) => option.long)
		).toContain('--no-gitignore');
	});

	it('maps verdicts and configuration/runtime errors to the documented exit codes', () => {
		expect(exitCodeForVerdict('permit')).toBe(0);
		expect(exitCodeForVerdict('rewrite')).toBe(10);
		expect(exitCodeForVerdict('require_review')).toBe(20);
		expect(exitCodeForVerdict('deny')).toBe(30);
		expect(connectErrorExitCode(new Error('Connect is not enabled.'))).toBe(40);
		expect(connectErrorExitCode(new Error('No stored Connect decision.'))).toBe(
			40
		);
		expect(connectErrorExitCode(new Error('generic failure'))).toBe(1);
	});
});
