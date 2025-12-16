/**
 * Completion providers for ContractSpec VS Code extension.
 */

import * as vscode from 'vscode';
import {
  SpecNameCompletionProvider,
  invalidateSpecCache,
} from './spec-name-provider';

/**
 * Register all completion providers.
 */
export function registerCompletionProviders(
  context: vscode.ExtensionContext
): void {
  // Register spec name completion provider for TypeScript files
  const specNameProvider = new SpecNameCompletionProvider();

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'typescript', pattern: '**/*.feature.ts' },
      specNameProvider,
      "'", // Trigger on single quote
      '"', // Trigger on double quote
      '{' // Trigger on opening brace
    )
  );

  // Invalidate cache when spec files change
  const watcher = vscode.workspace.createFileSystemWatcher(
    '**/*.{contracts,event,presentation}.ts'
  );

  watcher.onDidChange(() => invalidateSpecCache());
  watcher.onDidCreate(() => invalidateSpecCache());
  watcher.onDidDelete(() => invalidateSpecCache());

  context.subscriptions.push(watcher);
}

export { SpecNameCompletionProvider, invalidateSpecCache };

