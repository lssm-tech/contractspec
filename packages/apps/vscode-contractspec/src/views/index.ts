/**
 * View providers registration.
 */

import * as vscode from 'vscode';
import { SpecsTreeDataProvider, SpecTreeItem } from './specs-tree';
import { DependenciesTreeDataProvider } from './deps-tree';
import { BuildResultsTreeDataProvider } from './build-results-tree';
import {
  LLMToolsTreeDataProvider,
  registerLLMToolsTree,
} from './llm-tools-tree';

export { BuildResultsTreeDataProvider };
export { LLMToolsTreeDataProvider, registerLLMToolsTree };

/**
 * Register all tree view providers.
 */
export function registerViews(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel
): {
  specsProvider: SpecsTreeDataProvider;
  depsProvider: DependenciesTreeDataProvider;
  buildResultsProvider: BuildResultsTreeDataProvider;
  llmToolsProvider: LLMToolsTreeDataProvider;
} {
  // Specs Explorer
  const specsProvider = new SpecsTreeDataProvider();
  const specsTreeView = vscode.window.createTreeView('contractspec.specsView', {
    treeDataProvider: specsProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(specsTreeView);

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.refreshSpecs', () => {
      specsProvider.refresh();
    })
  );

  // Register grouping mode commands
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.selectGroupingMode', () => {
      specsProvider.selectGroupingMode();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.cycleGroupingMode', () => {
      specsProvider.cycleGroupingMode();
    })
  );

  // Register spec context menu actions
  registerSpecContextActions(context);

  // Dependencies View
  const depsProvider = new DependenciesTreeDataProvider();
  const depsTreeView = vscode.window.createTreeView('contractspec.depsView', {
    treeDataProvider: depsProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(depsTreeView);

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.refreshDeps', () => {
      depsProvider.refresh();
    })
  );

  // Build Results View
  const buildResultsProvider = new BuildResultsTreeDataProvider();
  const buildResultsTreeView = vscode.window.createTreeView(
    'contractspec.buildResultsView',
    {
      treeDataProvider: buildResultsProvider,
      showCollapseAll: false,
    }
  );

  context.subscriptions.push(buildResultsTreeView);

  // Register clear command
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.clearBuildResults', () => {
      buildResultsProvider.clear();
    })
  );

  // LLM Tools View
  const llmToolsProvider = registerLLMToolsTree(context, outputChannel);

  return {
    specsProvider,
    depsProvider,
    buildResultsProvider,
    llmToolsProvider,
  };
}

/**
 * Register context menu actions for spec items.
 */
function registerSpecContextActions(context: vscode.ExtensionContext): void {
  // Reveal in File Explorer
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.revealInExplorer',
      (item: SpecTreeItem) => {
        if (item.data && 'filePath' in item.data) {
          const uri = vscode.Uri.file(item.data.filePath);
          vscode.commands.executeCommand('revealInExplorer', uri);
        }
      }
    )
  );

  // Copy Spec Name
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.copySpecName',
      (item: SpecTreeItem) => {
        if (item.data && 'name' in item.data && item.data.name) {
          vscode.env.clipboard.writeText(item.data.name);
          vscode.window.showInformationMessage(`Copied: ${item.data.name}`);
        } else if (item.label) {
          vscode.env.clipboard.writeText(item.label);
          vscode.window.showInformationMessage(`Copied: ${item.label}`);
        }
      }
    )
  );

  // Copy File Path
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.copySpecPath',
      (item: SpecTreeItem) => {
        if (item.data && 'filePath' in item.data) {
          vscode.env.clipboard.writeText(item.data.filePath);
          vscode.window.showInformationMessage(
            `Copied path: ${item.data.filePath}`
          );
        }
      }
    )
  );

  // Go to Spec Definition (open at first line with spec definition)
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.goToSpecDefinition',
      async (item: SpecTreeItem) => {
        if (item.data && 'filePath' in item.data) {
          const uri = vscode.Uri.file(item.data.filePath);
          const document = await vscode.workspace.openTextDocument(uri);
          const text = document.getText();

          // Find the line with the spec definition (e.g., 'export const', 'defineCommand', etc.)
          const lines = text.split('\n');
          let definitionLine = 0;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (
              line.includes('defineCommand') ||
              line.includes('defineQuery') ||
              line.includes('defineEvent') ||
              line.includes('definePresentation') ||
              line.includes('defineFeature') ||
              line.includes('defineCapability') ||
              line.includes('defineDataView') ||
              line.includes('defineWorkflow') ||
              line.includes('defineIntegration') ||
              line.includes('defineExperiment') ||
              line.includes('defineTelemetry') ||
              line.includes('definePolicy') ||
              line.includes('defineTestSpec')
            ) {
              definitionLine = i;
              break;
            }
          }

          const editor = await vscode.window.showTextDocument(document);
          const position = new vscode.Position(definitionLine, 0);
          editor.selection = new vscode.Selection(position, position);
          editor.revealRange(
            new vscode.Range(position, position),
            vscode.TextEditorRevealType.InCenter
          );
        }
      }
    )
  );

  // Show Dependencies for this spec
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.showSpecDeps',
      async (item: SpecTreeItem) => {
        if (item.data && 'filePath' in item.data) {
          // Open the file and trigger dependencies analysis
          const uri = vscode.Uri.file(item.data.filePath);
          await vscode.window.showTextDocument(uri);
          await vscode.commands.executeCommand('contractspec.analyzeDeps');
        }
      }
    )
  );

  // Show Features that reference this spec
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.showReferencingFeatures',
      async (item: SpecTreeItem) => {
        if (item.data && 'name' in item.data && item.data.name) {
          const specName = item.data.name;
          const specVersion = item.data.version ?? 1;

          // Focus the Features view and show a message
          await vscode.commands.executeCommand('contractspec-features.focus');

          vscode.window.showInformationMessage(
            `Showing features that reference ${specName}.v${specVersion}. Check the Features view.`
          );
        }
      }
    )
  );
}
