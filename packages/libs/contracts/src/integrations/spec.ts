import type { OwnerShipMeta } from '../ownership';
import type {
  CapabilityRef,
  CapabilityRequirement,
} from '../capabilities';

export type IntegrationCategory =
  | 'payments'
  | 'email'
  | 'calendar'
  | 'sms'
  | 'ai-llm'
  | 'ai-voice'
  | 'speech-to-text'
  | 'vector-db'
  | 'storage'
  | 'accounting'
  | 'crm'
  | 'helpdesk'
  | 'custom';

export interface IntegrationMeta extends OwnerShipMeta {
  /** Stable provider slug (e.g., "stripe", "openai"). */
  key: string;
  /** Provider version (increment on breaking API changes). */
  version: number;
  category: IntegrationCategory;
  displayName: string;
}

export interface IntegrationCapabilityMapping {
  /** Which CapabilitySpec this integration provides. */
  provides: CapabilityRef[];
  /** Optional: which capabilities it requires (e.g., storage for caching). */
  requires?: CapabilityRequirement[];
}

export interface IntegrationConfigSchema {
  /** JSON Schema or SchemaModel defining required config fields. */
  schema: unknown;
  /** Example configuration (for docs/UI). */
  example?: Record<string, unknown>;
}

export interface IntegrationHealthCheck {
  /** Endpoint or method to validate connection health. */
  method?: 'ping' | 'list' | 'custom';
  /** Timeout in ms for health check. */
  timeoutMs?: number;
}

export interface IntegrationSpec {
  meta: IntegrationMeta;
  /** Which capabilities this integration provides/requires. */
  capabilities: IntegrationCapabilityMapping;
  /** Configuration schema (API keys, endpoints, etc.). */
  configSchema: IntegrationConfigSchema;
  /** Optional health check configuration. */
  healthCheck?: IntegrationHealthCheck;
  /** Documentation URL. */
  docsUrl?: string;
  /** Rate limits or usage constraints. */
  constraints?: {
    rateLimit?: { rpm?: number; rph?: number };
    quotas?: Record<string, number>;
  };
}

const integrationKey = (meta: Pick<IntegrationMeta, 'key' | 'version'>) =>
  `${meta.key}.v${meta.version}`;

export class IntegrationSpecRegistry {
  private readonly items = new Map<string, IntegrationSpec>();

  register(spec: IntegrationSpec): this {
    const key = integrationKey(spec.meta);
    if (this.items.has(key)) {
      throw new Error(`Duplicate IntegrationSpec ${key}`);
    }
    this.items.set(key, spec);
    return this;
  }

  list(): IntegrationSpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: number): IntegrationSpec | undefined {
    if (version != null) {
      return this.items.get(integrationKey({ key, version }));
    }
    let latest: IntegrationSpec | undefined;
    let maxVersion = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== key) continue;
      if (spec.meta.version > maxVersion) {
        maxVersion = spec.meta.version;
        latest = spec;
      }
    }
    return latest;
  }

  getByCategory(category: IntegrationCategory): IntegrationSpec[] {
    return this.list().filter((spec) => spec.meta.category === category);
  }
}

export function makeIntegrationSpecKey(meta: IntegrationMeta) {
  return integrationKey(meta);
}

