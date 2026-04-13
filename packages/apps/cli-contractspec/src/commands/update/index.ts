import {
	createNodeAdapters,
	type SpecFieldPatch,
	updateSpec,
} from '@contractspec/bundle.workspace';
import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { AgentOrchestrator } from '../../ai/agents/index';
import { validateProvider } from '../../ai/providers';
import { loadConfig, mergeConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';
import {
	ensureTrailingNewline,
	stripCode,
} from '../build-cmd/agent-generation';

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
	.action(runUpdateCommand);

interface UpdateCommandOptions {
	field?: string[];
	content?: string;
	ai?: boolean;
	skipValidation?: boolean;
	allowWarnings?: boolean;
	provider?: string;
	model?: string;
	agentMode?: string;
	endpoint?: string;
}

export async function executeUpdateCommand(
	specFile: string,
	options: UpdateCommandOptions
) {
	const baseConfig = await loadConfig();
	const config = mergeConfig(baseConfig, options);
	const adapters = createNodeAdapters({ config });

	console.log(chalk.bold(`\nUpdating spec: ${specFile}\n`));

	let content: string | undefined = options.content;
	let fields: SpecFieldPatch[] | undefined;

	if (options.field) {
		fields = parseFieldPatches(options.field);
		if (fields.length === 0) {
			throw new Error('Invalid --field format. Use key=value pairs.');
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
		content = await applyAiEdit(currentContent, description, config);

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
		throw new Error('Provide --content, --field, or --ai to update the spec.');
	}

	const result = await updateSpec(specFile, adapters, {
		content,
		fields,
		skipValidation: options.skipValidation,
		allowWarnings: options.allowWarnings,
	});

	if (!result.updated) {
		throw new Error(result.errors.join('\n'));
	}

	console.log(chalk.green(`Updated: ${result.specPath}`));
	if (result.warnings.length > 0) {
		for (const w of result.warnings) {
			console.log(chalk.yellow(`  Warning: ${w}`));
		}
	}
}

export async function runUpdateCommand(
	specFile: string,
	options: UpdateCommandOptions
) {
	try {
		await executeUpdateCommand(specFile, options);
	} catch (error) {
		console.error(chalk.red('\nError:'), getErrorMessage(error));
		process.exit(1);
	}
}

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
	currentContent: string,
	description: string,
	config: Awaited<ReturnType<typeof loadConfig>>
): Promise<string> {
	if (config.agentMode === 'simple') {
		const providerStatus = await validateProvider(config);
		if (!providerStatus.success) {
			throw new Error(
				`AI provider unavailable: ${providerStatus.error ?? 'unknown error'}`
			);
		}
	}

	const orchestrator = new AgentOrchestrator(config);
	const result = await orchestrator.refactor(
		[
			'Apply the requested change to the existing ContractSpec source.',
			'Return the full updated TypeScript file only.',
			`Requested change: ${description}`,
		].join('\n\n'),
		currentContent
	);

	if (!result.success || !result.code) {
		throw new Error(
			result.errors?.join('\n') || 'AI edit generation failed to return code.'
		);
	}

	return ensureTrailingNewline(stripCode(result.code));
}
