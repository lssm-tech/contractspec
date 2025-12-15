import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, mergeConfig } from './utils/config';
import { createCommand } from './commands/create/index';
import { buildCommand } from './commands/build/index';
import { validateCommand } from './commands/validate/index';
import { testCommand } from './commands/test/index';
import { generateGoldenTestsCommand } from './commands/test/generate';
import { regeneratorCommand } from './commands/regenerator/index';
import { listCommand } from './commands/list/index';
import { watchCommand } from './commands/watch/index';
import { syncCommand } from './commands/sync/index';
import { cleanCommand } from './commands/clean/index';
import { depsCommand } from './commands/deps/index';
import { diffCommand } from './commands/diff/index';
import { registryCommand } from './commands/registry/index';
import { openapiCommand } from './commands/openapi/index';
import { examplesCommand } from './commands/examples/index';
import { workspaceCommand } from './commands/workspace/index';

const program = new Command();

program
  .name('contractspec')
  .description(
    'CLI tool for creating, building, and validating contract specifications'
  )
  .version('0.0.1');

// List command
program.addCommand(listCommand);

// Watch command
program.addCommand(watchCommand);

// Sync command
program.addCommand(syncCommand);

// Clean command
program.addCommand(cleanCommand);

// Deps command
program.addCommand(depsCommand);

// Diff command
program.addCommand(diffCommand);

// Registry command
program.addCommand(registryCommand);

// OpenAPI export command
program.addCommand(openapiCommand);

// Examples command
program.addCommand(examplesCommand);

// Workspace command
program.addCommand(workspaceCommand);

// Create command
program
  .command('create')
  .description('Create a new contract specification')
  .option(
    '-t, --type <type>',
    'Spec type: operation, event, presentation, form, feature, workflow, data-view, migration, telemetry, experiment, app-config, integration, knowledge'
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
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

// Build command
program
  .command('build')
  .description('Generate implementation code from a spec')
  .argument('<spec-file>', 'Path to spec file')
  .option('-o, --output-dir <dir>', 'Output directory (default: ./generated)')
  .option(
    '--provider <provider>',
    'AI provider: claude, openai, ollama, custom'
  )
  .option('--model <model>', 'AI model to use')
  .option(
    '--agent-mode <mode>',
    'Agent mode: simple, cursor, claude-code, openai-codex'
  )
  .option('--no-tests', 'Skip test generation')
  .option('--no-agent', 'Disable AI agent (use basic templates)')
  .action(async (specFile, options) => {
    try {
      const config = await loadConfig();
      const mergedConfig = mergeConfig(config, options);
      await buildCommand(specFile, options, mergedConfig);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description(
    'Validate a contract specification and optionally its implementation'
  )
  .argument('<spec-file>', 'Path to spec file')
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
    'Agent mode for validation: simple, claude-code, openai-codex'
  )
  .option('--check-handlers', 'Verify handler implementations exist')
  .option('--check-tests', 'Verify test coverage')
  .option('-i, --interactive', 'Interactive mode - prompt for what to validate')
  .action(async (specFile, options) => {
    try {
      const config = await loadConfig();
      const mergedConfig = mergeConfig(config, options);
      await validateCommand(specFile, options, mergedConfig);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

const testProgram = program
  .command('test')
  .description('Run TestSpec scenarios against a SpecRegistry')
  .argument('<spec-file>', 'Path to TestSpec file')
  .option(
    '-r, --registry <path>',
    'Path to module exporting a SpecRegistry or factory'
  )
  .option('--json', 'Output JSON results')
  .action(async (specFile, options) => {
    try {
      const config = await loadConfig();
      await testCommand(specFile, options, config);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
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
  .option('--runner-fn <name>', 'Exported runner function name', 'runContract')
  .option('--suite-name <name>', 'Override suite name')
  .option('--framework <name>', 'vitest (default) or jest', 'vitest')
  .option('--from-production', 'Pull snapshots from production database', false)
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
  .action(async (cmdOptions) => {
    try {
      await generateGoldenTestsCommand({
        operation: cmdOptions.operation,
        output: cmdOptions.output,
        runnerImport: cmdOptions.runnerImport,
        runnerFn: cmdOptions.runnerFn,
        suiteName: cmdOptions.suiteName,
        framework: cmdOptions.framework,
        fromProduction: cmdOptions.fromProduction,
        days: cmdOptions.days,
        sampleRate: cmdOptions.sampleRate,
      });
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

// Regenerator command
program
  .command('regenerator')
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
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

// Parse CLI arguments
export function run() {
  program.parse();
}
