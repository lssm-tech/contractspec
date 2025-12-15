/**
 * Status bar integration for ContractSpec extension.
 */

import * as vscode from 'vscode';
import {
  getDetectedPackageManager,
  isMonorepoWorkspace,
  getWorkspaceInfoCached,
  formatWorkspaceInfoForDisplay,
  type PackageManager,
} from '../workspace/adapters';

/**
 * Package manager icons.
 */
const PACKAGE_MANAGER_ICONS: Record<PackageManager, string> = {
  bun: '🐰',
  pnpm: '🟠',
  yarn: '🐈',
  npm: '📦',
};

/**
 * Create and configure status bar item for watch mode.
 */
export function createWatchStatusBarItem(
  context: vscode.ExtensionContext
): vscode.StatusBarItem {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  statusBarItem.command = 'contractspec.watchToggle';
  statusBarItem.text = '$(eye-closed) ContractSpec';
  statusBarItem.tooltip = 'Click to toggle watch mode';
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);

  return statusBarItem;
}

/**
 * Create status bar item for validation status.
 */
export function createValidationStatusBarItem(
  context: vscode.ExtensionContext
): vscode.StatusBarItem {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    99
  );

  statusBarItem.command = 'contractspec.validate';
  statusBarItem.hide(); // Hidden by default, shown when validation is running/complete

  context.subscriptions.push(statusBarItem);

  return statusBarItem;
}

/**
 * Create status bar item for workspace/package manager info.
 */
export function createWorkspaceStatusBarItem(
  context: vscode.ExtensionContext
): vscode.StatusBarItem {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    98
  );

  statusBarItem.command = 'contractspec.workspaceInfo';

  // Initial update
  updateWorkspaceStatus(statusBarItem);

  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  return statusBarItem;
}

/**
 * Update workspace status bar item.
 */
export function updateWorkspaceStatus(
  statusBarItem: vscode.StatusBarItem
): void {
  try {
    const packageManager = getDetectedPackageManager();
    const isMonorepo = isMonorepoWorkspace();
    const icon = PACKAGE_MANAGER_ICONS[packageManager];

    const workspaceInfo = getWorkspaceInfoCached();
    const tooltip = formatWorkspaceInfoForDisplay();

    if (isMonorepo) {
      const currentPkg = workspaceInfo.packageName || 'monorepo';
      statusBarItem.text = `${icon} ${packageManager} (${currentPkg})`;
    } else {
      statusBarItem.text = `${icon} ${packageManager}`;
    }

    statusBarItem.tooltip = tooltip;
  } catch {
    // Fallback if detection fails
    statusBarItem.text = '$(package) Unknown';
    statusBarItem.tooltip = 'Unable to detect package manager';
  }
}

/**
 * Update validation status.
 */
export function updateValidationStatus(
  statusBarItem: vscode.StatusBarItem,
  status: 'validating' | 'passed' | 'failed' | 'idle'
): void {
  switch (status) {
    case 'validating':
      statusBarItem.text = '$(sync~spin) Validating...';
      statusBarItem.tooltip = 'Validation in progress';
      statusBarItem.backgroundColor = undefined;
      statusBarItem.show();
      break;
    case 'passed':
      statusBarItem.text = '$(check) Spec Valid';
      statusBarItem.tooltip = 'Spec validation passed';
      statusBarItem.backgroundColor = undefined;
      statusBarItem.show();
      // Auto-hide after 3 seconds
      setTimeout(() => {
        statusBarItem.hide();
      }, 3000);
      break;
    case 'failed':
      statusBarItem.text = '$(error) Spec Invalid';
      statusBarItem.tooltip = 'Spec validation failed';
      statusBarItem.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.errorBackground'
      );
      statusBarItem.show();
      break;
    case 'idle':
    default:
      statusBarItem.hide();
      break;
  }
}
