/**
 * Vibe context command.
 *
 * Thin CLI adapter - business logic is in @contractspec/bundle.workspace.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { vibe } from '@contractspec/bundle.workspace';

export const vibeContextCommand = new Command('context')
  .description('Export or manage context bundles for AI')
  .addCommand(
    new Command('export')
      .description('Export safe context for AI agents')
      .action(async () => {
        const result = await vibe.exportContext();

        if (!result.success) {
          console.error(chalk.red('❌ Context export failed:'), result.error);
          process.exit(1);
        }

        console.log(chalk.green('✅ Context exported successfully!'));
        console.log(chalk.gray(`Files: ${result.files.length}`));
        console.log(chalk.gray(`Index: ${result.indexPath}`));
      })
  )
  .addCommand(
    new Command('list')
      .description('List files that will be exported')
      .action(async () => {
        const config = await vibe.loadVibeConfig();
        console.log(chalk.bold('Context Export Allowlist:'));
        if (config.contextExportAllowlist.length === 0) {
          console.log(
            chalk.gray(
              '  (default: README.md, package.json, contracts/**/*.ts)'
            )
          );
        } else {
          config.contextExportAllowlist.forEach((p) =>
            console.log(chalk.gray(`  - ${p}`))
          );
        }
      })
  )
  .addCommand(
    new Command('config')
      .description('Interactive allowlist configuration')
      .action(async () => {
        const action = await select({
          message: 'What would you like to do?',
          choices: [
            { name: 'View current allowlist', value: 'view' },
            { name: 'Add patterns', value: 'add' },
            { name: 'Reset to defaults', value: 'reset' },
          ],
        });

        console.log(
          chalk.gray(
            `Selected: ${action} - This feature is not yet implemented.`
          )
        );
      })
  );
