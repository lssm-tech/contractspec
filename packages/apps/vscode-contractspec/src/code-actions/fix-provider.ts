import * as vscode from 'vscode';
import {
  createNodeAdapters,
  fix,
  type IntegrityIssue,
} from '@contractspec/bundle.workspace';
import { getIntegrityResult } from '../diagnostics/index';

// Initialize fix service for getting strategies
const adapters = createNodeAdapters({});

let fixService: fix.FixService | undefined;

async function getFixService(): Promise<fix.FixService> {
  if (!fixService) {
    const nodeAdapters = await adapters;
    fixService = new fix.FixService(nodeAdapters);
  }
  return fixService;
}

/**
 * Provides code actions for integrity issues.
 */
export class FixCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  async provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    _token: vscode.CancellationToken
  ): Promise<vscode.CodeAction[]> {
    const actions: vscode.CodeAction[] = [];
    const analysisResult = getIntegrityResult();

    if (!analysisResult) {
      return actions;
    }

    const service = await getFixService();

    // Find diagnostics related to integrity
    const integrityDiagnostics = context.diagnostics.filter(
      (d) => d.source === 'ContractSpec Integrity'
    );

    for (const diagnostic of integrityDiagnostics) {
      // Find the corresponding issue in the analysis result
      // We match by file and message/type roughly, or we need a better ID
      // diagnostics/index.ts puts diagnostic.code = issue.type

      const issue = this.findIssue(
        analysisResult.issues,
        document.uri.fsPath,
        diagnostic
      );

      if (issue) {
        const fixable = service.getToFix(issue);
        if (fixable) {
          for (const strategyType of fixable.availableStrategies) {
            const strategyLabel = strategyType
              .split('-')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' ');
            const action = new vscode.CodeAction(
              strategyLabel,
              vscode.CodeActionKind.QuickFix
            );

            // Mark as preferred if it's the recommended one
            action.isPreferred = strategyType === 'implement-skeleton';

            // Connect to the command we registered
            action.command = {
              command: 'contractspec.fixIssue',
              title: strategyLabel,
              arguments: [fixable, strategyType],
            };

            action.diagnostics = [diagnostic];
            actions.push(action);
          }
        }
      }
    }

    return actions;
  }

  private findIssue(
    issues: IntegrityIssue[],
    filePath: string,
    diagnostic: vscode.Diagnostic
  ): IntegrityIssue | undefined {
    // Exact match on file and type
    // Note: range might not match exactly if we synthesized it in diagnostics
    return issues.find(
      (i) =>
        i.file === filePath &&
        i.type === diagnostic.code &&
        i.message === diagnostic.message // Stronger match
    );
  }
}
