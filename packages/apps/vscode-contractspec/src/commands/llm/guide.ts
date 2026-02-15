import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { type AgentType } from '@contractspec/lib.contracts-spec/llm';
import { loadSpecFromSource } from '@contractspec/module.workspace';
import {
  generateCursorRulesFromParsedSpec,
  generateGuideFromParsedSpec,
} from '@contractspec/bundle.workspace';
import { getCurrentSpecFile } from './utils';

/**
 * Generate implementation guide for an AI agent.
 */
export async function generateGuide(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const specFile = getCurrentSpecFile();

  if (!specFile) {
    const files = await vscode.workspace.findFiles(
      '**/*.spec.ts',
      '**/node_modules/**'
    );
    if (files.length === 0) {
      vscode.window.showWarningMessage('No spec files found in workspace');
      return;
    }

    const items = files.map((f) => ({
      label: path.basename(f.fsPath),
      description: vscode.workspace.asRelativePath(f.fsPath),
      uri: f,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a spec to generate guide for',
    });

    if (!selected) return;

    await generateGuideForSpec(selected.uri.fsPath, outputChannel);
  } else {
    await generateGuideForSpec(specFile, outputChannel);
  }
}

async function generateGuideForSpec(
  specPath: string,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  try {
    outputChannel.appendLine(`Generating guide for: ${specPath}`);
    outputChannel.show();

    // Pick agent
    const agentPick = await vscode.window.showQuickPick(
      [
        {
          label: 'Claude Code',
          description: 'Anthropic Claude in extended mode',
          value: 'claude-code' as AgentType,
        },
        {
          label: 'Cursor CLI',
          description: 'Cursor background/composer mode',
          value: 'cursor-cli' as AgentType,
        },
        {
          label: 'Generic MCP',
          description: 'Any MCP-compatible agent',
          value: 'generic-mcp' as AgentType,
        },
      ],
      {
        placeHolder: 'Select target agent',
      }
    );

    if (!agentPick) return;

    // Load specs from source (no compilation needed)
    const specs = await loadSpecFromSource(specPath);
    const spec = specs[0]; // Use first spec

    if (!spec) {
      vscode.window.showErrorMessage('No spec found in file');
      return;
    }

    // Generate a guide based on the parsed spec
    const guide = generateGuideFromParsedSpec(spec, agentPick.value);

    // Show options
    const action = await vscode.window.showQuickPick(
      [
        { label: '📋 Copy to Clipboard', value: 'copy' },
        { label: '📄 Open in New Tab', value: 'open' },
        {
          label: '📝 Generate Cursor Rules',
          value: 'cursor',
          enabled: agentPick.value === 'cursor-cli',
        },
      ].filter((a) => a.enabled !== false),
      {
        placeHolder: 'What would you like to do?',
      }
    );

    if (!action) return;

    if (action.value === 'copy') {
      await vscode.env.clipboard.writeText(guide);
      vscode.window.showInformationMessage(`Guide copied to clipboard!`);
    } else if (action.value === 'open') {
      const doc = await vscode.workspace.openTextDocument({
        content: guide,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc);
    } else if (action.value === 'cursor') {
      // Generate cursor rules from parsed spec
      const cursorRules = generateCursorRulesFromParsedSpec(spec);
      const workspaceRoot =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
      const rulesDir = path.join(workspaceRoot, '.cursor', 'rules');
      const safeName = spec.meta.key.replace(/\./g, '-');
      const rulesPath = path.join(rulesDir, `${safeName}.mdc`);

      const savePath = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(rulesPath),
        filters: { 'Cursor Rules': ['mdc'] },
      });

      if (savePath) {
        const dir = path.dirname(savePath.fsPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(savePath.fsPath, cursorRules);
        vscode.window.showInformationMessage(
          `Cursor rules saved to ${path.basename(savePath.fsPath)}`
        );
      }
    }

    outputChannel.appendLine(`Guide generated for ${spec.meta.key}`);
  } catch (error) {
    outputChannel.appendLine(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    vscode.window.showErrorMessage(
      `Failed to generate guide: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
