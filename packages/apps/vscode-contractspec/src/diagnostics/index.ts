/**
 * Diagnostics provider for ContractSpec extension.
 *
 * Provides real-time validation feedback in the editor.
 */

import * as vscode from 'vscode';
import { validateSpecStructure } from '@lssm/module.contractspec-workspace';

const DIAGNOSTIC_SOURCE = 'ContractSpec';

/**
 * Register diagnostics (validation on open/save).
 */
export function registerDiagnostics(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel
): void {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection(DIAGNOSTIC_SOURCE);
  context.subscriptions.push(diagnosticCollection);

  // Validate on document open
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      const config = vscode.workspace.getConfiguration('contractspec');
      if (config.get<boolean>('validation.onOpen', true)) {
        validateDocument(document, diagnosticCollection, outputChannel);
      }
    })
  );

  // Validate on document save
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      const config = vscode.workspace.getConfiguration('contractspec');
      if (config.get<boolean>('validation.onSave', true)) {
        validateDocument(document, diagnosticCollection, outputChannel);
      }
    })
  );

  // Clear diagnostics when document is closed
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      diagnosticCollection.delete(document.uri);
    })
  );

  // Validate already open documents
  for (const document of vscode.workspace.textDocuments) {
    const config = vscode.workspace.getConfiguration('contractspec');
    if (config.get<boolean>('validation.onOpen', true)) {
      validateDocument(document, diagnosticCollection, outputChannel);
    }
  }
}

/**
 * Validate a document and update diagnostics.
 */
function validateDocument(
  document: vscode.TextDocument,
  diagnosticCollection: vscode.DiagnosticCollection,
  _outputChannel: vscode.OutputChannel
): void {
  const filePath = document.uri.fsPath;

  // Only validate spec files
  if (!isSpecFile(filePath)) {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];
  const code = document.getText();
  const fileName = getFileName(filePath);

  try {
    const result = validateSpecStructure(code, fileName);

    // Convert errors to diagnostics
    for (const error of result.errors) {
      const diagnostic = createDiagnostic(
        document,
        error,
        vscode.DiagnosticSeverity.Error
      );
      diagnostics.push(diagnostic);
    }

    // Convert warnings to diagnostics
    for (const warning of result.warnings) {
      const diagnostic = createDiagnostic(
        document,
        warning,
        vscode.DiagnosticSeverity.Warning
      );
      diagnostics.push(diagnostic);
    }
  } catch (error) {
    // If validation itself fails, show a single error
    const message = error instanceof Error ? error.message : String(error);
    const diagnostic = new vscode.Diagnostic(
      new vscode.Range(0, 0, 0, 0),
      `Validation error: ${message}`,
      vscode.DiagnosticSeverity.Error
    );
    diagnostic.source = DIAGNOSTIC_SOURCE;
    diagnostics.push(diagnostic);
  }

  diagnosticCollection.set(document.uri, diagnostics);
}

/**
 * Create a diagnostic from an error/warning message.
 */
function createDiagnostic(
  document: vscode.TextDocument,
  message: string,
  severity: vscode.DiagnosticSeverity
): vscode.Diagnostic {
  // Try to find the relevant location in the document
  const range = findRelevantRange(document, message);

  const diagnostic = new vscode.Diagnostic(range, message, severity);
  diagnostic.source = DIAGNOSTIC_SOURCE;

  return diagnostic;
}

/**
 * Find a relevant range in the document for the error message.
 */
function findRelevantRange(
  document: vscode.TextDocument,
  message: string
): vscode.Range {
  const text = document.getText();

  // Try to match common error patterns and find relevant code
  const patterns: { pattern: RegExp; search: string }[] = [
    { pattern: /Missing (meta|io|policy) section/, search: 'export' },
    { pattern: /Missing defineCommand or defineQuery/, search: 'export const' },
    { pattern: /Missing.*name field/, search: 'name:' },
    { pattern: /Missing.*version field/, search: 'version:' },
    { pattern: /Missing.*kind field/, search: 'kind:' },
    { pattern: /Missing payload/, search: 'payload:' },
    { pattern: /Missing content/, search: 'content:' },
    { pattern: /Missing definition/, search: 'definition:' },
  ];

  for (const { pattern, search } of patterns) {
    if (pattern.test(message)) {
      // Try to find the search term, or fall back to first export
      let index = text.indexOf(search);
      if (index === -1) {
        index = text.indexOf('export');
      }
      if (index !== -1) {
        const position = document.positionAt(index);
        const line = document.lineAt(position.line);
        return line.range;
      }
    }
  }

  // Default: first line
  return document.lineAt(0).range;
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

/**
 * Get just the file name from a path.
 */
function getFileName(filePath: string): string {
  return filePath.split(/[/\\]/).pop() ?? filePath;
}
