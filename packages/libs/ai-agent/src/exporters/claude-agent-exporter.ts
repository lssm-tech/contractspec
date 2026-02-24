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
import { createAgentI18n } from '../i18n';

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
    const i18n = createAgentI18n(spec.locale);
    const errors: string[] = [];

    if (!spec.meta?.key) {
      errors.push(i18n.t('export.validation.requiresKey'));
    }

    if (!spec.instructions) {
      errors.push(i18n.t('export.validation.requiresInstructions'));
    }

    if (!spec.tools || spec.tools.length === 0) {
      errors.push(i18n.t('export.validation.requiresTool'));
    }

    for (const tool of spec.tools ?? []) {
      if (!tool.name) {
        errors.push(i18n.t('export.validation.toolRequiresName'));
      }
      if (!tool.description && !tool.name) {
        errors.push(i18n.t('export.validation.toolRequiresDescOrName'));
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
    const i18n = createAgentI18n(options.locale ?? spec.locale);
    const parts: string[] = [];

    // Base instructions
    parts.push(spec.instructions);

    // Add knowledge context if available
    if (spec.knowledge && spec.knowledge.length > 0) {
      parts.push('');
      parts.push(i18n.t('export.knowledgeSources'));
      for (const k of spec.knowledge) {
        if (k.instructions) {
          parts.push(`- ${k.key}: ${k.instructions}`);
        }
      }
    }

    // Add policy information if available
    if (spec.policy) {
      parts.push('');
      parts.push(i18n.t('export.policy'));
      if (spec.policy.confidence?.min) {
        parts.push(
          i18n.t('export.minConfidence', { min: spec.policy.confidence.min })
        );
      }
      if (spec.policy.escalation) {
        parts.push(i18n.t('export.escalationConfigured'));
      }
    }

    // Add custom metadata if provided
    if (options.metadata) {
      parts.push('');
      parts.push(i18n.t('export.additionalContext'));
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
    const i18n = createAgentI18n(spec.locale);
    return spec.tools.map((tool) => ({
      name: tool.name,
      description:
        tool.description ??
        i18n.t('tool.fallbackDescription', { name: tool.name }),
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
    const i18n = createAgentI18n(options.locale ?? spec.locale);
    const lines: string[] = [];

    // Header
    lines.push(i18n.t('export.agentConfiguration'));
    lines.push('');

    // Description
    if (spec.description) {
      lines.push(`> ${spec.description}`);
      lines.push('');
    }

    // Metadata
    lines.push(i18n.t('export.metadata'));
    lines.push('');
    lines.push(i18n.t('export.metaName', { name: spec.meta.key }));
    lines.push(i18n.t('export.metaVersion', { version: spec.meta.version }));
    if (spec.meta.owners && spec.meta.owners.length > 0) {
      lines.push(
        i18n.t('export.metaOwners', {
          owners: spec.meta.owners.join(', '),
        })
      );
    }
    if (options.model) {
      lines.push(i18n.t('export.metaModel', { model: options.model }));
    }
    lines.push('');

    // Instructions
    lines.push(i18n.t('export.instructions'));
    lines.push('');
    lines.push(spec.instructions);
    lines.push('');

    // Tools
    if (spec.tools.length > 0) {
      lines.push(i18n.t('export.availableTools'));
      lines.push('');
      for (const tool of spec.tools) {
        const flags: string[] = [];
        if (tool.requiresApproval) {
          flags.push(i18n.t('export.requiresApproval'));
        }
        if (tool.automationSafe === false) {
          flags.push(i18n.t('export.notAutomationSafe'));
        }
        const flagStr = flags.length > 0 ? ` (${flags.join(', ')})` : '';

        lines.push(`### ${tool.name}${flagStr}`);
        lines.push('');
        if (tool.description) {
          lines.push(tool.description);
          lines.push('');
        }
        if (tool.schema) {
          lines.push(i18n.t('export.parameters'));
          lines.push('```json');
          lines.push(JSON.stringify(tool.schema, null, 2));
          lines.push('```');
          lines.push('');
        }
      }
    }

    // Knowledge
    if (spec.knowledge && spec.knowledge.length > 0) {
      lines.push(i18n.t('export.knowledgeSources'));
      lines.push('');
      for (const k of spec.knowledge) {
        const required = k.required
          ? i18n.t('export.required')
          : i18n.t('export.optional');
        lines.push(`- **${k.key}** ${required}`);
        if (k.instructions) {
          lines.push(`  - ${k.instructions}`);
        }
      }
      lines.push('');
    }

    // Policy
    if (spec.policy) {
      lines.push(i18n.t('export.policy'));
      lines.push('');
      if (spec.policy.confidence?.min) {
        lines.push(
          i18n.t('export.minConfidence', { min: spec.policy.confidence.min })
        );
      }
      if (spec.policy.escalation) {
        lines.push(i18n.t('export.escalationPolicyConfigured'));
      }
      if (spec.policy.flags && spec.policy.flags.length > 0) {
        lines.push(
          i18n.t('export.featureFlags', {
            flags: spec.policy.flags.join(', '),
          })
        );
      }
      lines.push('');
    }

    // MCP Servers
    if (options.mcpServers && options.mcpServers.length > 0) {
      lines.push(i18n.t('export.mcpServers'));
      lines.push('');
      for (const server of options.mcpServers) {
        lines.push(`- **${server.name}**: \`${this.formatMcpServer(server)}\``);
      }
      lines.push('');
    }

    // Footer
    lines.push('---');
    lines.push('');
    lines.push(i18n.t('export.generatedFrom', { key: agentKey(spec.meta) }));

    return lines.join('\n');
  }

  private formatMcpServer(
    server: NonNullable<ClaudeAgentExportOptions['mcpServers']>[number]
  ): string {
    if ('command' in server) {
      const args = server.args ? ` ${server.args.join(' ')}` : '';
      return `${server.command}${args}`;
    }

    if (server.transport === 'http' || server.transport === 'sse') {
      return `${server.transport} ${server.url}`;
    }

    return server.url;
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
