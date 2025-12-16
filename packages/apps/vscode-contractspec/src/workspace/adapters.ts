/**
 * Workspace adapters for VS Code extension.
 *
 * Creates adapters that work in the VS Code environment with monorepo support.
 */

import * as vscode from 'vscode';
import {
  createNodeAdapters,
  loadWorkspaceConfig,
  getWorkspaceInfo,
  findWorkspaceRoot,
  findPackageRoot,
  detectPackageManager,
  type WorkspaceAdapters,
  type WorkspaceInfo,
  type PackageManager,
} from '@lssm/bundle.contractspec-workspace';

/**
 * Cached workspace info to avoid repeated filesystem checks.
 */
let cachedWorkspaceInfo: WorkspaceInfo | undefined;

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
 * Get workspace adapters for a specific folder/file context.
 *
 * In monorepo setups, this returns adapters configured for the
 * package containing the specified path.
 */
export function getWorkspaceAdaptersForPath(path: string): WorkspaceAdapters {
  const packageRoot = findPackageRoot(path);

  return createNodeAdapters({
    cwd: packageRoot,
    silent: true,
  });
}

/**
 * Get the current workspace root path.
 *
 * This returns the VS Code workspace folder root, which may be:
 * - A single project root
 * - A monorepo root
 * - A multi-root workspace root
 */
export function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

/**
 * Get the actual workspace/monorepo root by walking up from cwd.
 *
 * This detects monorepo roots by looking for:
 * - pnpm-workspace.yaml
 * - package.json with workspaces
 * - Lock files
 */
export function getMonorepoRoot(): string {
  const vsCodeRoot = getWorkspaceRoot() ?? process.cwd();
  return findWorkspaceRoot(vsCodeRoot);
}

/**
 * Get workspace info including monorepo detection.
 */
export function getWorkspaceInfoCached(): WorkspaceInfo {
  if (cachedWorkspaceInfo) {
    return cachedWorkspaceInfo;
  }

  const vsCodeRoot = getWorkspaceRoot() ?? process.cwd();
  cachedWorkspaceInfo = getWorkspaceInfo(vsCodeRoot);
  return cachedWorkspaceInfo;
}

/**
 * Invalidate the cached workspace info.
 *
 * Call this when workspace configuration may have changed.
 */
export function invalidateWorkspaceCache(): void {
  cachedWorkspaceInfo = undefined;
}

/**
 * Get the detected package manager for the workspace.
 */
export function getDetectedPackageManager(): PackageManager {
  const info = getWorkspaceInfoCached();
  return info.packageManager;
}

/**
 * Check if the current workspace is a monorepo.
 */
export function isMonorepoWorkspace(): boolean {
  const info = getWorkspaceInfoCached();
  return info.isMonorepo;
}

/**
 * Get the package root for a given file.
 *
 * In a monorepo, this returns the package containing the file.
 * In a single project, this returns the project root.
 */
export function getPackageRootForFile(filePath: string): string {
  return findPackageRoot(filePath);
}

/**
 * Load workspace configuration from .contractsrc.json.
 *
 * In monorepos, this merges workspace and package configs.
 */
export async function getWorkspaceConfig() {
  const adapters = getWorkspaceAdapters();
  const cwd = getWorkspaceRoot();
  return loadWorkspaceConfig(adapters.fs, cwd);
}

/**
 * Format workspace info for display.
 */
export function formatWorkspaceInfoForDisplay(): string {
  const info = getWorkspaceInfoCached();
  const lines: string[] = [];

  lines.push(`Package Manager: ${info.packageManager}`);
  lines.push(`Workspace Root: ${info.workspaceRoot}`);

  if (info.isMonorepo) {
    lines.push(`Monorepo: Yes`);
    lines.push(`Package Root: ${info.packageRoot}`);
    if (info.packageName) {
      lines.push(`Current Package: ${info.packageName}`);
    }
  } else {
    lines.push(`Monorepo: No`);
  }

  return lines.join('\n');
}

// Re-export types
export type { WorkspaceInfo, PackageManager };
