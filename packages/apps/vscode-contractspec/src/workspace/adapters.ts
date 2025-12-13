/**
 * Workspace adapters for VS Code extension.
 *
 * Creates adapters that work in the VS Code environment.
 */

import * as vscode from 'vscode';
import {
  createNodeAdapters,
  loadWorkspaceConfig,
  type WorkspaceAdapters,
} from '@lssm/bundle.contractspec-workspace';

/**
 * Get workspace adapters for the current workspace.
 */
export function getWorkspaceAdapters(): WorkspaceAdapters {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const cwd = workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();

  return createNodeAdapters({
    cwd,
    silent: true, // Use VS Code output channel instead of console
  });
}

/**
 * Get the current workspace root path.
 */
export function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

/**
 * Load workspace configuration from .contractsrc.json.
 */
export async function getWorkspaceConfig() {
  const adapters = getWorkspaceAdapters();
  const cwd = getWorkspaceRoot();
  return loadWorkspaceConfig(adapters.fs, cwd);
}

