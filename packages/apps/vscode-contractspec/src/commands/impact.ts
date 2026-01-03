/**
 * Impact detection command for VSCode extension.
 *
 * Provides commands to detect breaking changes in contract specifications.
 */

import * as vscode from 'vscode';
import { impact } from '@contractspec/bundle.workspace';
import type { TelemetryReporter } from '../telemetry/index';

/**
 * Register impact detection commands.
 */
export function registerImpactCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetryReporter: TelemetryReporter | undefined
): void {
  // Main impact detection command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.detectImpact', async () => {
      await detectImpactCommand(outputChannel, telemetryReporter);
    })
  );

  // Quick compare with default baseline
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.compareWithBaseline',
      async () => {
        await compareWithBaselineCommand(outputChannel, telemetryReporter);
      }
    )
  );
}

/**
 * Detect impact with user-specified baseline.
 */
async function detectImpactCommand(
  outputChannel: vscode.OutputChannel,
  telemetryReporter: TelemetryReporter | undefined
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  // Prompt for baseline
  const baseline = await vscode.window.showInputBox({
    prompt: 'Enter Git ref to compare against',
    placeHolder: 'origin/main',
    value: 'origin/main',
  });

  if (!baseline) {
    return; // User cancelled
  }

  await runImpactDetection(
    workspaceFolder.uri.fsPath,
    baseline,
    outputChannel,
    telemetryReporter
  );
}

/**
 * Compare with default baseline (origin/main).
 */
async function compareWithBaselineCommand(
  outputChannel: vscode.OutputChannel,
  telemetryReporter: TelemetryReporter | undefined
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const config = vscode.workspace.getConfiguration('contractspec.impact');
  const defaultBaseline = config.get<string>('defaultBaseline', 'origin/main');

  await runImpactDetection(
    workspaceFolder.uri.fsPath,
    defaultBaseline,
    outputChannel,
    telemetryReporter
  );
}

/**
 * Run impact detection and display results.
 */
async function runImpactDetection(
  workspaceRoot: string,
  baseline: string,
  outputChannel: vscode.OutputChannel,
  telemetryReporter: TelemetryReporter | undefined
): Promise<void> {
  outputChannel.clear();
  outputChannel.show(true);

  try {
    outputChannel.appendLine('═══════════════════════════════════════');
    outputChannel.appendLine('   ContractSpec Impact Detection');
    outputChannel.appendLine('═══════════════════════════════════════');
    outputChannel.appendLine('');
    outputChannel.appendLine(`Workspace: ${workspaceRoot}`);
    outputChannel.appendLine(`Baseline:  ${baseline}`);
    outputChannel.appendLine('');
    outputChannel.appendLine('Running analysis...');
    outputChannel.appendLine('');

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Detecting contract impact',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Analyzing specs...' });

        // Import adapters dynamically to avoid circular dependencies
        const {
          createNodeFsAdapter,
          createNodeGitAdapter,
          createConsoleLoggerAdapter,
        } = await import('@contractspec/bundle.workspace');

        const fs = createNodeFsAdapter();
        const git = createNodeGitAdapter();
        const logger = createConsoleLoggerAdapter();

        // Run detection
        const result = await impact.detectImpact(
          { fs, git, logger },
          {
            baseline,
            workspaceRoot,
          }
        );

        // Track telemetry
        telemetryReporter?.sendTelemetryEvent('contractspec.impact.detected', {
          status: result.status,
          breaking: result.summary.breaking.toString(),
          nonBreaking: result.summary.nonBreaking.toString(),
        });

        // Format and display results
        displayImpactResults(result, outputChannel);

        // Show summary notification
        const message = formatSummaryMessage(result);
        if (result.hasBreaking) {
          vscode.window.showWarningMessage(message);
        } else if (result.hasNonBreaking) {
          vscode.window.showInformationMessage(message);
        } else {
          vscode.window.showInformationMessage(message);
        }
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    outputChannel.appendLine('');
    outputChannel.appendLine(`❌ Error: ${errorMessage}`);
    vscode.window.showErrorMessage(`Impact detection failed: ${errorMessage}`);

    telemetryReporter?.sendTelemetryEvent('contractspec.impact.error', {
      error: errorMessage,
    });
  }
}

