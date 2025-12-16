/**
 * Dependency analysis command for ContractSpec extension.
 */

import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
  analyzeDeps,
  getGraphStats,
  exportGraphAsDot,
} from '@lssm/bundle.contractspec-workspace';

/**
 * Analyze spec dependencies in the workspace.
 */
export async function analyzeSpecDependencies(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Spec Dependency Analysis ===');
  outputChannel.show(true);

  try {
    const adapters = getWorkspaceAdapters();
    const result = await analyzeDeps(adapters);

    if (result.total === 0) {
      vscode.window.showInformationMessage('No spec files found in workspace');
      outputChannel.appendLine('No spec files found');
      return;
    }

    const stats = getGraphStats(result.graph);

    outputChannel.appendLine(`\nTotal specs: ${stats.total}`);
    outputChannel.appendLine(`With dependencies: ${stats.withDeps}`);
    outputChannel.appendLine(`Without dependencies: ${stats.withoutDeps}`);
    outputChannel.appendLine(`Used by others: ${stats.used}`);
    outputChannel.appendLine(`Unused (leaf nodes): ${stats.unused}`);

    // Report cycles
    if (result.cycles.length > 0) {
      outputChannel.appendLine(
        `\n⚠️  Circular Dependencies (${result.cycles.length}):`
      );
      for (const cycle of result.cycles) {
        outputChannel.appendLine(`   🔄 ${cycle.join(' → ')} → ${cycle[0]}`);
      }
      vscode.window.showWarningMessage(
        `Found ${result.cycles.length} circular dependency cycle(s)`
      );
    }

    // Report missing dependencies
    if (result.missing.length > 0) {
      outputChannel.appendLine(
        `\n❌ Missing Dependencies (${result.missing.length}):`
      );
      for (const item of result.missing) {
        outputChannel.appendLine(`   ${item.contract}:`);
        for (const dep of item.missing) {
          outputChannel.appendLine(`      → ${dep} (not found)`);
        }
      }
      vscode.window.showWarningMessage(
        `Found ${result.missing.length} spec(s) with missing dependencies`
      );
    }

    // Show dependency graph
    outputChannel.appendLine('\n📊 Dependency Graph:');
    for (const [name, node] of result.graph) {
      if (node.dependencies.length > 0) {
        outputChannel.appendLine(`   ${name}:`);
        for (const dep of node.dependencies) {
          outputChannel.appendLine(`      → ${dep}`);
        }
      }
    }

    // Offer to export as DOT
    const exportDot = await vscode.window.showInformationMessage(
      `Analyzed ${stats.total} specs. Export dependency graph as DOT?`,
      'Export DOT',
      'Close'
    );

    if (exportDot === 'Export DOT') {
      const dotContent = exportGraphAsDot(result.graph);
      const document = await vscode.workspace.openTextDocument({
        content: dotContent,
        language: 'dot',
      });
      await vscode.window.showTextDocument(document);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Error analyzing dependencies: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}


