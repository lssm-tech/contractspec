/**
 * Clean command for ContractSpec extension.
 * 
 * Cleans generated files and build artifacts.
 */

import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';
import * as path from 'path';

interface CleanOptions {
  generatedOnly: boolean;
  dryRun: boolean;
}

/**
 * Clean generated files and artifacts.
 */
export async function cleanGeneratedFiles(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Cleaning generated files ===');
  outputChannel.show(true);

  try {
    // Ask for clean options
    const cleanMode = await vscode.window.showQuickPick(
      [
        { 
          label: 'Generated directories only',
          description: 'Clean generated/, dist/, .turbo/',
          value: { generatedOnly: true, dryRun: false },
        },
        {
          label: 'All generated files',
          description: 'Include handler/component files',
          value: { generatedOnly: false, dryRun: false },
        },
        {
          label: 'Preview (dry run)',
          description: 'Show what would be deleted',
          value: { generatedOnly: false, dryRun: true },
        },
      ],
      { placeHolder: 'What would you like to clean?' }
    );

    if (!cleanMode) {
      return;
    }

    const options = cleanMode.value;

    // Confirm if not dry run
    if (!options.dryRun) {
      const confirm = await vscode.window.showWarningMessage(
        'This will delete generated files. Continue?',
        { modal: true },
        'Yes, delete files'
      );

      if (confirm !== 'Yes, delete files') {
        outputChannel.appendLine('Cancelled');
        return;
      }
    }

    const adapters = getWorkspaceAdapters();
    const workspaceRoot = workspaceFolders[0].uri.fsPath;

    // Define patterns to clean
    const basePatterns = [
      'generated/**',
      'dist/**',
      '.turbo/**',
    ];

    const outputDirPatterns = options.generatedOnly ? [] : [
      'src/handlers/**/*.handler.ts',
      'src/handlers/**/*.handler.test.ts',
      'src/components/**/*.component.tsx',
      'src/components/**/*.component.test.tsx',
      'src/forms/**/*.form.tsx',
      'src/forms/**/*.form.test.tsx',
      '**/*.runner.ts',
      '**/*.renderer.tsx',
    ];

    const patterns = [...basePatterns, ...outputDirPatterns];

    let totalFiles = 0;
    let totalSize = 0;

    if (options.dryRun) {
      outputChannel.appendLine('DRY RUN - No files will be deleted\n');
    }

    for (const pattern of patterns) {
      try {
        const files = await adapters.fs.glob(pattern, {
          cwd: workspaceRoot,
          ignore: ['node_modules/**'],
          absolute: true,
        });

        for (const file of files) {
          try {
            const stats = await adapters.fs.stat(file);
            const relativePath = path.relative(workspaceRoot, file);

            if (options.dryRun) {
              outputChannel.appendLine(
                `Would delete: ${relativePath} (${formatBytes(stats.size)})`
              );
            } else {
              await adapters.fs.remove(file);
              outputChannel.appendLine(
                `🗑️  Deleted: ${relativePath} (${formatBytes(stats.size)})`
              );
            }

            totalFiles++;
            totalSize += stats.size;
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            outputChannel.appendLine(`⚠️  Could not process ${file}: ${message}`);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        outputChannel.appendLine(`⚠️  Error with pattern ${pattern}: ${message}`);
      }
    }

    outputChannel.appendLine('');
    if (options.dryRun) {
      outputChannel.appendLine(
        `📊 Would clean ${totalFiles} file(s) (${formatBytes(totalSize)})`
      );
      vscode.window.showInformationMessage(
        `Preview: ${totalFiles} file(s) would be deleted (${formatBytes(totalSize)})`
      );
    } else {
      outputChannel.appendLine(
        `✅ Cleaned ${totalFiles} file(s) (${formatBytes(totalSize)})`
      );
      vscode.window.showInformationMessage(
        `Cleaned ${totalFiles} file(s) (${formatBytes(totalSize)})`
      );
    }

    if (totalFiles === 0) {
      outputChannel.appendLine('No files to clean');
      vscode.window.showInformationMessage('No files to clean');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Clean failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Format bytes to human-readable string.
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

