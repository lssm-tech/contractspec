/**
 * Build/scaffold command for ContractSpec extension.
 *
 * Uses the build service from @contractspec/bundle.workspace to generate
 * handler/component skeletons from spec files.
 */

import * as vscode from 'vscode';
import {
  getWorkspaceAdapters,
  getWorkspaceConfig,
} from '../workspace/adapters';
import { buildSpec, type BuildTarget } from '@contractspec/bundle.workspace';
import { inferSpecTypeFromFilePath } from '@contractspec/module.workspace';

/**
 * Build/scaffold from the currently active spec file.
 */
export async function buildCurrentSpec(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  const document = editor.document;
  const filePath = document.uri.fsPath;

  if (!isSpecFile(filePath)) {
    vscode.window.showWarningMessage(
      'Current file is not a ContractSpec file. Expected extensions: .contracts.ts, .event.ts, .presentation.ts, etc.'
    );
    return;
  }

  outputChannel.appendLine(`\nBuilding from: ${filePath}`);
  outputChannel.show(true);

  try {
    const adapters = getWorkspaceAdapters();
    const config = await getWorkspaceConfig();
    const specType = inferSpecTypeFromFilePath(filePath);

    outputChannel.appendLine(`Spec type: ${specType}`);

    // Determine what to generate based on spec type
    const targets = await selectBuildTargets(specType);
    if (!targets || targets.length === 0) {
      return;
    }

    // Ask about overwrite behavior
    const overwrite = await askOverwriteBehavior();

    // Build using the workspace bundle's build service
    const result = await buildSpec(filePath, adapters, config, {
      targets: targets as BuildTarget[],
      overwrite,
    });

    outputChannel.appendLine(`Name: ${result.specInfo.key ?? 'unknown'}`);

    const generatedFiles: string[] = [];
    for (const targetResult of result.results) {
      if (targetResult.success) {
        generatedFiles.push(targetResult.outputPath);
        outputChannel.appendLine(`✅ Generated: ${targetResult.outputPath}`);
      } else if (targetResult.skipped) {
        outputChannel.appendLine(
          `⏭️  Skipped ${targetResult.target}: ${targetResult.error}`
        );
      } else {
        outputChannel.appendLine(
          `❌ Failed ${targetResult.target}: ${targetResult.error}`
        );
      }
    }

    if (generatedFiles.length > 0) {
      vscode.window.showInformationMessage(
        `Generated ${generatedFiles.length} file(s)`
      );

      // Offer to open first generated file
      const openFile = await vscode.window.showInformationMessage(
        'Open generated file?',
        'Open',
        'Close'
      );

      if (openFile === 'Open' && generatedFiles[0]) {
        const doc = await vscode.workspace.openTextDocument(generatedFiles[0]);
        await vscode.window.showTextDocument(doc);
      }
    } else {
      vscode.window.showInformationMessage('No files generated');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Build error: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Ask user about overwrite behavior.
 */
async function askOverwriteBehavior(): Promise<boolean> {
  const choice = await vscode.window.showQuickPick(
    [
      { label: 'Skip existing files', value: false },
      { label: 'Overwrite existing files', value: true },
    ],
    { placeHolder: 'What to do if files already exist?' }
  );

  return choice?.value ?? false;
}

/**
 * Show quick pick to select build targets.
 */
async function selectBuildTargets(
  specType: string
): Promise<string[] | undefined> {
  const options: vscode.QuickPickItem[] = [];

  if (specType === 'operation') {
    options.push(
      {
        label: 'handler',
        description: 'Generate handler implementation skeleton',
        picked: true,
      },
      {
        label: 'test',
        description: 'Generate test file',
        picked: false,
      }
    );
  } else if (specType === 'presentation') {
    options.push(
      {
        label: 'component',
        description: 'Generate React component skeleton',
        picked: true,
      },
      {
        label: 'test',
        description: 'Generate test file',
        picked: false,
      }
    );
  } else {
    vscode.window.showInformationMessage(
      `Build not yet supported for ${specType} specs`
    );
    return undefined;
  }

  const selected = await vscode.window.showQuickPick(options, {
    canPickMany: true,
    placeHolder: 'Select what to generate',
  });

  if (!selected || selected.length === 0) {
    return undefined;
  }

  return selected.map((item) => item.label);
}

/**
 * Check if a file is a ContractSpec file.
 */
function isSpecFile(filePath: string): boolean {
  const specExtensions = [
    '.contracts.ts',
    '.event.ts',
    '.presentation.ts',
    '.workflow.ts',
    '.data-view.ts',
    '.migration.ts',
    '.telemetry.ts',
    '.experiment.ts',
    '.app-config.ts',
    '.integration.ts',
    '.knowledge.ts',
  ];

  return specExtensions.some((ext) => filePath.endsWith(ext));
}
