import type { OwnerShipMeta } from '@contractspec/lib.contracts-spec/ownership';
import type { KnowledgeCategory } from '@contractspec/lib.contracts-spec/knowledge/spec';
import type { PolicyRef } from '@contractspec/lib.contracts-spec/policy/spec';
import { getDefaultI18n } from '../i18n';

/**
 * Metadata for an agent specification.
 */
export type AgentMeta = OwnerShipMeta;

/**
 * Configuration for a tool that an agent can use.
 */
export interface AgentToolConfig {
  /** Tool name (unique within the agent) */
  name: string;
  /** Human-readable description for the LLM */
  description?: string;
  /** JSON Schema fragment for tool parameters */
  schema?: Record<string, unknown>;
  /** Optional cooldown in milliseconds between invocations */
  cooldownMs?: number;
  /** Maximum execution time before timeout */
  timeoutMs?: number;
  /** Whether the tool can be executed without human approval (AI SDK needsApproval = !automationSafe) */
  automationSafe?: boolean;
  /** Explicit approval requirement (overrides automationSafe) */
  requiresApproval?: boolean;
  /** Optional policy guard that must evaluate to allow the tool call */
  policy?: PolicyRef;
}

/**
 * Reference to a knowledge space that the agent can access.
 */
export interface AgentKnowledgeRef {
  /** Knowledge space key */
  key: string;
  /** Optional specific version */
  version?: number;
  /** Filter by knowledge category */
  category?: KnowledgeCategory;
  /** Whether the knowledge is required (static injection) or optional (dynamic RAG) */
  required?: boolean;
  /** Additional instructions appended when the space is available */
  instructions?: string;
}

/**
 * Memory configuration for agent session persistence.
 */
export interface AgentMemoryConfig {
  /** Maximum entries to keep in memory */
  maxEntries?: number;
  /** Time-to-live in minutes */
  ttlMinutes?: number;
  /** Number of messages before triggering summarization */
  summaryTrigger?: number;
  /** Whether to persist to long-term storage */
  persistLongTerm?: boolean;
}

/**
 * Confidence policy for agent responses.
 */
export interface AgentConfidencePolicy {
  /** Minimum acceptable confidence before escalation. Defaults to 0.7 */
  min?: number;
  /** Default value used when provider does not report confidence */
  default?: number;
}

/**
 * Escalation policy for handling uncertain or failed agent responses.
 */
export interface AgentEscalationPolicy {
  /** Auto escalate when confidence < threshold */
  confidenceThreshold?: number;
  /** Escalate when a tool throws irrecoverable errors */
  onToolFailure?: boolean;
  /** Escalate when iteration budget exceeded */
  onTimeout?: boolean;
  /** Optional human approval workflow ID */
  approvalWorkflow?: string;
}

/**
 * Combined policy configuration for an agent.
 */
export interface AgentPolicy {
  confidence?: AgentConfidencePolicy;
  escalation?: AgentEscalationPolicy;
  /** Feature flags to apply to this agent */
  flags?: string[];
}

/**
 * Complete specification for a ContractSpec agent.
 */
export interface AgentSpec {
  meta: AgentMeta;
  /** System instructions for the agent */
  instructions: string;
  /** Human-readable description */
  description?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Default locale for the agent (e.g., 'en', 'fr'). Falls back to 'en' if unset. */
  locale?: string;
  /** Tools the agent can use */
  tools: AgentToolConfig[];
  /** Memory/session configuration */
  memory?: AgentMemoryConfig;
  /** Knowledge spaces the agent can access */
  knowledge?: AgentKnowledgeRef[];
  /** Policy configuration */
  policy?: AgentPolicy;
  /** Maximum steps per generation (defaults to 10) */
  maxSteps?: number;
}

/**
 * Define and validate an agent specification.
 *
 * @param spec - The agent specification
 * @returns The frozen, validated specification
 * @throws Error if the specification is invalid
 */
export function defineAgent(spec: AgentSpec): AgentSpec {
  const i18n = getDefaultI18n();
  if (!spec.meta?.key) {
    throw new Error(i18n.t('error.agentKeyRequired'));
  }
  if (typeof spec.meta.version !== 'string') {
    throw new Error(
      i18n.t('error.agentMissingVersion', { key: spec.meta.key })
    );
  }
  if (!spec.instructions?.trim()) {
    throw new Error(
      i18n.t('error.agentRequiresInstructions', { key: spec.meta.key })
    );
  }
  if (!spec.tools?.length) {
    throw new Error(i18n.t('error.agentRequiresTool', { key: spec.meta.key }));
  }

  // Validate tool names are unique
  const toolNames = new Set<string>();
  for (const tool of spec.tools) {
    if (toolNames.has(tool.name)) {
      throw new Error(
        i18n.t('error.agentDuplicateTool', {
          key: spec.meta.key,
          name: tool.name,
        })
      );
    }
    toolNames.add(tool.name);
  }

  return Object.freeze(spec);
}

/**
 * Generate a unique key for an agent spec.
 */
export function agentKey(meta: AgentMeta): string {
  return `${meta.key}.v${meta.version}`;
}

