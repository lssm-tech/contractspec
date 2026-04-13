import { describe, expect, it } from 'bun:test';
import { resolveValidateImplementationMode } from './index';

describe('validate command interaction mode', () => {
	it('does not prompt unless --interactive is explicitly enabled', () => {
		const mode = resolveValidateImplementationMode(
			{},
			{ stdinTty: true, stdoutTty: true }
		);

		expect(mode.shouldPrompt).toBe(false);
		expect(mode.validateImplementation).toBe(false);
	});

	it('prompts for implementation checks when --interactive is enabled on a TTY', () => {
		const mode = resolveValidateImplementationMode(
			{ interactive: true },
			{ stdinTty: true, stdoutTty: true }
		);

		expect(mode.shouldPrompt).toBe(true);
		expect(mode.validateImplementation).toBe(false);
	});

	it('fails fast when --interactive is requested without a TTY', () => {
		expect(() =>
			resolveValidateImplementationMode(
				{ interactive: true },
				{ stdinTty: false, stdoutTty: false }
			)
		).toThrow('--interactive requires an interactive TTY.');
	});
});
