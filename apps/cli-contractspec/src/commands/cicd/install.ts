/**
 * CICD install command.
 *
 * Installs GitHub Actions workflow for ContractSpec CI/CD.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { checkbox, confirm, input, select } from '@inquirer/prompts';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { generateWorkflow, type WorkflowConfig } from './templates';

const WORKFLOW_PATH = '.github/workflows/contractspec.yml';

export const installCommand = new Command('install')
  .description('Install GitHub Actions workflow for ContractSpec')
  .option('-y, --yes', 'Use defaults, skip prompts', false)
  .option('--validate-only', 'Only run validation (no impact detection)', false)
  .option('--impact-only', 'Only run impact detection', false)
  .option('-d, --directory <dir>', 'Working directory', '.')
  .action(async (options) => {
    const cwd = process.cwd();
    const workflowPath = resolve(cwd, WORKFLOW_PATH);

    console.log(chalk.bold('\n🔧 ContractSpec CI/CD Setup\n'));

    // Check if workflow already exists
    if (existsSync(workflowPath)) {
      console.log(chalk.yellow('⚠️  Workflow already exists:'), workflowPath);

      if (!options.yes) {
        const overwrite = await confirm({
          message: 'Overwrite existing workflow?',
          default: false,
        });

        if (!overwrite) {
          console.log(
            chalk.gray('Skipped. Use doctor to check existing workflow.')
          );
          return;
        }
      } else {
        console.log(chalk.gray('Overwriting (--yes mode)'));
      }
    }

    // Build config
    const config: Partial<WorkflowConfig> = {
      workingDirectory: options.directory,
    };

    // Determine mode
    if (options.validateOnly) {
      config.mode = 'validate';
    } else if (options.impactOnly) {
      config.mode = 'impact';
    } else if (!options.yes) {
      const mode = await select({
        message: 'What checks do you want to run?',
        choices: [
          {
            value: 'both',
            name: 'Both validation and impact detection (recommended)',
          },
          {
            value: 'validate',
            name: 'Validation only (structure, integrity, deps)',
          },
          { value: 'impact', name: 'Impact detection only (breaking changes)' },
        ],
        default: 'both',
      });
      config.mode = mode as WorkflowConfig['mode'];
    } else {
      config.mode = 'both';
    }

    // Interactive configuration
    if (!options.yes) {
      // Select checks for validate mode
      if (config.mode === 'validate' || config.mode === 'both') {
        const checks = await checkbox({
          message: 'Select validation checks to run:',
          choices: [
            { value: 'structure', name: 'Structure validation', checked: true },
            { value: 'integrity', name: 'Integrity checks', checked: true },
            { value: 'deps', name: 'Dependency analysis', checked: true },
            { value: 'doctor', name: 'Health checks', checked: true },
            {
              value: 'handlers',
              name: 'Handler implementation',
              checked: false,
            },
            { value: 'tests', name: 'Test coverage', checked: false },
          ],
        });

        config.checks = checks.length > 0 ? checks : ['all'];

        const failOnWarnings = await confirm({
          message: 'Fail on warnings (not just errors)?',
          default: false,
        });
        config.failOnWarnings = failOnWarnings;

        const uploadSarif = await confirm({
          message: 'Upload results to GitHub Code Scanning?',
          default: true,
        });
        config.uploadSarif = uploadSarif;
      }

      // Impact detection options
      if (config.mode === 'impact' || config.mode === 'both') {
        const prComment = await confirm({
          message: 'Post impact results as PR comment?',
          default: true,
        });
        config.prComment = prComment;

        const failOnBreaking = await confirm({
          message: 'Fail CI if breaking changes detected?',
          default: true,
        });
        config.failOnBreaking = failOnBreaking;
      }

      // Working directory
      if (options.directory === '.') {
        const customDir = await input({
          message: 'Working directory (. for root):',
          default: '.',
        });
        config.workingDirectory = customDir;
      }
    }

    // Generate and write workflow
    const spinner = ora('Generating workflow...').start();

    try {
      const content = generateWorkflow(config);

      // Ensure directory exists
      const dir = dirname(workflowPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      writeFileSync(workflowPath, content, 'utf-8');

      spinner.succeed('Workflow created!');

      console.log(chalk.green(`\n✅ Created: ${WORKFLOW_PATH}`));
      console.log();

      // Show summary
      console.log(chalk.bold('📋 Configuration:'));
      console.log(`  Mode: ${chalk.cyan(config.mode ?? 'both')}`);
      if (config.checks) {
        console.log(`  Checks: ${chalk.cyan(config.checks.join(', '))}`);
      }
      if (config.mode === 'impact' || config.mode === 'both') {
        console.log(
          `  PR Comments: ${chalk.cyan(config.prComment ? 'yes' : 'no')}`
        );
        console.log(
          `  Fail on Breaking: ${chalk.cyan(config.failOnBreaking ? 'yes' : 'no')}`
        );
      }
      console.log();

      // Next steps
      console.log(chalk.bold('🚀 Next steps:'));
      console.log(
        `  1. Review the generated workflow: ${chalk.cyan(WORKFLOW_PATH)}`
      );
      console.log(`  2. Commit and push to trigger CI`);
      console.log(
        `  3. Run ${chalk.cyan('contractspec cicd doctor')} to verify setup`
      );
      console.log();
    } catch (error) {
      spinner.fail('Failed to create workflow');
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
