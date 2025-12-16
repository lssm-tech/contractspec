/**
 * Integrity analysis commands for VS Code.
 */

import * as vscode from 'vscode';
import {
  analyzeIntegrity,
  generateMermaidDiagram,
  type IntegrityAnalysisResult,
} from '@lssm/bundle.contractspec-workspace';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
  updateIntegrityResult,
  updateIntegrityDiagnostics,
} from '../diagnostics/index';
import { getOutputChannel } from '../ui/output-channel';

/**
 * Run integrity analysis and show results.
 */
export async function analyzeIntegrityCommand(
  integrityDiagnostics?: vscode.DiagnosticCollection
): Promise<IntegrityAnalysisResult | undefined> {
  const outputChannel = getOutputChannel();

  try {
    const adapters = getWorkspaceAdapters();

    outputChannel.appendLine('📊 Running contract integrity analysis...');
    outputChannel.show();

    const result = await analyzeIntegrity(
      { fs: adapters.fs, logger: adapters.logger },
      {}
    );

    // Update cached result for diagnostics
    updateIntegrityResult(result);

    // Update integrity diagnostics
    if (integrityDiagnostics) {
      updateIntegrityDiagnostics(result, integrityDiagnostics);
    }

    // Output results
    outputChannel.appendLine('');
    outputChannel.appendLine(`Features: ${result.features.length}`);

    for (const feature of result.features) {
      const hasIssues = result.issues.some(
        (i) => i.featureKey === feature.key && i.severity === 'error'
      );
      const icon = hasIssues ? '✗' : '✓';
      const counts = [
        `${feature.operations.length} ops`,
        `${feature.events.length} events`,
        `${feature.presentations.length} presentations`,
      ].join(', ');

      outputChannel.appendLine(`  ${icon} ${feature.key} (${counts})`);
    }

    outputChannel.appendLine('');
    outputChannel.appendLine('Coverage:');

    for (const [type, stats] of Object.entries(result.coverage.byType)) {
      if (stats.total === 0) continue;

      const percent = Math.round((stats.covered / stats.total) * 100);
      const orphanedNote =
        stats.orphaned > 0 ? ` - ${stats.orphaned} orphaned` : '';

      outputChannel.appendLine(
        `  ${type.padEnd(15)} ${stats.covered}/${stats.total} (${percent}%)${orphanedNote}`
      );
    }

    if (result.issues.length > 0) {
      outputChannel.appendLine('');
      outputChannel.appendLine('Issues:');

      for (const issue of result.issues) {
        const icon = issue.severity === 'error' ? '✗' : '⚠';
        outputChannel.appendLine(`  ${icon} ${issue.type}: ${issue.message}`);
        outputChannel.appendLine(`     ${issue.file}`);
      }
    }

    outputChannel.appendLine('');

    if (result.healthy) {
      outputChannel.appendLine('✅ All contracts are healthy');
      void vscode.window.showInformationMessage(
        'ContractSpec: All contracts are healthy!'
      );
    } else {
      const errorCount = result.issues.filter(
        (i) => i.severity === 'error'
      ).length;
      const warningCount = result.issues.filter(
        (i) => i.severity === 'warning'
      ).length;

      outputChannel.appendLine(
        `❌ Found ${errorCount} error(s) and ${warningCount} warning(s)`
      );

      void vscode.window.showWarningMessage(
        `ContractSpec: Found ${errorCount} error(s) and ${warningCount} warning(s)`
      );
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    outputChannel.appendLine(`❌ Error: ${message}`);
    void vscode.window.showErrorMessage(`ContractSpec: ${message}`);
    return undefined;
  }
}

/**
 * Show feature map as Mermaid diagram.
 */
export async function showFeatureMapCommand(): Promise<void> {
  try {
    const adapters = getWorkspaceAdapters();

    const result = await analyzeIntegrity(
      { fs: adapters.fs, logger: adapters.logger },
      {}
    );

    const diagram = generateMermaidDiagram(result, 'feature-map', {
      showVersions: true,
      maxNodes: 100,
    });

    // Show in a new document
    const doc = await vscode.workspace.openTextDocument({
      content: `# Contract Feature Map\n\n\`\`\`mermaid\n${diagram}\n\`\`\``,
      language: 'markdown',
    });

    await vscode.window.showTextDocument(doc, {
      preview: true,
      viewColumn: vscode.ViewColumn.Beside,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`ContractSpec: ${message}`);
  }
}

/**
 * Show orphaned specs diagram.
 */
export async function showOrphansCommand(): Promise<void> {
  try {
    const adapters = getWorkspaceAdapters();

    const result = await analyzeIntegrity(
      { fs: adapters.fs, logger: adapters.logger },
      {}
    );

    if (result.orphanedSpecs.length === 0) {
      void vscode.window.showInformationMessage(
        'ContractSpec: No orphaned specs found!'
      );
      return;
    }

    const diagram = generateMermaidDiagram(result, 'orphans', {
      showVersions: true,
      maxNodes: 100,
    });

    // Show in a new document
    const doc = await vscode.workspace.openTextDocument({
      content: `# Orphaned Specs\n\nThese specs are not linked to any feature.\n\n\`\`\`mermaid\n${diagram}\n\`\`\``,
      language: 'markdown',
    });

    await vscode.window.showTextDocument(doc, {
      preview: true,
      viewColumn: vscode.ViewColumn.Beside,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`ContractSpec: ${message}`);
  }
}

/**
 * Show dependencies diagram.
 */
export async function showDependenciesCommand(): Promise<void> {
  try {
    const adapters = getWorkspaceAdapters();

    const result = await analyzeIntegrity(
      { fs: adapters.fs, logger: adapters.logger },
      {}
    );

    const diagram = generateMermaidDiagram(result, 'dependencies', {
      showVersions: true,
      maxNodes: 100,
    });

    // Show in a new document
    const doc = await vscode.workspace.openTextDocument({
      content: `# Contract Dependencies\n\n\`\`\`mermaid\n${diagram}\n\`\`\``,
      language: 'markdown',
    });

    await vscode.window.showTextDocument(doc, {
      preview: true,
      viewColumn: vscode.ViewColumn.Beside,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`ContractSpec: ${message}`);
  }
}

/**
 * Register integrity commands.
 */
export function registerIntegrityCommands(
  context: vscode.ExtensionContext,
  integrityDiagnostics: vscode.DiagnosticCollection
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.analyzeIntegrity', () =>
      analyzeIntegrityCommand(integrityDiagnostics)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.showFeatureMap',
      showFeatureMapCommand
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.showOrphans',
      showOrphansCommand
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.showDependencies',
      showDependenciesCommand
    )
  );
}
