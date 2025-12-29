/**
 * Upgrade command.
 *
 * Thin CLI wrapper around the upgrade service from @contractspec/bundle.workspace.
 * This command handles platform-specific concerns (prompts, shell execution)
 * while delegating business logic to the bundle.
 *
 * @module commands/upgrade
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { confirm, select } from '@inquirer/prompts';
import { execSync } from 'node:child_process';
import {
  createNodeFsAdapter,
  createConsoleLoggerAdapter,
  upgrade,
} from '@contractspec/bundle.workspace';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface UpgradeOptions {
  all?: boolean;
  packages?: boolean;
  config?: boolean;
  dryRun?: boolean;
  latest?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Command
// ─────────────────────────────────────────────────────────────────────────────

export const upgradeCommand = new Command('upgrade')
  .description('Upgrade ContractSpec SDK and configuration to latest versions')
  .option('-a, --all', 'Upgrade everything (packages + config)')
  .option('-p, --packages', 'Upgrade SDK packages only')
  .option('-c, --config', 'Upgrade configuration schema only')
  .option('--dry-run', 'Preview changes without applying them')
  .option('--latest', 'Use @latest tag instead of caret range')
  .action(async (options: UpgradeOptions) => {
    const spinner = ora('Analyzing workspace...').start();
    const fs = createNodeFsAdapter();
    const logger = createConsoleLoggerAdapter();
    const workspaceRoot = process.cwd();

    try {
      // Analyze available upgrades using bundle service
      const analysis = await upgrade.analyzeUpgrades(
        { fs, logger },
        { workspaceRoot }
      );

      spinner.succeed(`Detected ${analysis.packageManager} workspace`);

      // Determine what to upgrade
      let upgradePackages = options.packages ?? false;
      let upgradeConfig = options.config ?? false;

      if (options.all) {
        upgradePackages = true;
        upgradeConfig = true;
      }

      // If nothing specified, ask interactively
      if (!upgradePackages && !upgradeConfig) {
        const choice = await select({
          message: 'What would you like to upgrade?',
          choices: [
            { value: 'all', name: 'Everything (packages + config)' },
            { value: 'packages', name: 'SDK packages only' },
            { value: 'config', name: 'Configuration only' },
          ],
        });

        upgradePackages = choice === 'all' || choice === 'packages';
        upgradeConfig = choice === 'all' || choice === 'config';
      }

      // Upgrade packages (requires shell execution)
      if (upgradePackages && analysis.packages.length > 0) {
        await upgradePackagesAction(analysis, options);
      } else if (upgradePackages) {
        console.log(chalk.yellow('\n  No ContractSpec packages found'));
      }

      // Upgrade config (delegates to bundle)
      if (upgradeConfig) {
        const configResult = await upgrade.applyConfigUpgrades(
          { fs, logger },
          { workspaceRoot, dryRun: options.dryRun }
        );

        console.log('');
        console.log(chalk.blue.bold('⚙️  Configuration upgrade:'));
        console.log(`  ${configResult.summary}`);
      }

      console.log('');
      console.log(chalk.green.bold('✓ Upgrade complete!'));

      if (options.dryRun) {
        console.log(chalk.yellow('  (dry run - no changes were made)'));
      }
    } catch (error) {
      spinner.fail('Upgrade failed');
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

// ─────────────────────────────────────────────────────────────────────────────
// Package Upgrade (platform-specific)
// ─────────────────────────────────────────────────────────────────────────────

async function upgradePackagesAction(
  analysis: upgrade.UpgradeAnalysisResult,
  options: UpgradeOptions
): Promise<void> {
  console.log('');
  console.log(chalk.blue.bold('📦 SDK packages:'));

  console.log(`  Found ${analysis.packages.length} ContractSpec package(s):`);
  for (const pkg of analysis.packages) {
    console.log(chalk.gray(`    - ${pkg.name}@${pkg.currentVersion}`));
  }

  if (options.dryRun) {
    console.log(chalk.yellow('  Would upgrade to latest versions'));
    return;
  }

  const shouldProceed = await confirm({
    message: 'Upgrade these packages to latest versions?',
    default: true,
  });

  if (!shouldProceed) {
    console.log(chalk.gray('  Skipped package upgrade'));
    return;
  }

  // Get upgrade command from bundle service
  const updateCmd = upgrade.getPackageUpgradeCommand(
    analysis.packageManager,
    analysis.packages,
    options.latest ?? false
  );

  console.log(chalk.gray(`  Running: ${updateCmd}`));

  try {
    execSync(updateCmd, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    console.log(chalk.green('  ✓ Packages upgraded'));
  } catch {
    console.log(chalk.red('  ✗ Failed to upgrade packages'));
  }
}
