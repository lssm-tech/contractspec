/**
 * Spec consumer for external agents.
 *
 * Enables external agent SDKs to consume ContractSpec specs:
 * - Read spec definitions as markdown/prompts
 * - List available specs
 * - Query spec metadata
 */
import type { AgentSpec } from '../spec/spec';
import { agentKey } from '../spec/spec';
import type {
  SpecConsumer,
  SpecConsumerConfig,
  SpecMarkdownOptions,
  SpecPromptOptions,
  SpecQueryResult,
  SpecListOptions,
  SpecListResult,
} from './types';

// =============================================================================
// Spec Consumer Implementation
// =============================================================================

/**
 * ContractSpec consumer for external agents.
 *
 * @example
 * ```typescript
 * const consumer = createSpecConsumer({
 *   specs: [myAgentSpec, anotherSpec],
 *   includeMetadata: true,
 * });
 *
 * // Get markdown representation
 * const markdown = consumer.getSpecMarkdown('my-agent.v1.0.0');
 *
 * // Get prompt for LLM
 * const prompt = consumer.getSpecPrompt('my-agent.v1.0.0', {
 *   includeTools: true,
 * });
 * ```
 */
export class ContractSpecConsumer implements SpecConsumer {
  private readonly specs: Map<string, AgentSpec>;
  private readonly includeMetadata: boolean;
  private readonly baseUrl?: string;

  constructor(config: SpecConsumerConfig) {
    this.specs = new Map();
    this.includeMetadata = config.includeMetadata ?? true;
    this.baseUrl = config.baseUrl;

    // Index specs by key
    for (const spec of config.specs) {
      const key = agentKey(spec.meta);
      this.specs.set(key, spec);
    }
  }

