/**
 * Agent bridge for mapping between ContractSpec AgentSpec and OpenCode agent configuration.
 *
 * OpenCode has four built-in agent types:
 * - build: Primary agent with all tools enabled (default for code generation)
 * - plan: Restricted agent for analysis/planning (file edits and bash in "ask" mode)
 * - general: Subagent for complex questions and multi-step tasks
 * - explore: Fast subagent for codebase exploration
 */

import type { AgentSpec } from '../../spec/spec';
import type { OpenCodeAgentType } from '../types';
import { specToolsToOpenCodeTools, type OpenCodeTool } from './tool-bridge';
import { getDefaultI18n } from '../../i18n';

// ============================================================================
// OpenCode Agent Configuration Types
// ============================================================================

/**
 * OpenCode agent configuration in JSON format.
 */
export interface OpenCodeAgentJSON {
  /** Agent name */
  name: string;
  /** Agent version */
  version?: string;
  /** Agent description */
  description?: string;
  /** System instructions */
  instructions?: string;
  /** Agent type */
  agent_type: OpenCodeAgentType;
  /** Available tools */
  tools?: OpenCodeTool[];
  /** Configuration options */
  config?: OpenCodeAgentConfig;
}

/**
 * OpenCode agent configuration options.
 */
export interface OpenCodeAgentConfig {
  /** Maximum agentic iterations */
  max_steps?: number;
  /** Temperature for generation */
  temperature?: number;
  /** Model to use */
  model?: string;
  /** Tool permissions */
  permissions?: Record<string, 'allow' | 'ask' | 'deny'>;
}

/**
 * OpenCode agent markdown format (for .opencode/agent/*.md files).
 */
export interface OpenCodeAgentMarkdown {
  /** Frontmatter */
  frontmatter: {
    name: string;
    type: OpenCodeAgentType;
    version?: string;
    model?: string;
    temperature?: number;
    max_steps?: number;
    tools?: string[];
  };
  /** Body content */
  body: string;
}

// ============================================================================
// Agent Type Inference
// ============================================================================

/**
 * Infer the appropriate OpenCode agent type from an AgentSpec.
 *
 * The inference is based on:
 * - Tool capabilities (file editing, bash execution → build)
 * - Instructions content (planning keywords → plan)
 * - Exploration keywords (search, find → explore)
 */
export function inferAgentType(spec: AgentSpec): OpenCodeAgentType {
  // Check for code-generation/modification tools
  const hasCodeTools = spec.tools.some((tool) =>
    [
      'write_file',
      'edit_file',
      'create_file',
      'delete_file',
      'bash',
      'execute',
      'run_command',
      'terminal',
    ].includes(tool.name.toLowerCase())
  );

  // Check instructions for planning-related keywords
  const instructionsLower = spec.instructions.toLowerCase();
  const hasPlanningKeywords =
    /\b(plan|design|architect|strategy|analyze|review|assess|evaluate)\b/.test(
      instructionsLower
    );

  // Check for exploration-related keywords
  const hasExplorationKeywords =
    /\b(search|find|explore|discover|locate|grep|pattern)\b/.test(
      instructionsLower
    );

  // Check for research/general keywords
  const hasResearchKeywords =
    /\b(research|investigate|understand|learn|gather|collect)\b/.test(
      instructionsLower
    );

  // Decision logic
  if (hasCodeTools) {
    return 'build';
  }

  if (hasPlanningKeywords && !hasCodeTools) {
    return 'plan';
  }

  if (hasExplorationKeywords && !hasResearchKeywords) {
    return 'explore';
  }

  // Default to general for most use cases
  return 'general';
}

// ============================================================================
// Spec to OpenCode Conversion
// ============================================================================

/**
 * Convert an AgentSpec to OpenCode agent JSON configuration.
 */
export function specToOpenCodeConfig(
  spec: AgentSpec,
  options?: {
    agentType?: OpenCodeAgentType;
    model?: string;
    temperature?: number;
    maxSteps?: number;
  }
): OpenCodeAgentJSON {
  const agentType = options?.agentType ?? inferAgentType(spec);

  return {
    name: spec.meta.key,
    version: spec.meta.version,
    description: spec.description ?? spec.meta.description,
    instructions: spec.instructions,
    agent_type: agentType,
    tools: specToolsToOpenCodeTools(spec.tools),
    config: {
      max_steps: options?.maxSteps ?? spec.maxSteps ?? 10,
      temperature: options?.temperature ?? 0.7,
      model: options?.model,
      permissions: buildPermissions(spec),
    },
  };
}

/**
 * Build tool permissions from spec.
 */
