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
  type LLMExportFormat,
  type AgentType,
  type VerificationTier,
} from '@lssm/lib.contracts/llm';
import {
  scanAllSpecsFromSource,
  scanFeatureSource,
  isFeatureFile,
} from '@lssm/module.contractspec-workspace';

/**
 * Parsed spec information from source code.
 * This is a lightweight representation extracted without execution.
 */
interface ParsedSpec {
  meta: {
    name: string;
    version: number;
    description?: string;
    stability?: string;
    owners?: string[];
    tags?: string[];
    goal?: string;
    context?: string;
  };
  specType: string;
  kind?: 'command' | 'query' | 'unknown';
  hasIo?: boolean;
  hasPolicy?: boolean;
  emittedEvents?: { name: string; version: number }[];
  // For features
  operations?: { name: string; version: number }[];
  events?: { name: string; version: number }[];
  presentations?: { name: string; version: number }[];
}

/**
 * Load spec(s) from a file by parsing the source code.
 * This approach doesn't require compilation - it reads the TypeScript source
 * and extracts spec information using regex-based parsing.
 */
async function loadSpecFromSource(specPath: string): Promise<ParsedSpec[]> {
  // Convert file:// URI to file path if needed
  let filePath = specPath;
  if (specPath.startsWith('file://')) {
    filePath = vscode.Uri.parse(specPath).fsPath;
  }

  // Normalize path separators
  filePath = path.normalize(filePath);

  // Read the source file
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const source = fs.readFileSync(filePath, 'utf-8');

  // Check if it's a feature file
  if (isFeatureFile(filePath)) {
    const featureResult = scanFeatureSource(source, filePath);
    if (featureResult.key) {
      // Extract additional metadata from source
      const goalMatch = source.match(/goal\s*:\s*['"]([^'"]+)['"]/);
      const contextMatch = source.match(/context\s*:\s*['"]([^'"]+)['"]/);

      return [
        {
          meta: {
            name: featureResult.key,
            version: 1,
            description: featureResult.description,
            stability: featureResult.stability,
            owners: featureResult.owners,
            tags: featureResult.tags,
            goal: goalMatch?.[1],
            context: contextMatch?.[1],
          },
          specType: 'feature',
          operations: featureResult.operations,
          events: featureResult.events,
          presentations: featureResult.presentations,
        },
      ];
    }
  }

  // Scan for all specs in the file
  const scanResults = scanAllSpecsFromSource(source, filePath);

  if (scanResults.length === 0) {
    throw new Error(`No spec definitions found in ${path.basename(filePath)}`);
  }

  // Convert scan results to ParsedSpec format
  return scanResults.map((result) => {
    // Extract goal and context from the source near this spec
    const specBlock = extractSpecBlock(source, result.name ?? '');
    const goalMatch = specBlock?.match(/goal\s*:\s*['"]([^'"]+)['"]/);
    const contextMatch = specBlock?.match(/context\s*:\s*['"]([^'"]+)['"]/);

    return {
      meta: {
        name: result.name ?? 'unknown',
        version: result.version ?? 1,
        description: result.description,
        stability: result.stability,
        owners: result.owners,
        tags: result.tags,
        goal: goalMatch?.[1],
        context: contextMatch?.[1],
      },
      specType: result.specType,
      kind: result.kind,
      hasIo: result.hasIo,
      hasPolicy: result.hasPolicy,
      emittedEvents: result.emittedEvents,
    };
  });
}

/**
 * Extract the code block containing a specific spec by name.
 */
