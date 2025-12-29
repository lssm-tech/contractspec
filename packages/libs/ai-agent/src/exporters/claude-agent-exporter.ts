/**
 * Claude Agent SDK Exporter
 *
 * Exports ContractSpec AgentSpec definitions to formats compatible with
 * @anthropic-ai/claude-agent-sdk and Claude Code CLI.
 */

import type { AgentSpec } from '../spec/spec';
import { agentKey } from '../spec/spec';
import type {
  Exporter,
  ClaudeAgentExportOptions,
  ClaudeAgentExportResult,
  ClaudeAgentConfig,
  ClaudeToolDefinition,
} from './types';

// ============================================================================
// Exporter Implementation
// ============================================================================

/**
 * Claude Agent SDK Exporter.
 */
export class ClaudeAgentExporter implements Exporter<
  ClaudeAgentExportOptions,
  ClaudeAgentExportResult
> {
  readonly format = 'claude-agent' as const;

  /**
   * Export an AgentSpec to Claude Agent SDK format.
   */
  export(
    spec: AgentSpec,
    options: ClaudeAgentExportOptions = {}
  ): ClaudeAgentExportResult {
    const tools = this.exportTools(spec);
    const config = this.buildConfig(spec, tools, options);
    const claudeMd = options.generateClaudeMd
      ? this.generateClaudeMd(spec, options)
      : undefined;

    return {
      config,
      claudeMd,
      tools,
      exportedAt: new Date(),
      sourceSpec: agentKey(spec.meta),
    };
  }

  /**
   * Export multiple specs.
   */
  exportMany(
    specs: AgentSpec[],
    options: ClaudeAgentExportOptions = {}
  ): ClaudeAgentExportResult[] {
    return specs.map((spec) => this.export(spec, options));
  }

  /**
   * Validate that a spec can be exported.
   */
  validate(spec: AgentSpec): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!spec.meta?.key) {
      errors.push('Spec must have a meta.key');
    }

    if (!spec.instructions) {
      errors.push('Spec must have instructions');
    }

    if (!spec.tools || spec.tools.length === 0) {
      errors.push('Spec must have at least one tool');
    }

    for (const tool of spec.tools ?? []) {
      if (!tool.name) {
        errors.push('All tools must have a name');
      }
      if (!tool.description && !tool.name) {
        errors.push(`Tool must have a description or name`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Build Claude Agent SDK configuration.
   */
  private buildConfig(
    spec: AgentSpec,
    tools: ClaudeToolDefinition[],
    options: ClaudeAgentExportOptions
  ): ClaudeAgentConfig {
    const config: ClaudeAgentConfig = {
      model: options.model ?? 'claude-sonnet-4-20250514',
      system: this.buildSystemPrompt(spec, options),
      tools,
      max_turns: spec.maxSteps ?? 10,
    };

    if (options.computerUse) {
      config.computer_use = true;
    }

    if (options.extendedThinking) {
      config.extended_thinking = true;
    }

    if (options.mcpServers && options.mcpServers.length > 0) {
      config.mcp_servers = options.mcpServers;
    }

    return config;
  }

  /**
   * Build system prompt from spec.
   */
  private buildSystemPrompt(
    spec: AgentSpec,
    options: ClaudeAgentExportOptions
  ): string {
    const parts: string[] = [];

    // Base instructions
    parts.push(spec.instructions);

    // Add knowledge context if available
    if (spec.knowledge && spec.knowledge.length > 0) {
      parts.push('');
      parts.push('## Knowledge Sources');
      for (const k of spec.knowledge) {
        if (k.instructions) {
          parts.push(`- ${k.key}: ${k.instructions}`);
        }
      }
    }

    // Add policy information if available
    if (spec.policy) {
      parts.push('');
      parts.push('## Policy');
      if (spec.policy.confidence?.min) {
        parts.push(`- Minimum confidence: ${spec.policy.confidence.min}`);
      }
      if (spec.policy.escalation) {
        parts.push('- Escalation policy is configured');
      }
    }

    // Add custom metadata if provided
    if (options.metadata) {
      parts.push('');
      parts.push('## Additional Context');
      for (const [key, value] of Object.entries(options.metadata)) {
        parts.push(`- ${key}: ${String(value)}`);
      }
    }

    return parts.join('\n');
  }

  /**
   * Export tools to Claude Agent SDK format.
   */
  private exportTools(spec: AgentSpec): ClaudeToolDefinition[] {
    return spec.tools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? `Execute ${tool.name}`,
      input_schema: this.normalizeSchema(tool.schema),
      requires_confirmation: tool.requiresApproval ?? !tool.automationSafe,
    }));
  }

  /**
   * Normalize schema to Claude Agent SDK format.
   */
  private normalizeSchema(
    schema?: Record<string, unknown>
  ): ClaudeToolDefinition['input_schema'] {
    if (!schema) {
      return { type: 'object' };
    }

    if (schema.type === 'object') {
      return {
        type: 'object',
        properties: schema.properties as Record<string, unknown> | undefined,
        required: schema.required as string[] | undefined,
      };
    }

    // Wrap non-object schemas
    return {
      type: 'object',
      properties: { value: schema },
      required: ['value'],
    };
  }

  /**
   * Generate CLAUDE.md content for Claude Code CLI integration.
   */
  private generateClaudeMd(
    spec: AgentSpec,
    options: ClaudeAgentExportOptions
  ): string {
    const lines: string[] = [];

    // Header
    lines.push('# Agent Configuration');
    lines.push('');

    // Description
    if (spec.description) {
      lines.push(`> ${spec.description}`);
      lines.push('');
    }

    // Metadata
    lines.push('## Metadata');
    lines.push('');
    lines.push(`- **Name**: ${spec.meta.key}`);
    lines.push(`- **Version**: ${spec.meta.version}`);
    if (spec.meta.owners && spec.meta.owners.length > 0) {
      lines.push(`- **Owners**: ${spec.meta.owners.join(', ')}`);
    }
    if (options.model) {
      lines.push(`- **Model**: ${options.model}`);
    }
    lines.push('');

    // Instructions
    lines.push('## Instructions');
    lines.push('');
    lines.push(spec.instructions);
    lines.push('');

    // Tools
    if (spec.tools.length > 0) {
      lines.push('## Available Tools');
      lines.push('');
      for (const tool of spec.tools) {
        const flags: string[] = [];
        if (tool.requiresApproval) {
          flags.push('requires approval');
        }
        if (tool.automationSafe === false) {
          flags.push('not automation safe');
        }
        const flagStr = flags.length > 0 ? ` (${flags.join(', ')})` : '';

        lines.push(`### ${tool.name}${flagStr}`);
        lines.push('');
        if (tool.description) {
          lines.push(tool.description);
          lines.push('');
        }
        if (tool.schema) {
          lines.push('**Parameters:**');
          lines.push('```json');
          lines.push(JSON.stringify(tool.schema, null, 2));
          lines.push('```');
          lines.push('');
        }
      }
    }

    // Knowledge
    if (spec.knowledge && spec.knowledge.length > 0) {
      lines.push('## Knowledge Sources');
      lines.push('');
      for (const k of spec.knowledge) {
        const required = k.required ? '(required)' : '(optional)';
        lines.push(`- **${k.key}** ${required}`);
        if (k.instructions) {
          lines.push(`  - ${k.instructions}`);
        }
      }
      lines.push('');
    }

    // Policy
    if (spec.policy) {
      lines.push('## Policy');
      lines.push('');
      if (spec.policy.confidence?.min) {
        lines.push(`- Minimum confidence: ${spec.policy.confidence.min}`);
      }
      if (spec.policy.escalation) {
        lines.push('- Escalation policy configured');
      }
      if (spec.policy.flags && spec.policy.flags.length > 0) {
        lines.push(`- Feature flags: ${spec.policy.flags.join(', ')}`);
      }
      lines.push('');
    }

    // MCP Servers
    if (options.mcpServers && options.mcpServers.length > 0) {
      lines.push('## MCP Servers');
      lines.push('');
      for (const server of options.mcpServers) {
        lines.push(
          `- **${server.name}**: \`${server.command}${server.args ? ' ' + server.args.join(' ') : ''}\``
        );
      }
      lines.push('');
    }

    // Footer
    lines.push('---');
    lines.push('');
    lines.push(`*Generated from ContractSpec: ${agentKey(spec.meta)}*`);

    return lines.join('\n');
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Export an AgentSpec to Claude Agent SDK format.
 */
export function exportToClaudeAgent(
  spec: AgentSpec,
  options?: ClaudeAgentExportOptions
): ClaudeAgentExportResult {
  const exporter = new ClaudeAgentExporter();
  return exporter.export(spec, options);
}

/**
 * Generate CLAUDE.md content from an AgentSpec.
 */
export function generateClaudeMd(
  spec: AgentSpec,
  options?: Omit<ClaudeAgentExportOptions, 'generateClaudeMd'>
): string {
  const exporter = new ClaudeAgentExporter();
  const result = exporter.export(spec, { ...options, generateClaudeMd: true });
  return result.claudeMd ?? '';
}

/**
 * Validate an AgentSpec for Claude Agent SDK export.
 */
export function validateForClaudeAgent(spec: AgentSpec): {
  valid: boolean;
  errors: string[];
} {
  const exporter = new ClaudeAgentExporter();
  return exporter.validate(spec);
}
