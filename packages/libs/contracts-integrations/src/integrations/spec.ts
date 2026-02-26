import type { OwnerShipMeta } from '@contractspec/lib.contracts-spec/ownership';
import type {
  CapabilityRef,
  CapabilityRequirement,
} from '@contractspec/lib.contracts-spec/capabilities';
import { SpecContractRegistry } from '@contractspec/lib.contracts-spec/registry';

export type IntegrationCategory =
  | 'payments'
  | 'email'
  | 'calendar'
  | 'sms'
  | 'health'
  | 'ai-llm'
  | 'ai-voice-tts'
  | 'ai-voice-stt'
  | 'ai-voice-conversational'
  | 'ai-image'
  | 'analytics'
  | 'vector-db'
  | 'storage'
  | 'accounting'
  | 'crm'
  | 'helpdesk'
  | 'project-management'
  | 'open-banking'
  | 'meeting-recorder'
  | 'database'
  | 'custom';

export type IntegrationOwnershipMode = 'managed' | 'byok';

export interface IntegrationMeta extends OwnerShipMeta {
  category: IntegrationCategory;
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

export interface IntegrationSecretSchema {
  /** JSON Schema or SchemaModel describing secret fields. */
  schema: unknown;
  /** Redacted example for documentation/UI. */
  example?: Record<string, string>;
}

export interface IntegrationByokSetup {
  /** Human-readable instructions for tenants configuring BYOK accounts. */
  setupInstructions?: string;
  /** Required scopes/permissions for BYOK accounts. */
  requiredScopes?: string[];
}

export interface IntegrationHealthCheck {
  /** Endpoint or method to validate connection health. */
  method?: 'ping' | 'list' | 'custom';
  /** Timeout in ms for health check. */
  timeoutMs?: number;
}

export interface IntegrationSpec {
  meta: IntegrationMeta;
  /** Supported ownership modes for this provider. */
  supportedModes: IntegrationOwnershipMode[];
  /** Which capabilities this integration provides/requires. */
  capabilities: IntegrationCapabilityMapping;
  /** Configuration schema (API keys, endpoints, etc.). */
  configSchema: IntegrationConfigSchema;
  /** Secret schema (API/key material stored via secretRef). */
  secretSchema: IntegrationSecretSchema;
  /** Optional health check configuration. */
  healthCheck?: IntegrationHealthCheck;
  /** Documentation URL. */
  docsUrl?: string;
  /** Rate limits or usage constraints. */
  constraints?: {
    rateLimit?: { rpm?: number; rph?: number };
    quotas?: Record<string, number>;
  };
  /** Provider-specific metadata for BYOK setup flows. */
  byokSetup?: IntegrationByokSetup;
}

const integrationKey = (meta: Pick<IntegrationMeta, 'key' | 'version'>) =>
  `${meta.key}.v${meta.version}`;

export class IntegrationSpecRegistry extends SpecContractRegistry<
  'integration',
  IntegrationSpec
> {
  public constructor(items?: IntegrationSpec[]) {
    super('integration', items);
  }

  public getByCategory(category: IntegrationCategory): IntegrationSpec[] {
    return this.list().filter((spec) => spec.meta.category === category);
  }
}

export function makeIntegrationSpecKey(meta: IntegrationMeta) {
  return integrationKey(meta);
}

/**
 * Helper to define an Integration.
 */
export const defineIntegration = (spec: IntegrationSpec): IntegrationSpec =>
  spec;