/**
 * Display impact results in output channel.
 */
function displayImpactResults(
  result: Awaited<ReturnType<typeof impact.detectImpact>>,
  outputChannel: vscode.OutputChannel
): void {
  // Status
  outputChannel.appendLine('───────────────────────────────────────');
  outputChannel.appendLine('  RESULTS');
  outputChannel.appendLine('───────────────────────────────────────');
  outputChannel.appendLine('');

  if (result.hasBreaking) {
    outputChannel.appendLine('❌ Breaking changes detected');
  } else if (result.hasNonBreaking) {
    outputChannel.appendLine('⚠️  Contract changed (non-breaking)');
  } else {
    outputChannel.appendLine('✅ No contract impact');
  }
  outputChannel.appendLine('');

  // Summary
  if (
    result.summary.breaking > 0 ||
    result.summary.nonBreaking > 0 ||
    result.summary.added > 0 ||
    result.summary.removed > 0
  ) {
    outputChannel.appendLine('Summary:');
    if (result.summary.breaking > 0) {
      outputChannel.appendLine(`  🔴 Breaking:     ${result.summary.breaking}`);
    }
    if (result.summary.nonBreaking > 0) {
      outputChannel.appendLine(
        `  🟡 Non-breaking: ${result.summary.nonBreaking}`
      );
    }
    if (result.summary.added > 0) {
      outputChannel.appendLine(`  ➕ Added:        ${result.summary.added}`);
    }
    if (result.summary.removed > 0) {
      outputChannel.appendLine(`  ➖ Removed:      ${result.summary.removed}`);
    }
    outputChannel.appendLine('');
  }

  // Details
  if (result.deltas.length > 0) {
    outputChannel.appendLine('Changes:');
    outputChannel.appendLine('');

    // Group by severity
    const breaking = result.deltas.filter((d) => d.severity === 'breaking');
    const nonBreaking = result.deltas.filter(
      (d) => d.severity === 'non_breaking'
    );
    const info = result.deltas.filter((d) => d.severity === 'info');

    if (breaking.length > 0) {
      outputChannel.appendLine('  🔴 BREAKING CHANGES:');
      breaking.slice(0, 10).forEach((delta) => {
        outputChannel.appendLine(`     • ${delta.specKey}`);
        outputChannel.appendLine(`       ${delta.description}`);
      });
      if (breaking.length > 10) {
        outputChannel.appendLine(`     ... and ${breaking.length - 10} more`);
      }
      outputChannel.appendLine('');
    }

    if (nonBreaking.length > 0) {
      outputChannel.appendLine('  🟡 NON-BREAKING CHANGES:');
      nonBreaking.slice(0, 10).forEach((delta) => {
        outputChannel.appendLine(`     • ${delta.specKey}`);
        outputChannel.appendLine(`       ${delta.description}`);
      });
      if (nonBreaking.length > 10) {
        outputChannel.appendLine(
          `     ... and ${nonBreaking.length - 10} more`
        );
      }
      outputChannel.appendLine('');
    }

    if (info.length > 0 && info.length <= 5) {
      outputChannel.appendLine('  🔵 INFO:');
      info.forEach((delta) => {
        outputChannel.appendLine(
          `     • ${delta.specKey}: ${delta.description}`
        );
      });
      outputChannel.appendLine('');
    }
  }

  outputChannel.appendLine('───────────────────────────────────────');
  outputChannel.appendLine(`Analyzed ${result.specsAnalyzed} specs`);
  if (result.baseRef) {
    outputChannel.appendLine(`Compared against: ${result.baseRef}`);
  }
  outputChannel.appendLine('───────────────────────────────────────');
}

/**
 * Format summary message for notification.
 */
function formatSummaryMessage(
  result: Awaited<ReturnType<typeof impact.detectImpact>>
): string {
  if (result.hasBreaking) {
    return `⚠️ ${result.summary.breaking} breaking change${result.summary.breaking !== 1 ? 's' : ''} detected`;
  } else if (result.hasNonBreaking) {
    return `ℹ️ ${result.summary.nonBreaking} non-breaking change${result.summary.nonBreaking !== 1 ? 's' : ''} detected`;
  } else {
    return '✅ No contract changes detected';
  }
}
