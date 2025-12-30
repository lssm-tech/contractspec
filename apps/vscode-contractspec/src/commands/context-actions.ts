/**
 * Unified context menu action handlers.
 *
 * Provides polymorphic handlers for context actions that work across
 * all TreeDataProviders (Specs, Features, Integrity, Dependencies, LLM Tools).
 */

import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Common data structure that context actions can work with.
 */
export interface ContextActionData {
  filePath?: string;
  name?: string;
  version?: number;
  specType?: string;
}

/**
 * Extract file path from various tree item data structures.
 */
export function extractFilePath(item: unknown): string | undefined {
  if (!item || typeof item !== 'object') return undefined;

  const obj = item as Record<string, unknown>;

  // Direct properties
  if (typeof obj['filePath'] === 'string') return obj['filePath'];
  if (typeof obj['file'] === 'string') return obj['file'];
  if (typeof obj['path'] === 'string') return obj['path'];

  // Nested spec object
  if (obj['spec'] && typeof obj['spec'] === 'object') {
    return extractFilePath(obj['spec']);
  }

  // Nested location object
  if (obj['location'] && typeof obj['location'] === 'object') {
    return extractFilePath(obj['location']);
  }

  // Nested data object
  if (obj['data'] && typeof obj['data'] === 'object') {
    return extractFilePath(obj['data']);
  }

  // Feature with filePath
  if (obj['feature'] && typeof obj['feature'] === 'object') {
    return extractFilePath(obj['feature']);
  }

  return undefined;
}

/**
 * Extract name from various tree item data structures.
 */
export function extractName(item: unknown): string | undefined {
  if (!item || typeof item !== 'object') return undefined;

  const obj = item as Record<string, unknown>;

  // Direct properties
  if (typeof obj['name'] === 'string') return obj['name'];
  if (typeof obj['key'] === 'string') return obj['key'];
  if (typeof obj['title'] === 'string') return obj['title'];
  if (typeof obj['label'] === 'string') return obj['label'];

  // Nested spec object
  if (obj['spec'] && typeof obj['spec'] === 'object') {
    return extractName(obj['spec']);
  }

  // Nested ref object
  if (obj['ref'] && typeof obj['ref'] === 'object') {
    return extractName(obj['ref']);
  }

  // Nested data object
  if (obj['data'] && typeof obj['data'] === 'object') {
    return extractName(obj['data']);
  }

  // Feature object
  if (obj['feature'] && typeof obj['feature'] === 'object') {
    return extractName(obj['feature']);
  }

  return undefined;
}

/**
 * Extract version from tree item data.
 */
export function extractVersion(item: unknown): number | undefined {
  if (!item || typeof item !== 'object') return undefined;

  const obj = item as Record<string, unknown>;

  if (typeof obj['version'] === 'number') return obj['version'];

  if (obj['ref'] && typeof obj['ref'] === 'object') {
    return extractVersion(obj['ref']);
  }

  if (obj['spec'] && typeof obj['spec'] === 'object') {
    return extractVersion(obj['spec']);
  }

  if (obj['data'] && typeof obj['data'] === 'object') {
    return extractVersion(obj['data']);
  }

  return undefined;
}

/**
 * Go to spec definition - opens file and jumps to first define* call.
 */
