/**
 * Setup command for ContractSpec extension.
 *
 * Provides an interactive wizard to set up ContractSpec in a project.
 * Supports monorepos with package-level or workspace-level configuration.
 */

import * as vscode from 'vscode';
import {
  ALL_SETUP_TARGETS,
  findPackageRoot,
  findWorkspaceRoot,
  getPackageName,
  isMonorepo,
  runSetup,
  SETUP_TARGET_LABELS,
  type SetupPromptCallbacks,
  type SetupScope,
  type SetupTarget,
} from '@contractspec/bundle.workspace';
import { getWorkspaceAdapters } from '../workspace/adapters';

/**
 * Get VS Code icon for each target.
 */
function getTargetIcon(target: SetupTarget): string {
  switch (target) {
    case 'cli-config':
      return '$(terminal)';
    case 'vscode-settings':
      return '$(settings-gear)';
    case 'mcp-cursor':
      return '$(extensions)';
    case 'mcp-claude':
      return '$(comment-discussion)';
    case 'cursor-rules':
      return '$(law)';
    case 'agents-md':
      return '$(robot)';
    default:
      return '$(file)';
  }
}

/**
 * Create VS Code prompt callbacks.
 *
 * For scope selection (single choice), uses single-select quick pick.
 */
function createVscodePrompts(): SetupPromptCallbacks {
  return {
    confirm: async (message: string) => {
      const result = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: message,
      });
      return result === 'Yes';
    },
    multiSelect: async <T extends string>(
      message: string,
      options: { value: T; label: string; selected?: boolean }[]
    ): Promise<T[]> => {
      // Special handling for scope selection (single choice)
      if (message.includes('Configure at which level')) {
        const items = options.map((o) => ({
          label: o.label,
          value: o.value,
        }));

        const selected = await vscode.window.showQuickPick(items, {
          placeHolder: message,
          canPickMany: false,
        });

        return selected ? [selected.value] : [];
      }

      const items = options.map((o) => ({
        label: o.label,
        picked: o.selected !== false,
        value: o.value,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: message,
        canPickMany: true,
      });

      if (!selected) {
        return [];
      }

      return selected.map((s) => s.value);
    },
    input: async (message: string, defaultValue?: string) => {
      const result = await vscode.window.showInputBox({
        prompt: message,
        value: defaultValue,
      });
      return result ?? defaultValue ?? '';
    },
  };
}

/**
 * Run the ContractSpec setup wizard.
 */
