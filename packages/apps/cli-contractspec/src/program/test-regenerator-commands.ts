import chalk from 'chalk';
import { Command } from 'commander';
import { regeneratorCommand } from '../commands/regenerator/index';
import { generateGoldenTestsCommand } from '../commands/test/generate';
import { testCommand } from '../commands/test/index';
import { loadConfig, mergeConfig } from '../utils/config';

export function createTestCommand(): Command {
	const testProgram = new Command('test')
		.argument('<specFile>')
		.description('Run test specs')
		.option('-r, --registry <path>', 'Path to registry module')
		.option('-j, --json', 'Output results as JSON')
		.option('-g, --generate', 'Generate tests using AI')
		.option('-l, --list', 'List available tests')
		.action(async (specFile, options) => {
			try {
				const config = await loadConfig();
				await testCommand(specFile, options, config);
			} catch (error) {
				console.error(
					chalk.red('Error running tests:'),
					error instanceof Error ? error.message : String(error)
				);
				process.exit(1);
			}
		});

	testProgram
		.command('generate')
		.description('Generate golden tests from captured traffic')
		.requiredOption(
			'-o, --operation <name>',
			'Operation name, e.g. billing.createInvoice'
		)
		.requiredOption('-O, --output <path>', 'Destination test file')
		.requiredOption(
			'--runner-import <path>',
			'Module path that exports the runner function used in generated tests'
		)
		.option(
			'--runner-fn <name>',
			'Exported runner function name',
			'runContract'
		)
		.option('--suite-name <name>', 'Override suite name')
		.option('--framework <name>', 'vitest (default) or jest', 'vitest')
		.option(
			'--from-production',
			'Pull snapshots from production database',
			false
		)
		.option(
			'--days <number>',
			'Lookback window in days',
			(value) => Number(value),
			7
		)
		.option(
			'--sample-rate <number>',
			'Sample subset of traffic (0-1)',
			(value) => Number(value),
			1
		)
		.action(async (options) => {
			try {
				await generateGoldenTestsCommand({
					days: options.days,
					framework: options.framework,
					fromProduction: options.fromProduction,
					operation: options.operation,
					output: options.output,
					runnerFn: options.runnerFn,
					runnerImport: options.runnerImport,
					sampleRate: options.sampleRate,
					suiteName: options.suiteName,
				});
			} catch (error) {
				reportCommandError(error);
			}
		});

	return testProgram;
}

export function createRegeneratorCommand(): Command {
	return new Command('regenerator')
		.description('Operate the Regenerator daemon')
		.argument('<blueprint-file>', 'Path to AppBlueprintSpec file')
		.argument('<tenant-file>', 'Path to TenantAppConfig file')
		.argument('<rules-file>', 'Path to module exporting regenerator rules')
		.argument(
			'<sink-file>',
			'Path to module exporting a proposal sink (use "auto" with --executor)'
		)
		.option(
			'-p, --poll-interval <ms>',
			'Polling interval in ms (default 60000)',
			(value) => Number.parseInt(value, 10)
		)
		.option(
			'-b, --batch-duration <ms>',
			'Lookback duration in ms (default 300000)',
			(value) => Number.parseInt(value, 10)
		)
		.option('--once', 'Run a single evaluation cycle then exit')
		.option(
			'--contexts <path>',
			'Optional file exporting an array of RegenerationContext overrides'
		)
		.option(
			'--executor <path>',
			'Module exporting a ProposalExecutor instance, factory, or deps (required when sink is "auto")'
		)
		.option(
			'--dry-run',
			'Execute proposals in dry-run mode when using executor sink'
		)
		.action(async (blueprintPath, tenantPath, rulesPath, sinkPath, options) => {
			try {
				const config = await loadConfig();
				const mergedConfig = mergeConfig(config, options);
				await regeneratorCommand(
					blueprintPath,
					tenantPath,
					rulesPath,
					sinkPath,
					options,
					mergedConfig
				);
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