export async function goToDefinition(item: vscode.TreeItem): Promise<void> {
  const filePath =
    extractFilePath(item) ??
    extractFilePath(
      item.resourceUri?.fsPath ? { path: item.resourceUri.fsPath } : undefined
    );

  if (!filePath) {
    vscode.window.showWarningMessage('No file path found for this item');
    return;
  }

  const uri = vscode.Uri.file(filePath);
  const document = await vscode.workspace.openTextDocument(uri);
  const text = document.getText();
  const lines = text.split('\n');

  let definitionLine = 0;
  const definePatterns = [
    'defineCommand',
    'defineQuery',
    'defineEvent',
    'definePresentation',
    'defineFeature',
    'defineCapability',
    'defineDataView',
    'defineWorkflow',
    'defineIntegration',
    'defineExperiment',
    'defineTelemetry',
    'definePolicy',
    'defineTestSpec',
    'defineForm',
    'defineMigration',
    'defineAppConfig',
    'defineKnowledge',
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (definePatterns.some((pattern) => line.includes(pattern))) {
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

/**
 * Reveal file in VS Code file explorer.
 */
export async function revealInExplorer(item: vscode.TreeItem): Promise<void> {
  const filePath =
    extractFilePath(item) ??
    extractFilePath(
      item.resourceUri?.fsPath ? { path: item.resourceUri.fsPath } : undefined
    );

  if (!filePath) {
    vscode.window.showWarningMessage('No file path found for this item');
    return;
  }

  const uri = vscode.Uri.file(filePath);
  await vscode.commands.executeCommand('revealInExplorer', uri);
}

/**
 * Copy spec/feature name to clipboard.
 */
export async function copyName(item: vscode.TreeItem): Promise<void> {
  const name =
    extractName(item) ??
    (typeof item.label === 'string' ? item.label : undefined);

  if (!name) {
    vscode.window.showWarningMessage('No name found for this item');
    return;
  }

  await vscode.env.clipboard.writeText(name);
  vscode.window.showInformationMessage(`Copied: ${name}`);
}

/**
 * Copy file path to clipboard.
 */
export async function copyPath(item: vscode.TreeItem): Promise<void> {
  const filePath =
    extractFilePath(item) ??
    extractFilePath(
      item.resourceUri?.fsPath ? { path: item.resourceUri.fsPath } : undefined
    );

  if (!filePath) {
    vscode.window.showWarningMessage('No file path found for this item');
    return;
  }

  await vscode.env.clipboard.writeText(filePath);
  vscode.window.showInformationMessage(
    `Copied path: ${path.basename(filePath)}`
  );
}

/**
 * Show dependencies for a spec.
 */
export async function showDependencies(item: vscode.TreeItem): Promise<void> {
  const filePath =
    extractFilePath(item) ??
    extractFilePath(
      item.resourceUri?.fsPath ? { path: item.resourceUri.fsPath } : undefined
    );

  if (!filePath) {
    vscode.window.showWarningMessage('No file path found for this item');
    return;
  }

  const uri = vscode.Uri.file(filePath);
  await vscode.window.showTextDocument(uri);
  await vscode.commands.executeCommand('contractspec.analyzeDeps');
}

/**
 * Show features that reference this spec.
 */
export async function showReferencingFeatures(
  item: vscode.TreeItem
): Promise<void> {
  const name = extractName(item);
  const version = extractVersion(item) ?? 1;

  if (!name) {
    vscode.window.showWarningMessage('No spec name found for this item');
    return;
  }

  await vscode.commands.executeCommand('contractspec-features.focus');
  vscode.window.showInformationMessage(
    `Showing features that reference ${name}.v${version}. Check the Features view.`
  );
}

/**
 * Register all context action commands.
 */
export function registerContextActions(context: vscode.ExtensionContext): void {
  // Go to Definition
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.goToSpecDefinition',
      (item: vscode.TreeItem) => goToDefinition(item)
    )
  );

  // Reveal in Explorer
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.revealInExplorer',
      (item: vscode.TreeItem) => revealInExplorer(item)
    )
  );

  // Copy Spec Name
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.copySpecName',
      (item: vscode.TreeItem) => copyName(item)
    )
  );

  // Copy File Path
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.copySpecPath',
      (item: vscode.TreeItem) => copyPath(item)
    )
  );

  // Show Spec Dependencies
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.showSpecDeps',
      (item: vscode.TreeItem) => showDependencies(item)
    )
  );

  // Show Referencing Features
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.showReferencingFeatures',
      (item: vscode.TreeItem) => showReferencingFeatures(item)
    )
  );
}
