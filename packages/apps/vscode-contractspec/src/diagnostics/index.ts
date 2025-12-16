/**
 * Diagnostics provider for ContractSpec extension.
 *
 * Provides real-time validation feedback in the editor including:
 * - Spec structure validation
 * - Integrity analysis (orphaned specs, unresolved refs)
 */

import * as vscode from 'vscode';
import {
  validateSpecStructure,
  scanSpecSource,
  isFeatureFile,
  scanFeatureSource,
} from '@lssm/module.contractspec-workspace';
import type { IntegrityAnalysisResult } from '@lssm/bundle.contractspec-workspace';

const DIAGNOSTIC_SOURCE = 'ContractSpec';
const INTEGRITY_SOURCE = 'ContractSpec Integrity';

// Cache for integrity analysis results
let integrityResult: IntegrityAnalysisResult | undefined;

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
    '.feature.ts',
    '.capability.ts',
    '.workflow.ts',
    '.data-view.ts',
    '.form.ts',
    '.migration.ts',
    '.telemetry.ts',
    '.experiment.ts',
    '.app-config.ts',
    '.integration.ts',
    '.knowledge.ts',
    '.policy.ts',
    '.test-spec.ts',
  ];

  return specExtensions.some((ext) => filePath.endsWith(ext));
}

/**
 * Get just the file name from a path.
 */
function getFileName(filePath: string): string {
  return filePath.split(/[/\\]/).pop() ?? filePath;
}

/**
 * Update the cached integrity result.
 * Called from the integrity tree provider.
 */
export function updateIntegrityResult(
  result: IntegrityAnalysisResult | undefined
): void {
  integrityResult = result;
}

/**
 * Create integrity diagnostics collection.
 */
export function registerIntegrityDiagnostics(
  context: vscode.ExtensionContext
): vscode.DiagnosticCollection {
  const integrityDiagnostics =
    vscode.languages.createDiagnosticCollection(INTEGRITY_SOURCE);
  context.subscriptions.push(integrityDiagnostics);

  return integrityDiagnostics;
}

/**
 * Update integrity diagnostics based on analysis result.
 */
export function updateIntegrityDiagnostics(
  result: IntegrityAnalysisResult,
  diagnosticCollection: vscode.DiagnosticCollection
): void {
  // Clear all existing diagnostics
  diagnosticCollection.clear();

  // Group issues by file
  const issuesByFile = new Map<string, vscode.Diagnostic[]>();

  for (const issue of result.issues) {
    const filePath = issue.file;

    if (!issuesByFile.has(filePath)) {
      issuesByFile.set(filePath, []);
    }

    const severity =
      issue.severity === 'error'
        ? vscode.DiagnosticSeverity.Error
        : vscode.DiagnosticSeverity.Warning;

    // Create diagnostic at first line (we don't have line numbers from static analysis)
    const range = new vscode.Range(0, 0, 0, 100);

    const diagnostic = new vscode.Diagnostic(range, issue.message, severity);
    diagnostic.source = INTEGRITY_SOURCE;
    diagnostic.code = issue.type;

    // Add related information if available
    if (issue.featureKey) {
      diagnostic.relatedInformation = [
        new vscode.DiagnosticRelatedInformation(
          new vscode.Location(vscode.Uri.file(filePath), range),
          `Referenced by feature: ${issue.featureKey}`
        ),
      ];
    }

    issuesByFile.get(filePath)!.push(diagnostic);
  }

  // Set diagnostics for each file
  for (const [filePath, diagnostics] of issuesByFile) {
    diagnosticCollection.set(vscode.Uri.file(filePath), diagnostics);
  }
}

/**
 * Add integrity warnings for a single document based on cached analysis.
 */
export function addIntegrityDiagnosticsForDocument(
  document: vscode.TextDocument,
  diagnostics: vscode.Diagnostic[]
): void {
  if (!integrityResult) return;

  const filePath = document.uri.fsPath;
  const code = document.getText();

  // Check if this is a feature file
  if (isFeatureFile(filePath)) {
    const feature = scanFeatureSource(code, filePath);

    // Check for unresolved refs in this feature
    const checkRefs = (
      refs: { name: string; version: number }[],
      inventory: Map<string, unknown>,
      refType: string
    ) => {
      for (const ref of refs) {
        const key = `${ref.name}.v${ref.version}`;
        if (!inventory.has(key)) {
          const diagnostic = new vscode.Diagnostic(
            findRefRange(document, ref.name),
            `${refType} ${ref.name}.v${ref.version} not found`,
            vscode.DiagnosticSeverity.Error
          );
          diagnostic.source = INTEGRITY_SOURCE;
          diagnostic.code = 'unresolved-ref';
          diagnostics.push(diagnostic);
        }
      }
    };

    checkRefs(
      feature.operations,
      integrityResult.inventory.operations,
      'Operation'
    );
    checkRefs(feature.events, integrityResult.inventory.events, 'Event');
    checkRefs(
      feature.presentations,
      integrityResult.inventory.presentations,
      'Presentation'
    );
    checkRefs(
      feature.experiments,
      integrityResult.inventory.experiments,
      'Experiment'
    );

    return;
  }

  // Check if this spec is orphaned
  if (isSpecFile(filePath)) {
    const spec = scanSpecSource(code, filePath);

    if (spec.name && spec.version !== undefined) {
      const isOrphaned = integrityResult.orphanedSpecs.some(
        (orphan) =>
          orphan.name === spec.name &&
          orphan.version === spec.version &&
          orphan.file === filePath
      );

      if (isOrphaned) {
        const diagnostic = new vscode.Diagnostic(
          findNameRange(document),
          `This ${spec.specType} is not linked to any feature`,
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = INTEGRITY_SOURCE;
        diagnostic.code = 'orphaned';
        diagnostics.push(diagnostic);
      }
    }
  }
}

/**
 * Find the range where a ref name appears in the document.
 */
function findRefRange(
  document: vscode.TextDocument,
  refName: string
): vscode.Range {
  const text = document.getText();
  const index = text.indexOf(`'${refName}'`) ?? text.indexOf(`"${refName}"`);

  if (index !== -1) {
    const start = document.positionAt(index);
    const end = document.positionAt(index + refName.length + 2);
    return new vscode.Range(start, end);
  }

  return document.lineAt(0).range;
}

/**
 * Find the range where the spec name is declared.
 */
function findNameRange(document: vscode.TextDocument): vscode.Range {
  const text = document.getText();
  const match = text.match(/name:\s*['"]([^'"]+)['"]/);

  if (match) {
    const index = match.index ?? 0;
    const start = document.positionAt(index);
    const end = document.positionAt(index + match[0].length);
    return new vscode.Range(start, end);
  }

  return document.lineAt(0).range;
}
