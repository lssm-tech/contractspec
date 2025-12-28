import * as vscode from 'vscode';
import { exportToLLM } from './export';
import { generateGuide } from './guide';
import { verifyImplementation } from './verify';
import { copySpecForLLM } from './copy';

export * from './export';
export * from './guide';
export * from './verify';
export * from './copy';
export * from './utils';

/**
 * Register all LLM commands.
 */
export function registerLLMCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry?: {
    sendTelemetryEvent: (name: string, props: Record<string, string>) => void;
  }
): void {
  // Export to LLM
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmExport', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmExport',
      });
      await exportToLLM(outputChannel);
    })
  );

  // Generate implementation guide
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmGuide', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmGuide',
      });
      await generateGuide(outputChannel);
    })
  );

  // Verify implementation
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmVerify', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmVerify',
      });
      await verifyImplementation(outputChannel);
    })
  );

  // Copy spec to clipboard
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.llmCopy',
      async (item?: vscode.TreeItem) => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'llmCopy',
        });
        await copySpecForLLM(outputChannel, item);
      }
    )
  );
}
