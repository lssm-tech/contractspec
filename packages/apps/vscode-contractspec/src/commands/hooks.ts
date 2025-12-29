/**
 * Hooks commands for VSCode extension.
 *
 * Provides hook execution functionality through VSCode commands.
 */

import * as vscode from 'vscode';
import type { TelemetryReporter } from '../telemetry/index';
import { getWorkspaceAdapters } from '../workspace/adapters';
import { hooks, findWorkspaceRoot } from '@contractspec/bundle.workspace';

/**
 * Register hooks commands.
 */
export function registerHooksCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry: TelemetryReporter | undefined
): void {
  // Run a hook
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.hooks.run', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'hooks.run',
      });
      await runHookCommand(outputChannel);
    })
  );

  // List available hooks
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.hooks.list', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'hooks.list',
      });
      await listHooksCommand(outputChannel);
    })
  );
}

/**
 * Run a hook command.
 */
async function runHookCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const adapters = getWorkspaceAdapters();
  const workspaceRoot = findWorkspaceRoot(workspaceFolder.uri.fsPath);

  // Get available hooks
  const availableHooks = await hooks.getAvailableHooks(
    { fs: adapters.fs, logger: adapters.logger },
    workspaceRoot
  );

  if (availableHooks.length === 0) {
    vscode.window.showWarningMessage(
      'No hooks configured in .contractsrc.json'
    );
    return;
  }

  // Let user pick a hook
  const hookName = await vscode.window.showQuickPick(availableHooks, {
    placeHolder: 'Select a hook to run',
  });

  if (!hookName) return;

  outputChannel.show();
  outputChannel.appendLine(`Running hook: ${hookName}`);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Running ${hookName} checks...`,
      cancellable: false,
    },
    async () => {
      const result = await hooks.runHook(
        { fs: adapters.fs, logger: adapters.logger },
        {
          hookName,
          workspaceRoot,
        }
      );

      // Log command results
      for (const cmdResult of result.commandResults) {
        const icon = cmdResult.success ? '✓' : '✗';
        outputChannel.appendLine(`  ${icon} ${cmdResult.command}`);
        if (cmdResult.stdout) {
          outputChannel.appendLine(cmdResult.stdout);
        }
        if (!cmdResult.success && cmdResult.stderr) {
          outputChannel.appendLine(cmdResult.stderr);
        }
      }

      outputChannel.appendLine(`\n${result.summary}`);

      if (result.success) {
        vscode.window.showInformationMessage(
          `Hook ${hookName}: All checks passed`
        );
      } else {
        vscode.window.showErrorMessage(`Hook ${hookName}: Some checks failed`);
      }
    }
  );
}

/**
 * List available hooks.
 */
async function listHooksCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const adapters = getWorkspaceAdapters();
  const workspaceRoot = findWorkspaceRoot(workspaceFolder.uri.fsPath);

  const availableHooks = await hooks.getAvailableHooks(
    { fs: adapters.fs, logger: adapters.logger },
    workspaceRoot
  );

  if (availableHooks.length === 0) {
    vscode.window.showWarningMessage(
      'No hooks configured. Add a "hooks" section to .contractsrc.json'
    );
    return;
  }

  outputChannel.show();
  outputChannel.appendLine('Available hooks:');
  for (const hook of availableHooks) {
    outputChannel.appendLine(`  - ${hook}`);
  }

  vscode.window.showInformationMessage(
    `${availableHooks.length} hook(s) configured: ${availableHooks.join(', ')}`
  );
}
