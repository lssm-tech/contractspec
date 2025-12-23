/**
 * LLM Export Functions
 *
 * Provides multi-format markdown export for specs, features, presentations,
 * and other ContractSpec artifacts for LLM consumption.
 */

import type { AnyOperationSpec } from '../operations/';
import { isEmitDeclRef } from '../operations/';
import type { FeatureModuleSpec } from '../features';
import type { PresentationSpec } from '../presentations/';
import type { EventSpec } from '../events';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { DocBlock } from '../docs/types';
import type { OperationSpecRegistry } from '../operations/registry';
import type { PresentationRegistry } from '../presentations';
import { jsonSchemaForSpec } from '../jsonschema';
import type {
  FeatureExportOptions,
  FeatureExportResult,
  SpecExportOptions,
  SpecExportResult,
} from './types';

const DEFAULT_SPEC_OPTIONS: SpecExportOptions = {
  format: 'full',
  includeSchemas: true,
  includeScenarios: true,
  includeExamples: true,
  includePolicy: true,
  includeSideEffects: true,
};

const DEFAULT_FEATURE_OPTIONS: FeatureExportOptions = {
  ...DEFAULT_SPEC_OPTIONS,
  includeRelatedSpecs: true,
  includeRelatedEvents: true,
  includeRelatedPresentations: true,
};

/**
 * Export a single spec to context-focused markdown.
 * Includes: goal, context, description, acceptance scenarios.
 * Best for: Understanding what the spec does, providing context to LLMs.
 */
