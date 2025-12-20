/**
 * Sync command for ContractSpec extension.
 *
 * Synchronizes all specs by building discovered specifications.
 */

import * as vscode from 'vscode';
import {
  getWorkspaceAdapters,
  getWorkspaceConfig,
} from '../workspace/adapters';
import {
  validateSpec,
  buildSpec,
  listSpecs,
} from '@lssm/bundle.contractspec-workspace';

/**
 * Sync all specs in the workspace.
 */
export async function syncAllSpecs(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Syncing all specs ===');
  outputChannel.show(true);

  try {
    // Ask for options
    const validateFirst = await vscode.window.showQuickPick(
      [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      { placeHolder: 'Validate specs before building?' }
    );

    if (validateFirst === undefined) {
      return;
    }

    const adapters = getWorkspaceAdapters();
    const config = await getWorkspaceConfig();

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Syncing ContractSpec files',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Finding specs...' });

        const specs = await listSpecs(adapters);
        outputChannel.appendLine(`Found ${specs.length} spec file(s)`);

        if (specs.length === 0) {
          vscode.window.showInformationMessage('No spec files found');
          return;
        }

        let successCount = 0;
        let failureCount = 0;

        for (let i = 0; i < specs.length; i++) {
          const spec = specs[i];
          const fileName = spec.filePath.split(/[/\\]/).pop() || spec.filePath;

          progress.report({
            message: `[${i + 1}/${specs.length}] ${fileName}`,
            increment: 100 / specs.length,
          });

          outputChannel.appendLine(`\n📋 ${spec.filePath}`);

          try {
            // Validate if requested
            if (validateFirst.value) {
              const validation = await validateSpec(spec.filePath, adapters);
              if (!validation.valid) {
                failureCount++;
                outputChannel.appendLine(
                  `  ❌ Validation failed: ${validation.errors.length} error(s)`
                );
                for (const error of validation.errors) {
                  outputChannel.appendLine(`    • ${error}`);
                }
                continue;
              }
              outputChannel.appendLine('  ✅ Validation passed');
            }

            // Build
            const buildResult = await buildSpec(
              spec.filePath,
              adapters,
              config,
              {
                targets:
                  spec.specType === 'operation'
                    ? ['handler']
                    : spec.specType === 'presentation'
                      ? ['component']
                      : [],
                overwrite: false,
              }
            );

            let hasErrors = false;
            for (const targetResult of buildResult.results) {
              if (targetResult.success) {
                outputChannel.appendLine(
                  `  ✅ Generated: ${targetResult.outputPath}`
                );
              } else if (!targetResult.skipped) {
                hasErrors = true;
                outputChannel.appendLine(
                  `  ❌ Failed ${targetResult.target}: ${targetResult.error}`
                );
              }
            }

            if (hasErrors) {
              failureCount++;
            } else {
              successCount++;
            }
          } catch (error) {
            failureCount++;
            const message =
              error instanceof Error ? error.message : String(error);
            outputChannel.appendLine(`  ❌ Error: ${message}`);
          }
        }

        outputChannel.appendLine('\n=== Summary ===');
        outputChannel.appendLine(`Success: ${successCount}`);
        outputChannel.appendLine(`Failed: ${failureCount}`);

        if (failureCount === 0) {
          vscode.window.showInformationMessage(
            `✅ Sync completed: ${successCount} spec(s) processed`
          );
        } else {
          vscode.window.showWarningMessage(
            `⚠️ Sync completed with failures: ${successCount} succeeded, ${failureCount} failed`
          );
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Sync failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}
