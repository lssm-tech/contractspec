/**
 * OpenAPI export command for ContractSpec extension.
 *
 * Exports specs to OpenAPI 3.1 specification.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { getWorkspaceAdapters } from '../workspace/adapters';

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
            'No SpecRegistry found. Please create a registry file that exports a SpecRegistry instance.'
          );
          outputChannel.appendLine('❌ No SpecRegistry found');
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
              'Registry file must export a SpecRegistry instance or createRegistry function'
            );
            outputChannel.appendLine('❌ Invalid registry export');
            return;
          }

          // Generate OpenAPI document using the lib
          const { openApiForRegistry } = await import('@lssm/lib.contracts');

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
  adapters: any,
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
    const files = await adapters.fs.glob(pattern, {
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
function convertToYaml(obj: any, indent = 0): string {
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
