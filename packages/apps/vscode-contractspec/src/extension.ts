/**
 * ContractSpec VS Code Extension
 *
 * Provides spec validation, scaffolding, and MCP integration
 * for ContractSpec-powered projects.
 */

import * as vscode from 'vscode';
import { registerCommands } from './commands/index';
import { registerDiagnostics } from './diagnostics/index';
import { createTelemetryReporter, TelemetryReporter } from './telemetry/index';
import { createOutputChannel } from './ui/output-channel';

let telemetryReporter: TelemetryReporter | undefined;

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

  // Register commands
  registerCommands(context, outputChannel, telemetryReporter);

  // Register diagnostics (validation on open/save)
  registerDiagnostics(context, outputChannel);

  outputChannel.appendLine('ContractSpec extension activated');
}

export function deactivate(): void {
  telemetryReporter?.dispose();
}