function extractSpecBlock(source: string, specName: string): string | null {
  // Find the position of the spec name in the source
  const namePattern = new RegExp(
    `name\\s*:\\s*['"]${escapeRegex(specName)}['"]`
  );
  const match = source.match(namePattern);
  if (!match || match.index === undefined) return null;

  // Find the start of the block (look backwards for defineCommand/defineQuery/etc)
  const beforeMatch = source.slice(0, match.index);
  const defineMatch = beforeMatch.match(
    /(?:defineCommand|defineQuery|defineEvent|definePresentation|FeatureModuleSpec)\s*[=(]\s*\{?\s*$/
  );
  if (!defineMatch || defineMatch.index === undefined) return null;

  const startIndex = defineMatch.index;

  // Find the matching closing brace
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let endIndex = -1;

  for (let i = match.index; i < source.length; i++) {
    const char = source[i];
    const prevChar = i > 0 ? source[i - 1] : '';

    // Handle string literals
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  if (endIndex === -1) return null;
  return source.slice(startIndex, endIndex);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate markdown from a parsed spec.
 */
function specToMarkdown(spec: ParsedSpec, format: LLMExportFormat): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${spec.meta.name}`);
  lines.push('');

  if (spec.meta.description) {
    lines.push(spec.meta.description);
    lines.push('');
  }

  // Metadata
  lines.push('## Metadata');
  lines.push('');
  lines.push(
    `- **Type**: ${spec.specType}${spec.kind ? ` (${spec.kind})` : ''}`
  );
  lines.push(`- **Version**: ${spec.meta.version}`);
  if (spec.meta.stability) {
    lines.push(`- **Stability**: ${spec.meta.stability}`);
  }
  if (spec.meta.owners && spec.meta.owners.length > 0) {
    lines.push(`- **Owners**: ${spec.meta.owners.join(', ')}`);
  }
  if (spec.meta.tags && spec.meta.tags.length > 0) {
    lines.push(`- **Tags**: ${spec.meta.tags.join(', ')}`);
  }
  lines.push('');

  // Goal and Context (for full/prompt format)
  if (format !== 'context') {
    if (spec.meta.goal) {
      lines.push('## Goal');
      lines.push('');
      lines.push(spec.meta.goal);
      lines.push('');
    }
    if (spec.meta.context) {
      lines.push('## Context');
      lines.push('');
      lines.push(spec.meta.context);
      lines.push('');
    }
  }

  // For features, show operations/events/presentations
  if (spec.specType === 'feature') {
    if (spec.operations && spec.operations.length > 0) {
      lines.push('## Operations');
      lines.push('');
      for (const op of spec.operations) {
        lines.push(`- \`${op.name}\` (v${op.version})`);
      }
      lines.push('');
    }
    if (spec.events && spec.events.length > 0) {
      lines.push('## Events');
      lines.push('');
      for (const ev of spec.events) {
        lines.push(`- \`${ev.name}\` (v${ev.version})`);
      }
      lines.push('');
    }
    if (spec.presentations && spec.presentations.length > 0) {
      lines.push('## Presentations');
      lines.push('');
      for (const pres of spec.presentations) {
        lines.push(`- \`${pres.name}\` (v${pres.version})`);
      }
      lines.push('');
    }
  }

  // Emitted events (for operations)
  if (spec.emittedEvents && spec.emittedEvents.length > 0) {
    lines.push('## Emitted Events');
    lines.push('');
    for (const ev of spec.emittedEvents) {
      lines.push(`- \`${ev.name}\` (v${ev.version})`);
    }
    lines.push('');
  }

  // For prompt format, add implementation instructions
  if (format === 'prompt') {
    lines.push('## Implementation Instructions');
    lines.push('');
    if (spec.specType === 'operation') {
      lines.push(
        `Implement the \`${spec.meta.name}\` ${spec.kind ?? 'operation'} according to the specification above.`
      );
      if (spec.hasIo) {
        lines.push('');
        lines.push('Ensure the implementation:');
        lines.push('- Validates input according to the schema');
        lines.push('- Returns output matching the expected schema');
      }
      if (spec.hasPolicy) {
        lines.push('- Enforces the specified policies');
      }
      if (spec.emittedEvents && spec.emittedEvents.length > 0) {
        lines.push('- Emits the specified events on success');
      }
    } else if (spec.specType === 'feature') {
      lines.push(
        `Implement the \`${spec.meta.name}\` feature according to the specification above.`
      );
      lines.push('');
      lines.push('The feature includes:');
      if (spec.operations && spec.operations.length > 0) {
        lines.push(`- ${spec.operations.length} operation(s) to implement`);
      }
      if (spec.presentations && spec.presentations.length > 0) {
        lines.push(
          `- ${spec.presentations.length} presentation(s) to implement`
        );
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Shared utility to load specs from source - exported for use by tree view
 */
export { loadSpecFromSource, specToMarkdown, type ParsedSpec };

/**
 * Generate implementation guide from parsed spec.
 */
function generateGuideFromParsedSpec(
  spec: ParsedSpec,
  agent: AgentType
): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Implementation Guide: ${spec.meta.name}`);
  lines.push('');
  lines.push(`**Target Agent**: ${agent}`);
  lines.push(
    `**Spec Type**: ${spec.specType}${spec.kind ? ` (${spec.kind})` : ''}`
  );
  lines.push('');

  // Description
  if (spec.meta.description) {
    lines.push('## Overview');
    lines.push('');
    lines.push(spec.meta.description);
    lines.push('');
  }

  // Goal and Context
  if (spec.meta.goal) {
    lines.push('## Goal');
    lines.push('');
    lines.push(spec.meta.goal);
    lines.push('');
  }

  if (spec.meta.context) {
    lines.push('## Context');
    lines.push('');
    lines.push(spec.meta.context);
    lines.push('');
  }

  // Implementation Steps
  lines.push('## Implementation Steps');
  lines.push('');

  if (spec.specType === 'operation') {
    lines.push(`1. Create the ${spec.kind ?? 'operation'} handler function`);
    if (spec.hasIo) {
      lines.push('2. Implement input validation according to the schema');
      lines.push('3. Implement the core business logic');
      lines.push('4. Return output matching the expected schema');
    }
    if (spec.hasPolicy) {
      lines.push('5. Enforce authorization and policies');
    }
    if (spec.emittedEvents && spec.emittedEvents.length > 0) {
      lines.push('6. Emit events on success:');
      for (const ev of spec.emittedEvents) {
        lines.push(`   - \`${ev.name}\` (v${ev.version})`);
      }
    }
    lines.push('7. Add error handling for expected failure cases');
    lines.push('8. Write tests covering success and error scenarios');
  } else if (spec.specType === 'feature') {
    lines.push('1. Set up the feature module structure');
    if (spec.operations && spec.operations.length > 0) {
      lines.push('2. Implement operations:');
      for (const op of spec.operations) {
        lines.push(`   - \`${op.name}\` (v${op.version})`);
      }
    }
    if (spec.presentations && spec.presentations.length > 0) {
      lines.push('3. Implement presentations:');
      for (const pres of spec.presentations) {
        lines.push(`   - \`${pres.name}\` (v${pres.version})`);
      }
    }
    lines.push('4. Wire up feature exports');
    lines.push('5. Add integration tests');
  } else {
    lines.push('1. Review the spec requirements');
    lines.push('2. Implement the core logic');
    lines.push('3. Add tests');
    lines.push('4. Document the implementation');
  }

  lines.push('');

  // Constraints
  lines.push('## Constraints');
  lines.push('');
  lines.push(`- Stability: ${spec.meta.stability ?? 'experimental'}`);
  if (spec.meta.owners && spec.meta.owners.length > 0) {
    lines.push(`- Owners: ${spec.meta.owners.join(', ')}`);
  }
  if (spec.meta.tags && spec.meta.tags.length > 0) {
    lines.push(`- Tags: ${spec.meta.tags.join(', ')}`);
  }
  lines.push('');

  // Agent-specific notes
  if (agent === 'cursor-cli') {
    lines.push('## Cursor Notes');
    lines.push('');
    lines.push('- Use Composer mode for multi-file changes');
    lines.push('- Reference this guide in your cursor rules');
    lines.push('- Break implementation into small, focused commits');
  } else if (agent === 'claude-code') {
    lines.push('## Claude Code Notes');
    lines.push('');
    lines.push('- Use extended thinking for complex logic');
    lines.push('- Ask for clarification on ambiguous requirements');
    lines.push('- Provide step-by-step reasoning');
  }

  return lines.join('\n');
}

