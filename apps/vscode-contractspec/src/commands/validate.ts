/**
 * Validation commands for ContractSpec extension.
 */

import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
  listSpecs,
  validateSpec,
  validateSpecs,
} from '@contractspec/bundle.workspace';

/**
 * Validate the currently active spec file.
 */
export async function validateCurrentSpec(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  const document = editor.document;
  const filePath = document.uri.fsPath;

  if (!isSpecFile(filePath)) {
    vscode.window.showWarningMessage(
      'Current file is not a ContractSpec file. Expected extensions: .contracts.ts, .event.ts, .presentation.ts, etc.'
    );
    return;
  }

  outputChannel.appendLine(`\nValidating: ${filePath}`);
  outputChannel.show(true);

  try {
    const adapters = getWorkspaceAdapters();
    const result = await validateSpec(filePath, adapters);

    if (result.valid) {
      vscode.window.showInformationMessage(
        `✅ Spec validation passed: ${getFileName(filePath)}`
      );
      outputChannel.appendLine('✅ Validation passed');

      if (result.warnings.length > 0) {
        outputChannel.appendLine(`\nWarnings (${result.warnings.length}):`);
        for (const warning of result.warnings) {
          outputChannel.appendLine(`  ⚠️  ${warning}`);
        }
      }
    } else {
      vscode.window.showErrorMessage(
        `❌ Spec validation failed: ${result.errors.length} error(s)`
      );
      outputChannel.appendLine(`\n❌ Validation failed`);
      outputChannel.appendLine(`\nErrors (${result.errors.length}):`);
      for (const error of result.errors) {
        outputChannel.appendLine(`  ❌ ${error}`);
      }

      if (result.warnings.length > 0) {
        outputChannel.appendLine(`\nWarnings (${result.warnings.length}):`);
        for (const warning of result.warnings) {
          outputChannel.appendLine(`  ⚠️  ${warning}`);
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Validation error: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Validate all spec files in the workspace.
 */
export async function validateWorkspace(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Validating all specs in workspace ===');
  outputChannel.show(true);

  try {
    const adapters = getWorkspaceAdapters();

    // Find all spec files
    const specs = await listSpecs(adapters);

    if (specs.length === 0) {
      vscode.window.showInformationMessage('No spec files found in workspace');
      outputChannel.appendLine('No spec files found');
      return;
    }

    outputChannel.appendLine(`Found ${specs.length} spec file(s)\n`);

    // Validate all specs
    const specPaths = specs.map((s) => s.filePath);
    const results = await validateSpecs(specPaths, adapters);

    let passedCount = 0;
    let failedCount = 0;
    let totalWarnings = 0;

    for (const [filePath, result] of results) {
      const fileName = getFileName(filePath);

      if (result.valid) {
        passedCount++;
        outputChannel.appendLine(`✅ ${fileName}`);
        if (result.warnings.length > 0) {
          totalWarnings += result.warnings.length;
          for (const warning of result.warnings) {
            outputChannel.appendLine(`   ⚠️  ${warning}`);
          }
        }
      } else {
        failedCount++;
        outputChannel.appendLine(`❌ ${fileName}`);
        for (const error of result.errors) {
          outputChannel.appendLine(`   ❌ ${error}`);
        }
        if (result.warnings.length > 0) {
          totalWarnings += result.warnings.length;
          for (const warning of result.warnings) {
            outputChannel.appendLine(`   ⚠️  ${warning}`);
          }
        }
      }
    }

    outputChannel.appendLine('\n=== Summary ===');
    outputChannel.appendLine(`Passed: ${passedCount}`);
    outputChannel.appendLine(`Failed: ${failedCount}`);
    outputChannel.appendLine(`Warnings: ${totalWarnings}`);

    if (failedCount === 0) {
      vscode.window.showInformationMessage(
        `✅ All ${passedCount} spec(s) passed validation`
      );
    } else {
      vscode.window.showErrorMessage(
        `❌ ${failedCount} of ${results.size} spec(s) failed validation`
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Validation error: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Check if a file is a ContractSpec file.
 */
function isSpecFile(filePath: string): boolean {
  const specExtensions = [
    '.contracts.ts',
    '.event.ts',
    '.presentation.ts',
    '.workflow.ts',
    '.data-view.ts',
    '.migration.ts',
    '.telemetry.ts',
    '.experiment.ts',
    '.app-config.ts',
    '.integration.ts',
    '.knowledge.ts',
  ];

  return specExtensions.some((ext) => filePath.endsWith(ext));
}

/**
 * Get just the file name from a path.
 */
function getFileName(filePath: string): string {
  return filePath.split(/[/\\]/).pop() ?? filePath;
}
