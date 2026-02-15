import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { type VerificationTier } from '@contractspec/lib.contracts-spec/llm';
import { loadSpecFromSource } from '@contractspec/module.workspace';
import {
  formatVerificationReport,
  verifyImplementationAgainstParsedSpec,
} from '@contractspec/bundle.workspace';

/**
 * Verify implementation against spec.
 */
export async function verifyImplementation(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  // Get spec file
  const specFiles = await vscode.workspace.findFiles(
    '**/*.spec.ts',
    '**/node_modules/**'
  );
  if (specFiles.length === 0) {
    vscode.window.showWarningMessage('No spec files found in workspace');
    return;
  }

  const specItems = specFiles.map((f) => ({
    label: path.basename(f.fsPath),
    description: vscode.workspace.asRelativePath(f.fsPath),
    uri: f,
  }));

  const selectedSpec = await vscode.window.showQuickPick(specItems, {
    placeHolder: 'Select the spec to verify against',
  });

  if (!selectedSpec) return;

  // Get implementation file
  const implFiles = await vscode.workspace.findFiles(
    '**/*.ts',
    '**/node_modules/**'
  );
  const implItems = implFiles
    .filter((f) => !f.fsPath.includes('.spec.') && !f.fsPath.includes('.test.'))
    .map((f) => ({
      label: path.basename(f.fsPath),
      description: vscode.workspace.asRelativePath(f.fsPath),
      uri: f,
    }));

  const selectedImpl = await vscode.window.showQuickPick(implItems, {
    placeHolder: 'Select the implementation file to verify',
  });

  if (!selectedImpl) return;

  await runVerification(
    selectedSpec.uri.fsPath,
    selectedImpl.uri.fsPath,
    outputChannel
  );
}

async function runVerification(
  specPath: string,
  implPath: string,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  try {
    outputChannel.appendLine(
      `Verifying: ${path.basename(implPath)} against ${path.basename(specPath)}`
    );
    outputChannel.show();

    // Pick tier
    const tierPick = await vscode.window.showQuickPick(
      [
        {
          label: 'Tier 1: Structure',
          description: 'Types, exports, imports',
          value: ['structure'] as VerificationTier[],
        },
        {
          label: 'Tier 1+2: Structure & Behavior',
          description: 'Types + scenarios + errors',
          value: ['structure', 'behavior'] as VerificationTier[],
        },
        {
          label: 'All Tiers',
          description: 'Structure + Behavior + AI Review',
          value: ['structure', 'behavior', 'ai_review'] as VerificationTier[],
        },
      ],
      {
        placeHolder: 'Select verification level',
      }
    );

    if (!tierPick) return;

    // Load spec from source (no compilation needed)
    const specs = await loadSpecFromSource(specPath);
    const spec = specs[0];

    if (!spec) {
      vscode.window.showErrorMessage('No spec found in file');
      return;
    }

    const implementationCode = fs.readFileSync(implPath, 'utf-8');

    // Perform basic verification based on parsed spec
    const issues = verifyImplementationAgainstParsedSpec(
      spec,
      implementationCode,
      tierPick.value
    );

    // Create diagnostic collection for issues
    const diagnostics = vscode.languages.createDiagnosticCollection(
      'contractspec-verify'
    );
    const implUri = vscode.Uri.file(implPath);

    const diags: vscode.Diagnostic[] = issues.map((issue) => {
      const severity =
        issue.severity === 'error'
          ? vscode.DiagnosticSeverity.Error
          : issue.severity === 'warning'
            ? vscode.DiagnosticSeverity.Warning
            : vscode.DiagnosticSeverity.Information;

      const range = new vscode.Range(issue.line ?? 0, 0, issue.line ?? 0, 1000);

      const diag = new vscode.Diagnostic(range, issue.message, severity);
      diag.source = 'ContractSpec';
      diag.code = issue.category;
      return diag;
    });

    diagnostics.set(implUri, diags);

    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;

    // Show result summary
    if (errorCount === 0 && warningCount === 0) {
      vscode.window.showInformationMessage(
        `✓ Verification passed! No issues found.`
      );
    } else {
      const markdown = formatVerificationReport(spec, issues);
      const viewReport = await vscode.window.showWarningMessage(
        `✗ Verification found ${errorCount} errors, ${warningCount} warnings`,
        'View Report'
      );

      if (viewReport) {
        const doc = await vscode.workspace.openTextDocument({
          content: markdown,
          language: 'markdown',
        });
        await vscode.window.showTextDocument(doc);
      }
    }

    outputChannel.appendLine(
      `Verification complete: ${errorCount} errors, ${warningCount} warnings`
    );
  } catch (error) {
    outputChannel.appendLine(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    vscode.window.showErrorMessage(
      `Failed to verify: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
