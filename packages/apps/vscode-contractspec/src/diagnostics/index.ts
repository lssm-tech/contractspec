/**
 * Diagnostics provider for ContractSpec extension.
 *
 * Provides real-time validation feedback in the editor including:
 * - Spec structure validation
 * - Integrity analysis (orphaned specs, unresolved refs)
 */

import * as vscode from 'vscode';
import {
  isFeatureFile,
  scanFeatureSource,
  scanSpecSource,
  validateSpecStructure,
} from '@contractspec/module.workspace';
import type {
  IntegrityAnalysisResult,
  SpecImplementationResult,
} from '@contractspec/bundle.workspace';

const DIAGNOSTIC_SOURCE = 'ContractSpec';
const INTEGRITY_SOURCE = 'ContractSpec Integrity';
const IMPLEMENTATION_SOURCE = 'ContractSpec Implementation';

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
    { pattern: /Missing.*key field/, search: 'key:' },
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
 * Get the cached integrity result.
 */
export function getIntegrityResult(): IntegrityAnalysisResult | undefined {
  return integrityResult;
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
  diagnosticCollection?.clear();

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

    issuesByFile.get(filePath)?.push(diagnostic);
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
      refs: { key: string; version: string }[],
      inventory: Map<string, unknown>,
      refType: string
    ) => {
      for (const ref of refs) {
        const key = `${ref.key}.v${ref.version}`;
        if (!inventory.has(key)) {
          const diagnostic = new vscode.Diagnostic(
            findRefRange(document, ref.key),
            `${refType} ${ref.key}.v${ref.version} not found`,
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

    if (spec.key && spec.version !== undefined) {
      const isOrphaned = integrityResult.orphanedSpecs.some(
        (orphan) =>
          orphan.key === spec.key &&
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

// ============================================================================
// Implementation Status Diagnostics
// ============================================================================

// Cache for implementation results by file path
const implementationResults = new Map<string, SpecImplementationResult>();

/**
 * Create implementation diagnostics collection.
 */
export function registerImplementationDiagnostics(
  context: vscode.ExtensionContext
): vscode.DiagnosticCollection {
  const implDiagnostics = vscode.languages.createDiagnosticCollection(
    IMPLEMENTATION_SOURCE
  );
  context.subscriptions.push(implDiagnostics);

  return implDiagnostics;
}

/**
 * Update cached implementation result for a file.
 */
export function updateImplementationResult(
  filePath: string,
  result: SpecImplementationResult
): void {
  implementationResults.set(filePath, result);
}

/**
 * Get cached implementation result for a file.
 */
export function getImplementationResult(
  filePath: string
): SpecImplementationResult | undefined {
  return implementationResults.get(filePath);
}

/**
 * Clear all cached implementation results.
 */
export function clearImplementationResults(): void {
  implementationResults.clear();
}

/**
 * Update implementation diagnostics for a document.
 */
export function updateImplementationDiagnostics(
  document: vscode.TextDocument,
  result: SpecImplementationResult,
  diagnosticCollection: vscode.DiagnosticCollection
): void {
  const diagnostics: vscode.Diagnostic[] = [];

  // Check implementation status
  if (result.status === 'missing') {
    const diagnostic = new vscode.Diagnostic(
      findNameRange(document),
      `No implementations found for ${result.specKey}`,
      vscode.DiagnosticSeverity.Warning
    );
    diagnostic.source = IMPLEMENTATION_SOURCE;
    diagnostic.code = 'missing-implementation';
    diagnostics.push(diagnostic);
  } else if (result.status === 'partial') {
    // Find which implementations are missing
    const missingImpls = result.implementations.filter(
      (i) => !i.exists && i.type !== 'test'
    );

    if (missingImpls.length > 0) {
      const missingPaths = missingImpls.map((i) => i.path).join(', ');
      const diagnostic = new vscode.Diagnostic(
        findNameRange(document),
        `Partial implementation: missing ${missingPaths}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = IMPLEMENTATION_SOURCE;
      diagnostic.code = 'partial-implementation';
      diagnostics.push(diagnostic);
    }

    // Check for missing tests
    const missingTests = result.implementations.filter(
      (i) => !i.exists && i.type === 'test'
    );

    if (missingTests.length > 0) {
      const diagnostic = new vscode.Diagnostic(
        findNameRange(document),
        `Missing test file(s): ${missingTests.map((t) => t.path).join(', ')}`,
        vscode.DiagnosticSeverity.Hint
      );
      diagnostic.source = IMPLEMENTATION_SOURCE;
      diagnostic.code = 'missing-tests';
      diagnostics.push(diagnostic);
    }
  }

  diagnosticCollection.set(document.uri, diagnostics);
}

/**
 * Create implementation diagnostics from a result.
 */
export function createImplementationDiagnostics(
  document: vscode.TextDocument,
  result: SpecImplementationResult
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  if (result.status === 'missing') {
    const diagnostic = new vscode.Diagnostic(
      findNameRange(document),
      `No implementations found for ${result.specKey}`,
      vscode.DiagnosticSeverity.Warning
    );
    diagnostic.source = IMPLEMENTATION_SOURCE;
    diagnostic.code = 'missing-implementation';
    diagnostics.push(diagnostic);
  } else if (result.status === 'partial') {
    const missingImpls = result.implementations.filter(
      (i) => !i.exists && i.type !== 'test'
    );

    if (missingImpls.length > 0) {
      for (const impl of missingImpls) {
        const diagnostic = new vscode.Diagnostic(
          findNameRange(document),
          `Missing ${impl.type}: ${impl.path}`,
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = IMPLEMENTATION_SOURCE;
        diagnostic.code = 'missing-' + impl.type;
        diagnostics.push(diagnostic);
      }
    }
  }

  return diagnostics;
}

/**
 * Add implementation status to diagnostic collection for all open documents.
 */
export async function refreshAllImplementationDiagnostics(
  diagnosticCollection: vscode.DiagnosticCollection
): Promise<void> {
  for (const document of vscode.workspace.textDocuments) {
    const filePath = document.uri.fsPath;
    const result = implementationResults.get(filePath);

    if (result) {
      updateImplementationDiagnostics(document, result, diagnosticCollection);
    }
  }
}
