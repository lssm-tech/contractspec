import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, mergeConfig } from './utils/config.js';
import { createCommand } from './commands/create/index.js';
import { buildCommand } from './commands/build/index.js';
import { validateCommand } from './commands/validate/index.js';

const program = new Command();

program
  .name('contractspec')
  .description('CLI tool for creating, building, and validating contract specifications')
  .version('0.0.1');

// Create command
program
  .command('create')
  .description('Create a new contract specification')
  .option('-t, --type <type>', 'Spec type: operation, event, presentation, form, feature')
  .option('--ai', 'Use AI to generate spec from description')
  .option('--provider <provider>', 'AI provider: claude, openai, ollama, custom')
  .option('--model <model>', 'AI model to use')
  .option('--endpoint <endpoint>', 'Custom endpoint for AI provider')
  .option('-o, --output-dir <dir>', 'Output directory')
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const mergedConfig = mergeConfig(config, options);
      await createCommand(options, mergedConfig);
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Build command
program
  .command('build')
  .description('Generate implementation code from a spec')
  .argument('<spec-file>', 'Path to spec file')
  .option('-o, --output-dir <dir>', 'Output directory (default: ./generated)')
  .option('--provider <provider>', 'AI provider: claude, openai, ollama, custom')
  .option('--model <model>', 'AI model to use')
  .option('--agent-mode <mode>', 'Agent mode: simple, cursor, claude-code, openai-codex')
  .option('--no-tests', 'Skip test generation')
  .option('--no-agent', 'Disable AI agent (use basic templates)')
  .action(async (specFile, options) => {
    try {
      const config = await loadConfig();
      const mergedConfig = mergeConfig(config, options);
      await buildCommand(specFile, options, mergedConfig);
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description('Validate a contract specification and optionally its implementation')
  .argument('<spec-file>', 'Path to spec file')
  .option('--check-implementation', 'Validate implementation against spec using AI')
  .option('--implementation-path <path>', 'Path to implementation file (auto-detected if not specified)')
  .option('--agent-mode <mode>', 'Agent mode for validation: simple, claude-code, openai-codex')
  .option('--check-handlers', 'Verify handler implementations exist')
  .option('--check-tests', 'Verify test coverage')
  .option('-i, --interactive', 'Interactive mode - prompt for what to validate')
  .action(async (specFile, options) => {
    try {
      const config = await loadConfig();
      const mergedConfig = mergeConfig(config, options);
      await validateCommand(specFile, options, mergedConfig);
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Parse CLI arguments
export function run() {
  program.parse();
}

