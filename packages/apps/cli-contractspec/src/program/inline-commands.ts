import { getAuthoringTargetDefinitions } from '@contractspec/module.workspace';
import chalk from 'chalk';
import { Command } from 'commander';
import { buildCommand } from '../commands/build-cmd/index';
import { createCommand } from '../commands/create/index';
import { validateCommand } from '../commands/validate/index';
import { loadConfig, mergeConfig } from '../utils/config';
import {
	CATEGORY_DEVELOPMENT,
	CATEGORY_ESSENTIALS,
	CATEGORY_OPERATIONS,
	CATEGORY_TESTING,
	withCategory,
} from './categories';
import {
	createRegeneratorCommand,
	createTestCommand,
} from './test-regenerator-commands';

export function registerInlineCommands(program: Command): void {
	const createCommandDefinition = withCategory(
		createCreateCommand(),
		CATEGORY_ESSENTIALS
	);
	const buildCommandDefinition = withCategory(
		createBuildCommand(),
		CATEGORY_DEVELOPMENT
	);
	const validateCommandDefinition = withCategory(
		createValidateCommand(),
		CATEGORY_DEVELOPMENT
	);
	const testCommandDefinition = withCategory(
		createTestCommand(),
		CATEGORY_TESTING
	);
	const regeneratorCommandDefinition = withCategory(
		createRegeneratorCommand(),
		CATEGORY_OPERATIONS
	);

	program.addCommand(createCommandDefinition);
	program.addCommand(buildCommandDefinition);
	program.addCommand(validateCommandDefinition);
	program.addCommand(testCommandDefinition);
	program.addCommand(regeneratorCommandDefinition);
}

function createCreateCommand(): Command {
	return new Command('create')
		.description('Author a new ContractSpec target or package scaffold')
		.option(
			'-t, --type <type>',
			`Spec type: ${getAuthoringTargetDefinitions()
				.map((definition) => definition.id)
				.join(', ')}`
		)
		.option('--ai', 'Use AI to generate spec from description')
		.option(
			'--provider <provider>',
			'AI provider: claude, openai, ollama, custom'
		)
		.option('--model <model>', 'AI model to use')
		.option('--endpoint <endpoint>', 'Custom endpoint for AI provider')
		.option('-o, --output-dir <dir>', 'Output directory')
		.action(async (options) => {
			try {
				const config = await loadConfig();
				const mergedConfig = mergeConfig(config, options);
				await createCommand(options, mergedConfig);
			} catch (error) {
				reportCommandError(error);
			}
		});
}

function createBuildCommand(): Command {
	return new Command('build')
		.description(
			'Materialize runtime artifacts or package scaffolds from an authored target'
		)
		.argument('<spec-file>', 'Path to spec file')
		.option('-o, --output-dir <dir>', 'Output directory (default: ./generated)')
		.option(
			'--provider <provider>',
			'AI provider: claude, openai, ollama, custom'
		)
		.option('--model <model>', 'AI model to use')
		.option(
			'--agent-mode <mode>',
			'Agent mode: simple, cursor, claude-code, openai-codex, opencode'
		)
		.option('--no-tests', 'Skip test generation')
		.option('--no-agent', 'Disable AI agent (use basic templates)')
		.action(async (specFile, options) => {
			try {
				const config = await loadConfig();
				const mergedConfig = mergeConfig(config, options);
				await buildCommand(specFile, options, mergedConfig);
			} catch (error) {
				reportCommandError(error);
			}
		});
}

function createValidateCommand(): Command {
	return new Command('validate')
		.description(
			'Validate authored targets, package scaffolds, and runtime implementations'
		)
		.argument('[spec-files]', 'Path to spec files (defaults to workspace scan)')
		.option(
			'--blueprint <path>',
			'Path to AppBlueprintSpec module for validation'
		)
		.option(
			'--tenant-config <path>',
			'Path to TenantAppConfig file for validation (requires --blueprint)'
		)
		.option(
			'--connections <paths...>',
			'Paths to modules or JSON files exporting IntegrationConnection entries'
		)
		.option(
			'--integration-registrars <paths...>',
			'Modules that register integration specs (supporting optional #exportName)'
		)
		.option(
			'--translation-catalog <path>',
			'Path to a blueprint translation catalog JSON/module'
		)
		.option(
			'--check-implementation',
			'Validate implementation against spec using AI'
		)
		.option(
			'--implementation-path <path>',
			'Path to implementation file (auto-detected if not specified)'
		)
		.option(
			'--agent-mode <mode>',
			'Agent mode for validation: simple, claude-code, openai-codex, opencode'
		)
		.option('--check-handlers', 'Verify handler implementations exist')
		.option('--check-tests', 'Verify test coverage')
		.option(
			'-i, --interactive',
			'Interactive mode - prompt for what to validate'
		)
		.action(async (specFile: string, options) => {
			try {
				const config = await loadConfig();
				const mergedConfig = mergeConfig(config, options);
				await validateCommand(specFile, options, mergedConfig);
			} catch (error) {
				reportCommandError(error);
			}
		});
}

function reportCommandError(error: unknown): never {
	console.error(
		chalk.red('\n❌ Error:'),
		error instanceof Error ? error.message : String(error)
	);
	process.exit(1);
}
