import * as vscode from 'vscode';
import * as path from 'path';
import {
  createNodeAdapters,
  TestGeneratorService,
  TestService,
  runTestSpecs,
  listTests,
} from '@contractspec/bundle.workspace';
import { generateText } from '@contractspec/lib.ai-agent';
import { OperationSpecRegistry } from '@contractspec/lib.contracts';
import { loadTypeScriptModule } from '../workspace/module-loader'; // Custom loader for VSCode or similar?
// In extension, we might not have 'fs' access same way or module loading might differ.
// But assuming node environment for extension host:
import { createOpenAI } from '@ai-sdk/openai';

export async function generateTestsCommand(
  uri: vscode.Uri,
  context: vscode.ExtensionContext
) {
  if (!uri) {
    // Try currently active editor
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      uri = editor.document.uri;
    } else {
      vscode.window.showErrorMessage('No file selected to generate tests for.');
      return;
    }
  }

  // Basic validation that it's a TS file
  if (!uri.fsPath.endsWith('.ts')) {
    vscode.window.showErrorMessage(
      'Test generation only supports TypeScript files.'
    );
    return;
  }

  // We need to implement module loading in VSCode context carefully.
  // Often better to delegate to a CLI or language server.
  // For now, we'll try to use the same logic as CLI, but loading modules in extension host might reference extension's node_modules vs workspace's.
  // Since `bundle.workspace` is bundled, we rely on dynamic import or similar.
  // If `bundle.workspace` uses `import()` it might work if paths are absolute.

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Generating tests for ${path.basename(uri.fsPath)}...`,
      cancellable: false,
    },
    async (progress) => {
      try {
        const adapters = createNodeAdapters({
          cwd:
            vscode.workspace.getWorkspaceFolder(uri)?.uri.fsPath ||
            path.dirname(uri.fsPath),
        });

        // Setup AI
        // This requires API key. Extension config should have it or ENV.
        // We'll peek at process.env or config
        const config = vscode.workspace.getConfiguration('contractspec');
        // Check standard env var or config
        // NOTE: In VSCode ext, process.env might not have user shell envs unless launched from shell.
        // Typically rely on Settings.

        // Mocking for now as we don't have settings migration yet
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error(
            'OPENAI_API_KEY not found in environment. Please configure AI provider.'
          );
        }

        const openai = createOpenAI({ apiKey });
        const model = openai('gpt-4-turbo');

        const generator = new TestGeneratorService(adapters.logger, model);

        // We need to load the module.
        // CAUTION: 'loadTypeScriptModule' uses 'bundle-require' or 'jiti' usually.
        // We need to ensure it works in extension context.
        // If 'loadTypeScriptModule' is imported from bundle.workspace, check if it's exported.
        // It resides in 'utils/module-loader' in CLI. Bundle might NOT export it.
        // I checked bundle exports in Step 201: `export * as utils from './utils/index'`.
        // Let's assume `utils.loadTypeScriptModule` exists.

        // However, I can't easily check internal bundle exports without digging.
        // If it fails, we might need a workaround.
        // But let's proceed assuming we can load it.

        // Actually, in the CLI implementation I imported `loadTypeScriptModule` from `../../utils/module-loader`.
        // The `bundle.workspace` re-exports keys.
        // Let's rely on `adapters` or `utils` if available.

        // Wait, for VSCode I should probably spawn the CLI?
        // Spawning CLI is often safer for environment/dependencies than running in ext host.
        // But user asked for "Integration".
        // Let's try to reuse logic if possible to keep it "Agentic".
        // But loading user code in extension host is risky (pollution, types).
        // CLI is separate process.

        // DECISION: Spawn CLI command `contractspec test <file> --generate --json`
        // This avoids all module loading issues in Extension Host and reuses CLI logic I just built.

        // But need to find CLI path.
        // Usually `npx contractspec` or looking for installed binary in workspace.

        // Let's implement the "Spawn CLI" approach for stability.

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) throw new Error('File not in a workspace.');

        const relativePath = path.relative(
          workspaceFolder.uri.fsPath,
          uri.fsPath
        );

        // Construct task/process
        // We can use vscode.Terminal or cp.exec
        // Terminal is better for user visibility.

        const terminal = vscode.window.createTerminal('ContractSpec Test Gen');
        terminal.show();
        terminal.sendText(`npx contractspec test "${relativePath}" --generate`);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Generation failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );
}

export async function runSpecTestsCommand(
  uri: vscode.Uri,
  context: vscode.ExtensionContext
) {
  if (!uri) {
    const editor = vscode.window.activeTextEditor;
    if (editor) uri = editor.document.uri;
    else {
      vscode.window.showErrorMessage('No file selected.');
      return;
    }
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('File not in workspace.');
    return;
  }

  const relativePath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
  const terminal = vscode.window.createTerminal('ContractSpec Run Tests');
  terminal.show();
  terminal.sendText(`npx contractspec test "${relativePath}"`);
}
