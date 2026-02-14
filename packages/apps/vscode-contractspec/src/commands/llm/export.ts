import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { type LLMExportFormat } from '@contractspec/lib.contracts-spec/llm';
import {
  loadSpecFromSource,
  specToMarkdown,
} from '@contractspec/module.workspace';
import { generateFeatureContextMarkdown } from '@contractspec/bundle.workspace';
import { getWorkspaceAdapters } from '../../workspace/adapters';
import { getCurrentSpecFile } from './utils';

/**
 * Export current spec to LLM-friendly markdown.
 */
export async function exportToLLM(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const specFile = getCurrentSpecFile();

  if (!specFile) {
    // Ask user to select a spec file
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
      placeHolder: 'Select a spec to export',
    });

    if (!selected) return;

    await exportSpecFile(selected.uri.fsPath, outputChannel);
  } else {
    await exportSpecFile(specFile, outputChannel);
  }
}

async function exportSpecFile(
  specPath: string,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  try {
    outputChannel.appendLine(`Exporting spec: ${specPath}`);
    outputChannel.show();

    // Pick format
    const formatPick = await vscode.window.showQuickPick(
      [
        {
          label: 'Full',
          description: 'Complete spec with all details',
          value: 'full' as LLMExportFormat,
        },
        {
          label: 'Context',
          description: 'Summary for understanding',
          value: 'context' as LLMExportFormat,
        },
        {
          label: 'Prompt',
          description: 'Actionable implementation prompt',
          value: 'prompt' as LLMExportFormat,
        },
      ],
      {
        placeHolder: 'Select export format',
      }
    );

    if (!formatPick) return;

    // Load specs from source (no compilation needed)
    const specs = await loadSpecFromSource(specPath);

    if (specs.length === 0) {
      vscode.window.showErrorMessage(
        `No spec definitions found in ${path.basename(specPath)}`
      );
      return;
    }

    // If multiple specs, let user pick one or export all
    let selectedSpecs = specs;
    if (specs.length > 1) {
      const specPick = await vscode.window.showQuickPick(
        [
          {
            label: '📦 All specs',
            description: `Export all ${specs.length} specs`,
            value: 'all',
          },
          ...specs.map((s) => ({
            label: s.meta.key,
            description: `${s.specType}${s.kind ? ` (${s.kind})` : ''}`,
            value: s.meta.key,
          })),
        ],
        { placeHolder: 'Select spec to export' }
      );
      if (!specPick) return;
      if (specPick.value !== 'all') {
        selectedSpecs = specs.filter((s) => s.meta.key === specPick.value);
      }
    }

    // Generate markdown for each selected spec
    const markdownParts = [];
    for (const spec of selectedSpecs) {
      if (spec.specType === 'feature' && formatPick.value === 'full') {
        // Special handling for features with full context
        const adapters = getWorkspaceAdapters();
        const content = await generateFeatureContextMarkdown(spec, adapters);
        markdownParts.push(content);
      } else {
        markdownParts.push(specToMarkdown(spec, formatPick.value));
      }
    }

    const markdown = markdownParts.join('\n\n---\n\n');

    // Show options: copy, save, or open in new doc
    const action = await vscode.window.showQuickPick(
      [
        { label: '📋 Copy to Clipboard', value: 'copy' },
        { label: '💾 Save to File', value: 'save' },
        { label: '📄 Open in New Tab', value: 'open' },
      ],
      {
        placeHolder: 'What would you like to do?',
      }
    );

    if (!action) return;

    if (action.value === 'copy') {
      await vscode.env.clipboard.writeText(markdown);
      vscode.window.showInformationMessage(
        `Spec copied to clipboard (${markdown.split(/\s+/).length} words)`
      );
    } else if (action.value === 'save') {
      const savePath = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(specPath.replace(/\.ts$/, '.md')),
        filters: { Markdown: ['md'] },
      });
      if (savePath) {
        fs.writeFileSync(savePath.fsPath, markdown);
        vscode.window.showInformationMessage(
          `Saved to ${path.basename(savePath.fsPath)}`
        );
      }
    } else if (action.value === 'open') {
      const doc = await vscode.workspace.openTextDocument({
        content: markdown,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc);
    }

    outputChannel.appendLine(
      `Export complete: ${formatPick.label} format, ${markdown.split(/\s+/).length} words`
    );
  } catch (error) {
    outputChannel.appendLine(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    vscode.window.showErrorMessage(
      `Failed to export spec: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
