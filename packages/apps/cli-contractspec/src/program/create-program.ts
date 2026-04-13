import { Command } from 'commander';
import { GroupedHelp } from './grouped-help';
import { registerInlineCommands } from './inline-commands';
import { registerRootCommands } from './root-commands';
import { resolveCliVersion } from './version';

export function createProgram(): Command {
	const program = new Command();

	program
		.name('contractspec')
		.description(
			'CLI tool for creating, building, and validating contract specifications'
		)
		.version(resolveCliVersion());

	program.createHelp = () => new GroupedHelp();

	registerRootCommands(program, () => program);
	registerInlineCommands(program);

	return program;
}
