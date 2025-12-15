/**
 * View providers registration.
 */

import * as vscode from 'vscode';
import { SpecsTreeDataProvider } from './specs-tree';
import { DependenciesTreeDataProvider } from './deps-tree';
import { BuildResultsTreeDataProvider } from './build-results-tree';

export { BuildResultsTreeDataProvider };

/**
 * Register all tree view providers.
 */
export function registerViews(context: vscode.ExtensionContext): {
  specsProvider: SpecsTreeDataProvider;
  depsProvider: DependenciesTreeDataProvider;
  buildResultsProvider: BuildResultsTreeDataProvider;
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

  return {
    specsProvider,
    depsProvider,
    buildResultsProvider,
  };
}

