/**
 * Vibe pack command.
 *
 * Thin CLI adapter - business logic is in @contractspec/bundle.workspace.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { vibe } from '@contractspec/bundle.workspace';

export const vibePackCommand = new Command('pack')
  .description('Install, list, or manage vibe packs')
  .addCommand(
    new Command('install')
      .description('Install a vibe pack from registry or local path')
      .argument('<source>', 'Pack source (registry: or local path)')
      .action(async (source: string) => {
        console.log(chalk.gray(`Installing pack from: ${source}`));

        const result = await vibe.installPack(source);

        if (!result.success) {
          console.error(
            chalk.red('❌ Pack installation failed:'),
            result.error
          );
          process.exit(1);
        }

        console.log(chalk.green('✅ Pack installed successfully!'));
        console.log(chalk.gray(`Workflows: ${result.workflowsInstalled}`));
        console.log(chalk.gray(`Templates: ${result.templatesInstalled}`));
      })
  )
  .addCommand(
    new Command('list').description('List installed packs').action(async () => {
      const workflows = await vibe.loadWorkflows();
      console.log(chalk.bold('Installed Workflows:'));
      workflows.forEach((w) =>
        console.log(chalk.gray(`  - ${w.id}: ${w.name}`))
      );
    })
  );
