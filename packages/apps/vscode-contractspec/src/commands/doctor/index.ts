/**
 * Doctor command for ContractSpec extension.
 *
 * Provides health checks and interactive fixes for ContractSpec setup.
 */

import * as vscode from 'vscode';
import {
  runDoctor,
  ALL_CHECK_CATEGORIES,
  CHECK_CATEGORY_LABELS,
} from '@lssm/bundle.contractspec-workspace';
import { getWorkspaceAdapters } from '../../workspace/adapters';
import { createVscodePrompts, logResults, applyFixes } from './helpers';

/**
 * Run the doctor with full health checks.
 */
export async function runDoctorCheck(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  outputChannel.appendLine('\n=== ContractSpec Doctor ===');
  outputChannel.show(true);

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;

  try {
    // Let user select which categories to check
    const categoryItems = ALL_CHECK_CATEGORIES.map((cat) => ({
      label: CHECK_CATEGORY_LABELS[cat],
      description: cat,
      picked: true,
      value: cat,
    }));

    const selectedItems = await vscode.window.showQuickPick(categoryItems, {
      placeHolder: 'Select health check categories',
      canPickMany: true,
    });

    if (!selectedItems || selectedItems.length === 0) {
      outputChannel.appendLine('Doctor cancelled by user');
      return;
    }

    const categories = selectedItems.map((item) => item.value);
    outputChannel.appendLine(`Checking: ${categories.join(', ')}`);

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Running ContractSpec health checks...',
        cancellable: false,
      },
      async () => {
        const adapters = getWorkspaceAdapters();
        const prompts = createVscodePrompts();

        const result = await runDoctor(
          adapters,
          { workspaceRoot, categories, autoFix: false, verbose: true },
          prompts
        );

        logResults(result.checks, outputChannel);

        outputChannel.appendLine('\n--- Summary ---');
        outputChannel.appendLine(
          `Passed: ${result.passed}, Warnings: ${result.warnings}, ` +
            `Failures: ${result.failures}, Skipped: ${result.skipped}`
        );

        // Handle fixable checks
        const fixable = result.checks.filter(
          (c) => (c.status === 'fail' || c.status === 'warn') && c.fix
        );

        if (fixable.length > 0) {
          const action = await vscode.window.showWarningMessage(
            `Found ${fixable.length} issue(s) that can be fixed.`,
            'Fix All',
            'Choose Fixes',
            'Ignore'
          );

          if (action === 'Fix All') {
            await applyFixes(fixable, outputChannel);
          } else if (action === 'Choose Fixes') {
            const items = fixable.map((c) => ({
              label: c.name,
              description: c.fix?.description,
              picked: c.status === 'fail',
              check: c,
            }));

            const selected = await vscode.window.showQuickPick(items, {
              placeHolder: 'Select fixes to apply',
              canPickMany: true,
            });

            if (selected && selected.length > 0) {
              await applyFixes(
                selected.map((s) => s.check),
                outputChannel
              );
            }
          }
        }

        if (result.healthy) {
          vscode.window.showInformationMessage(
            'ContractSpec health check passed!'
          );
        } else {
          vscode.window.showWarningMessage(
            `Health check found ${result.failures} issue(s).`
          );
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Doctor failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Quick doctor check (no prompts, just reports).
 */
export async function runQuickDoctorCheck(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  outputChannel.appendLine('\n=== ContractSpec Quick Health Check ===');
  outputChannel.show(true);

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Running quick health check...',
        cancellable: false,
      },
      async () => {
        const adapters = getWorkspaceAdapters();

        const result = await runDoctor(adapters, {
          workspaceRoot,
          autoFix: false,
          skipAi: true,
        });

        const failed = result.checks.filter((c) => c.status === 'fail');

        if (failed.length === 0) {
          vscode.window.showInformationMessage(
            `ContractSpec: ${result.passed} passed, ${result.warnings} warnings`
          );
        } else {
          const names = failed.map((c) => c.name).join(', ');
          vscode.window.showWarningMessage(
            `ContractSpec: ${failed.length} issue(s): ${names}`
          );
        }

        for (const check of result.checks) {
          const icon =
            check.status === 'pass'
              ? '✓'
              : check.status === 'warn'
                ? '⚠'
                : check.status === 'fail'
                  ? '✗'
                  : '○';
          outputChannel.appendLine(`${icon} ${check.name}: ${check.message}`);
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Quick check failed: ${message}`);
  }
}
