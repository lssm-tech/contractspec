/**
 * Fix command handler.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { createNodeAdapters, fix } from '@contractspec/bundle.workspace';
import { promptForStrategy, promptForIssues } from './interactive';
import { parseCiIssues } from './batch-fix';
import type { FixCommandOptions } from './types';
import type {
  FixStrategyType,
  FixableIssue,
} from '@contractspec/bundle.workspace/services/fix/types';

export const fixCommand = new Command('fix')
  .description('Fix integrity issues in contract specs')
  .option('-t, --target <path>', 'Target file or directory to scan', '.')
  .option('--from-ci <file>', 'Fix issues from CI output JSON file')
  .option(
    '--strategy <strategy>',
    'Force a specific fix strategy (e.g., remove-reference, implement-skeleton)'
  )
  .option('--ai', 'Use AI augmentation where possible', false)
  .option('--dry-run', 'Preview changes without writing', false)
  .option('-y, --yes', 'Apply all fixes without prompting', false)
  .action(async (options: FixCommandOptions) => {
    try {
      const adapters = createNodeAdapters({ silent: false });
      const fixService = new fix.FixService(adapters);

      let issuesToFix: fix.FixableIssue[] = [];

      if (options.fromCi) {
        // Mode: Batch fix from CI report
        console.log(
          chalk.blue(`Loading issues from CI report: ${options.fromCi}`)
        );
        issuesToFix = await parseCiIssues(options.fromCi, fixService);
      } else {
        // Mode: Scan and fix
        const target = options.target ?? '.';

        // Use shared logic for determining scan options
        const scanOptions = await fixService.determineScanOptions(target);
        console.log(
          chalk.blue(
            `Scanning for integrity issues in ${scanOptions.cwd || scanOptions.pattern || target}...`
          )
        );

        const fixableItems = await fixService.scanAndGetFixables(scanOptions);

        if (fixableItems.length === 0) {
          console.log(chalk.green('No fixable issues found.'));
          return;
        }

        console.log(
          chalk.yellow(`Found ${fixableItems.length} fixable issues.`)
        );
        issuesToFix = fixableItems;
      }

      // Filter/Select issues
      if (!options.yes && issuesToFix.length > 0) {
        issuesToFix = await promptForIssues(issuesToFix);
      }

      if (issuesToFix.length === 0) {
        console.log('No issues selected to fix.');
        return;
      }

      // Apply fixes
      let successCount = 0;
      let failCount = 0;

      for (const item of issuesToFix) {
        // Use shared strategy resolution logic
        // We pass a 'select' callback for interactive mode
        const strategyType = await fixService.resolveStrategy(item, {
          forceStrategy: options.strategy,
          preferAi: options.ai,
          select: options.yes
            ? undefined
            : async (issue: FixableIssue, strategies: FixStrategyType[]) => {
                return promptForStrategy(issue, strategies);
              },
        });

        if (strategyType) {
          if (options.dryRun) {
            console.log(
              chalk.cyan(
                `[Dry Run] Would apply ${strategyType} to ${item.issue.message}`
              )
            );
            successCount++;
            continue;
          }

          console.log(
            chalk.blue(`Applying ${strategyType} to ${item.issue.message}...`)
          );
          try {
            // We need to construct the options object correctly
            const result = await fixService.fixIssue(item, {
              strategy: strategyType,
              workspaceRoot: process.cwd(), // CLI runs in CWD
              aiConfig: options.ai ? { provider: 'claude' } : undefined, // Default AI config if flag is set
              dryRun: options.dryRun,
            });

            if (result.success) {
              console.log(
                chalk.green(`✔ Fixed: ${result.message || 'Issue resolved'}`)
              );
              successCount++;
            } else {
              console.log(
                chalk.red(
                  `✘ Failed: ${result.error || result.message || 'Unknown error'}`
                )
              );
              failCount++;
            }
          } catch (error) {
            console.log(
              chalk.red(
                `✘ Error: ${error instanceof Error ? error.message : String(error)}`
              )
            );
            failCount++;
          }
        } else {
          console.log(
            chalk.yellow(`⚠ No strategy selected for ${item.issue.message}`)
          );
          failCount++;
        }
      }

      console.log('---');
      console.log(
        chalk.bold(`Fix complete: ${successCount} fixed, ${failCount} failed.`)
      );
    } catch (error) {
      console.error(
        chalk.red(
          `Fatal error: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      process.exit(1);
    }
  });
