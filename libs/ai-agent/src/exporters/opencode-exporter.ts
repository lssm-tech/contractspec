/**
 * OpenCode SDK Exporter
 *
 * Exports ContractSpec AgentSpec definitions to formats compatible with
 * @opencode-ai/sdk (JSON config and markdown agent files).
 */

import type { AgentSpec } from '../spec/spec';
import { agentKey } from '../spec/spec';
import type {
  Exporter,
  OpenCodeAgentJSON,
  OpenCodeExportOptions,
  OpenCodeExportResult,
  OpenCodeToolJSON,
} from './types';
import type { OpenCodeAgentType } from '../providers/types';
import { inferAgentType } from '../providers/opencode-sdk/agent-bridge';

// ============================================================================
// Exporter Implementation
// ============================================================================

/**
 * OpenCode SDK Exporter.
 */
export class OpenCodeExporter implements Exporter<
  OpenCodeExportOptions,
  OpenCodeExportResult
> {
  readonly format = 'opencode' as const;

  /**
   * Export an AgentSpec to OpenCode SDK format.
   */
  export(
    spec: AgentSpec,
    options: OpenCodeExportOptions = {}
  ): OpenCodeExportResult {
    const jsonConfig = this.buildJsonConfig(spec, options);
    const markdownConfig = this.generateMarkdown(spec, jsonConfig, options);

    return {
      jsonConfig,
      markdownConfig,
      exportedAt: new Date(),
      sourceSpec: agentKey(spec.meta),
    };
  }

  /**
   * Export multiple specs.
   */
  exportMany(
    specs: AgentSpec[],
    options: OpenCodeExportOptions = {}
  ): OpenCodeExportResult[] {
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

    // OpenCode doesn't require tools, but we check for valid tool names
    for (const tool of spec.tools ?? []) {
      if (!tool.name) {
        errors.push('All tools must have a name');
      }
      // OpenCode tool names should be valid identifiers
      if (tool.name && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tool.name)) {
        errors.push(
          `Tool name '${tool.name}' should be a valid identifier (letters, numbers, underscores)`
        );
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Build OpenCode agent JSON configuration.
   */
  private buildJsonConfig(
    spec: AgentSpec,
    options: OpenCodeExportOptions
  ): OpenCodeAgentJSON {
    const agentType: OpenCodeAgentType =
      options.agentType ?? inferAgentType(spec);

    return {
      name: spec.meta.key,
      version: spec.meta.version,
      description: spec.description,
      type: agentType,
      instructions: spec.instructions,
      tools: this.exportTools(spec),
      config: {
        max_steps: options.maxSteps ?? spec.maxSteps ?? 10,
        temperature: options.temperature ?? 0.7,
        model: options.model,
      },
    };
  }

  /**
   * Export tools to OpenCode format.
   */
  private exportTools(spec: AgentSpec): OpenCodeToolJSON[] {
    return spec.tools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? `Execute ${tool.name}`,
      schema: tool.schema ?? { type: 'object' },
      requires_approval: tool.requiresApproval ?? !tool.automationSafe,
    }));
  }

  /**
   * Generate markdown agent file content.
   */
  private generateMarkdown(
    spec: AgentSpec,
    jsonConfig: OpenCodeAgentJSON,
    options: OpenCodeExportOptions
  ): string {
    const lines: string[] = [];

    // Frontmatter
    lines.push('---');
    lines.push(`name: ${jsonConfig.name}`);
    lines.push(`type: ${jsonConfig.type}`);

    if (jsonConfig.version) {
      lines.push(`version: ${jsonConfig.version}`);
    }

    if (jsonConfig.config.model) {
      lines.push(`model: ${jsonConfig.config.model}`);
    }

    if (jsonConfig.config.temperature !== undefined) {
      lines.push(`temperature: ${jsonConfig.config.temperature}`);
    }

    if (jsonConfig.config.max_steps !== undefined) {
      lines.push(`max_steps: ${jsonConfig.config.max_steps}`);
    }

    // Tool list in frontmatter
    if (jsonConfig.tools.length > 0) {
      lines.push('tools:');
      for (const tool of jsonConfig.tools) {
        const permission = tool.requires_approval ? ' # requires approval' : '';
        lines.push(`  - ${tool.name}${permission}`);
      }
    }

    lines.push('---');
    lines.push('');

    // Title
    lines.push(`# ${spec.meta.key}`);
    lines.push('');

    // Description
    if (spec.description) {
      lines.push(spec.description);
      lines.push('');
    }

    // Agent type explanation
    lines.push(`> Agent type: **${jsonConfig.type}**`);
    lines.push('');
    lines.push(this.getAgentTypeDescription(jsonConfig.type));
    lines.push('');

    // Instructions
    lines.push('## Instructions');
    lines.push('');
    lines.push(spec.instructions);
    lines.push('');

    // Tools section
    if (spec.tools.length > 0) {
      lines.push('## Tools');
      lines.push('');
      for (const tool of spec.tools) {
        const approval = tool.requiresApproval ? ' *(requires approval)*' : '';
        const safe =
          tool.automationSafe === false ? ' *(not automation safe)*' : '';
        lines.push(`### ${tool.name}${approval}${safe}`);
        lines.push('');
        if (tool.description) {
          lines.push(tool.description);
          lines.push('');
        }
        if (tool.schema && options.includeComments !== false) {
          lines.push('**Parameters:**');
          lines.push('');
          lines.push('```json');
          lines.push(
            JSON.stringify(
              tool.schema,
              null,
              options.prettyPrint !== false ? 2 : 0
            )
          );
          lines.push('```');
          lines.push('');
        }
      }
    }

    // Knowledge sources
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
      lines.push('');
    }

    // Configuration (JSON)
    lines.push('## Configuration');
    lines.push('');
    lines.push('```json');
    lines.push(
      JSON.stringify(
        jsonConfig.config,
        null,
        options.prettyPrint !== false ? 2 : 0
      )
    );
    lines.push('```');
    lines.push('');

    // Footer
    lines.push('---');
    lines.push('');
    lines.push(`*Generated from ContractSpec: ${agentKey(spec.meta)}*`);
    lines.push(`*Exported at: ${new Date().toISOString()}*`);

    return lines.join('\n');
  }

  /**
   * Get description for agent type.
   */
  private getAgentTypeDescription(type: OpenCodeAgentType): string {
    switch (type) {
      case 'build':
        return 'Primary agent with full tool access for code generation and modification.';
      case 'plan':
        return 'Restricted agent for analysis and planning. File edits and bash commands require approval.';
      case 'general':
        return 'General-purpose subagent for complex questions and multi-step tasks.';
      case 'explore':
        return 'Fast subagent optimized for codebase exploration and pattern searching.';
      default:
        return '';
    }
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Export an AgentSpec to OpenCode SDK format.
 */
export function exportToOpenCode(
  spec: AgentSpec,
  options?: OpenCodeExportOptions
): OpenCodeExportResult {
  const exporter = new OpenCodeExporter();
  return exporter.export(spec, options);
}

/**
 * Generate OpenCode agent markdown from an AgentSpec.
 */
export function generateOpenCodeMarkdown(
  spec: AgentSpec,
  options?: OpenCodeExportOptions
): string {
  const exporter = new OpenCodeExporter();
  const result = exporter.export(spec, options);
  return result.markdownConfig;
}

/**
 * Generate OpenCode agent JSON from an AgentSpec.
 */
export function generateOpenCodeJSON(
  spec: AgentSpec,
  options?: OpenCodeExportOptions
): OpenCodeAgentJSON {
  const exporter = new OpenCodeExporter();
  const result = exporter.export(spec, options);
  return result.jsonConfig;
}

/**
 * Validate an AgentSpec for OpenCode SDK export.
 */
export function validateForOpenCode(spec: AgentSpec): {
  valid: boolean;
  errors: string[];
} {
  const exporter = new OpenCodeExporter();
  return exporter.validate(spec);
}
