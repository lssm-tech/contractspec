/**
 * Hook command.
 *
 * Thin CLI wrapper around the hooks service from @contractspec/bundle.workspace.
 * Runs git hook checks configured in .contractsrc.json.
 *
 * Usage:
 *   contractspec hook run pre-commit     # Run pre-commit checks
 *   contractspec hook run pre-push       # Run pre-push checks
 *   contractspec hook list               # List available hooks
 *
 * @module commands/hook
 */

import { type Command as CommandType } from 'commander';
import chalk from 'chalk';
import {
  createNodeFsAdapter,
  createConsoleLoggerAdapter,
  hooks,
  findWorkspaceRoot,
} from '@contractspec/bundle.workspace';

/**
 * Register the hook command on the program.
 */
export function registerHookCommand(program: CommandType): void {
  const hookCmd = program
    .command('hook')
    .description('Run git hook checks configured in .contractsrc.json');

  // hook run <hook-name>
  hookCmd
    .command('run <hook-name>')
    .description('Run checks for a specific git hook')
    .option('--dry-run', 'Show commands without executing')
    .action(async (hookName: string, options: { dryRun?: boolean }) => {
      const fs = createNodeFsAdapter();
      const logger = createConsoleLoggerAdapter();
      const workspaceRoot = findWorkspaceRoot(process.cwd());

      console.log(chalk.blue(`Running hook: ${hookName}`));

      const result = await hooks.runHook(
        { fs, logger },
        {
          hookName,
          workspaceRoot,
          dryRun: options.dryRun,
        }
      );

      if (!result.success) {
        console.log(chalk.red(`\n${result.summary}`));
        process.exit(1);
      }

      console.log(chalk.green(`\n${result.summary}`));
    });

  // hook list
  hookCmd
    .command('list')
    .description('List available hooks from configuration')
    .action(async () => {
      const fs = createNodeFsAdapter();
      const logger = createConsoleLoggerAdapter();
      const workspaceRoot = findWorkspaceRoot(process.cwd());

      const availableHooks = await hooks.getAvailableHooks(
        { fs, logger },
        workspaceRoot
      );

      if (availableHooks.length === 0) {
        console.log(chalk.yellow('No hooks configured in .contractsrc.json'));
        console.log(
          chalk.gray('Add a "hooks" section to configure git hooks.')
        );
        return;
      }

      console.log(chalk.bold('Available hooks:'));
      for (const hook of availableHooks) {
        console.log(`  - ${hook}`);
      }
    });
}
