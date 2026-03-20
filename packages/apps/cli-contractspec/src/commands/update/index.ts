import {
	createNodeAdapters,
	type SpecFieldPatch,
	updateSpec,
} from '@contractspec/bundle.workspace';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { loadConfig, mergeConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';

export const updateCommand = new Command('update')
	.description('Update an existing contract specification')
	.argument('<spec-file>', 'Path to the spec file to update')
	.option(
		'--field <patches...>',
		'Field patches in key=value format (e.g. meta.stability=stable)'
	)
	.option('--content <content>', 'Replace entire spec content')
	.option('--ai', 'Describe the change in natural language and apply via AI')
	.option('--skip-validation', 'Skip post-update validation')
	.option('--allow-warnings', 'Write even when validation produces warnings')
	.action(async (specFile: string, options) => {
		try {
			const config = await loadConfig();
			mergeConfig(config, options);
			const adapters = createNodeAdapters({ config });

			console.log(chalk.bold(`\nUpdating spec: ${specFile}\n`));

			let content: string | undefined = options.content;
			let fields: SpecFieldPatch[] | undefined;

			if (options.field) {
				fields = parseFieldPatches(options.field);
				if (fields.length === 0) {
					console.error(
						chalk.red('Invalid --field format. Use key=value pairs.')
					);
					process.exit(1);
				}
			}

			if (options.ai) {
				const description = await input({
					message: 'Describe the change you want to make:',
				});

				if (!description.trim()) {
					console.log(chalk.yellow('No description provided. Cancelled.'));
					return;
				}

				const currentContent = await adapters.fs.readFile(specFile);
				content = await applyAiEdit(currentContent, description, adapters);

				if (!content) {
					console.log(chalk.yellow('AI edit cancelled.'));
					return;
				}

				const ok = await confirm({
					message: 'Apply the AI-generated changes?',
					default: true,
				});
				if (!ok) {
					console.log(chalk.yellow('Cancelled.'));
					return;
				}
			}

			if (!content && !fields) {
				console.error(
					chalk.red('Provide --content, --field, or --ai to update the spec.')
				);
				process.exit(1);
			}

			const result = await updateSpec(specFile, adapters, {
				content,
				fields,
				skipValidation: options.skipValidation,
				allowWarnings: options.allowWarnings,
			});

			if (result.updated) {
				console.log(chalk.green(`Updated: ${result.specPath}`));
				if (result.warnings.length > 0) {
					for (const w of result.warnings) {
						console.log(chalk.yellow(`  Warning: ${w}`));
					}
				}
			} else {
				console.error(chalk.red('Update failed:'));
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

function parseFieldPatches(raw: string[]): SpecFieldPatch[] {
	const patches: SpecFieldPatch[] = [];
	for (const item of raw) {
		const eqIndex = item.indexOf('=');
		if (eqIndex <= 0) continue;
		patches.push({
			key: item.slice(0, eqIndex).trim(),
			value: item.slice(eqIndex + 1).trim(),
		});
	}
	return patches;
}

/**
 * Placeholder for AI-based spec editing.
 *
 * A full implementation would call the workspace AI generator with
 * the current content and the user description.  For now we return
 * undefined so the caller can abort gracefully.
 */
async function applyAiEdit(
	_currentContent: string,
	_description: string,
	_adapters: ReturnType<typeof createNodeAdapters>
): Promise<string | undefined> {
	console.log(
		chalk.yellow(
			'AI-based editing requires an AI provider. ' +
				'Falling back to manual mode. ' +
				'Use --content or --field instead.'
		)
	);
	return undefined;
}
