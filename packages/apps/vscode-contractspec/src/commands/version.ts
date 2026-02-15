/**
 * Version management commands.
 */

import * as vscode from 'vscode';
import type { TelemetryReporter } from '../telemetry/index';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
  versioning,
  createNodeGitAdapter,
} from '@contractspec/bundle.workspace';
import type {
  VersionAnalysis,
  VersionBumpType,
} from '@contractspec/lib.contracts-spec'; // Import types from libs or use versioning.X

const { analyzeVersions, applyVersionBump, generateChangelogs } = versioning;

/**
 * Register versioning commands.
 */
export function registerVersionCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry: TelemetryReporter | undefined
): void {
  // Analyze versions (show info)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.version.analyze',
      async () => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'version.analyze',
        });
        await analyzeVersionsCommand(outputChannel);
      }
    )
  );

  // Bump version (single spec from context menu or command palette)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.version.bump',
      async (uri?: vscode.Uri) => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'version.bump',
        });
        await bumpVersionCommand(outputChannel, uri);
      }
    )
  );

  // Generate changelogs
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.version.changelog',
      async () => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'version.changelog',
        });
        await generateChangelogCommand(outputChannel);
      }
    )
  );
}

/**
 * Analyze versions and show summary.
 */
async function analyzeVersionsCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  outputChannel.show();
  outputChannel.appendLine('Analyzing versions...');

  try {
    const adapters = getWorkspaceAdapters();
    const analysesResult = await analyzeVersions(
      { fs: adapters.fs, logger: adapters.logger, git: createNodeGitAdapter() },
      {}
    );
    const analyses = analysesResult.analyses;

    if (analyses.length === 0) {
      vscode.window.showInformationMessage(
        'All specs are up to date! No version bumps needed.'
      );
      outputChannel.appendLine('No version bumps needed.');
      return;
    }

    const breakingCount = analyses.filter(
      (a: VersionAnalysis) => a.hasBreaking
    ).length;
    const message = `Found ${analyses.length} specs needing update (${breakingCount} breaking). Check the Versions view for details.`;

    outputChannel.appendLine(message);

    const selection = await vscode.window.showInformationMessage(
      message,
      'View Details',
      'Bump All...'
    );

    if (selection === 'View Details') {
      vscode.commands.executeCommand('contractspec.versionsView.focus');
    } else if (selection === 'Bump All...') {
      // Trigger interactive bump for all (could be enhanced later)
      vscode.window.showInformationMessage(
        'Please use the CLI for batch bumping for now: `contractspec version bump --all --interactive`'
      );
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Analysis failed: ${msg}`);
    outputChannel.appendLine(`Error: ${msg}`);
  }
}

interface VersionQuickPickItem extends vscode.QuickPickItem {
  analysis: VersionAnalysis;
}

/**
 * Bump version for a spec.
 */
async function bumpVersionCommand(
  outputChannel: vscode.OutputChannel,
  uri?: vscode.Uri
): Promise<void> {
  let specPath = uri?.fsPath;

  if (!specPath) {
    // If no context, pick from active editor or list
    const editor = vscode.window.activeTextEditor;
    if (
      editor &&
      editor.document.uri.fsPath.match(
        /\.(contract|operation|event|presentation|feature)\.ts$/
      )
    ) {
      specPath = editor.document.uri.fsPath;
    } else {
      // Pick file logic - for now simplicity: analyze and pick
      const adapters = getWorkspaceAdapters();
      const analysesResult = await analyzeVersions(
        {
          fs: adapters.fs,
          logger: adapters.logger,
          git: createNodeGitAdapter(),
        },
        {}
      );
      const analyses = analysesResult.analyses;

      if (analyses.length === 0) {
        vscode.window.showInformationMessage('No specs need bumping.');
        return;
      }

      const items: VersionQuickPickItem[] = analyses.map(
        (a: VersionAnalysis) => ({
          label: a.specKey,
          description: `${a.currentVersion} -> ${a.suggestedVersion} (${a.bumpType})`,
          analysis: a,
        })
      );

      const selected = await vscode.window.showQuickPick<VersionQuickPickItem>(
        items,
        {
          placeHolder: 'Select spec to bump',
        }
      );

      if (!selected) return;
      specPath = selected.analysis.specPath;
    }
  }

  // Ask for bump type/confirmation
  // In a real implementation we might confirm the suggested bump or allow override

  // For now, confirm suggested
  const adapters = getWorkspaceAdapters();

  // We need to re-analyze to get the suggestion if we just have the path
  const analysesResult = await analyzeVersions(
    { fs: adapters.fs, logger: adapters.logger, git: createNodeGitAdapter() },
    {} // Force re-analysis to be safe
  );
  const analyses = analysesResult.analyses;

  const analysis = analyses.find(
    (a: VersionAnalysis) => a.specPath === specPath
  );

  if (!analysis) {
    // Configured manual bump if not found in analysis?
    // Let's stick to simple "ContractSpec not detecting changes" message for now
    const forceBump = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: 'No pending changes detected. Force bump anyway?',
    });

    if (forceBump !== 'Yes') return;

    // Manual override flow
    const bumpType = await vscode.window.showQuickPick(
      ['patch', 'minor', 'major'] as VersionBumpType[],
      {
        placeHolder: 'Select bump type',
      }
    );

    if (!bumpType) return;

    try {
      await applyVersionBump(
        {
          fs: adapters.fs,
          logger: adapters.logger,
          git: createNodeGitAdapter(),
        },
        { specPath, bumpType: bumpType as VersionBumpType }
      );
      vscode.window.showInformationMessage(`Bumped ${specPath} (${bumpType})`);
      vscode.commands.executeCommand('contractspec.version.refresh');
    } catch (e) {
      vscode.window.showErrorMessage(`Bump failed: ${e}`);
    }
    return;
  }

  interface BumpTypeItem extends vscode.QuickPickItem {
    type?: VersionBumpType;
  }

  const selection = await vscode.window.showQuickPick<BumpTypeItem>(
    [
      {
        label: analysis.suggestedVersion,
        description: `Suggested (${analysis.bumpType})`,
        type: analysis.bumpType,
      },
      { label: 'Custom...', description: 'Choose manually' },
    ],
    { placeHolder: `Bump ${analysis.specKey}?` }
  );

  if (!selection) return;

  let bumpType: VersionBumpType | undefined = selection.type;

  if (selection.label === 'Custom...') {
    const customType = await vscode.window.showQuickPick<
      vscode.QuickPickItem & { type: VersionBumpType }
    >(
      [
        { label: 'patch', type: 'patch' },
        { label: 'minor', type: 'minor' },
        { label: 'major', type: 'major' },
      ],
      {
        placeHolder: 'Select bump type',
      }
    );
    if (customType) bumpType = customType.type;
  }

  if (bumpType) {
    try {
      await applyVersionBump(
        {
          fs: adapters.fs,
          logger: adapters.logger,
          git: createNodeGitAdapter(),
        },
        { specPath, bumpType }
      );
      vscode.window.showInformationMessage(`Bumped ${analysis.specKey}`);
      outputChannel.appendLine(`Bumped ${analysis.specKey} to ${bumpType}`);
      // Refresh views
      vscode.commands.executeCommand('contractspec.version.refresh');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      vscode.window.showErrorMessage(`Bump failed: ${msg}`);
    }
  }
}

/**
 * Generate changelogs command.
 */
async function generateChangelogCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const confirm = await vscode.window.showInformationMessage(
    'Generate changelogs for the entire workspace?',
    'Yes',
    'No'
  );

  if (confirm !== 'Yes') return;

  outputChannel.show();
  outputChannel.appendLine('Generating changelogs...');

  try {
    const adapters = getWorkspaceAdapters();
    const _result = await generateChangelogs(
      { fs: adapters.fs, logger: adapters.logger, git: createNodeGitAdapter() },
      {} // Use defaults from contractsrc
    );

    outputChannel.appendLine('Changelog generation complete.');
    vscode.window.showInformationMessage('Changelogs generated successfully.');
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    outputChannel.appendLine(`Error: ${msg}`);
    vscode.window.showErrorMessage(`Changelog generation failed: ${msg}`);
  }
}
