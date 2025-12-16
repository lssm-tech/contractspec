/**
 * ContractSpec VS Code Extension
 *
 * Provides spec validation, scaffolding, and MCP integration
 * for ContractSpec-powered projects.
 */

import * as vscode from 'vscode';
import { registerCommands } from './commands/index';
import {
  registerDiagnostics,
  registerIntegrityDiagnostics,
} from './diagnostics/index';
import { createTelemetryReporter, TelemetryReporter } from './telemetry/index';
import { createOutputChannel } from './ui/output-channel';
import {
  createWatchStatusBarItem,
  createWorkspaceStatusBarItem,
  updateWorkspaceStatus,
} from './ui/status-bar';
import { disposeWatchMode } from './commands/watch';
import { registerViews } from './views/index';
import { registerIntegrityTree } from './views/integrity-tree';
import { registerFeatureExplorer } from './views/feature-explorer';
import { registerIntegrityCommands } from './commands/integrity';
import {
  formatWorkspaceInfoForDisplay,
  invalidateWorkspaceCache,
} from './workspace/adapters';
import { registerCompletionProviders } from './completion/index';

let telemetryReporter: TelemetryReporter | undefined;
let workspaceStatusBarItem: vscode.StatusBarItem | undefined;

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const outputChannel = createOutputChannel();
  context.subscriptions.push(outputChannel);

  outputChannel.appendLine('ContractSpec extension activating...');

  // Initialize telemetry (respects VS Code telemetry settings)
  telemetryReporter = createTelemetryReporter(context);
  if (telemetryReporter) {
    context.subscriptions.push(telemetryReporter);
    telemetryReporter.sendTelemetryEvent('contractspec.vscode.activated', {
      version: context.extension.packageJSON.version ?? '0.0.0',
    });
  }

  // Create status bar items
  const statusBarItem = createWatchStatusBarItem(context);
  workspaceStatusBarItem = createWorkspaceStatusBarItem(context);

  // Register views
  const views = registerViews(context);

  // Register integrity views
  const integrityProvider = registerIntegrityTree(context);
  const featureProvider = registerFeatureExplorer(context);

  // Register diagnostics (validation on open/save)
  registerDiagnostics(context, outputChannel);

  // Register integrity diagnostics
  const integrityDiagnostics = registerIntegrityDiagnostics(context);

  // Register commands (including workspace info command)
  registerCommands(context, outputChannel, telemetryReporter, statusBarItem);

  // Register integrity commands
  registerIntegrityCommands(context, integrityDiagnostics);

  // Register completion providers for spec names
  registerCompletionProviders(context);

  // Register workspace info command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.workspaceInfo', () => {
      const info = formatWorkspaceInfoForDisplay();
      vscode.window.showInformationMessage('ContractSpec Workspace Info', {
        modal: true,
        detail: info,
      });
    })
  );

  // Watch for workspace changes to update status
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      invalidateWorkspaceCache();
      if (workspaceStatusBarItem) {
        updateWorkspaceStatus(workspaceStatusBarItem);
      }
    })
  );

  outputChannel.appendLine('ContractSpec extension activated');
}

export function deactivate(): void {
  telemetryReporter?.dispose();
  disposeWatchMode();
}
