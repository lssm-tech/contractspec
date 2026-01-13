/**
 * Spec to Markdown Formatter
 *
 * Pure functions for converting parsed specs to LLM-friendly markdown formats.
 * Extracted from vscode-contractspec/src/commands/llm.ts for reuse.
 */

import type {
  LLMExportFormat,
  ParsedSpec,
  SpecRef,
  SpecToMarkdownOptions,
} from '../types/llm-types';
import * as path from 'node:path';

/**
 * Generate markdown from a parsed spec.
 *
 * Formats:
 * - **full**: Complete information including source code and all details (for deep LLM context)
 * - **prompt**: Concise with implementation instructions (actionable for LLM)
 * - **context**: Brief summary with counts and key fields (lightweight overview)
 */
export function specToMarkdown(
  spec: ParsedSpec,
  format: LLMExportFormat,
  optionsOrDepth: number | { depth?: number; rootPath?: string } = 0
): string {
  const options =
    typeof optionsOrDepth === 'number'
      ? { depth: optionsOrDepth }
      : optionsOrDepth;
  const depth = options.depth ?? 0;
  const rootPath = options.rootPath;

  const lines: string[] = [];
  const indent = depth > 0 ? '  '.repeat(depth) : '';
  const headerLevel = Math.min(depth + 1, 6);
  const headerPrefix = '#'.repeat(headerLevel);

  // Header
  lines.push(`${indent}${headerPrefix} ${spec.meta.key}`);
  lines.push('');

  // Description (always included if present)
  if (spec.meta.description) {
    lines.push(`${indent}${spec.meta.description}`);
    lines.push('');
  }

  // ===== CONTEXT FORMAT: Brief summary only =====
  if (format === 'context') {
    return formatContextMode(spec, lines, indent);
  }

  // ===== PROMPT FORMAT: Implementation-focused =====
  if (format === 'prompt') {
    return formatPromptMode(spec, lines, indent);
  }

  // ===== FULL FORMAT: Complete with source code =====
  return formatFullMode(spec, lines, indent, rootPath);
}

/**
 * Format spec in context mode (brief summary).
 */