export async function runSetupWizard(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  outputChannel.appendLine('\n=== ContractSpec Setup ===');
  outputChannel.show(true);

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const cwd = workspaceFolders[0].uri.fsPath;

  // Detect workspace structure
  const workspaceRoot = findWorkspaceRoot(cwd);
  const packageRoot = findPackageRoot(cwd);
  const monorepo = isMonorepo(workspaceRoot);
  const packageName = monorepo ? getPackageName(packageRoot) : undefined;

  // Show monorepo info
  if (monorepo) {
    outputChannel.appendLine('📦 Monorepo detected');
    outputChannel.appendLine(`   Workspace root: ${workspaceRoot}`);
    if (packageRoot !== workspaceRoot) {
      outputChannel.appendLine(`   Package root:   ${packageRoot}`);
      if (packageName) {
        outputChannel.appendLine(`   Package name:   ${packageName}`);
      }
    }
  }

  try {
    // Step 0: Ask for scope if in monorepo
    let scope: SetupScope | undefined;
    if (monorepo && packageRoot !== workspaceRoot) {
      const scopeItems = [
        {
          label: `$(package) Package level (${packageName ?? packageRoot})`,
          description: 'Create config files in current package',
          value: 'package' as SetupScope,
        },
        {
          label: '$(root-folder) Workspace level',
          description: 'Create config files at workspace root',
          value: 'workspace' as SetupScope,
        },
      ];

      const selectedScope = await vscode.window.showQuickPick(scopeItems, {
        placeHolder: 'Monorepo detected. Configure at which level?',
      });

      if (!selectedScope) {
        outputChannel.appendLine('Setup cancelled by user');
        return;
      }

      scope = selectedScope.value;
      outputChannel.appendLine(`Selected scope: ${scope}`);
    }

    // Step 1: Select targets
    const targetItems = ALL_SETUP_TARGETS.map((target) => ({
      label: `${getTargetIcon(target)} ${SETUP_TARGET_LABELS[target]}`,
      description: target,
      picked: true,
      value: target,
    }));

    const selectedItems = await vscode.window.showQuickPick(targetItems, {
      placeHolder: 'Select components to configure',
      canPickMany: true,
    });

    if (!selectedItems || selectedItems.length === 0) {
      outputChannel.appendLine('Setup cancelled by user');
      return;
    }

    const selectedTargets = selectedItems.map((item) => item.value);
    outputChannel.appendLine(`Selected targets: ${selectedTargets.join(', ')}`);

    // Step 2: Get project name
    const defaultName =
      scope === 'package' && packageName
        ? packageName
        : (workspaceRoot.split('/').pop() ?? 'my-project');
    const projectName = await vscode.window.showInputBox({
      prompt: 'Project name',
      value: defaultName,
      placeHolder: 'Enter project name',
    });

    if (projectName === undefined) {
      outputChannel.appendLine('Setup cancelled by user');
      return;
    }

    // Step 3: Run setup with progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Setting up ContractSpec...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Configuring...' });

        const adapters = getWorkspaceAdapters();
        const prompts = createVscodePrompts();

        const result = await runSetup(
          adapters.fs,
          {
            workspaceRoot,
            packageRoot: monorepo ? packageRoot : undefined,
            isMonorepo: monorepo,
            scope,
            packageName,
            interactive: true,
            targets: selectedTargets,
            projectName,
          },
          prompts
        );

        // Log results
        outputChannel.appendLine('\n--- Results ---');
        for (const file of result.files) {
          const icon =
            file.action === 'created'
              ? '✓'
              : file.action === 'merged'
                ? '↔'
                : file.action === 'skipped'
                  ? '○'
                  : '✗';
          outputChannel.appendLine(`${icon} ${file.filePath}`);
          outputChannel.appendLine(`  ${file.action}: ${file.message}`);
        }

        // Show summary
        const created = result.files.filter(
          (f) => f.action === 'created'
        ).length;
        const merged = result.files.filter((f) => f.action === 'merged').length;
        const skipped = result.files.filter(
          (f) => f.action === 'skipped'
        ).length;
        const errors = result.files.filter((f) => f.action === 'error').length;

        outputChannel.appendLine('\n--- Summary ---');
        outputChannel.appendLine(
          `Created: ${created}, Merged: ${merged}, Skipped: ${skipped}, Errors: ${errors}`
        );

        if (result.success) {
          const action = await vscode.window.showInformationMessage(
            `ContractSpec setup complete! ${created + merged} files configured.`,
            'Create First Spec',
            'View Output'
          );

          if (action === 'Create First Spec') {
            await vscode.commands.executeCommand('contractspec.create');
          } else if (action === 'View Output') {
            outputChannel.show();
          }
        } else {
          vscode.window.showErrorMessage(
            `ContractSpec setup completed with ${errors} errors. Check output for details.`
          );
          outputChannel.show();
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Setup failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Quick setup with defaults (no prompts).
 *
 * In monorepo, defaults to package level if in a subpackage.
 */
export async function runQuickSetup(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  outputChannel.appendLine('\n=== ContractSpec Quick Setup ===');
  outputChannel.show(true);

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const cwd = workspaceFolders[0].uri.fsPath;

  // Detect workspace structure
  const workspaceRoot = findWorkspaceRoot(cwd);
  const packageRoot = findPackageRoot(cwd);
  const monorepo = isMonorepo(workspaceRoot);
  const packageName = monorepo ? getPackageName(packageRoot) : undefined;

  // Default to package level if in a subpackage
  const scope: SetupScope =
    monorepo && packageRoot !== workspaceRoot ? 'package' : 'workspace';

  const defaultName =
    scope === 'package' && packageName
      ? packageName
      : (workspaceRoot.split('/').pop() ?? 'my-project');

  if (monorepo) {
    outputChannel.appendLine('📦 Monorepo detected');
    outputChannel.appendLine(`   Using ${scope} scope`);
  }

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Setting up ContractSpec with defaults...',
        cancellable: false,
      },
      async () => {
        const adapters = getWorkspaceAdapters();

        const result = await runSetup(adapters.fs, {
          workspaceRoot,
          packageRoot: monorepo ? packageRoot : undefined,
          isMonorepo: monorepo,
          scope,
          packageName,
          interactive: false,
          targets: ALL_SETUP_TARGETS,
          projectName: defaultName,
        });

        // Log results
        for (const file of result.files) {
          outputChannel.appendLine(`${file.action}: ${file.filePath}`);
        }

        const created = result.files.filter(
          (f) => f.action === 'created'
        ).length;
        const merged = result.files.filter((f) => f.action === 'merged').length;

        if (result.success) {
          vscode.window.showInformationMessage(
            `ContractSpec configured! ${created + merged} files ready.`
          );
        } else {
          const errors = result.files.filter(
            (f) => f.action === 'error'
          ).length;
          vscode.window.showWarningMessage(
            `Setup completed with ${errors} issues. Check output.`
          );
          outputChannel.show();
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Setup failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}
