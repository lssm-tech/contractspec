import { createNodeAdapters, deleteSpec } from '@contractspec/bundle.workspace';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { loadConfig, mergeConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';

export const deleteCommand = new Command('delete')
	.description('Delete a contract specification and optionally its artifacts')
	.argument('<spec-file>', 'Path to the spec file to delete')
	.option('--force', 'Skip confirmation prompt')
	.option('--clean', 'Also remove generated handlers, tests, and components')
	.action(async (specFile: string, options) => {
		try {
			const config = await loadConfig();
			mergeConfig(config, options);
			const adapters = createNodeAdapters({ config });

			const exists = await adapters.fs.exists(specFile);
			if (!exists) {
				console.error(chalk.red(`Spec file not found: ${specFile}`));
				process.exit(1);
			}

			const code = await adapters.fs.readFile(specFile);
			console.log(chalk.bold(`\nSpec: ${specFile}`));
			console.log(chalk.gray(`Size: ${code.length} bytes`));

			if (options.clean) {
				console.log(
					chalk.yellow(
						'With --clean: generated artifacts referencing this spec will also be removed.'
					)
				);
			}

			if (!options.force) {
				if (!process.stdout.isTTY) {
					console.error(
						chalk.red(
							'Refusing to delete without --force in non-interactive mode.'
						)
					);
					process.exit(1);
				}

				const ok = await confirm({
					message: `Delete ${specFile}${options.clean ? ' and its generated artifacts' : ''}?`,
					default: false,
				});
				if (!ok) {
					console.log(chalk.yellow('Cancelled.'));
					return;
				}
			}

			const result = await deleteSpec(specFile, adapters, {
				clean: options.clean,
			});

			if (result.deleted) {
				console.log(chalk.green(`Deleted: ${result.specPath}`));
				if (result.cleanedFiles.length > 0) {
					console.log(
						chalk.green(`Cleaned ${result.cleanedFiles.length} artifact(s):`)
					);
					for (const f of result.cleanedFiles) {
						console.log(chalk.gray(`  ${f}`));
					}
				}
			} else {
				console.error(chalk.red('Delete failed:'));
				for (const e of result.errors) {
					console.error(chalk.red(`  ${e}`));
				}
				process.exit(1);
			}
		} catch (error) {
			console.error(chalk.red('\nError:'), getErrorMessage(error));
			process.exit(1);
		}
	});
