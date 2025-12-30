/**
 * Doctor command helpers.
 */

import * as vscode from 'vscode';
import type {
  CheckResult,
  DoctorPromptCallbacks,
} from '@contractspec/bundle.workspace';

/**
 * Create VS Code prompt callbacks.
 */
export function createVscodePrompts(): DoctorPromptCallbacks {
  return {
    confirm: async (message: string) => {
      const result = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: message,
      });
      return result === 'Yes';
    },
    input: async (message: string, options?: { password?: boolean }) => {
      const result = await vscode.window.showInputBox({
        prompt: message,
        password: options?.password,
      });
      return result ?? '';
    },
  };
}

/**
 * Log check results to output channel.
 */
export function logResults(
  checks: CheckResult[],
  outputChannel: vscode.OutputChannel
): void {
  outputChannel.appendLine('\n--- Results ---');

  for (const check of checks) {
    const icon =
      check.status === 'pass'
        ? '✓'
        : check.status === 'warn'
          ? '⚠'
          : check.status === 'fail'
            ? '✗'
            : '○';

    outputChannel.appendLine(`${icon} [${check.category}] ${check.name}`);
    outputChannel.appendLine(`  ${check.message}`);

    if (check.details) {
      outputChannel.appendLine(`  ${check.details}`);
    }
    if (check.fix) {
      outputChannel.appendLine(`  Fix available: ${check.fix.description}`);
    }
  }
}

/**
 * Apply fixes to failed checks.
 */
export async function applyFixes(
  checks: CheckResult[],
  outputChannel: vscode.OutputChannel
): Promise<void> {
  outputChannel.appendLine('\n--- Applying Fixes ---');

  for (const check of checks) {
    if (!check.fix) continue;

    outputChannel.appendLine(`Fixing: ${check.name}...`);

    try {
      const result = await check.fix.apply();
      outputChannel.appendLine(
        result.success ? `  ✓ ${result.message}` : `  ✗ ${result.message}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      outputChannel.appendLine(`  ✗ Error: ${message}`);
    }
  }

  vscode.window.showInformationMessage(
    'Fixes applied. Run doctor again to verify.'
  );
}