function formatContextMode(
  spec: ParsedSpec,
  lines: string[],
  indent: string
): string {
  // Compact metadata line
  const metaParts: string[] = [];
  metaParts.push(`**${spec.specType}**`);
  if (spec.kind && spec.kind !== 'unknown') metaParts.push(`(${spec.kind})`);
  metaParts.push(`v${spec.meta.version}`);
  if (spec.meta.stability) metaParts.push(`[${spec.meta.stability}]`);
  lines.push(`${indent}${metaParts.join(' ')}`);
  lines.push('');

  // Key counts for features
  if (spec.specType === 'feature') {
    const counts: string[] = [];
    if (spec.operations?.length)
      counts.push(`${spec.operations.length} operation(s)`);
    if (spec.events?.length) counts.push(`${spec.events.length} event(s)`);
    if (spec.presentations?.length)
      counts.push(`${spec.presentations.length} presentation(s)`);
    if (counts.length > 0) {
      lines.push(`${indent}Contains: ${counts.join(', ')}`);
      lines.push('');
    }
  }

  // Key indicators for operations
  if (spec.specType === 'operation') {
    const indicators: string[] = [];
    if (spec.hasIo) indicators.push('I/O');
    if (spec.hasPolicy) indicators.push('Policy');
    if (spec.emittedEvents?.length)
      indicators.push(`${spec.emittedEvents.length} event(s)`);
    if (indicators.length > 0) {
      lines.push(`${indent}Includes: ${indicators.join(', ')}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Format spec in prompt mode (implementation-focused).
 */
function formatPromptMode(
  spec: ParsedSpec,
  lines: string[],
  indent: string
): string {
  // Metadata
  lines.push(
    `${indent}**Type**: ${spec.specType}${spec.kind && spec.kind !== 'unknown' ? ` (${spec.kind})` : ''}`
  );
  lines.push(`${indent}**Version**: ${spec.meta.version}`);
  if (spec.meta.stability)
    lines.push(`${indent}**Stability**: ${spec.meta.stability}`);
  if (spec.meta.owners?.length)
    lines.push(`${indent}**Owners**: ${spec.meta.owners.join(', ')}`);
  if (spec.meta.tags?.length)
    lines.push(`${indent}**Tags**: ${spec.meta.tags.join(', ')}`);
  lines.push('');

  // Goal and Context
  if (spec.meta.goal) {
    lines.push(`${indent}**Goal**: ${spec.meta.goal}`);
    lines.push('');
  }
  if (spec.meta.context) {
    lines.push(`${indent}**Context**: ${spec.meta.context}`);
    lines.push('');
  }

  // Structure for operations
  if (spec.specType === 'operation') {
    const structure: string[] = [];
    if (spec.hasIo) structure.push('Input/Output Schema');
    if (spec.hasPolicy) structure.push('Policy Enforcement');
    if (spec.hasPayload) structure.push('Payload');
    if (spec.hasContent) structure.push('Content');
    if (structure.length > 0) {
      lines.push(`${indent}**Structure**: ${structure.join(', ')}`);
      lines.push('');
    }
  }

  // Child refs for features (summary only)
  if (spec.specType === 'feature') {
    appendFeatureRefs(spec, lines, indent);
  }

  // Emitted events
  if (spec.emittedEvents?.length) {
    lines.push(`${indent}**Emits**: ${formatRefs(spec.emittedEvents)}`);
    lines.push('');
  }

  // Implementation instructions
  lines.push(`${indent}---`);
  lines.push('');
  lines.push(`${indent}**Implementation Instructions**:`);
  lines.push('');
  appendImplementationInstructions(spec, lines, indent);

  return lines.join('\n');
}

/**
 * Format spec in full mode (complete with source code).
 */
function formatFullMode(
  spec: ParsedSpec,
  lines: string[],
  indent: string,
  rootPath?: string
): string {
  // Full metadata section
  lines.push(`${indent}## Metadata`);
  lines.push('');
  lines.push(
    `${indent}- **Type**: ${spec.specType}${spec.kind && spec.kind !== 'unknown' ? ` (${spec.kind})` : ''}`
  );
  lines.push(`${indent}- **Version**: ${spec.meta.version}`);
  if (spec.meta.stability) {
    lines.push(`${indent}- **Stability**: ${spec.meta.stability}`);
  }
  if (spec.meta.owners?.length) {
    lines.push(`${indent}- **Owners**: ${spec.meta.owners.join(', ')}`);
  }
  if (spec.meta.tags?.length) {
    lines.push(`${indent}- **Tags**: ${spec.meta.tags.join(', ')}`);
  }
  if (spec.filePath) {
    const displayPath = rootPath
      ? path.relative(rootPath, spec.filePath)
      : spec.filePath;
    lines.push(`${indent}- **File**: \`${displayPath}\``);
  }
  lines.push('');

  // Goal and Context
  if (spec.meta.goal) {
    lines.push(`${indent}## Goal`);
    lines.push('');
    lines.push(`${indent}${spec.meta.goal}`);
    lines.push('');
  }
  if (spec.meta.context) {
    lines.push(`${indent}## Context`);
    lines.push('');
    lines.push(`${indent}${spec.meta.context}`);
    lines.push('');
  }

  // Child specs for features (with full detail)
  if (spec.specType === 'feature') {
    appendFeatureSections(spec, lines, indent);
  }

  // Emitted events (for operations)
  if (spec.emittedEvents?.length) {
    lines.push(`${indent}## Emitted Events`);
    lines.push('');
    for (const ev of spec.emittedEvents) {
      lines.push(`${indent}- \`${ev.name}\` (v${ev.version})`);
    }
    lines.push('');
  }

  // Policy references
  if (spec.policyRefs?.length) {
    lines.push(`${indent}## Policy References`);
    lines.push('');
    for (const policy of spec.policyRefs) {
      lines.push(`${indent}- \`${policy.name}\` (v${policy.version})`);
    }
    lines.push('');
  }

  // Test references
  if (spec.testRefs?.length) {
    lines.push(`${indent}## Test Specifications`);
    lines.push('');
    for (const test of spec.testRefs) {
      lines.push(`${indent}- \`${test.name}\` (v${test.version})`);
    }
    lines.push('');
  }

  // Source code block (the key differentiator for full format!)
  if (spec.sourceBlock) {
    lines.push(`${indent}## Source Definition`);
    lines.push('');
    lines.push(`${indent}\`\`\`typescript`);
    // Add source block with proper indentation
    const sourceLines = spec.sourceBlock.split('\n');
    for (const sourceLine of sourceLines) {
      lines.push(`${indent}${sourceLine}`);
    }
    lines.push(`${indent}\`\`\``);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format a list of spec refs as inline code.
 */
function formatRefs(refs: SpecRef[]): string {
  return refs.map((r) => `\`${r.name}\``).join(', ');
}

/**
 * Append feature refs in summary format.
 */
function appendFeatureRefs(
  spec: ParsedSpec,
  lines: string[],
  indent: string
): void {
  if (spec.operations?.length) {
    lines.push(`${indent}**Operations**: ${formatRefs(spec.operations)}`);
  }
  if (spec.events?.length) {
    lines.push(`${indent}**Events**: ${formatRefs(spec.events)}`);
  }
  if (spec.presentations?.length) {
    lines.push(`${indent}**Presentations**: ${formatRefs(spec.presentations)}`);
  }
  lines.push('');
}

/**
 * Append feature child sections with full detail.
 */
function appendFeatureSections(
  spec: ParsedSpec,
  lines: string[],
  indent: string
): void {
  if (spec.operations?.length) {
    lines.push(`${indent}## Operations (${spec.operations.length})`);
    lines.push('');
    for (const op of spec.operations) {
      lines.push(`${indent}- \`${op.name}\` (v${op.version})`);
    }
    lines.push('');
  }
  if (spec.events?.length) {
    lines.push(`${indent}## Events (${spec.events.length})`);
    lines.push('');
    for (const ev of spec.events) {
      lines.push(`${indent}- \`${ev.name}\` (v${ev.version})`);
    }
    lines.push('');
  }
  if (spec.presentations?.length) {
    lines.push(`${indent}## Presentations (${spec.presentations.length})`);
    lines.push('');
    for (const pres of spec.presentations) {
      lines.push(`${indent}- \`${pres.name}\` (v${pres.version})`);
    }
    lines.push('');
  }
}

/**
 * Append implementation instructions based on spec type.
 */
function appendImplementationInstructions(
  spec: ParsedSpec,
  lines: string[],
  indent: string
): void {
  if (spec.specType === 'operation') {
    lines.push(
      `${indent}Implement the \`${spec.meta.key}\` ${spec.kind ?? 'operation'} ensuring:`
    );
    if (spec.hasIo) {
      lines.push(`${indent}- Input validation per schema`);
      lines.push(`${indent}- Output matches expected schema`);
    }
    if (spec.hasPolicy) {
      lines.push(`${indent}- Policy rules are enforced`);
    }
    if (spec.emittedEvents?.length) {
      lines.push(`${indent}- Events are emitted on success`);
    }
  } else if (spec.specType === 'feature') {
    lines.push(
      `${indent}Implement the \`${spec.meta.key}\` feature including:`
    );
    if (spec.operations?.length) {
      lines.push(`${indent}- ${spec.operations.length} operation(s)`);
    }
    if (spec.presentations?.length) {
      lines.push(`${indent}- ${spec.presentations.length} presentation(s)`);
    }
  } else if (spec.specType === 'event') {
    lines.push(`${indent}Implement the \`${spec.meta.key}\` event ensuring:`);
    lines.push(`${indent}- Payload matches expected schema`);
    lines.push(`${indent}- Event is properly typed`);
  } else if (spec.specType === 'presentation') {
    lines.push(
      `${indent}Implement the \`${spec.meta.key}\` presentation ensuring:`
    );
    lines.push(`${indent}- Component renders correctly`);
    lines.push(`${indent}- Accessibility requirements are met`);
  } else {
    lines.push(
      `${indent}Implement the \`${spec.meta.key}\` ${spec.specType} according to the specification.`
    );
  }
  lines.push('');
}

/**
 * Convert spec to markdown with custom options.
 */
export function specToMarkdownWithOptions(
  spec: ParsedSpec,
  options: SpecToMarkdownOptions
): string {
  return specToMarkdown(spec, options.format, options.depth ?? 0);
}

/**
 * Generate a summary header for multiple specs.
 */
export function generateSpecsSummaryHeader(
  specs: ParsedSpec[],
  format: LLMExportFormat
): string {
  const lines: string[] = [];

  lines.push('# ContractSpec Export');
  lines.push('');
  lines.push(`**Format**: ${format}`);
  lines.push(`**Specs**: ${specs.length}`);
  lines.push('');

  // Group by type
  const byType = new Map<string, number>();
  for (const spec of specs) {
    byType.set(spec.specType, (byType.get(spec.specType) ?? 0) + 1);
  }

  if (byType.size > 0) {
    lines.push('**Contents**:');
    for (const [type, count] of byType) {
      lines.push(`- ${count} ${type}(s)`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

/**
 * Combine multiple spec markdowns into a single document.
 */
export function combineSpecMarkdowns(
  specs: ParsedSpec[],
  format: LLMExportFormat
): string {
  const header = generateSpecsSummaryHeader(specs, format);
  const specMarkdowns = specs.map((spec) => specToMarkdown(spec, format));

  return header + specMarkdowns.join('\n---\n\n');
}
