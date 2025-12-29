/**
 * Integrity analysis commands for VS Code.
 */

import * as vscode from 'vscode';
import {
  analyzeIntegrity,
  generateMermaidDiagram,
  type IntegrityAnalysisResult,
  templates,
} from '@contractspec/bundle.workspace';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
  updateIntegrityDiagnostics,
  updateIntegrityResult,
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
 * Link orphaned spec to an existing feature.
 */
export async function linkToFeatureCommand(
  specName: string,
  specVersion: number,
  specType: string,
  specFile?: string
): Promise<void> {
  try {
    const adapters = getWorkspaceAdapters();

    // Get all features
    const result = await analyzeIntegrity(
      { fs: adapters.fs, logger: adapters.logger },
      {}
    );

    if (result.features.length === 0) {
      const createNew = await vscode.window.showInformationMessage(
        'No features found. Would you like to create a new feature?',
        'Create Feature',
        'Cancel'
      );

      if (createNew === 'Create Feature') {
        await createFeatureFromOrphansCommand([
          {
            name: specName,
            version: specVersion,
            type: specType,
            file: specFile ?? '',
          },
        ]);
      }
      return;
    }

    // Show quick pick to select a feature
    const featureItems = result.features.map((f) => ({
      label: f.title ?? f.key,
      description: f.key,
      detail: f.description,
      feature: f,
    }));

    const selected = await vscode.window.showQuickPick(featureItems, {
      placeHolder: `Select feature to link ${specName}.v${specVersion}`,
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (!selected) {
      return;
    }

    // Open the feature file and show where to add the spec
    if (selected.feature.filePath) {
      const featureUri = vscode.Uri.file(selected.feature.filePath);
      const document = await vscode.workspace.openTextDocument(featureUri);
      const editor = await vscode.window.showTextDocument(document);

      // Find the appropriate array to add to based on spec type
      const arrayName = getArrayNameForSpecType(specType);
      const text = document.getText();

      // Find the array in the document
      const arrayPattern = new RegExp(`${arrayName}\\s*:\\s*\\[`, 'g');
      const match = arrayPattern.exec(text);

      if (match) {
        const position = document.positionAt(match.index + match[0].length);

        // Create the ref to insert
        const refText = `\n    { name: '${specName}', version: ${specVersion} },`;

        // Insert the ref
        await editor.edit((editBuilder) => {
          editBuilder.insert(position, refText);
        });

        // Show success message
        void vscode.window.showInformationMessage(
          `Added ${specName}.v${specVersion} to ${selected.feature.key}.${arrayName}`
        );
      } else {
        // Couldn't find the array, show manual instruction
        void vscode.window.showWarningMessage(
          `Please add { name: '${specName}', version: ${specVersion} } to the ${arrayName} array manually.`
        );
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`ContractSpec: ${message}`);
  }
}

/**
 * Create a new feature from orphaned specs.
 */
export async function createFeatureFromOrphansCommand(
  orphans: { name: string; version: string; type: string; file: string }[]
): Promise<void> {
  try {
    // Get feature key from user
    const featureKey = await vscode.window.showInputBox({
      prompt: 'Enter the feature key (e.g., user-management)',
      placeHolder: 'my-feature',
      validateInput: (value) => {
        if (!value) return 'Feature key is required';
        if (!/^[a-z][a-z0-9-]*$/.test(value)) {
          return 'Feature key must be lowercase, start with a letter, and contain only letters, numbers, and hyphens';
        }
        return undefined;
      },
    });

    if (!featureKey) {
      return;
    }

    // Get feature title from user
    const featureTitle = await vscode.window.showInputBox({
      prompt: 'Enter the feature title',
      placeHolder: 'My Feature',
      value: featureKey
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    });

    if (!featureTitle) {
      return;
    }

    // Group orphans by type
    const operations = orphans.filter(
      (o) =>
        o.type === 'operation' || o.type === 'command' || o.type === 'query'
    );
    const events = orphans.filter((o) => o.type === 'event');
    const presentations = orphans.filter((o) => o.type === 'presentation');
    const experiments = orphans.filter((o) => o.type === 'experiment');

    // Generate feature file content
    const featureContent = templates.generateFeatureSpec({
      key: featureKey,
      title: featureTitle,
      owners: [],
      tags: [],
      operations,
      events,
      presentations,
      experiments,
    });

    // Ask where to save the file
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      void vscode.window.showErrorMessage('No workspace folder open');
      return;
    }

    const defaultUri = vscode.Uri.joinPath(
      workspaceFolders[0].uri,
      'src',
      `${featureKey}.feature.ts`
    );

    const saveUri = await vscode.window.showSaveDialog({
      defaultUri,
      filters: {
        'TypeScript Files': ['ts'],
      },
      saveLabel: 'Create Feature',
    });

    if (!saveUri) {
      return;
    }

    // Write the file
    await vscode.workspace.fs.writeFile(
      saveUri,
      Buffer.from(featureContent, 'utf-8')
    );

    // Open the new file
    const document = await vscode.workspace.openTextDocument(saveUri);
    await vscode.window.showTextDocument(document);

    void vscode.window.showInformationMessage(
      `Created feature: ${featureKey} with ${orphans.length} spec(s)`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`ContractSpec: ${message}`);
  }
}

/**
 * Get array name in feature spec for a given spec type.
 */
function getArrayNameForSpecType(specType: string): string {
  switch (specType) {
    case 'operation':
    case 'command':
    case 'query':
      return 'operations';
    case 'event':
      return 'events';
    case 'presentation':
      return 'presentations';
    case 'experiment':
      return 'experiments';
    default:
      return 'operations';
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

  // Orphan spec actions
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.linkToFeature',
      (item: {
        spec?: { name: string; version: string; type: string; file?: string };
      }) => {
        if (item?.spec) {
          return linkToFeatureCommand(
            item.spec.name,
            item.spec.version,
            item.spec.type,
            item.spec.file
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.createFeatureFromOrphans',
      async () => {
        // Get orphaned specs from integrity analysis
        const adapters = getWorkspaceAdapters();
        const result = await analyzeIntegrity(
          { fs: adapters.fs, logger: adapters.logger },
          {}
        );

        if (result.orphanedSpecs.length === 0) {
          void vscode.window.showInformationMessage(
            'No orphaned specs to create feature from.'
          );
          return;
        }

        // Show quick pick to select which orphans to include
        const items = result.orphanedSpecs.map((spec) => ({
          label: `${spec.key}.v${spec.version}`,
          description: spec.type,
          detail: spec.file,
          picked: true,
          spec,
        }));

        const selected = await vscode.window.showQuickPick(items, {
          canPickMany: true,
          placeHolder: 'Select specs to include in the new feature',
        });

        if (!selected || selected.length === 0) {
          return;
        }

        await createFeatureFromOrphansCommand(
          selected.map((s) => ({
            name: s.spec.key,
            version: s.spec.version,
            type: s.spec.type,
            file: s.spec.file,
          }))
        );
      }
    )
  );
}
