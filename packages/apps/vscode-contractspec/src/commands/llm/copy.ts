import * as vscode from 'vscode';
import { type LLMExportFormat } from '@contractspec/lib.contracts/llm';
import {
  loadSpecFromSource,
  specToMarkdown,
} from '@contractspec/module.workspace';
import { generateFeatureContextMarkdown } from '@contractspec/bundle.workspace';
import { getWorkspaceAdapters } from '../../workspace/adapters';
import { extractFilePath as extractFilePathFromItem } from '../context-actions';
import { getCurrentSpecFile } from './utils';

/**
 * Copy current spec to clipboard for LLM use.
 * Supports being called from context menu with a tree item.
 */
export async function copySpecForLLM(
  _outputChannel: vscode.OutputChannel,
  treeItem?: vscode.TreeItem
): Promise<void> {
  // Try to get file path from tree item first, then active editor
  let specFile = treeItem ? extractFilePathFromItem(treeItem) : undefined;
  if (!specFile) {
    specFile = getCurrentSpecFile();
  }

  if (!specFile) {
    vscode.window.showWarningMessage(
      'Open a spec file first or select a spec from the tree'
    );
    return;
  }

  try {
    // Load specs from source (no compilation needed)
    const specs = await loadSpecFromSource(specFile);
    const spec = specs[0];

    if (!spec) {
      vscode.window.showErrorMessage('No spec found in file');
      return;
    }

    // Pick format quickly
    const formatPick = await vscode.window.showQuickPick(
      [
        { label: 'Full', value: 'full' as LLMExportFormat },
        { label: 'Context', value: 'context' as LLMExportFormat },
        { label: 'Prompt', value: 'prompt' as LLMExportFormat },
      ],
      {
        placeHolder: 'Format',
      }
    );

    if (!formatPick) return;

    let markdown: string;
    if (spec.specType === 'feature' && formatPick.value === 'full') {
      const adapters = getWorkspaceAdapters();
      markdown = await generateFeatureContextMarkdown(spec, adapters);
    } else {
      markdown = specToMarkdown(spec, formatPick.value);
    }

    await vscode.env.clipboard.writeText(markdown);
    vscode.window.showInformationMessage(
      `${spec.meta.key} copied (${formatPick.label}, ${markdown.split(/\s+/).length} words)`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
