/**
 * Agent Commands for ContractSpec VS Code Extension
 *
 * Provides commands for:
 * - Export spec to Agent formats (Claude, OpenCode)
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { loadSpecFromSource } from '@contractspec/module.workspace';
import {
  exportToClaudeAgent,
  exportToOpenCode,
} from '@contractspec/lib.ai-agent/exporters';
import { extractFilePath } from './context-actions';

/**
 * Export current spec to Agent format.
 */
export async function exportAgent(
  outputChannel: vscode.OutputChannel,
  treeItem?: vscode.TreeItem
): Promise<void> {
  // 1. Resolve file
  let specPath = treeItem ? extractFilePath(treeItem) : undefined;
  if (!specPath) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      specPath = editor.document.uri.fsPath;
    }
  }

  if (!specPath) {
    vscode.window.showWarningMessage('No spec file selected or active');
    return;
  }

  try {
    // 2. Load specs
    const specs = await loadSpecFromSource(specPath);
    if (!specs || specs.length === 0) {
      vscode.window.showErrorMessage('No specs found in file');
      return;
    }
    const spec = specs[0]; // Default to first

    // 3. Select Format
    const format = await vscode.window.showQuickPick(
      [
        {
          label: 'Claude Agent SDK',
          description: 'Export for Claude Agent SDK (CLAUDE.md)',
          value: 'claude',
        },
        {
          label: 'OpenCode SDK',
          description: 'Export for OpenCode SDK (agent.json)',
          value: 'opencode',
        },
      ],
      { placeHolder: 'Select Agent Format' }
    );

    if (!format) return;

    // 4. Select Output Directory
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Select Output Directory',
      defaultUri: vscode.Uri.file(path.dirname(specPath)),
    });

    if (!folderUri || folderUri.length === 0) return;
    const outputDir = folderUri[0].fsPath;

    // 5. Export
    outputChannel.appendLine(`Exporting agent to ${outputDir}...`);

    if (format.value === 'claude') {
      const result = exportToClaudeAgent(spec, { generateClaudeMd: true });
      if (result.claudeMd) {
        fs.writeFileSync(path.join(outputDir, 'CLAUDE.md'), result.claudeMd);
        vscode.window.showInformationMessage(
          `Exported CLAUDE.md to ${outputDir}`
        );
      }
    } else if (format.value === 'opencode') {
      const result = exportToOpenCode(spec);
      if (result.agentConfig) {
        fs.writeFileSync(
          path.join(outputDir, 'agent.json'),
          JSON.stringify(result.agentConfig, null, 2)
        );
      }
      if (result.agentMarkdown) {
        fs.writeFileSync(
          path.join(outputDir, `${spec.meta.key}.md`),
          result.agentMarkdown
        );
      }
      vscode.window.showInformationMessage(
        `Exported OpenCode agent to ${outputDir}`
      );
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Agent export failed: ${msg}`);
    outputChannel.appendLine(`Error export agent: ${msg}`);
  }
}

/**
 * Register Agent commands
 */
export function registerAgentCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry?: {
    sendTelemetryEvent: (name: string, props: Record<string, string>) => void;
  }
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.agentExport',
      async (item?: vscode.TreeItem) => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'agentExport',
        });
        await exportAgent(outputChannel, item);
      }
    )
  );
}