/**
 * Generate Cursor rules from parsed spec.
 */
function generateCursorRulesFromParsedSpec(spec: ParsedSpec): string {
  const lines: string[] = [];

  lines.push(`# ${spec.meta.name}`);
  lines.push('');
  lines.push(`Description: ${spec.meta.description ?? 'No description'}`);
  lines.push('');
  lines.push('## Rules');
  lines.push('');

  if (spec.specType === 'operation') {
    lines.push(`- This is a ${spec.kind ?? 'operation'} spec`);
    if (spec.hasIo) {
      lines.push('- Validate input and output against schemas');
    }
    if (spec.hasPolicy) {
      lines.push('- Enforce authorization policies');
    }
    if (spec.emittedEvents && spec.emittedEvents.length > 0) {
      lines.push('- Emit events on success');
    }
  } else if (spec.specType === 'feature') {
    lines.push('- This is a feature module');
    if (spec.operations && spec.operations.length > 0) {
      lines.push(`- Contains ${spec.operations.length} operation(s)`);
    }
    if (spec.presentations && spec.presentations.length > 0) {
      lines.push(`- Contains ${spec.presentations.length} presentation(s)`);
    }
  }

  lines.push('');
  lines.push('## Implementation');
  lines.push('');
  lines.push('Follow ContractSpec patterns and conventions.');
  if (spec.meta.stability) {
    lines.push(`Stability: ${spec.meta.stability}`);
  }

  return lines.join('\n');
}

/**
 * Verification issue from parsed spec check.
 */
interface VerificationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  category: string;
  line?: number;
}

/**
 * Verify implementation against parsed spec.
 * This is a simplified verification that checks for basic patterns.
 */
