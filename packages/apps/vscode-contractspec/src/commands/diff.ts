/**
 * Diff command for ContractSpec extension.
 *
 * Compares two spec files and shows differences.
 */

import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';
import { compareSpecs, listSpecs } from '@lssm/bundle.contractspec-workspace';

/**
 * Compare specs and show diff.
 */
export async function compareSpecFiles(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Comparing specs ===');
  outputChannel.show(true);

  try {
    const adapters = getWorkspaceAdapters();

    // Get all specs
    const specs = await listSpecs(adapters);

    if (specs.length < 2) {
      vscode.window.showWarningMessage('Need at least 2 spec files to compare');
      return;
    }

    // Create quick pick items
    const items = specs.map((spec) => ({
      label: spec.name || spec.filePath.split(/[/\\]/).pop() || spec.filePath,
      description: spec.specType,
      detail: spec.filePath,
      spec,
    }));

    // Select first spec
    const first = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select first spec to compare',
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (!first) {
      return;
    }

    // Select second spec (excluding the first)
    const second = await vscode.window.showQuickPick(
      items.filter((item) => item.spec.filePath !== first.spec.filePath),
      {
        placeHolder: 'Select second spec to compare with',
        matchOnDescription: true,
        matchOnDetail: true,
      }
    );

    if (!second) {
      return;
    }

    outputChannel.appendLine(`Comparing:`);
    outputChannel.appendLine(`  1. ${first.spec.filePath}`);
    outputChannel.appendLine(`  2. ${second.spec.filePath}`);

    // Ask for comparison type
    const comparisonType = await vscode.window.showQuickPick(
      [
        {
          label: 'Semantic comparison',
          description: 'Compare spec metadata and structure',
          value: 'semantic',
        },
        {
          label: 'Text diff',
          description: 'Show line-by-line differences',
          value: 'text',
        },
      ],
      { placeHolder: 'How would you like to compare?' }
    );

    if (!comparisonType) {
      return;
    }

    if (comparisonType.value === 'semantic') {
      // Semantic comparison
      const result = await compareSpecs(
        first.spec.filePath,
        second.spec.filePath,
        adapters,
        { breakingOnly: false }
      );

      outputChannel.appendLine(`\n=== Semantic Comparison ===`);
      outputChannel.appendLine(
        `Differences found: ${result.differences.length}\n`
      );

      if (result.differences.length === 0) {
        outputChannel.appendLine('✅ No semantic differences found');
        vscode.window.showInformationMessage('No semantic differences found');
      } else {
        for (const diff of result.differences) {
          const icon =
            diff.type === 'breaking'
              ? '💥'
              : diff.type === 'added'
                ? '➕'
                : diff.type === 'removed'
                  ? '➖'
                  : '✏️';

          outputChannel.appendLine(`${icon} ${diff.path}: ${diff.description}`);
          if (typeof diff.oldValue !== 'undefined') {
            outputChannel.appendLine(`  - ${JSON.stringify(diff.oldValue)}`);
          }
          if (typeof diff.newValue !== 'undefined') {
            outputChannel.appendLine(`  + ${JSON.stringify(diff.newValue)}`);
          }
          outputChannel.appendLine('');
        }

        const breakingCount = result.differences.filter(
          (d) => d.type === 'breaking'
        ).length;

        if (breakingCount > 0) {
          vscode.window.showWarningMessage(
            `Found ${result.differences.length} difference(s), ${breakingCount} breaking`
          );
        } else {
          vscode.window.showInformationMessage(
            `Found ${result.differences.length} non-breaking difference(s)`
          );
        }
      }
    } else {
      // Text diff - use VS Code's built-in diff view
      const uri1 = vscode.Uri.file(first.spec.filePath);
      const uri2 = vscode.Uri.file(second.spec.filePath);

      await vscode.commands.executeCommand(
        'vscode.diff',
        uri1,
        uri2,
        `${first.label} ↔ ${second.label}`
      );

      outputChannel.appendLine('Opened diff view');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Diff failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Compare current spec with another version (git).
 */
export async function compareWithGit(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  const filePath = editor.document.uri.fsPath;

  if (!isSpecFile(filePath)) {
    vscode.window.showWarningMessage('Current file is not a spec file');
    return;
  }

  outputChannel.appendLine(`\n=== Comparing with git: ${filePath} ===`);
  outputChannel.show(true);

  try {
    // Ask for git reference
    const ref = await vscode.window.showInputBox({
      prompt: 'Git reference (branch/commit)',
      placeHolder: 'main',
      value: 'main',
    });

    if (!ref) {
      return;
    }

    const adapters = getWorkspaceAdapters();

    // Compare with git version
    const result = await compareSpecs(filePath, filePath, adapters, {
      baseline: ref,
      breakingOnly: false,
    });

    outputChannel.appendLine(`Comparing with: ${ref}\n`);
    outputChannel.appendLine(
      `Differences found: ${result.differences.length}\n`
    );

    if (result.differences.length === 0) {
      outputChannel.appendLine('✅ No differences from git version');
      vscode.window.showInformationMessage(`No differences from ${ref}`);
    } else {
      for (const diff of result.differences) {
        const icon =
          diff.type === 'breaking'
            ? '💥'
            : diff.type === 'added'
              ? '➕'
              : diff.type === 'removed'
                ? '➖'
                : '✏️';

        outputChannel.appendLine(`${icon} ${diff.path}: ${diff.description}`);
        if (typeof diff.oldValue !== 'undefined') {
          outputChannel.appendLine(`  - ${JSON.stringify(diff.oldValue)}`);
        }
        if (typeof diff.newValue !== 'undefined') {
          outputChannel.appendLine(`  + ${JSON.stringify(diff.newValue)}`);
        }
        outputChannel.appendLine('');
      }

      const breakingCount = result.differences.filter(
        (d) => d.type === 'breaking'
      ).length;

      if (breakingCount > 0) {
        vscode.window.showWarningMessage(
          `Found ${result.differences.length} difference(s) from ${ref}, ${breakingCount} breaking`
        );
      } else {
        vscode.window.showInformationMessage(
          `Found ${result.differences.length} non-breaking difference(s) from ${ref}`
        );
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Git comparison failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Check if a file is a spec file.
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
