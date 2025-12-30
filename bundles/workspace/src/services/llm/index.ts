/**
 * LLM Service
 *
 * Provides services for generating LLM-friendly content from specs.
 * Primarily used by VSCode and CLI for "Ask AI" features.
 */

import {
  type AgentType,
  loadSpecFromSource,
  type ParsedSpec,
  specToMarkdown,
} from '@contractspec/module.workspace';
import { listSpecs } from '../list';
import type { FsAdapter } from '../../ports/fs';

export * from './verify-static';

/**
 * Generate full markdown context for a feature, including referenced specs.
 */
export async function generateFeatureContextMarkdown(
  feature: ParsedSpec,
  adapters: { fs: FsAdapter }
): Promise<string> {
  const parts: string[] = [];

  // 1. Render feature header/context
  parts.push(specToMarkdown(feature, 'context'));

  // 2. Find all referenced specs
  // We need to scan the workspace to find them
  // Optimization: In a real app we might have a pre-built index
  const allSpecs = await listSpecs(adapters);

  // Helper to find and load a spec
  const loadChild = async (ref: { name: string; version: string }) => {
    const found = allSpecs.find(
      (s) => s.key === ref.name && s.version === ref.version
    );
    if (!found) return null;

    // Load full parsed spec
    const specs = await loadSpecFromSource(found.filePath);
    return specs.find((s) => s.meta.key === ref.name) ?? null;
  };

  // 3. Render operations
  if (feature.operations?.length) {
    parts.push(`\n## Operations (${feature.operations.length})\n`);
    for (const op of feature.operations) {
      const child = await loadChild(op);
      if (child) {
        parts.push(specToMarkdown(child, 'full'));
      } else {
        parts.push(`### ${op.name} (v${op.version})\n\n*Spec not found*`);
      }
      parts.push('---');
    }
  }

  // 4. Render events
  if (feature.events?.length) {
    parts.push(`\n## Events (${feature.events.length})\n`);
    for (const ev of feature.events) {
      const child = await loadChild(ev);
      if (child) {
        parts.push(specToMarkdown(child, 'full'));
      } else {
        parts.push(`### ${ev.name} (v${ev.version})\n\n*Spec not found*`);
      }
      parts.push('---');
    }
  }

  // 5. Render presentations
  if (feature.presentations?.length) {
    parts.push(`\n## Presentations (${feature.presentations.length})\n`);
    for (const pres of feature.presentations) {
      const child = await loadChild(pres);
      if (child) {
        parts.push(specToMarkdown(child, 'full'));
      } else {
        parts.push(`### ${pres.name} (v${pres.version})\n\n*Spec not found*`);
      }
      parts.push('---');
    }
  }

  return parts.join('\n');
}

/**
 * Generate an implementation guide for a parsed spec.
 * This logic was extracted from VSCode extension.
 */
export function generateGuideFromParsedSpec(
  spec: ParsedSpec,
  agent: AgentType
): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Implementation Guide: ${spec.meta.key}`);
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
  } else if (agent === 'generic-mcp') {
    lines.push('## General Notes');
    lines.push('');
    lines.push('- Use inline comments to guide generation');
    lines.push('- Review generated code carefully');
  }

  // Append context formatted spec
  lines.push('');
  lines.push('## Spec Definition');
  lines.push('');
  lines.push(specToMarkdown(spec, 'full'));

  return lines.join('\n');
}

/**
 * Generate Cursor rules from parsed spec.
 */
export function generateCursorRulesFromParsedSpec(spec: ParsedSpec): string {
  const lines: string[] = [];

  lines.push(`# ${spec.meta.key}`);
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
      lines.push('- Emit documented events');
    }
  } else if (spec.specType === 'feature') {
    lines.push('- Implement all operations and presentations');
    lines.push('- Follow modular architecture');
  } else {
    lines.push(`- Follow ${spec.specType} patterns`);
  }

  lines.push('- Follow project code quality standards');
  lines.push('- Write tests for new functionality');

  return lines.join('\n');
}

/**
 * Export spec to clipboard format suitable for pasting into LLM.
 */
export function exportSpecForLLM(
  spec: ParsedSpec,
  format: 'guide' | 'rules' | 'prompt' | 'context' | 'full',
  agent: AgentType = 'generic-mcp'
): string {
  switch (format) {
    case 'guide':
      return generateGuideFromParsedSpec(spec, agent);
    case 'rules':
      return generateCursorRulesFromParsedSpec(spec);
    case 'prompt':
      return specToMarkdown(spec, 'prompt');
    case 'context':
      return specToMarkdown(spec, 'context');
    case 'full':
    default:
      return specToMarkdown(spec, 'full');
  }
}