function verifyImplementationAgainstParsedSpec(
  spec: ParsedSpec,
  implementationCode: string,
  tiers: VerificationTier[]
): VerificationIssue[] {
  const issues: VerificationIssue[] = [];

  // Structure checks (Tier 1)
  if (tiers.includes('structure')) {
    // Check for function/class export
    const hasExport =
      /export\s+(async\s+)?function|export\s+class|export\s+const/.test(
        implementationCode
      );
    if (!hasExport) {
      issues.push({
        severity: 'warning',
        message: 'No exports found in implementation',
        category: 'structure',
      });
    }

    // Check for spec name reference
    if (spec.meta.name && !implementationCode.includes(spec.meta.name)) {
      issues.push({
        severity: 'info',
        message: `Spec name "${spec.meta.name}" not found in implementation`,
        category: 'structure',
      });
    }
  }

  // Behavior checks (Tier 2)
  if (tiers.includes('behavior')) {
    // Check for error handling
    const hasErrorHandling = /try\s*{|catch\s*\(|throw\s+new/.test(
      implementationCode
    );
    if (!hasErrorHandling) {
      issues.push({
        severity: 'warning',
        message: 'No error handling patterns found',
        category: 'behavior',
      });
    }

    // Check for async patterns if needed
    if (spec.specType === 'operation') {
      const hasAsyncPattern = /async\s+|await\s+|Promise/.test(
        implementationCode
      );
      if (!hasAsyncPattern) {
        issues.push({
          severity: 'info',
          message: 'No async patterns found (operations typically use async)',
          category: 'behavior',
        });
      }
    }

    // Check for event emission if spec defines emitted events
    if (spec.emittedEvents && spec.emittedEvents.length > 0) {
      const hasEventEmit = /emit|publish|dispatch|fire/i.test(
        implementationCode
      );
      if (!hasEventEmit) {
        issues.push({
          severity: 'warning',
          message: `Spec emits ${spec.emittedEvents.length} event(s) but no event emission found`,
          category: 'behavior',
        });
      }
    }
  }

  return issues;
}

/**
 * Format verification report as markdown.
 */
function formatVerificationReport(
  spec: ParsedSpec,
  issues: VerificationIssue[]
): string {
  const lines: string[] = [];

  lines.push(`# Verification Report: ${spec.meta.name}`);
  lines.push('');

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- Errors: ${errors.length}`);
  lines.push(`- Warnings: ${warnings.length}`);
  lines.push(`- Info: ${infos.length}`);
  lines.push('');

  if (errors.length > 0) {
    lines.push('## Errors');
    lines.push('');
    for (const issue of errors) {
      lines.push(`- ❌ **${issue.category}**: ${issue.message}`);
    }
    lines.push('');
  }

  if (warnings.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    for (const issue of warnings) {
      lines.push(`- ⚠️ **${issue.category}**: ${issue.message}`);
    }
    lines.push('');
  }

  if (infos.length > 0) {
    lines.push('## Info');
    lines.push('');
    for (const issue of infos) {
      lines.push(`- ℹ️ **${issue.category}**: ${issue.message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
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
    '.spec.',
    '.feature.',
    '.event.',
    '.presentation.',
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
            label: s.meta.name,
            description: `${s.specType}${s.kind ? ` (${s.kind})` : ''}`,
            value: s.meta.name,
          })),
        ],
        { placeHolder: 'Select spec to export' }
      );
      if (!specPick) return;
      if (specPick.value !== 'all') {
        selectedSpecs = specs.filter((s) => s.meta.name === specPick.value);
      }
    }

    // Generate markdown for each selected spec
    const markdownParts = selectedSpecs.map((spec) =>
      specToMarkdown(spec, formatPick.value)
    );
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
        vscode.window.showInformationMessage(
          `Cursor rules saved to ${path.basename(savePath.fsPath)}`
        );
      }
    }

    outputChannel.appendLine(`Guide generated for ${spec.meta.name}`);
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
 */
export async function copySpecForLLM(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const specFile = getCurrentSpecFile();

  if (!specFile) {
    vscode.window.showWarningMessage('Open a spec file first');
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

    const markdown = specToMarkdown(spec, formatPick.value);

    await vscode.env.clipboard.writeText(markdown);
    vscode.window.showInformationMessage(
      `${spec.meta.name} copied (${formatPick.label}, ${markdown.split(/\s+/).length} words)`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
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
    vscode.commands.registerCommand('contractspec.llmCopy', async () => {
      telemetry?.sendTelemetryEvent('contractspec.vscode.command_run', {
        command: 'llmCopy',
      });
      await copySpecForLLM(outputChannel);
    })
  );
}