export function operationSpecToContextMarkdown(spec: AnyOperationSpec): string {
  const m = spec.meta;
  const lines: string[] = [];

  lines.push(`# ${m.name} (v${m.version})`);
  lines.push('');
  lines.push(`> ${m.description}`);
  lines.push('');
  lines.push(`**Type:** ${m.kind} | **Stability:** ${m.stability}`);
  lines.push('');

  lines.push('## Goal');
  lines.push('');
  lines.push(m.goal);
  lines.push('');

  lines.push('## Context');
  lines.push('');
  lines.push(m.context);
  lines.push('');

  if (spec.acceptance?.scenarios?.length) {
    lines.push('## Acceptance Criteria');
    lines.push('');
    for (const s of spec.acceptance.scenarios) {
      lines.push(`### ${s.name}`);
      lines.push('');
      lines.push('**Given:**');
      for (const g of s.given) lines.push(`- ${g}`);
      lines.push('');
      lines.push('**When:**');
      for (const w of s.when) lines.push(`- ${w}`);
      lines.push('');
      lines.push('**Then:**');
      for (const t of s.then) lines.push(`- ${t}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Export a single spec to full markdown with all details.
 * Includes: all fields, I/O schemas, policy, events, examples.
 * Best for: Complete documentation, implementation reference.
 */
export function operationSpecToFullMarkdown(
  spec: AnyOperationSpec,
  options: Partial<SpecExportOptions> = {}
): string {
  const opts = { ...DEFAULT_SPEC_OPTIONS, ...options };
  const m = spec.meta;
  const lines: string[] = [];

  // Header
  lines.push(`# ${m.name}.v${m.version}`);
  lines.push('');
  lines.push(`> ${m.description}`);
  lines.push('');

  // Metadata table
  lines.push('## Metadata');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('|-------|-------|');
  lines.push(`| Kind | ${m.kind} |`);
  lines.push(`| Stability | ${m.stability} |`);
  lines.push(`| Owners | ${m.owners.join(', ')} |`);
  lines.push(`| Tags | ${m.tags.join(', ')} |`);
  lines.push('');

  // Goal & Context
  lines.push('## Goal');
  lines.push('');
  lines.push(m.goal);
  lines.push('');

  lines.push('## Context');
  lines.push('');
  lines.push(m.context);
  lines.push('');

  // I/O Schemas
  if (opts.includeSchemas) {
    lines.push('## Input/Output');
    lines.push('');

    if (spec.io.input) {
      lines.push('### Input Schema');
      lines.push('');
      lines.push('```json');
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const schema = jsonSchemaForSpec(spec as any) as any;
        lines.push(JSON.stringify(schema.input ?? {}, null, 2));
      } catch {
        lines.push('// Schema generation not available');
      }
      lines.push('```');
      lines.push('');
    }

    lines.push('### Output Schema');
    lines.push('');
    lines.push('```json');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schema = jsonSchemaForSpec(spec as any) as any;
      lines.push(JSON.stringify(schema.output ?? {}, null, 2));
    } catch {
      lines.push('// Schema generation not available');
    }
    lines.push('```');
    lines.push('');

    // Errors
    if (spec.io.errors && Object.keys(spec.io.errors).length) {
      lines.push('### Error Codes');
      lines.push('');
      lines.push('| Code | HTTP | Description | When |');
      lines.push('|------|------|-------------|------|');
      for (const [code, err] of Object.entries(spec.io.errors)) {
        lines.push(
          `| \`${code}\` | ${err.http ?? 400} | ${err.description} | ${err.when} |`
        );
      }
      lines.push('');
    }
  }

  // Policy
  if (opts.includePolicy) {
    lines.push('## Policy');
    lines.push('');
    lines.push(`- **Auth Required:** ${spec.policy.auth}`);
    lines.push(
      `- **Idempotent:** ${spec.policy.idempotent ?? m.kind === 'query'}`
    );
    if (spec.policy.rateLimit) {
      lines.push(
        `- **Rate Limit:** ${spec.policy.rateLimit.rpm} rpm per ${spec.policy.rateLimit.key}`
      );
    }
    if (spec.policy.flags?.length) {
      lines.push(`- **Feature Flags:** ${spec.policy.flags.join(', ')}`);
    }
    if (spec.policy.pii?.length) {
      lines.push(`- **PII Fields:** ${spec.policy.pii.join(', ')}`);
    }
    if (spec.policy.escalate) {
      lines.push(`- **Escalation:** ${spec.policy.escalate}`);
    }
    lines.push('');
  }

  // Side Effects
  if (opts.includeSideEffects && spec.sideEffects) {
    if (spec.sideEffects.emits?.length) {
      lines.push('## Events Emitted');
      lines.push('');
      for (const e of spec.sideEffects.emits) {
        if (isEmitDeclRef(e)) {
          lines.push(`- \`${e.ref.name}.v${e.ref.version}\` — ${e.when}`);
        } else {
          lines.push(`- \`${e.name}.v${e.version}\` — ${e.when}`);
        }
      }
      lines.push('');
    }

    if (spec.sideEffects.analytics?.length) {
      lines.push('## Analytics Events');
      lines.push('');
      for (const a of spec.sideEffects.analytics) {
        lines.push(`- ${a}`);
      }
      lines.push('');
    }
  }

  // Acceptance Scenarios
  if (opts.includeScenarios && spec.acceptance?.scenarios?.length) {
    lines.push('## Acceptance Scenarios');
    lines.push('');
    for (const s of spec.acceptance.scenarios) {
      lines.push(`### ${s.name}`);
      lines.push('');
      lines.push('**Given:**');
      for (const g of s.given) lines.push(`- ${g}`);
      lines.push('');
      lines.push('**When:**');
      for (const w of s.when) lines.push(`- ${w}`);
      lines.push('');
      lines.push('**Then:**');
      for (const t of s.then) lines.push(`- ${t}`);
      lines.push('');
    }
  }

  // Examples
  if (opts.includeExamples && spec.acceptance?.examples?.length) {
    lines.push('## Examples');
    lines.push('');
    for (const ex of spec.acceptance.examples) {
      lines.push(`### ${ex.name}`);
      lines.push('');
      lines.push('**Input:**');
      lines.push('```json');
      lines.push(JSON.stringify(ex.input, null, 2));
      lines.push('```');
      lines.push('');
      lines.push('**Output:**');
      lines.push('```json');
      lines.push(JSON.stringify(ex.output, null, 2));
      lines.push('```');
      lines.push('');
    }
  }

  // Transport hints
  if (spec.transport) {
    lines.push('## Transport Configuration');
    lines.push('');
    if (spec.transport.rest) {
      lines.push(
        `- **REST:** ${spec.transport.rest.method ?? 'POST'} ${spec.transport.rest.path ?? 'auto'}`
      );
    }
    if (spec.transport.gql) {
      lines.push(`- **GraphQL:** ${spec.transport.gql.field ?? 'auto'}`);
    }
    if (spec.transport.mcp) {
      lines.push(`- **MCP Tool:** ${spec.transport.mcp.toolName ?? 'auto'}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export a single spec as an actionable agent prompt.
 * Includes: instructions, full spec, expected output format.
 * Best for: Directly feeding to coding agents for implementation.
 */
export function operationSpecToAgentPrompt(
  spec: AnyOperationSpec,
  options?: {
    taskType?: 'implement' | 'test' | 'refactor' | 'review';
    existingCode?: string;
  }
): string {
  const taskType = options?.taskType ?? 'implement';
  const m = spec.meta;
  const lines: string[] = [];

  // Task header
  const taskVerb = {
    implement: 'Implement',
    test: 'Write tests for',
    refactor: 'Refactor',
    review: 'Review',
  }[taskType];

  lines.push(`# Task: ${taskVerb} ${m.name}.v${m.version}`);
  lines.push('');

  // Context
  lines.push('## Context');
  lines.push('');
  lines.push(
    `You are working on a ContractSpec-driven codebase. This spec defines a ${m.kind} operation.`
  );
  lines.push('');
  lines.push(`**Goal:** ${m.goal}`);
  lines.push('');
  lines.push(`**Background:** ${m.context}`);
  lines.push('');

  // Full spec
  lines.push('## Specification');
  lines.push('');
  lines.push(operationSpecToFullMarkdown(spec));
  lines.push('');

  // Task-specific instructions
  lines.push('## Instructions');
  lines.push('');

  if (taskType === 'implement') {
    lines.push('Implement this specification following these requirements:');
    lines.push('');
    lines.push(
      '1. **Type Safety**: Use TypeScript with strict typing. No `any` types.'
    );
    lines.push(
      '2. **Input Validation**: Validate input against the schema before processing.'
    );
    lines.push(
      '3. **Error Handling**: Implement all error cases defined in the spec.'
    );
    lines.push('4. **Events**: Emit events as specified in sideEffects.emits.');
    lines.push('5. **Policy**: Respect auth, rate limits, and feature flags.');
    lines.push(
      '6. **Idempotency**: ' +
        (spec.policy.idempotent
          ? 'This operation MUST be idempotent.'
          : 'This operation may have side effects.')
    );
    lines.push('');

    if (spec.policy.pii?.length) {
      lines.push(
        '**PII Handling**: The following fields contain PII and must be handled carefully:'
      );
      for (const field of spec.policy.pii) {
        lines.push(`- ${field}`);
      }
      lines.push('');
    }
  } else if (taskType === 'test') {
    lines.push('Write comprehensive tests for this specification:');
    lines.push('');
    lines.push('1. Test all acceptance scenarios defined in the spec.');
    lines.push('2. Test all error cases with appropriate assertions.');
    lines.push('3. Test edge cases and boundary conditions.');
    lines.push('4. Verify events are emitted correctly.');
    lines.push(
      '5. Use descriptive test names following the pattern: "should [behavior] when [condition]"'
    );
    lines.push('');
  } else if (taskType === 'refactor') {
    lines.push('Refactor this implementation while preserving all behavior:');
    lines.push('');
    lines.push('1. Maintain compliance with the specification.');
    lines.push('2. Improve code clarity and maintainability.');
    lines.push('3. Reduce complexity where possible.');
    lines.push('4. Ensure all existing tests still pass.');
    lines.push('');
  } else if (taskType === 'review') {
    lines.push('Review this implementation against the specification:');
    lines.push('');
    lines.push('1. Verify input/output types match the schema.');
    lines.push('2. Check all error cases are handled.');
    lines.push('3. Verify events are emitted as specified.');
    lines.push('4. Check policy compliance (auth, rate limits).');
    lines.push('5. Report any deviations from the spec.');
    lines.push('');
  }

  // Existing code if provided
  if (options?.existingCode) {
    lines.push('## Existing Code');
    lines.push('');
    lines.push('```typescript');
    lines.push(options.existingCode);
    lines.push('```');
    lines.push('');
  }

  // Expected output format
  lines.push('## Expected Output');
  lines.push('');
  if (taskType === 'implement' || taskType === 'refactor') {
    lines.push('Provide a complete TypeScript implementation. Include:');
    lines.push('- Type definitions for input/output');
    lines.push('- Handler function with proper error handling');
    lines.push('- JSDoc comments explaining the implementation');
  } else if (taskType === 'test') {
    lines.push(
      'Provide a complete test file using the testing framework available (prefer Vitest).'
    );
  } else if (taskType === 'review') {
    lines.push('Provide a structured review with:');
    lines.push('- Compliance status (pass/fail for each requirement)');
    lines.push('- Issues found with severity (error/warning/info)');
    lines.push('- Suggestions for improvement');
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Export a feature module to markdown.
 * Includes all related specs, events, and presentations.
 */
export function featureToMarkdown(
  feature: FeatureModuleSpec,
  deps?: {
    specs?: OperationSpecRegistry;
    presentations?: PresentationRegistry;
  },
  options: Partial<FeatureExportOptions> = {}
): string {
  const opts = { ...DEFAULT_FEATURE_OPTIONS, ...options };
  const m = feature.meta;
  const lines: string[] = [];

  // Header
  lines.push(`# Feature: ${m.title ?? m.key}`);
  lines.push('');
  if (m.description) {
    lines.push(`> ${m.description}`);
    lines.push('');
  }

  // Metadata
  lines.push('## Overview');
  lines.push('');
  lines.push(`- **Key:** \`${m.key}\``);
  lines.push(`- **Stability:** ${m.stability}`);
  lines.push(`- **Owners:** ${m.owners.join(', ')}`);
  if (m.tags?.length) {
    lines.push(`- **Tags:** ${m.tags.join(', ')}`);
  }
  lines.push('');

  // Operations summary
  if (feature.operations?.length) {
    lines.push('## Operations');
    lines.push('');
    lines.push('| Name | Version | Type |');
    lines.push('|------|---------|------|');
    for (const op of feature.operations) {
      const spec = deps?.specs?.getSpec(op.name, op.version);
      const kind = spec?.meta.kind ?? 'unknown';
      lines.push(`| ${op.name} | v${op.version} | ${kind} |`);
    }
    lines.push('');

    // Include full specs if requested
    if (opts.includeRelatedSpecs && deps?.specs) {
      lines.push('### Operation Details');
      lines.push('');
      for (const op of feature.operations) {
        const spec = deps.specs.getSpec(op.name, op.version);
        if (spec) {
          lines.push(`---`);
          lines.push('');
          lines.push(operationSpecToFullMarkdown(spec, opts));
        }
      }
    }
  }

  // Events summary
  if (feature.events?.length) {
    lines.push('## Events');
    lines.push('');
    lines.push('| Name | Version |');
    lines.push('|------|---------|');
    for (const evt of feature.events) {
      lines.push(`| ${evt.name} | v${evt.version} |`);
    }
    lines.push('');
  }

  // Presentations summary
  if (feature.presentations?.length) {
    lines.push('## Presentations');
    lines.push('');
    lines.push('| Name | Version |');
    lines.push('|------|---------|');
    for (const pres of feature.presentations) {
      lines.push(`| ${pres.name} | v${pres.version} |`);
    }
    lines.push('');

    // Include full presentations if requested
    if (opts.includeRelatedPresentations && deps?.presentations) {
      lines.push('### Presentation Details');
      lines.push('');
      for (const pres of feature.presentations) {
        const p = deps.presentations.get(pres.name, pres.version);
        if (p) {
          lines.push(`#### ${pres.name}.v${pres.version}`);
          lines.push('');
          lines.push(`- **Type:** ${p.source.type}`);
          if (p.source.type === 'component') {
            lines.push(`- **Component:** ${p.source.componentKey}`);
          }
          lines.push('');
        }
      }
    }
  }

  // Capabilities
  if (feature.capabilities) {
    if (feature.capabilities.provides?.length) {
      lines.push('## Capabilities Provided');
      lines.push('');
      for (const cap of feature.capabilities.provides) {
        lines.push(`- \`${cap.key}.v${cap.version}\``);
      }
      lines.push('');
    }

    if (feature.capabilities.requires?.length) {
      lines.push('## Capabilities Required');
      lines.push('');
      for (const cap of feature.capabilities.requires) {
        lines.push(
          `- \`${cap.key}\`${cap.version ? `.v${cap.version}` : ''} (${cap.optional ? 'optional' : 'required'})`
        );
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Export a presentation descriptor to markdown.
 */
export function presentationToMarkdown(
  presentation: PresentationSpec
): string {
  const m = presentation.meta;
  const lines: string[] = [];

  lines.push(`# Presentation: ${m.name}.v${m.version}`);
  lines.push('');

  if (m.description) {
    lines.push(`> ${m.description}`);
    lines.push('');
  }

  lines.push('## Metadata');
  lines.push('');
  lines.push(`- **Name:** ${m.name}`);
  lines.push(`- **Version:** ${m.version}`);
  if (m.stability) lines.push(`- **Stability:** ${m.stability}`);
  if (m.owners?.length) lines.push(`- **Owners:** ${m.owners.join(', ')}`);
  if (m.tags?.length) lines.push(`- **Tags:** ${m.tags.join(', ')}`);
  lines.push('');

  lines.push('## Source');
  lines.push('');
  lines.push(`- **Type:** ${presentation.source.type}`);
  if (presentation.source.type === 'component') {
    lines.push(`- **Framework:** ${presentation.source.framework}`);
    lines.push(`- **Component Key:** ${presentation.source.componentKey}`);
  }
  lines.push('');

  lines.push('## Supported Targets');
  lines.push('');
  for (const target of presentation.targets) {
    lines.push(`- ${target}`);
  }
  lines.push('');

  if (presentation.policy) {
    lines.push('## Policy');
    lines.push('');
    if (presentation.policy.flags?.length) {
      lines.push(
        `- **Feature Flags:** ${presentation.policy.flags.join(', ')}`
      );
    }
    if (presentation.policy.pii?.length) {
      lines.push(`- **PII Fields:** ${presentation.policy.pii.join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export an event spec to markdown.
 */
export function eventToMarkdown(event: EventSpec<AnySchemaModel>): string {
  const lines: string[] = [];

  lines.push(`# Event: ${event.name}.v${event.version}`);
  lines.push('');

  lines.push('## Metadata');
  lines.push('');
  lines.push(`- **Name:** ${event.name}`);
  lines.push(`- **Version:** ${event.version}`);
  if (event.description) lines.push(`- **Description:** ${event.description}`);
  lines.push('');

  lines.push('## Payload Schema');
  lines.push('');
  lines.push('```json');
  try {
    const zodSchema = event.payload.getZod();
    // Try to get shape if available
    if ('shape' in zodSchema && zodSchema.shape) {
      const shape = zodSchema.shape as Record<string, unknown>;
      const fields = Object.keys(shape);
      lines.push(JSON.stringify({ fields }, null, 2));
    } else {
      lines.push('// Payload schema available at runtime');
    }
  } catch {
    lines.push('// Schema details available at runtime');
  }
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}

/**
 * Export a DocBlock to markdown (already markdown, but formatted consistently).
 */
export function docBlockToMarkdown(doc: DocBlock): string {
  const lines: string[] = [];

  lines.push(`# ${doc.title}`);
  lines.push('');

  if (doc.summary) {
    lines.push(`> ${doc.summary}`);
    lines.push('');
  }

  lines.push('## Metadata');
  lines.push('');
  lines.push(`- **ID:** ${doc.id}`);
  lines.push(`- **Kind:** ${doc.kind ?? 'reference'}`);
  lines.push(`- **Visibility:** ${doc.visibility ?? 'public'}`);
  if (doc.tags?.length) lines.push(`- **Tags:** ${doc.tags.join(', ')}`);
  if (doc.owners?.length) lines.push(`- **Owners:** ${doc.owners.join(', ')}`);
  if (doc.domain) lines.push(`- **Domain:** ${doc.domain}`);
  lines.push('');

  lines.push('## Content');
  lines.push('');
  lines.push(doc.body);
  lines.push('');

  if (doc.links?.length) {
    lines.push('## Related Links');
    lines.push('');
    for (const link of doc.links) {
      lines.push(`- [${link.label}](${link.href})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export a spec with a specific format.
 * Convenience function that wraps the format-specific functions.
 */
export function exportSpec(
  spec: AnyOperationSpec,
  options: Partial<SpecExportOptions> = {}
): SpecExportResult {
  const format = options.format ?? 'full';

  let markdown: string;
  switch (format) {
    case 'context':
      markdown = operationSpecToContextMarkdown(spec);
      break;
    case 'prompt':
      markdown = operationSpecToAgentPrompt(spec);
      break;
    case 'full':
    default:
      markdown = operationSpecToFullMarkdown(spec, options);
      break;
  }

  return {
    spec,
    markdown,
    format,
    meta: {
      specName: spec.meta.name,
      specVersion: spec.meta.version,
      exportedAt: new Date().toISOString(),
      wordCount: markdown.split(/\s+/).length,
    },
  };
}

/**
 * Export a feature with a specific format.
 */
export function exportFeature(
  feature: FeatureModuleSpec,
  deps?: {
    specs?: OperationSpecRegistry;
    presentations?: PresentationRegistry;
  },
  options: Partial<FeatureExportOptions> = {}
): FeatureExportResult {
  const format = options.format ?? 'full';
  const markdown = featureToMarkdown(feature, deps, options);

  return {
    feature,
    markdown,
    format,
    includedSpecs:
      feature.operations?.map((o) => `${o.name}.v${o.version}`) ?? [],
    includedEvents: feature.events?.map((e) => `${e.name}.v${e.version}`) ?? [],
    includedPresentations:
      feature.presentations?.map((p) => `${p.name}.v${p.version}`) ?? [],
  };
}
