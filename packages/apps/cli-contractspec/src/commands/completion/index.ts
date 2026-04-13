import chalk from 'chalk';
import { Argument, Command } from 'commander';
import {
	COMPLETION_COMMAND_NAME,
	COMPLETION_SHELLS,
	type CompletionShell,
	INTERNAL_COMPLETE_COMMAND_NAME,
	isCompletionShell,
} from './constants';
import { installCompletionScript } from './install';
import { resolveCompletionCandidates } from './resolver';
import { createCompletionScript } from './scripts';

interface CompletionCommandSet {
	internalCommand: Command;
	publicCommand: Command;
}

export function createCompletionCommands(
	getProgram: () => Command
): CompletionCommandSet {
	return {
		internalCommand: createInternalCompletionCommand(getProgram),
		publicCommand: createPublicCompletionCommand(getProgram),
	};
}

function createPublicCompletionCommand(getProgram: () => Command): Command {
	return new Command(COMPLETION_COMMAND_NAME)
		.description(
			'Generate and install shell completion for the contractspec CLI'
		)
		.addCommand(
			new Command('script')
				.addArgument(
					new Argument('<shell>', 'Shell name: bash, zsh, or fish').choices(
						COMPLETION_SHELLS
					)
				)
				.action((shell) => {
					const normalizedShell = assertShell(shell);
					process.stdout.write(createCompletionScript(normalizedShell));
				})
		)
		.addCommand(
			new Command('install')
				.addArgument(
					new Argument('<shell>', 'Shell name: bash, zsh, or fish').choices(
						COMPLETION_SHELLS
					)
				)
				.option(
					'--write-profile',
					'Append an idempotent source block to the shell profile'
				)
				.action(async (shell, options: { writeProfile?: boolean }) => {
					const normalizedShell = assertShell(shell);
					const result = await installCompletionScript({
						shell: normalizedShell,
						script: createCompletionScript(normalizedShell),
						writeProfile: options.writeProfile,
					});

					console.log(
						chalk.green(`Installed ${normalizedShell} completion:`),
						result.scriptPath
					);

					if (result.profileUpdated && result.profilePath) {
						console.log(
							chalk.green('Updated shell profile:'),
							result.profilePath
						);
					} else {
						console.log(
							chalk.yellow('Profile not modified. Run this manually:')
						);
						console.log(result.sourceCommand);
					}

					console.log(
						chalk.dim(
							`Reload your shell or run ${result.sourceCommand} to activate completions now.`
						)
					);
				})
		)
		.addHelpText(
			'after',
			`\nUse ${getProgram().name()} ${COMPLETION_COMMAND_NAME} script <shell> for manual setup.`
		);
}

function createInternalCompletionCommand(getProgram: () => Command): Command {
	return new Command(INTERNAL_COMPLETE_COMMAND_NAME)
		.description('Internal command used by generated shell completion scripts')
		.helpOption(false)
		.allowUnknownOption()
		.allowExcessArguments()
		.argument('[tokens...]', 'Tokens to complete')
		.action(async (tokens: string[]) => {
			const suggestions = await resolveCompletionCandidates(
				getProgram(),
				tokens
			);
			process.stdout.write(suggestions.join('\n'));
		});
}

function assertShell(shell: string): CompletionShell {
	if (!isCompletionShell(shell)) {
		throw new Error(
			`Unsupported shell '${shell}'. Expected one of: ${COMPLETION_SHELLS.join(', ')}.`
		);
	}

	return shell;
}
