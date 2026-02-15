/**
 * OpenAPI commands for ContractSpec extension.
 *
 * Supports import, export, and validate operations.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import type { WorkspaceAdapters } from '../workspace/adapters';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
  importFromOpenApiService,
  loadWorkspaceConfig,
} from '@contractspec/bundle.workspace';
import { parseOpenApi } from '@contractspec/lib.contracts-transformers/openapi';

/**
 * Export specs to OpenAPI document.
 */
export async function exportToOpenApi(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Exporting to OpenAPI ===');
  outputChannel.show(true);

  try {
    // Ask for output location
    const defaultPath = path.join(
      workspaceFolders[0].uri.fsPath,
      'openapi.json'
    );
    const uri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(defaultPath),
      filters: {
        JSON: ['json'],
        YAML: ['yaml', 'yml'],
      },
      saveLabel: 'Export OpenAPI',
    });

    if (!uri) {
      return;
    }

    const outputPath = uri.fsPath;
    outputChannel.appendLine(`Output: ${outputPath}`);

    // Ask for OpenAPI metadata
    const title = await vscode.window.showInputBox({
      prompt: 'API Title',
      placeHolder: 'My API',
      value: 'ContractSpec API',
    });

    if (!title) {
      return;
    }

    const version = await vscode.window.showInputBox({
      prompt: 'API Version',
      placeHolder: '1.0.0',
      value: '1.0.0',
    });

    if (!version) {
      return;
    }

    const description = await vscode.window.showInputBox({
      prompt: 'API Description (optional)',
      placeHolder: 'API generated from ContractSpec',
    });

    const serverUrl = await vscode.window.showInputBox({
      prompt: 'Server URL (optional)',
      placeHolder: 'https://api.example.com',
    });

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Exporting to OpenAPI',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Generating OpenAPI document...' });

        const adapters = getWorkspaceAdapters();

        // Note: We need to load the registry from the workspace
        // For now, show a message that this requires a registry file
        const registryPath = await findRegistryFile(
          adapters,
          workspaceFolders[0].uri.fsPath
        );

        if (!registryPath) {
          vscode.window.showWarningMessage(
            'No OperationSpecRegistry found. Please create a registry file that exports a OperationSpecRegistry instance.'
          );
          outputChannel.appendLine('❌ No OperationSpecRegistry found');
          return;
        }

        outputChannel.appendLine(`Using registry: ${registryPath}`);

        try {
          // Import the registry module
          const registryModule = await import(registryPath);
          const registry =
            registryModule.default ||
            registryModule.registry ||
            (typeof registryModule.createRegistry === 'function'
              ? await registryModule.createRegistry()
              : null);

          if (!registry) {
            vscode.window.showErrorMessage(
              'Registry file must export a OperationSpecRegistry instance or createRegistry function'
            );
            outputChannel.appendLine('❌ Invalid registry export');
            return;
          }

          // Generate OpenAPI document using the lib
          const { openApiForRegistry } =
            await import('@contractspec/lib.contracts-spec/openapi');

          const servers = serverUrl ? [{ url: serverUrl }] : undefined;

          const doc = openApiForRegistry(registry, {
            title,
            version,
            description: description || undefined,
            servers,
          });

          // Write to file
          const isYaml =
            outputPath.endsWith('.yaml') || outputPath.endsWith('.yml');
          const content = isYaml
            ? convertToYaml(doc)
            : JSON.stringify(doc, null, 2);

          await adapters.fs.writeFile(outputPath, content);

          outputChannel.appendLine(
            `✅ OpenAPI document written to: ${outputPath}`
          );
          vscode.window.showInformationMessage(
            `OpenAPI exported to ${path.basename(outputPath)}`
          );

          // Ask to open file
          const open = await vscode.window.showInformationMessage(
            'Open exported file?',
            'Open',
            'Close'
          );

          if (open === 'Open') {
            const doc = await vscode.workspace.openTextDocument(outputPath);
            await vscode.window.showTextDocument(doc);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to generate OpenAPI: ${message}`);
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`OpenAPI export failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Find registry file in workspace.
 */
async function findRegistryFile(
  adapters: WorkspaceAdapters,
  workspaceRoot: string
): Promise<string | null> {
  // Look for common registry file patterns
  const patterns = [
    '**/registry.ts',
    '**/spec-registry.ts',
    '**/specs/index.ts',
    '**/contracts/registry.ts',
  ];

  for (const pattern of patterns) {
    const files = await adapters.fs.glob({
      pattern,
      cwd: workspaceRoot,
      ignore: ['node_modules/**', 'dist/**'],
      absolute: true,
    });

    if (files.length > 0) {
      return files[0];
    }
  }

  return null;
}

/**
 * Convert JSON to YAML (simple implementation).
 */
function convertToYaml(obj: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}-\n${convertToYaml(item, indent + 1)}`;
      } else {
        yaml += `${spaces}- ${item}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${convertToYaml(value, indent + 1)}`;
      } else if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${convertToYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
      }
    }
  }

  return yaml;
}

/**
 * Import specs from an OpenAPI document.
 */
/**
 * Import specs from an OpenAPI document.
 */
export async function importFromOpenApiCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Importing from OpenAPI ===');
  outputChannel.show(true);

  try {
    // Ask for input method
    const inputMethod = await vscode.window.showQuickPick(
      [
        { label: 'URL', description: 'Fetch from URL' },
        { label: 'File', description: 'Select local file' },
      ],
      { placeHolder: 'Select OpenAPI source' }
    );

    if (!inputMethod) {
      return;
    }

    let source: string;

    if (inputMethod.label === 'URL') {
      const url = await vscode.window.showInputBox({
        prompt: 'OpenAPI URL',
        placeHolder: 'https://api.example.com/openapi.json',
        validateInput: (value) => {
          try {
            new URL(value);
            return null;
          } catch {
            return 'Invalid URL';
          }
        },
      });

      if (!url) {
        return;
      }
      source = url;
    } else {
      const fileUris = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectMany: false,
        filters: {
          OpenAPI: ['json', 'yaml', 'yml'],
        },
        openLabel: 'Select OpenAPI File',
      });

      if (!fileUris || fileUris.length === 0) {
        return;
      }
      source = fileUris[0].fsPath;
    }

    outputChannel.appendLine(`Source: ${source}`);

    // Ask for output directory
    const defaultOutputDir = path.join(
      workspaceFolders[0].uri.fsPath,
      'src',
      'specs'
    );
    const outputDir = await vscode.window.showInputBox({
      prompt: 'Output directory for generated specs',
      value: defaultOutputDir,
    });

    if (!outputDir) {
      return;
    }

    // Ask for prefix
    const prefix = await vscode.window.showInputBox({
      prompt: 'Prefix for spec names (optional)',
      placeHolder: 'api',
    });

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Importing from OpenAPI',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Processing...' });

        const adapters = getWorkspaceAdapters();
        const rootPath = workspaceFolders[0].uri.fsPath;
        const config = await loadWorkspaceConfig(adapters.fs, rootPath);

        const result = await importFromOpenApiService(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config as any,
          {
            source,
            outputDir,
            prefix: prefix || undefined,
          },
          adapters
        );

        // Show results
        outputChannel.appendLine(`\n📊 Import summary:`);
        outputChannel.appendLine(`  Imported: ${result.imported}`);
        outputChannel.appendLine(`  Skipped: ${result.skipped}`);
        outputChannel.appendLine(`  Errors: ${result.errors}`);

        if (result.skippedOperations.length > 0) {
          outputChannel.appendLine(`\nSkipped operations:`);
          for (const skipped of result.skippedOperations) {
            outputChannel.appendLine(
              `  - ${skipped.operationId}: ${skipped.reason}`
            );
          }
        }

        if (result.errorMessages.length > 0) {
          outputChannel.appendLine(`\nErrors:`);
          for (const error of result.errorMessages) {
            outputChannel.appendLine(
              `  - ${error.operationId}: ${error.error}`
            );
          }
        }

        vscode.window.showInformationMessage(
          `Imported ${result.imported} specs from OpenAPI`
        );
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`OpenAPI import failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Validate specs against an OpenAPI source.
 */
export async function validateAgainstOpenApiCommand(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  outputChannel.appendLine('\n=== Validating against OpenAPI ===');
  outputChannel.show(true);

  try {
    // Ask for OpenAPI source
    const sourceInput = await vscode.window.showInputBox({
      prompt: 'OpenAPI source (URL or file path)',
      placeHolder: 'https://api.example.com/openapi.json or ./api.yaml',
    });

    if (!sourceInput) {
      return;
    }

    // Ask for spec directory
    const defaultSpecDir = path.join(
      workspaceFolders[0].uri.fsPath,
      'src',
      'specs'
    );
    const specDir = await vscode.window.showInputBox({
      prompt: 'Spec directory to validate',
      value: defaultSpecDir,
    });

    if (!specDir) {
      return;
    }

    outputChannel.appendLine(`OpenAPI source: ${sourceInput}`);
    outputChannel.appendLine(`Spec directory: ${specDir}`);

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Validating specs',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Parsing OpenAPI document...' });

        const adapters = getWorkspaceAdapters();

        // Parse the OpenAPI document
        const parseResult = await parseOpenApi(sourceInput, {
          fetch: globalThis.fetch,
          readFile: (filePath) => adapters.fs.readFile(filePath),
        });

        outputChannel.appendLine(
          `Parsed ${parseResult.operations.length} operations from ${parseResult.info.title}`
        );

        // Build operations map
        const operationsMap = new Map<
          string,
          (typeof parseResult.operations)[0]
        >();
        for (const op of parseResult.operations) {
          operationsMap.set(op.operationId, op);
        }

        progress.report({ message: 'Validating specs...' });

        // Find spec files
        const specFiles = await adapters.fs.glob({
          pattern: '**/*.ts',
          cwd: specDir,
          ignore: ['node_modules/**', 'dist/**'],
          absolute: true,
        });

        outputChannel.appendLine(`Found ${specFiles.length} spec files`);

        let specsValidated = 0;
        let specsWithDiffs = 0;

        for (const file of specFiles) {
          const content = await adapters.fs.readFile(file);
          const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);

          if (!nameMatch?.[1]) {
            continue;
          }

          specsValidated++;
          const specName = nameMatch[1];
          const matchingOp = operationsMap.get(specName);
          const diffs: string[] = [];

          if (!matchingOp) {
            diffs.push('No matching OpenAPI operation');
          }

          const valid = diffs.length === 0;
          if (!valid) {
            specsWithDiffs++;
            outputChannel.appendLine(`❌ ${specName}`);
            for (const diff of diffs) {
              outputChannel.appendLine(`   - ${diff}`);
            }
          } else {
            outputChannel.appendLine(`✅ ${specName}`);
          }
        }

        // Show results
        outputChannel.appendLine(`\n📊 Validation summary:`);
        outputChannel.appendLine(`  Specs validated: ${specsValidated}`);
        outputChannel.appendLine(`  Specs with differences: ${specsWithDiffs}`);

        if (specsWithDiffs === 0) {
          vscode.window.showInformationMessage(
            `All ${specsValidated} specs are valid!`
          );
        } else {
          vscode.window.showWarningMessage(
            `${specsWithDiffs} of ${specsValidated} specs have differences`
          );
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`OpenAPI validation failed: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}
