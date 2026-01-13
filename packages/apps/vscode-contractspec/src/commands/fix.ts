import * as vscode from 'vscode';
import { createNodeAdapters, fix } from '@contractspec/bundle.workspace';

// Create adapters for the fix service
// We use node adapters since the extension host runs in Node
const adapters = createNodeAdapters({});

let fixService: fix.FixService | undefined;

async function getFixService(): Promise<fix.FixService> {
  if (!fixService) {
    const nodeAdapters = await adapters;
    fixService = new fix.FixService(nodeAdapters);
  }
  return fixService;
}

/**
 * Apply a fix strategy to an issue.
 */
export async function applyFix(
  issue: fix.FixableIssue,
  strategyType: fix.FixStrategyType
): Promise<void> {
  const service = await getFixService();

  try {
    const result = await service.fixIssue(issue, {
      strategy: strategyType,
      workspaceRoot: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
    });

    if (result.success) {
      vscode.window.showInformationMessage(`Fixed: ${result.message}`);

      // Refresh integrity after fix
      vscode.commands.executeCommand('contractspec.refreshIntegrity');
    } else {
      vscode.window.showErrorMessage(`Fix failed: ${result.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Error applying fix: ${message}`);
  }
}

/**
 * Register fix commands.
 */
export function registerFixCommands(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.fixIssue',
      (issue: fix.FixableIssue, strategyType: fix.FixStrategyType) => {
        return applyFix(issue, strategyType);
      }
    )
  );
}
