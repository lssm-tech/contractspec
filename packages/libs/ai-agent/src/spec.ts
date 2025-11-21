import type { OwnerShipMeta } from '@lssm/lib.contracts/ownership';
import type { KnowledgeCategory } from '@lssm/lib.contracts/knowledge/spec';
import type { PolicyRef } from '@lssm/lib.contracts/policy/spec';

export interface AgentMeta extends OwnerShipMeta {
  name: string;
  version: number;
}

export interface AgentToolConfig {
  name: string;
  description?: string;
  /** JSON Schema fragment forwarded to the LLM tool definition. */
  schema?: Record<string, unknown>;
  /** Optional cooldown in milliseconds. */
  cooldownMs?: number;
  timeoutMs?: number;
  /** Whether the tool can be executed without human approval. */
  automationSafe?: boolean;
  /** Optional policy guard that must evaluate to allow the tool call. */
  policy?: PolicyRef;
}

export interface AgentKnowledgeRef {
  key: string;
  version?: number;
  category?: KnowledgeCategory;
  required?: boolean;
  /** Additional instructions appended when the space is available. */
  instructions?: string;
}

export interface AgentMemoryConfig {
  maxEntries?: number;
  ttlMinutes?: number;
  summaryTrigger?: number;
  persistLongTerm?: boolean;
}

export interface AgentConfidencePolicy {
  /** Minimum acceptable confidence before escalation. Defaults to 0.7. */
  min?: number;
  /** Default value used when provider does not report confidence. */
  default?: number;
}

export interface AgentEscalationPolicy {
  /** Auto escalate when confidence < threshold. */
  confidenceThreshold?: number;
  /** Escalate when a tool throws irrecoverable errors. */
  onToolFailure?: boolean;
  /** Escalate when iteration budget exceeded. */
  onTimeout?: boolean;
  /** Optional human approval workflow ID. */
  approvalWorkflow?: string;
}

export interface AgentPolicy {
  confidence?: AgentConfidencePolicy;
  escalation?: AgentEscalationPolicy;
  flags?: string[];
}

export interface AgentSpec {
  meta: AgentMeta;
  instructions: string;
  description?: string;
  tags?: string[];
  tools: AgentToolConfig[];
  memory?: AgentMemoryConfig;
  knowledge?: AgentKnowledgeRef[];
  policy?: AgentPolicy;
}

const agentKey = (meta: AgentMeta) => `${meta.name}.v${meta.version}`;

export function defineAgent(spec: AgentSpec): AgentSpec {
  if (!spec.meta?.name) throw new Error('Agent name is required');
  if (!Number.isFinite(spec.meta.version)) {
    throw new Error(`Agent ${spec.meta.name} is missing a numeric version`);
  }
  if (!spec.instructions?.trim()) {
    throw new Error(`Agent ${spec.meta.name} requires instructions`);
  }
  if (!spec.tools?.length) {
    throw new Error(`Agent ${spec.meta.name} must expose at least one tool`);
  }
  return Object.freeze(spec);
}

export class AgentRegistry {
  private readonly specs = new Map<string, AgentSpec>();

  register(spec: AgentSpec): this {
    const key = agentKey(spec.meta);
    if (this.specs.has(key)) {
      throw new Error(`Duplicate agent spec registered for ${key}`);
    }
    this.specs.set(key, spec);
    return this;
  }

  list(): AgentSpec[] {
    return [...this.specs.values()];
  }

  get(name: string, version?: number): AgentSpec | undefined {
    if (version != null) {
      return this.specs.get(`${name}.v${version}`);
    }
    let latest: AgentSpec | undefined;
    let maxVersion = -Infinity;
    for (const spec of this.specs.values()) {
      if (spec.meta.name !== name) continue;
      if (spec.meta.version > maxVersion) {
        latest = spec;
        maxVersion = spec.meta.version;
      }
    }
    return latest;
  }

  require(name: string, version?: number): AgentSpec {
    const spec = this.get(name, version);
    if (!spec) {
      throw new Error(
        `Agent spec not found for ${name}${version ? `.v${version}` : ''}`
      );
    }
    return spec;
  }
}
