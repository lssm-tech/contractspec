/**
 * Upgrade commands for VSCode extension.
 *
 * Provides upgrade functionality through VSCode commands.
 */

import * as vscode from 'vscode';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { TelemetryReporter } from '../telemetry/index';
import { getWorkspaceAdapters } from '../workspace/adapters';
import { upgrade } from '@contractspec/bundle.workspace';

const execAsync = promisify(exec);

/**
 * Register upgrade commands.
 */
export function registerUpgradeCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry: TelemetryReporter | undefined
): void {
  // Analyze upgrades
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.upgrade.analyze',
      async () => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'upgrade.analyze',
        });
        await analyzeUpgradesCommand(outputChannel);
      }
    )
  );

  // Apply upgrades
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.upgrade.apply', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'upgrade.apply',
      });
      await applyUpgradesCommand(outputChannel);
    })
  );

  // Upgrade config only
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.upgrade.config', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'upgrade.config',
      });
      await upgradeConfigCommand(outputChannel);
    })
  );
}

/**
 * Analyze available upgrades.
 */
async function analyzeUpgradesCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  outputChannel.show();
  outputChannel.appendLine('Analyzing available upgrades...');

  try {
    const adapters = getWorkspaceAdapters();
    const analysis = await upgrade.analyzeUpgrades(
      { fs: adapters.fs, logger: adapters.logger },
      { workspaceRoot: workspaceFolder.uri.fsPath }
    );

    if (!analysis.hasUpgrades) {
      vscode.window.showInformationMessage(
        'ContractSpec is already up to date!'
      );
      outputChannel.appendLine('No upgrades available.');
      return;
    }

    outputChannel.appendLine(`Package manager: ${analysis.packageManager}`);
    outputChannel.appendLine(
      `Packages: ${analysis.packages.length} ContractSpec package(s)`
    );
    outputChannel.appendLine(
      `Config: ${analysis.configUpgrades.length} upgrade(s) available`
    );

    const message = `${analysis.packages.length} package(s) and ${analysis.configUpgrades.length} config upgrade(s) available`;

    const selection = await vscode.window.showInformationMessage(
      message,
      'Upgrade All',
      'Upgrade Config Only',
      'View Details'
    );

    if (selection === 'Upgrade All') {
      await applyUpgradesCommand(outputChannel);
    } else if (selection === 'Upgrade Config Only') {
      await upgradeConfigCommand(outputChannel);
    } else if (selection === 'View Details') {
      outputChannel.appendLine('\n=== Packages ===');
      for (const pkg of analysis.packages) {
        outputChannel.appendLine(`  ${pkg.name}@${pkg.currentVersion}`);
      }
      outputChannel.appendLine('\n=== Config Upgrades ===');
      for (const cfg of analysis.configUpgrades) {
        outputChannel.appendLine(
          `  ${cfg.key}: ${cfg.isNew ? 'NEW' : 'UPDATE'}`
        );
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Upgrade analysis failed: ${msg}`);
    outputChannel.appendLine(`Error: ${msg}`);
  }
}

/**
 * Apply all upgrades (packages + config).
 */
async function applyUpgradesCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const adapters = getWorkspaceAdapters();
  const workspaceRoot = workspaceFolder.uri.fsPath;

  try {
    // Analyze first
    const analysis = await upgrade.analyzeUpgrades(
      { fs: adapters.fs, logger: adapters.logger },
      { workspaceRoot }
    );

    // Upgrade packages if any
    if (analysis.packages.length > 0) {
      const proceed = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: `Upgrade ${analysis.packages.length} package(s)?`,
      });

      if (proceed === 'Yes') {
        const cmd = upgrade.getPackageUpgradeCommand(
          analysis.packageManager,
          analysis.packages,
          false
        );

        outputChannel.appendLine(`Running: ${cmd}`);

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Upgrading packages...',
            cancellable: false,
          },
          async () => {
            try {
              await execAsync(cmd, { cwd: workspaceRoot });
              outputChannel.appendLine('Packages upgraded successfully');
            } catch (error) {
              outputChannel.appendLine(
                `Package upgrade failed: ${error instanceof Error ? error.message : String(error)}`
              );
            }
          }
        );
      }
    }

    // Upgrade config
    const configResult = await upgrade.applyConfigUpgrades(
      { fs: adapters.fs, logger: adapters.logger },
      { workspaceRoot }
    );

    outputChannel.appendLine(configResult.summary);

    vscode.window.showInformationMessage('ContractSpec upgrade complete!');
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Upgrade failed: ${msg}`);
    outputChannel.appendLine(`Error: ${msg}`);
  }
}

/**
 * Upgrade configuration only.
 */
async function upgradeConfigCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  outputChannel.show();
  outputChannel.appendLine('Upgrading configuration...');

  try {
    const adapters = getWorkspaceAdapters();
    const result = await upgrade.applyConfigUpgrades(
      { fs: adapters.fs, logger: adapters.logger },
      { workspaceRoot: workspaceFolder.uri.fsPath }
    );

    outputChannel.appendLine(result.summary);

    if (result.success && result.configSectionsUpgraded > 0) {
      vscode.window.showInformationMessage(
        `Configuration upgraded: ${result.configSectionsUpgraded} section(s)`
      );
    } else if (result.success) {
      vscode.window.showInformationMessage(
        'Configuration is already up to date'
      );
    } else {
      vscode.window.showErrorMessage(`Upgrade failed: ${result.error}`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Config upgrade failed: ${msg}`);
    outputChannel.appendLine(`Error: ${msg}`);
  }
}
