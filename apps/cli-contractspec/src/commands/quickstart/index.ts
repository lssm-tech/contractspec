/**
 * Quickstart command.
 *
 * Installs minimal necessary packages for ContractSpec to work.
 * Supports minimal (core only) and full (with dev tools) modes.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { confirm, select } from '@inquirer/prompts';
import {
  createNodeFsAdapter,
  findWorkspaceRoot,
  formatQuickstartPreview,
  isContractSpecInstalled,
  type QuickstartMode,
  type QuickstartPromptCallbacks,
  runQuickstart,
} from '@contractspec/bundle.workspace';

/**
 * Create CLI prompt callbacks using @inquirer/prompts.
 */
function createCliPrompts(): QuickstartPromptCallbacks {
  return {
    confirm: async (message: string) => {
      return confirm({ message });
    },
    select: async <T extends string>(
      message: string,
      options: { value: T; label: string }[]
    ): Promise<T> => {
      return select({
        message,
        choices: options.map((o) => ({
          value: o.value,
          name: o.label,
        })),
      });
    },
  };
}

export const quickstartCommand = new Command('quickstart')
  .description('Install minimal ContractSpec dependencies')
  .option(
    '--full',
    'Install full set of dependencies (includes CLI and TypeScript)'
  )
  .option('--dry-run', 'Show what would be installed without installing')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--force', 'Reinstall packages even if already installed')
  .action(async (options) => {
    const cwd = process.cwd();
    const workspaceRoot = findWorkspaceRoot(cwd);
    const interactive = !options.yes;

    console.log(chalk.bold('\n🚀 ContractSpec Quickstart\n'));

    // Check if already installed
    const fs = createNodeFsAdapter(cwd);
    const alreadyInstalled = await isContractSpecInstalled(fs, workspaceRoot);

    if (alreadyInstalled && !options.force && !options.dryRun) {
      console.log(chalk.green('✓ ContractSpec is already installed!'));
      console.log(chalk.gray('\n  Use --force to reinstall packages.'));
      console.log(
        chalk.gray('  Run "contractspec doctor" to check your setup.\n')
      );
      return;
    }

    // Determine mode
    let mode: QuickstartMode = options.full ? 'full' : 'minimal';

    // In interactive mode without --full, ask the user
    if (interactive && !options.full) {
      console.log(chalk.gray('Choose installation mode:\n'));
      console.log(chalk.cyan('  Minimal:'), 'Core ContractSpec library + Zod');
      console.log(
        chalk.cyan('  Full:'),
        'Adds CLI, TypeScript, and extended utilities\n'
      );

      const prompts = createCliPrompts();
      mode = await prompts.select('Installation mode:', [
        { value: 'minimal', label: 'Minimal - Just the essentials' },
        { value: 'full', label: 'Full - Complete development setup' },
      ]);
    }

    // Show preview
    console.log(chalk.gray('\n' + formatQuickstartPreview(mode) + '\n'));

    if (options.dryRun) {
      console.log(
        chalk.yellow('Dry run mode - no packages will be installed.\n')
      );
    }

    const spinner = ora('Installing packages...').start();

    try {
      if (interactive && !options.dryRun) {
        spinner.stop();
      }

      const prompts = createCliPrompts();
      const result = await runQuickstart(
        fs,
        {
          workspaceRoot,
          mode,
          dryRun: options.dryRun,
          skipPrompts: !interactive,
          force: options.force,
          verbose: true,
        },
        interactive ? prompts : undefined
      );

      if (!options.dryRun) {
        if (result.success) {
          spinner.succeed('Installation complete!');
        } else {
          spinner.fail('Installation had errors');
        }
      }

      // Show results
      console.log(chalk.bold('\n📋 Results:\n'));

      // Installed packages
      if (result.installed.length > 0) {
        for (const pkg of result.installed) {
          const icon = options.dryRun ? chalk.yellow('○') : chalk.green('✓');
          const devLabel = pkg.dev ? chalk.gray(' (dev)') : '';
          console.log(`  ${icon} ${pkg.name}${devLabel}`);
          console.log(`    ${chalk.dim(pkg.message)}`);
        }
      }

      // Skipped packages
      if (result.skipped.length > 0 && !options.dryRun) {
        console.log(chalk.gray('\n  Skipped (already installed):'));
        for (const pkg of result.skipped) {
          console.log(`    ${chalk.gray('○')} ${pkg.name}`);
        }
      }

      // Errors
      if (result.errors.length > 0) {
        console.log(chalk.red('\n  Errors:'));
        for (const pkg of result.errors) {
          console.log(`    ${chalk.red('✗')} ${pkg.name}: ${pkg.message}`);
        }
      }

      // Summary
      console.log(chalk.bold('\n📊 Summary:\n'));
      console.log(`  ${result.summary}`);

      // Next steps
      if (result.success && !options.dryRun) {
        console.log(chalk.bold('\n🚀 Next steps:\n'));
        console.log(`  1. Create your first spec:`);
        console.log(
          `     ${chalk.cyan('contractspec create command order.create')}`
        );
        console.log(`  2. Validate your specs:`);
        console.log(`     ${chalk.cyan('contractspec validate')}`);
        console.log(`  3. Check your setup:`);
        console.log(`     ${chalk.cyan('contractspec doctor')}`);
        console.log();
      }

      if (!result.success) {
        process.exit(1);
      }
    } catch (error) {
      spinner.fail('Quickstart failed');
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