function buildPermissions(
  spec: AgentSpec
): Record<string, 'allow' | 'ask' | 'deny'> {
  const permissions: Record<string, 'allow' | 'ask' | 'deny'> = {};

  for (const tool of spec.tools) {
    if (tool.requiresApproval) {
      permissions[tool.name] = 'ask';
    } else if (tool.automationSafe === false) {
      permissions[tool.name] = 'ask';
    } else {
      permissions[tool.name] = 'allow';
    }
  }

  return permissions;
}

/**
 * Convert an AgentSpec to OpenCode agent markdown format.
 */
export function specToOpenCodeMarkdown(
  spec: AgentSpec,
  options?: {
    agentType?: OpenCodeAgentType;
    model?: string;
    temperature?: number;
    maxSteps?: number;
  }
): OpenCodeAgentMarkdown {
  const agentType = options?.agentType ?? inferAgentType(spec);

  return {
    frontmatter: {
      name: spec.meta.key,
      type: agentType,
      version: spec.meta.version,
      model: options?.model,
      temperature: options?.temperature ?? 0.7,
      max_steps: options?.maxSteps ?? spec.maxSteps ?? 10,
      tools: spec.tools.map((t) => t.name),
    },
    body: buildMarkdownBody(spec),
  };
}

/**
 * Build markdown body content from spec.
 */
function buildMarkdownBody(spec: AgentSpec): string {
  const i18n = getDefaultI18n();
  const lines: string[] = [];

  // Title
  lines.push(`# ${spec.meta.key}`);
  lines.push('');

  // Description
  if (spec.description ?? spec.meta.description) {
    lines.push(spec.description ?? spec.meta.description ?? '');
    lines.push('');
  }

  // Instructions
  lines.push(i18n.t('export.instructions'));
  lines.push('');
  lines.push(spec.instructions);
  lines.push('');

  // Tools
  if (spec.tools.length > 0) {
    lines.push(i18n.t('export.tools'));
    lines.push('');
    for (const tool of spec.tools) {
      const permission = tool.requiresApproval
        ? i18n.t('export.bridge.requiresApproval')
        : tool.automationSafe === false
          ? i18n.t('export.bridge.askMode')
          : '';
      lines.push(
        `- **${tool.name}**: ${tool.description ?? i18n.t('export.noDescription')} ${permission}`.trim()
      );
    }
    lines.push('');
  }

  // Knowledge sources
  if (spec.knowledge && spec.knowledge.length > 0) {
    lines.push(i18n.t('export.knowledgeSources'));
    lines.push('');
    for (const k of spec.knowledge) {
      const required = k.required
        ? i18n.t('export.required')
        : i18n.t('export.optional');
      lines.push(`- ${k.key} ${required}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Serialize OpenCode agent markdown to string.
 */
export function serializeOpenCodeMarkdown(
  markdown: OpenCodeAgentMarkdown
): string {
  const lines: string[] = [];

  // Frontmatter
  lines.push('---');
  lines.push(`name: ${markdown.frontmatter.name}`);
  lines.push(`type: ${markdown.frontmatter.type}`);

  if (markdown.frontmatter.version) {
    lines.push(`version: ${markdown.frontmatter.version}`);
  }

  if (markdown.frontmatter.model) {
    lines.push(`model: ${markdown.frontmatter.model}`);
  }

  if (markdown.frontmatter.temperature !== undefined) {
    lines.push(`temperature: ${markdown.frontmatter.temperature}`);
  }

  if (markdown.frontmatter.max_steps !== undefined) {
    lines.push(`max_steps: ${markdown.frontmatter.max_steps}`);
  }

  if (markdown.frontmatter.tools && markdown.frontmatter.tools.length > 0) {
    lines.push(`tools:`);
    for (const tool of markdown.frontmatter.tools) {
      lines.push(`  - ${tool}`);
    }
  }

  lines.push('---');
  lines.push('');
  lines.push(markdown.body);

  return lines.join('\n');
}

// ============================================================================
// OpenCode to Spec Conversion
// ============================================================================

/**
 * Convert OpenCode agent configuration to partial AgentSpec.
 * Note: This is a partial conversion as OpenCode config may not have all spec fields.
 */
export function openCodeConfigToSpec(
  config: OpenCodeAgentJSON
): Partial<AgentSpec> {
  return {
    meta: {
      key: config.name,
      version: config.version ?? '1.0.0',
      description: config.description ?? '',
      stability: 'experimental',
      owners: [],
      tags: [],
    },
    description: config.description,
    instructions: config.instructions ?? '',
    tools:
      config.tools?.map((tool) => ({
        name: tool.name,
        description: tool.description,
        schema: tool.parameters,
        requiresApproval: tool.permission === 'ask',
        automationSafe: tool.permission === 'allow',
        // category not supported in AgentToolConfig
      })) ?? [],
    maxSteps: config.config?.max_steps ?? 10,
  };
}