  /**
   * Get a spec as markdown.
   */
  getSpecMarkdown(specKey: string, options?: SpecMarkdownOptions): string {
    const spec = this.specs.get(specKey);
    if (!spec) {
      throw new Error(`Spec not found: ${specKey}`);
    }

    const sections: string[] = [];
    const opts = {
      includeToc: options?.includeToc ?? true,
      includeTools: options?.includeTools ?? true,
      ...options,
    };

    // Custom header
    if (opts.customHeader) {
      sections.push(opts.customHeader);
      sections.push('');
    }

    // Header - use key as name
    const specName = spec.meta.key;
    sections.push(`# ${specName}`);
    sections.push('');

    if (spec.description) {
      sections.push(spec.description);
      sections.push('');
    }

    // Table of contents
    if (opts.includeToc) {
      sections.push('## Table of Contents');
      sections.push('');
      sections.push('- [Overview](#overview)');
      sections.push('- [Instructions](#instructions)');
      if (opts.includeTools && spec.tools && spec.tools.length > 0) {
        sections.push('- [Tools](#tools)');
      }
      if (spec.knowledge && spec.knowledge.length > 0) {
        sections.push('- [Knowledge](#knowledge)');
      }
      sections.push('');
    }

    // Overview
    sections.push('## Overview');
    sections.push('');
    if (this.includeMetadata) {
      sections.push(`- **Key**: \`${spec.meta.key}\``);
      sections.push(`- **Version**: ${spec.meta.version}`);
      if (spec.meta.stability) {
        sections.push(`- **Stability**: ${spec.meta.stability}`);
      }
      if (spec.meta.owners && spec.meta.owners.length > 0) {
        sections.push(`- **Owners**: ${spec.meta.owners.join(', ')}`);
      }
      if (spec.tags && spec.tags.length > 0) {
        sections.push(`- **Tags**: ${spec.tags.join(', ')}`);
      }
    }
    sections.push('');

    // Instructions
    sections.push('## Instructions');
    sections.push('');
    sections.push(spec.instructions);
    sections.push('');

    // Tools
    if (opts.includeTools && spec.tools && spec.tools.length > 0) {
      sections.push('## Tools');
      sections.push('');
      for (const tool of spec.tools) {
        sections.push(`### ${tool.name}`);
        sections.push('');
        if (tool.description) {
          sections.push(tool.description);
          sections.push('');
        }
        if (tool.schema) {
          sections.push('**Schema:**');
          sections.push('');
          sections.push('```json');
          sections.push(JSON.stringify(tool.schema, null, 2));
          sections.push('```');
          sections.push('');
        }
        if (tool.automationSafe !== undefined) {
          sections.push(
            `**Automation Safe**: ${tool.automationSafe ? 'Yes' : 'No'}`
          );
          sections.push('');
        }
      }
    }

    // Knowledge
    if (spec.knowledge && spec.knowledge.length > 0) {
      sections.push('## Knowledge');
      sections.push('');
      for (const k of spec.knowledge) {
        sections.push(`- **${k.key}**${k.required ? ' (required)' : ''}`);
        if (k.instructions) {
          sections.push(`  - ${k.instructions}`);
        }
      }
      sections.push('');
    }

    // Policy
    if (spec.policy) {
      sections.push('## Policy');
      sections.push('');
      if (spec.policy.confidence) {
        sections.push(
          `- **Minimum Confidence**: ${spec.policy.confidence.min ?? 0.7}`
        );
      }
      if (spec.policy.escalation) {
        const esc = spec.policy.escalation;
        if (esc.confidenceThreshold) {
          sections.push(
            `- **Escalation Threshold**: ${esc.confidenceThreshold}`
          );
        }
        if (esc.onToolFailure) {
          sections.push('- **Escalate on Tool Failure**: Yes');
        }
        if (esc.onTimeout) {
          sections.push('- **Escalate on Timeout**: Yes');
        }
      }
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * Get a spec as an LLM prompt.
   */
  getSpecPrompt(specKey: string, options?: SpecPromptOptions): string {
    const spec = this.specs.get(specKey);
    if (!spec) {
      throw new Error(`Spec not found: ${specKey}`);
    }

    const sections: string[] = [];
    const opts = {
      includeTools: options?.includeTools ?? true,
      format: options?.format ?? 'structured',
      ...options,
    };

    // Identity section
    sections.push('# Agent Identity');
    sections.push('');
    sections.push(`You are ${spec.meta.key} (v${spec.meta.version}).`);
    sections.push('');

    // Description
    if (spec.description) {
      sections.push('## Description');
      sections.push('');
      sections.push(spec.description);
      sections.push('');
    }

    // Instructions
    sections.push('## Instructions');
    sections.push('');
    sections.push(spec.instructions);
    sections.push('');

    // Tools
    if (opts.includeTools && spec.tools && spec.tools.length > 0) {
      sections.push('## Available Tools');
      sections.push('');
      sections.push('You have access to the following tools:');
      sections.push('');

      for (const tool of spec.tools) {
        sections.push(`### ${tool.name}`);
        sections.push('');
        if (tool.description) {
          sections.push(tool.description);
          sections.push('');
        }
        if (tool.schema && opts.format === 'structured') {
          sections.push('Parameters:');
          sections.push('```json');
          sections.push(JSON.stringify(tool.schema, null, 2));
          sections.push('```');
          sections.push('');
        }
      }
    }

    // Knowledge instructions
    if (spec.knowledge && spec.knowledge.length > 0) {
      const requiredKnowledge = spec.knowledge.filter((k) => k.required);
      if (requiredKnowledge.length > 0) {
        sections.push('## Knowledge Context');
        sections.push('');
        for (const k of requiredKnowledge) {
          if (k.instructions) {
            sections.push(k.instructions);
            sections.push('');
          }
        }
      }
    }

    // Custom context
    if (options?.customContext) {
      sections.push('## Additional Context');
      sections.push('');
      sections.push(options.customContext);
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * List available specs.
   */
  listSpecs(options?: SpecListOptions): SpecListResult[] {
    const results: SpecListResult[] = [];

    for (const [key, spec] of this.specs) {
      // Apply filters
      if (options?.stability && spec.meta.stability !== options.stability) {
        continue;
      }
      if (options?.tags && options.tags.length > 0) {
        const specTags = spec.tags ?? [];
        const hasMatchingTag = options.tags.some((tag) =>
          specTags.includes(tag)
        );
        if (!hasMatchingTag) {
          continue;
        }
      }

      results.push({
        key,
        name: spec.meta.key,
        version: spec.meta.version,
        description: spec.description,
        stability: spec.meta.stability,
        tags: spec.tags,
        toolCount: spec.tools?.length ?? 0,
      });
    }

    return results;
  }

  /**
   * Query a spec by key.
   */
  querySpec(specKey: string): SpecQueryResult | undefined {
    const spec = this.specs.get(specKey);
    if (!spec) {
      return undefined;
    }

    return {
      key: specKey,
      spec,
      markdown: this.getSpecMarkdown(specKey),
      prompt: this.getSpecPrompt(specKey),
    };
  }

  /**
   * Check if a spec exists.
   */
  hasSpec(specKey: string): boolean {
    return this.specs.has(specKey);
  }

  /**
   * Get a spec by key.
   */
  getSpec(specKey: string): AgentSpec | undefined {
    return this.specs.get(specKey);
  }

  /**
   * Get all specs.
   */
  getAllSpecs(): AgentSpec[] {
    return Array.from(this.specs.values());
  }

  /**
   * Get spec count.
   */
  getSpecCount(): number {
    return this.specs.size;
  }

  /**
   * Add a spec to the consumer.
   */
  addSpec(spec: AgentSpec): void {
    const key = agentKey(spec.meta);
    this.specs.set(key, spec);
  }

  /**
   * Remove a spec from the consumer.
   */
  removeSpec(specKey: string): boolean {
    return this.specs.delete(specKey);
  }
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create a new spec consumer.
 */
export function createSpecConsumer(config: SpecConsumerConfig): SpecConsumer {
  return new ContractSpecConsumer(config);
}

/**
 * Create a spec consumer from a single spec.
 */
export function createSingleSpecConsumer(
  spec: AgentSpec,
  options?: Omit<SpecConsumerConfig, 'specs'>
): SpecConsumer {
  return new ContractSpecConsumer({
    specs: [spec],
    ...options,
  });
}
