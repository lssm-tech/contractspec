/**
 * Workspace switching commands for meta-repo support.
 */

import * as vscode from 'vscode';
import {
  getMetaRepoInfo,
  getRepositoryType,
  getSubmodules,
  getActiveSubmodule,
  invalidateWorkspaceCache,
} from '../workspace/adapters';

/**
 * Show workspace selector for meta-repo.
 *
 * Displays a Quick Pick with available submodules/workspaces
 * and opens the selected one in a new window or same window.
 */
export async function showWorkspaceSelector(): Promise<void> {
  const repoType = getRepositoryType();

  if (repoType !== 'meta-repo') {
    vscode.window.showInformationMessage(
      `Not in a meta-repo context. Repository type: ${repoType}`
    );
    return;
  }

  const submodules = getSubmodules();
  if (submodules.length === 0) {
    vscode.window.showWarningMessage('No submodules found in meta-repo.');
    return;
  }

  const activeSubmodule = getActiveSubmodule();

  const items: vscode.QuickPickItem[] = submodules.map((sub) => ({
    label: sub.name,
    description: sub.path,
    detail: sub.hasWorkspaces
      ? '$(package) Has workspace configuration'
      : undefined,
    picked: sub.name === activeSubmodule?.name,
  }));

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a workspace to open',
    title: 'Switch Workspace',
    matchOnDescription: true,
  });

  if (!selected) {
    return;
  }

  const targetSubmodule = submodules.find((s) => s.name === selected.label);
  if (!targetSubmodule) {
    return;
  }

  // Ask how to open
  const openOption = await vscode.window.showQuickPick(
    [
      {
        label: 'Open in New Window',
        description: 'Opens the workspace in a new VS Code window',
        value: 'new',
      },
      {
        label: 'Open in Current Window',
        description: 'Opens the workspace in the current window',
        value: 'current',
      },
      {
        label: 'Add to Workspace',
        description: 'Adds the folder to the current workspace',
        value: 'add',
      },
    ],
    {
      placeHolder: 'How would you like to open the workspace?',
    }
  );

  if (!openOption) {
    return;
  }

  const folderUri = vscode.Uri.file(targetSubmodule.absolutePath);

  switch (openOption.value) {
    case 'new':
      await vscode.commands.executeCommand('vscode.openFolder', folderUri, {
        forceNewWindow: true,
      });
      break;
    case 'current':
      await vscode.commands.executeCommand('vscode.openFolder', folderUri, {
        forceNewWindow: false,
      });
      break;
    case 'add':
      vscode.workspace.updateWorkspaceFolders(
        vscode.workspace.workspaceFolders?.length ?? 0,
        0,
        { uri: folderUri, name: targetSubmodule.name }
      );
      break;
  }

  // Invalidate cache after switching
  invalidateWorkspaceCache();
}

/**
 * Show workspace list in output channel.
 */
export async function showWorkspaceList(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const repoType = getRepositoryType();
  const metaRepo = getMetaRepoInfo();

  outputChannel.clear();
  outputChannel.show();

  outputChannel.appendLine('=== ContractSpec Workspace List ===\n');
  outputChannel.appendLine(`Repository Type: ${repoType}`);

  if (!metaRepo) {
    outputChannel.appendLine('\nNot in a meta-repo context.');
    return;
  }

  outputChannel.appendLine(`Meta-Repo Root: ${metaRepo.root}`);
  outputChannel.appendLine(`\nSubmodules (${metaRepo.submodules.length}):\n`);

  const activeSubmodule = getActiveSubmodule();

  for (const sub of metaRepo.submodules) {
    const isActive = sub.name === activeSubmodule?.name;
    const marker = isActive ? '▸ ' : '  ';
    const wsIndicator = sub.hasWorkspaces ? ' [monorepo]' : '';
    const activeLabel = isActive ? ' (active)' : '';

    outputChannel.appendLine(
      `${marker}${sub.name}${wsIndicator}${activeLabel}`
    );
    outputChannel.appendLine(`    Path: ${sub.path}`);
    outputChannel.appendLine(`    URL: ${sub.url}`);
    outputChannel.appendLine('');
  }
}

/**
 * Register workspace commands.
 */
export function registerWorkspaceCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel
): void {
  // Switch workspace command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.workspaceSwitch',
      showWorkspaceSelector
    )
  );

  // List workspaces command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.workspaceList', () =>
      showWorkspaceList(outputChannel)
    )
  );
}
