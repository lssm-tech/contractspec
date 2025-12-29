/**
 * LLM Integration Commands for ContractSpec VS Code Extension
 *
 * Provides commands for:
 * - Export spec to LLM-friendly markdown
 * - Generate implementation guides
 * - Verify implementations
 * - Copy spec to clipboard
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
  type AgentType,
  type LLMExportFormat,
  type VerificationTier,
} from '@contractspec/lib.contracts/llm';
import {
  loadSpecFromSource,
  specToMarkdown,
} from '@contractspec/module.workspace';
import {
  formatVerificationReport,
  generateCursorRulesFromParsedSpec,
  generateFeatureContextMarkdown,
  generateGuideFromParsedSpec,
  verifyImplementationAgainstParsedSpec,
} from '@contractspec/bundle.workspace';
import { getWorkspaceAdapters } from '../workspace/adapters';
import { extractFilePath as extractFilePathFromItem } from './context-actions';

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

/**
 * Get the current spec file from the active editor.
 */
function getCurrentSpecFile(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return undefined;

  const filePath = editor.document.uri.fsPath;

  // Check for all spec file patterns
  const specPatterns = [
    '.contracts.',
    '.contract.',
    '.operations.',
    '.operation.',
    '.spec.',
    '.feature.',
    '.event.',
    '.events.',
    '.presentation.',
    '.presentations.',
    '.model.',
    '.models.',
    '.capability.',
    '.workflow.',
    '.data-view.',
    '.form.',
    '.migration.',
    '.telemetry.',
    '.experiment.',
    '.app-config.',
    '.integration.',
    '.knowledge.',
    '.policy.',
    '.test-spec.',
  ];

  return specPatterns.some((pattern) => filePath.includes(pattern))
    ? filePath
    : undefined;
}

/**
 * Register all LLM commands.
 */
export function registerLLMCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry?: {
    sendTelemetryEvent: (name: string, props: Record<string, string>) => void;
  }
): void {
  // Export to LLM
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmExport', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmExport',
      });
      await exportToLLM(outputChannel);
    })
  );

  // Generate implementation guide
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmGuide', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmGuide',
      });
      await generateGuide(outputChannel);
    })
  );

  // Verify implementation
  context.subscriptions.push(
    vscode.commands.registerCommand('contractspec.llmVerify', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmVerify',
      });
      await verifyImplementation(outputChannel);
    })
  );

  // Copy spec to clipboard
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'contractspec.llmCopy',
      async (item?: vscode.TreeItem) => {
        telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
          command: 'llmCopy',
        });
        await copySpecForLLM(outputChannel, item);
      }
    )
  );
}
