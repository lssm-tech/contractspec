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
              repositoryType: config.repositoryType,
              metaRepo: config.metaRepoInfo
                ? {
                    root: config.metaRepoInfo.root,
                    submodules: config.metaRepoInfo.submodules.map((s) => ({
                      name: s.name,
                      path: s.path,
                      hasWorkspaces: s.hasWorkspaces,
                    })),
                    activeSubmodule: config.metaRepoInfo.activeSubmodule?.name,
                  }
                : undefined,
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
            console.log(
              `  Repository Type: ${chalk.green(info.workspace.repositoryType)}`
            );
            console.log(`  Workspace Root: ${info.workspace.workspaceRoot}`);
            if (info.workspace.isMonorepo) {
              console.log(`  Package Root: ${info.workspace.packageRoot}`);
              console.log(`  Monorepo: ${chalk.green('Yes')}`);
            } else {
              console.log(`  Monorepo: No`);
            }

            // Meta-repo details
            if (info.workspace.metaRepo) {
              console.log();
              console.log(chalk.cyan('Meta-Repo:'));
              console.log(`  Root: ${info.workspace.metaRepo.root}`);
              if (info.workspace.metaRepo.activeSubmodule) {
                console.log(
                  `  Active: ${chalk.green(info.workspace.metaRepo.activeSubmodule)}`
                );
              }
              console.log(
                `  Submodules (${info.workspace.metaRepo.submodules.length}):`
              );
              for (const sub of info.workspace.metaRepo.submodules) {
                const isActive =
                  sub.name === info.workspace.metaRepo.activeSubmodule;
                const marker = isActive ? chalk.green('▸ ') : '  ';
                const wsIndicator = sub.hasWorkspaces
                  ? chalk.dim(' [workspaces]')
                  : '';
                console.log(`    ${marker}${sub.name}${wsIndicator}`);
              }
            }
            console.log();

            // Commands
            console.log(chalk.cyan('Commands:'));
            console.log(`  Run script: ${chalk.dim(info.commands.run)}`);
            console.log(`  Execute: ${chalk.dim(info.commands.exec)}`);
            console.log(`  Install: ${chalk.dim(info.commands.install)}`);
            console.log(
              `  Install (dev): ${chalk.dim(info.commands.installDev)}`
            );
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
  )
  .addCommand(
    new Command('list')
      .description(
        'List available workspaces/submodules (in meta-repo context)'
      )
      .option('--json', 'Output as JSON')
      .action(async (options) => {
        try {
          const cwd = process.cwd();
          const config = await loadConfigWithWorkspace(cwd);

          if (config.repositoryType !== 'meta-repo' || !config.metaRepoInfo) {
            if (options.json) {
              console.log(
                JSON.stringify(
                  { submodules: [], repositoryType: config.repositoryType },
                  null,
                  2
                )
              );
            } else {
              console.log(chalk.yellow('\nNot in a meta-repo context.'));
              console.log(
                chalk.dim(`Repository type: ${config.repositoryType}`)
              );
            }
            return;
          }

          const submodules = config.metaRepoInfo.submodules.map((s) => ({
            name: s.name,
            path: s.path,
            hasWorkspaces: s.hasWorkspaces,
            isActive: s.name === config.metaRepoInfo?.activeSubmodule?.name,
          }));

          if (options.json) {
            console.log(
              JSON.stringify(
                {
                  submodules,
                  activeSubmodule: config.metaRepoInfo.activeSubmodule?.name,
                },
                null,
                2
              )
            );
          } else {
            console.log(chalk.bold('\n📁 Available Workspaces\n'));
            console.log(
              chalk.dim(`Meta-repo root: ${config.metaRepoInfo.root}\n`)
            );

            for (const sub of submodules) {
              const marker = sub.isActive ? chalk.green('▸ ') : '  ';
              const wsIndicator = sub.hasWorkspaces
                ? chalk.dim(' [monorepo]')
                : '';
              const activeIndicator = sub.isActive
                ? chalk.green(' (active)')
                : '';
              console.log(
                `${marker}${sub.name}${wsIndicator}${activeIndicator}`
              );
              console.log(chalk.dim(`    ${sub.path}`));
            }
          }
        } catch (error) {
          console.error(
            chalk.red('\n❌ Error:'),
            error instanceof Error ? error.message : String(error)
          );
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('switch')
      .description('Switch to a different workspace/submodule (meta-repo)')
      .argument(
        '[name]',
        'Submodule name to switch to (optional, interactive if not provided)'
      )
      .option('--open', 'Open the workspace in a new terminal session')
      .action(async (name: string | undefined, options: { open?: boolean }) => {
        try {
          const cwd = process.cwd();
          const config = await loadConfigWithWorkspace(cwd);

          if (config.repositoryType !== 'meta-repo' || !config.metaRepoInfo) {
            console.log(chalk.yellow('\nNot in a meta-repo context.'));
            console.log(chalk.dim(`Repository type: ${config.repositoryType}`));
            return;
          }

          const submodules = config.metaRepoInfo.submodules;

          if (submodules.length === 0) {
            console.log(chalk.yellow('\nNo submodules found in meta-repo.'));
            return;
          }

          const targetSubmodule = name
            ? submodules.find(
                (s) =>
                  s.name === name || s.path === name || s.name.endsWith(name)
              )
            : undefined;

          // If no name provided or not found, show interactive list
          if (!targetSubmodule) {
            if (name) {
              console.log(chalk.yellow(`\nSubmodule "${name}" not found.`));
            }
            console.log(chalk.bold('\n📁 Available Workspaces:\n'));

            submodules.forEach((sub, idx) => {
              const wsIndicator = sub.hasWorkspaces
                ? chalk.dim(' [monorepo]')
                : '';
              const isActive =
                sub.name === config.metaRepoInfo?.activeSubmodule?.name;
              const activeIndicator = isActive ? chalk.green(' (active)') : '';
              console.log(
                `  ${chalk.cyan(String(idx + 1).padStart(2, ' '))}. ${sub.name}${wsIndicator}${activeIndicator}`
              );
              console.log(chalk.dim(`       ${sub.absolutePath}`));
            });

            console.log(
              chalk.dim(
                '\nUsage: contractspec workspace switch <name-or-number>'
              )
            );
            return;
          }

          // Found the target submodule
          const isActive =
            targetSubmodule.name === config.metaRepoInfo.activeSubmodule?.name;
          if (isActive) {
            console.log(
              chalk.green(`\n✓ Already in workspace: ${targetSubmodule.name}`)
            );
            console.log(chalk.dim(`  Path: ${targetSubmodule.absolutePath}`));
            return;
          }

          console.log(
            chalk.bold(
              `\n📂 Switching to workspace: ${chalk.green(targetSubmodule.name)}`
            )
          );
          console.log(chalk.dim(`   Path: ${targetSubmodule.absolutePath}`));

          if (options.open) {
            // Open in new terminal
            const { execSync } = await import('child_process');
            const isMac = process.platform === 'darwin';

            if (isMac) {
              try {
                execSync(`open -a Terminal "${targetSubmodule.absolutePath}"`, {
                  stdio: 'ignore',
                });
                console.log(
                  chalk.green('\n✓ Opened workspace in new terminal window')
                );
              } catch {
                console.log(
                  chalk.yellow(
                    '\n⚠ Could not open terminal. Please cd manually:'
                  )
                );
                console.log(
                  chalk.cyan(`   cd ${targetSubmodule.absolutePath}`)
                );
              }
            } else {
              console.log(chalk.dim('\nTo switch, run:'));
              console.log(chalk.cyan(`   cd ${targetSubmodule.absolutePath}`));
            }
          } else {
            console.log(chalk.dim('\nTo switch, run:'));
            console.log(chalk.cyan(`   cd ${targetSubmodule.absolutePath}`));
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
