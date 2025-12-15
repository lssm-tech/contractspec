import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfigWithWorkspace } from '../../utils/config';
import { detectRuntime, getRuntimeVersion } from '../../utils/runtime';
import {
  getRunCommand,
  getExecCommand,
  getInstallCommand,
} from '@lssm/bundle.contractspec-workspace';

/**
 * Workspace info command.
 *
 * Displays information about the current workspace, including:
 * - Package manager detection
 * - Monorepo detection
 * - Runtime environment
 * - Configuration locations
 */
export const workspaceCommand = new Command('workspace')
  .description('Workspace information and utilities')
  .addCommand(
    new Command('info')
      .description('Display workspace and environment information')
      .option('--json', 'Output as JSON')
      .action(async (options) => {
        try {
          const cwd = process.cwd();
          const config = await loadConfigWithWorkspace(cwd);
          const runtime = detectRuntime();
          const runtimeVersion = getRuntimeVersion();

          const info = {
            runtime: {
              kind: runtime,
              version: runtimeVersion,
            },
            workspace: {
              packageManager: config.packageManager,
              workspaceRoot: config.workspaceRoot,
              packageRoot: config.packageRoot,
              isMonorepo: config.isMonorepo,
            },
            commands: {
              run: getRunCommand(config.packageManager, '<script>'),
              exec: getExecCommand(config.packageManager, '<command>'),
              install: getInstallCommand(config.packageManager),
              installDev: getInstallCommand(config.packageManager, true),
            },
            config: {
              aiProvider: config.aiProvider,
              agentMode: config.agentMode,
              outputDir: config.outputDir,
            },
          };

          if (options.json) {
            console.log(JSON.stringify(info, null, 2));
          } else {
            console.log(chalk.bold('\n📦 Workspace Information\n'));

            // Runtime
            console.log(chalk.cyan('Runtime:'));
            console.log(`  Kind: ${chalk.green(info.runtime.kind)}`);
            console.log(`  Version: ${info.runtime.version}`);
            console.log();

            // Workspace
            console.log(chalk.cyan('Workspace:'));
            console.log(
              `  Package Manager: ${chalk.green(info.workspace.packageManager)}`
            );
            console.log(`  Workspace Root: ${info.workspace.workspaceRoot}`);
            if (info.workspace.isMonorepo) {
              console.log(`  Package Root: ${info.workspace.packageRoot}`);
              console.log(`  Monorepo: ${chalk.green('Yes')}`);
            } else {
              console.log(`  Monorepo: No`);
            }
            console.log();

            // Commands
            console.log(chalk.cyan('Commands:'));
            console.log(`  Run script: ${chalk.dim(info.commands.run)}`);
            console.log(`  Execute: ${chalk.dim(info.commands.exec)}`);
            console.log(`  Install: ${chalk.dim(info.commands.install)}`);
            console.log(`  Install (dev): ${chalk.dim(info.commands.installDev)}`);
            console.log();

            // Config
            console.log(chalk.cyan('Configuration:'));
            console.log(`  AI Provider: ${info.config.aiProvider}`);
            console.log(`  Agent Mode: ${info.config.agentMode}`);
            console.log(`  Output Dir: ${info.config.outputDir}`);
          }
        } catch (error) {
          console.error(
            chalk.red('\n❌ Error:'),
            error instanceof Error ? error.message : String(error)
          );
          process.exit(1);
        }
      })
  );

