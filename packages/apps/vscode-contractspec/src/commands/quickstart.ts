/**
 * Quickstart command for VS Code extension.
 *
 * Provides an interactive wizard to install ContractSpec dependencies.
 */

import * as vscode from 'vscode';
import {
  runQuickstart,
  formatQuickstartPreview,
  isContractSpecInstalled,
  type QuickstartMode,
  type QuickstartPromptCallbacks,
} from '@lssm/bundle.contractspec-workspace';
import { getWorkspaceAdapters } from '../workspace/adapters';

/**
 * Create VS Code prompt callbacks.
 */
function createVscodePrompts(): QuickstartPromptCallbacks {
  return {
    confirm: async (message: string) => {
      const result = await vscode.window.showInformationMessage(
        message,
        { modal: true },
        'Yes',
        'No'
      );
      return result === 'Yes';
    },
    select: async <T extends string>(
      message: string,
      options: { value: T; label: string }[]
    ): Promise<T> => {
      const items = options.map((o) => ({
        label: o.label,
        value: o.value,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        title: message,
        placeHolder: 'Select an option',
      });

      return selected?.value ?? options[0]?.value ?? ('' as T);
    },
  };
}

/**
 * Run the quickstart wizard.
 */
export async function runQuickstartWizard(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  const workspaceRoot = workspaceFolders[0]?.fsPath;
  if (!workspaceRoot) {
    vscode.window.showWarningMessage('Could not determine workspace root');
    return;
  }

  outputChannel.appendLine('\n=== ContractSpec Quickstart ===');
  outputChannel.show(true);

  try {
    const adapters = getWorkspaceAdapters();

    // Check if already installed
    const alreadyInstalled = await isContractSpecInstalled(
      adapters.fs,
      workspaceRoot
    );

    if (alreadyInstalled) {
      const reinstall = await vscode.window.showInformationMessage(
        'ContractSpec is already installed. Reinstall?',
        'Reinstall',
        'Cancel'
      );

      if (reinstall !== 'Reinstall') {
        outputChannel.appendLine('Quickstart cancelled - already installed');
        return;
      }
    }

    // Select mode
    const modeItems = [
      {
        label: '$(package) Minimal',
        description: 'Core ContractSpec library + Zod',
        value: 'minimal' as QuickstartMode,
      },
      {
        label: '$(tools) Full',
        description: 'Adds CLI, TypeScript, and extended utilities',
        value: 'full' as QuickstartMode,
      },
    ];

    const selectedMode = await vscode.window.showQuickPick(modeItems, {
      title: 'ContractSpec Quickstart',
      placeHolder: 'Select installation mode',
    });

    if (!selectedMode) {
      outputChannel.appendLine('Quickstart cancelled');
      return;
    }

    const mode = selectedMode.value;

    // Show preview
    const preview = formatQuickstartPreview(mode);
    outputChannel.appendLine('\n' + preview);

    // Confirm installation
    const proceed = await vscode.window.showInformationMessage(
      `Install ContractSpec (${mode} mode)?`,
      { modal: true, detail: preview },
      'Install',
      'Cancel'
    );

    if (proceed !== 'Install') {
      outputChannel.appendLine('Installation cancelled');
      return;
    }

    // Run installation with progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Installing ContractSpec dependencies...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0 });

        const prompts = createVscodePrompts();
        const result = await runQuickstart(
          adapters.fs,
          {
            workspaceRoot,
            mode,
            skipPrompts: true, // Already confirmed above
            force: alreadyInstalled, // Reinstall if already installed
          },
          prompts
        );

        progress.report({ increment: 100 });

        // Show results
        outputChannel.appendLine('\n=== Installation Results ===');

        if (result.installed.length > 0) {
          outputChannel.appendLine('\nInstalled:');
          for (const pkg of result.installed) {
            outputChannel.appendLine(`  ✓ ${pkg.name}`);
          }
        }

        if (result.skipped.length > 0) {
          outputChannel.appendLine('\nSkipped (already installed):');
          for (const pkg of result.skipped) {
            outputChannel.appendLine(`  ○ ${pkg.name}`);
          }
        }

        if (result.errors.length > 0) {
          outputChannel.appendLine('\nErrors:');
          for (const pkg of result.errors) {
            outputChannel.appendLine(`  ✗ ${pkg.name}: ${pkg.message}`);
          }
        }

        outputChannel.appendLine('\n' + result.summary);

        // Show result message
        if (result.success) {
          vscode.window.showInformationMessage(
            `ContractSpec installed successfully! ${result.installed.length} package(s) installed.`
          );
        } else {
          vscode.window.showErrorMessage(
            `ContractSpec installation had errors. Check output for details.`
          );
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Quickstart failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Run quick installation with defaults (no prompts).
 */
export async function runQuickInstall(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  const workspaceRoot = workspaceFolders[0]?.fsPath;
  if (!workspaceRoot) {
    vscode.window.showWarningMessage('Could not determine workspace root');
    return;
  }

  try {
    const adapters = getWorkspaceAdapters();

    // Check if already installed
    const alreadyInstalled = await isContractSpecInstalled(
      adapters.fs,
      workspaceRoot
    );

    if (alreadyInstalled) {
      vscode.window.showInformationMessage(
        'ContractSpec is already installed.'
      );
      return;
    }

    // Run installation with progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Installing ContractSpec (minimal)...',
        cancellable: false,
      },
      async () => {
        const result = await runQuickstart(adapters.fs, {
          workspaceRoot,
          mode: 'minimal',
          skipPrompts: true,
        });

        outputChannel.appendLine('\n=== Quick Install ===');
        outputChannel.appendLine(result.summary);
        outputChannel.show(true);

        if (result.success) {
          vscode.window.showInformationMessage(
            'ContractSpec installed successfully!'
          );
        } else {
          vscode.window.showErrorMessage(
            'ContractSpec installation failed. Check output for details.'
          );
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Quick install failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}
