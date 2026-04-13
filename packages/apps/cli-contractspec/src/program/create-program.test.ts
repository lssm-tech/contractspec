import { describe, expect, it } from 'bun:test';
import { createProgram } from './create-program';

describe('createProgram', () => {
	it('drops apply from the public root surface', () => {
		const program = createProgram();
		expect(program.commands.map((command) => command.name())).not.toContain(
			'apply'
		);
	});

	it('exposes the expanded create target list and agent summary', () => {
		const program = createProgram();
		const createCommand = program.commands.find(
			(command) => command.name() === 'create'
		);
		const agentCommand = program.commands.find(
			(command) => command.name() === 'agent'
		);

		expect(createCommand?.helpInformation()).toContain('module-bundle');
		expect(createCommand?.helpInformation()).toContain('builder-spec');
		expect(createCommand?.helpInformation()).toContain('provider-spec');
		expect(agentCommand?.description()).toBe(
			'Export agent specs to external agent runtimes'
		);
	});

	it('updates build/generate/validate help to the new authoring model', () => {
		const program = createProgram();
		const buildCommand = program.commands.find(
			(command) => command.name() === 'build'
		);
		const generateCommand = program.commands.find(
			(command) => command.name() === 'generate'
		);
		const validateCommand = program.commands.find(
			(command) => command.name() === 'validate'
		);

		expect(buildCommand?.description()).toContain(
			'Materialize runtime artifacts'
		);
		expect(generateCommand?.description()).toContain('derived artifacts');
		expect(validateCommand?.description()).toContain('package scaffolds');
	});
});
