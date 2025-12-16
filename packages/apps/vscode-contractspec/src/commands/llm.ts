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
  specToContextMarkdown,
  specToFullMarkdown,
  specToAgentPrompt,
  type LLMExportFormat,
  type AgentType,
  type VerificationTier,
} from '@lssm/lib.contracts/llm';
import {
  createAgentGuideService,
  createVerifyService,
} from '@lssm/bundle.contractspec-workspace';

/**
 * Load a spec from a file path.
 */
async function loadSpec(specPath: string): Promise<any> {
  try {
    const module = await import(specPath);
    for (const [_, value] of Object.entries(module)) {
      if (value && typeof value === 'object' && 'meta' in value && 'io' in value) {
        return value;
      }
    }
    throw new Error('No spec found in module');
  } catch (error) {
    throw new Error(`Failed to load spec: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get the current spec file from the active editor.
 */
function getCurrentSpecFile(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return undefined;
  
  const filePath = editor.document.uri.fsPath;
  if (filePath.includes('.spec.') || filePath.includes('.feature.')) {
    return filePath;
  }
  return undefined;
}

/**
 * Export current spec to LLM-friendly markdown.
 */
export async function exportToLLM(outputChannel: vscode.OutputChannel): Promise<void> {
  const specFile = getCurrentSpecFile();
  
  if (!specFile) {
    // Ask user to select a spec file
    const files = await vscode.workspace.findFiles('**/*.spec.ts', '**/node_modules/**');
    if (files.length === 0) {
      vscode.window.showWarningMessage('No spec files found in workspace');
      return;
    }
    
    const items = files.map(f => ({
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

async function exportSpecFile(specPath: string, outputChannel: vscode.OutputChannel): Promise<void> {
  try {
    outputChannel.appendLine(`Exporting spec: ${specPath}`);
    outputChannel.show();
    
    // Pick format
    const formatPick = await vscode.window.showQuickPick([
      { label: 'Full', description: 'Complete spec with all details', value: 'full' as LLMExportFormat },
      { label: 'Context', description: 'Summary for understanding', value: 'context' as LLMExportFormat },
      { label: 'Prompt', description: 'Actionable implementation prompt', value: 'prompt' as LLMExportFormat },
    ], {
      placeHolder: 'Select export format',
    });
    
    if (!formatPick) return;
    
    const spec = await loadSpec(specPath);
    let markdown: string;
    
    switch (formatPick.value) {
      case 'context':
        markdown = specToContextMarkdown(spec);
        break;
      case 'prompt':
        const taskPick = await vscode.window.showQuickPick([
          { label: 'Implement', value: 'implement' as const },
          { label: 'Test', value: 'test' as const },
          { label: 'Refactor', value: 'refactor' as const },
          { label: 'Review', value: 'review' as const },
        ], {
          placeHolder: 'Select task type',
        });
        markdown = specToAgentPrompt(spec, { taskType: taskPick?.value ?? 'implement' });
        break;
      case 'full':
      default:
        markdown = specToFullMarkdown(spec);
        break;
    }
    
    // Show options: copy, save, or open in new doc
    const action = await vscode.window.showQuickPick([
      { label: '📋 Copy to Clipboard', value: 'copy' },
      { label: '💾 Save to File', value: 'save' },
      { label: '📄 Open in New Tab', value: 'open' },
    ], {
      placeHolder: 'What would you like to do?',
    });
    
    if (!action) return;
    
    if (action.value === 'copy') {
      await vscode.env.clipboard.writeText(markdown);
      vscode.window.showInformationMessage(`Spec copied to clipboard (${markdown.split(/\s+/).length} words)`);
    } else if (action.value === 'save') {
      const savePath = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(specPath.replace(/\.ts$/, '.md')),
        filters: { 'Markdown': ['md'] },
      });
      if (savePath) {
        fs.writeFileSync(savePath.fsPath, markdown);
        vscode.window.showInformationMessage(`Saved to ${path.basename(savePath.fsPath)}`);
      }
    } else if (action.value === 'open') {
      const doc = await vscode.workspace.openTextDocument({
        content: markdown,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc);
    }
    
    outputChannel.appendLine(`Export complete: ${formatPick.label} format, ${markdown.split(/\s+/).length} words`);
  } catch (error) {
    outputChannel.appendLine(`Error: ${error instanceof Error ? error.message : String(error)}`);
    vscode.window.showErrorMessage(`Failed to export spec: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generate implementation guide for an AI agent.
 */
export async function generateGuide(outputChannel: vscode.OutputChannel): Promise<void> {
  const specFile = getCurrentSpecFile();
  
  if (!specFile) {
    const files = await vscode.workspace.findFiles('**/*.spec.ts', '**/node_modules/**');
    if (files.length === 0) {
      vscode.window.showWarningMessage('No spec files found in workspace');
      return;
    }
    
    const items = files.map(f => ({
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

async function generateGuideForSpec(specPath: string, outputChannel: vscode.OutputChannel): Promise<void> {
  try {
    outputChannel.appendLine(`Generating guide for: ${specPath}`);
    outputChannel.show();
    
    // Pick agent
    const agentPick = await vscode.window.showQuickPick([
      { label: 'Claude Code', description: 'Anthropic Claude in extended mode', value: 'claude-code' as AgentType },
      { label: 'Cursor CLI', description: 'Cursor background/composer mode', value: 'cursor-cli' as AgentType },
      { label: 'Generic MCP', description: 'Any MCP-compatible agent', value: 'generic-mcp' as AgentType },
    ], {
      placeHolder: 'Select target agent',
    });
    
    if (!agentPick) return;
    
    const spec = await loadSpec(specPath);
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
    
    const guideService = createAgentGuideService({
      defaultAgent: agentPick.value,
      projectRoot: workspaceRoot,
    });
    
    const result = guideService.generateGuide(spec, { agent: agentPick.value });
    
    // Show options
    const action = await vscode.window.showQuickPick([
      { label: '📋 Copy to Clipboard', value: 'copy' },
      { label: '📄 Open in New Tab', value: 'open' },
      { label: '📝 Generate Cursor Rules', value: 'cursor', enabled: agentPick.value === 'cursor-cli' },
    ].filter(a => a.enabled !== false), {
      placeHolder: 'What would you like to do?',
    });
    
    if (!action) return;
    
    if (action.value === 'copy') {
      const fullPrompt = result.prompt.systemPrompt 
        ? `${result.prompt.systemPrompt}\n\n---\n\n${result.prompt.taskPrompt}`
        : result.prompt.taskPrompt;
      await vscode.env.clipboard.writeText(fullPrompt);
      vscode.window.showInformationMessage(
        `Guide copied! (${result.plan.steps.length} steps, ${result.plan.fileStructure.length} files)`
      );
    } else if (action.value === 'open') {
      const fullPrompt = result.prompt.systemPrompt 
        ? `# System Prompt\n\n${result.prompt.systemPrompt}\n\n---\n\n# Task Prompt\n\n${result.prompt.taskPrompt}`
        : result.prompt.taskPrompt;
      const doc = await vscode.workspace.openTextDocument({
        content: fullPrompt,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(doc);
    } else if (action.value === 'cursor') {
      const cursorRules = guideService.generateAgentConfig(spec, 'cursor-cli');
      if (cursorRules) {
        const rulesDir = path.join(workspaceRoot, '.cursor', 'rules');
        const safeName = spec.meta.name.replace(/\./g, '-');
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
          vscode.window.showInformationMessage(`Cursor rules saved to ${path.basename(savePath.fsPath)}`);
        }
      }
    }
    
    outputChannel.appendLine(`Guide generated: ${result.plan.steps.length} steps, ${result.plan.fileStructure.length} files`);
  } catch (error) {
    outputChannel.appendLine(`Error: ${error instanceof Error ? error.message : String(error)}`);
    vscode.window.showErrorMessage(`Failed to generate guide: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Verify implementation against spec.
 */
export async function verifyImplementation(outputChannel: vscode.OutputChannel): Promise<void> {
  // Get spec file
  const specFiles = await vscode.workspace.findFiles('**/*.spec.ts', '**/node_modules/**');
  if (specFiles.length === 0) {
    vscode.window.showWarningMessage('No spec files found in workspace');
    return;
  }
  
  const specItems = specFiles.map(f => ({
    label: path.basename(f.fsPath),
    description: vscode.workspace.asRelativePath(f.fsPath),
    uri: f,
  }));
  
  const selectedSpec = await vscode.window.showQuickPick(specItems, {
    placeHolder: 'Select the spec to verify against',
  });
  
  if (!selectedSpec) return;
  
  // Get implementation file
  const implFiles = await vscode.workspace.findFiles('**/*.ts', '**/node_modules/**');
  const implItems = implFiles
    .filter(f => !f.fsPath.includes('.spec.') && !f.fsPath.includes('.test.'))
    .map(f => ({
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
    outputChannel.appendLine(`Verifying: ${path.basename(implPath)} against ${path.basename(specPath)}`);
    outputChannel.show();
    
    // Pick tier
    const tierPick = await vscode.window.showQuickPick([
      { label: 'Tier 1: Structure', description: 'Types, exports, imports', value: ['structure'] as VerificationTier[] },
      { label: 'Tier 1+2: Structure & Behavior', description: 'Types + scenarios + errors', value: ['structure', 'behavior'] as VerificationTier[] },
      { label: 'All Tiers', description: 'Structure + Behavior + AI Review', value: ['structure', 'behavior', 'ai_review'] as VerificationTier[] },
    ], {
      placeHolder: 'Select verification level',
    });
    
    if (!tierPick) return;
    
    const spec = await loadSpec(specPath);
    const implementationCode = fs.readFileSync(implPath, 'utf-8');
    
    const verifyService = createVerifyService();
    const result = await verifyService.verify(spec, implementationCode, {
      tiers: tierPick.value,
      includeSuggestions: true,
    });
    
    // Show results
    const markdown = verifyService.formatAsMarkdown(result);
    
    // Create diagnostic collection for issues
    const diagnostics = vscode.languages.createDiagnosticCollection('contractspec-verify');
    const implUri = vscode.Uri.file(implPath);
    
    const diags: vscode.Diagnostic[] = result.allIssues.map(issue => {
      const severity = issue.severity === 'error' 
        ? vscode.DiagnosticSeverity.Error
        : issue.severity === 'warning'
          ? vscode.DiagnosticSeverity.Warning
          : vscode.DiagnosticSeverity.Information;
      
      const range = new vscode.Range(
        issue.location?.line ?? 0,
        issue.location?.column ?? 0,
        issue.location?.line ?? 0,
        1000
      );
      
      const diag = new vscode.Diagnostic(range, issue.message, severity);
      diag.source = 'ContractSpec';
      diag.code = issue.category;
      return diag;
    });
    
    diagnostics.set(implUri, diags);
    
    // Show result summary
    if (result.passed) {
      vscode.window.showInformationMessage(
        `✓ Verification passed! Score: ${result.score}/100`
      );
    } else {
      const errorCount = result.allIssues.filter(i => i.severity === 'error').length;
      const warningCount = result.allIssues.filter(i => i.severity === 'warning').length;
      
      const viewReport = await vscode.window.showWarningMessage(
        `✗ Verification failed (${result.score}/100) - ${errorCount} errors, ${warningCount} warnings`,
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
    
    outputChannel.appendLine(result.summary);
    outputChannel.appendLine(`Duration: ${result.duration}ms`);
  } catch (error) {
    outputChannel.appendLine(`Error: ${error instanceof Error ? error.message : String(error)}`);
    vscode.window.showErrorMessage(`Failed to verify: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Copy current spec to clipboard for LLM use.
 */
export async function copySpecForLLM(outputChannel: vscode.OutputChannel): Promise<void> {
  const specFile = getCurrentSpecFile();
  
  if (!specFile) {
    vscode.window.showWarningMessage('Open a spec file first');
    return;
  }
  
  try {
    const spec = await loadSpec(specFile);
    
    // Pick format quickly
    const formatPick = await vscode.window.showQuickPick([
      { label: 'Full', value: 'full' as LLMExportFormat },
      { label: 'Context', value: 'context' as LLMExportFormat },
      { label: 'Prompt', value: 'prompt' as LLMExportFormat },
    ], {
      placeHolder: 'Format',
    });
    
    if (!formatPick) return;
    
    let markdown: string;
    switch (formatPick.value) {
      case 'context':
        markdown = specToContextMarkdown(spec);
        break;
      case 'prompt':
        markdown = specToAgentPrompt(spec, { taskType: 'implement' });
        break;
      case 'full':
      default:
        markdown = specToFullMarkdown(spec);
        break;
    }
    
    await vscode.env.clipboard.writeText(markdown);
    vscode.window.showInformationMessage(
      `${spec.meta.name} copied (${formatPick.label}, ${markdown.split(/\s+/).length} words)`
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Register all LLM commands.
 */
export function registerLLMCommands(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
  telemetry?: { sendTelemetryEvent: (name: string, props: Record<string, string>) => void }
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
    vscode.commands.registerCommand('contractspec.llmCopy', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmCopy',
      });
      await copySpecForLLM(outputChannel);
    })
  );
}

