import { SpecContractRegistry } from '../registry';
import type { OwnerShipMeta } from '../ownership';
import type { PolicyRef } from '../policy/spec';

export type KnowledgeCategory =
  | 'canonical' // Ground truth - product specs, schemas, official policies
  | 'operational' // Internal docs - support tickets, runbooks, sales materials
  | 'external' // Third-party - PSP docs, regulations, integration guides
  | 'ephemeral'; // Temporary - agent scratchpads, session context, drafts

export interface KnowledgeSpaceMeta extends OwnerShipMeta {
  category: KnowledgeCategory;
}

export interface KnowledgeRetentionPolicy {
  /** TTL in days (null = indefinite). */
  ttlDays?: number | null;
  /** Auto-archive after inactivity. */
  archiveAfterDays?: number;
}

export interface KnowledgeAccessPolicy {
  /** Which PolicySpec governs access. */
  policy?: PolicyRef;
  /** Trust level for agent/workflow consumption. */
  trustLevel: 'high' | 'medium' | 'low';
  /** Can this space be mutated by automation? */
  automationWritable: boolean;
}

export interface KnowledgeIndexingConfig {
  embeddingModel?: string;
  chunkSize?: number;
  vectorDbIntegration?: string;
}

export interface KnowledgeSpaceSpec {
  meta: KnowledgeSpaceMeta;
  /** Retention and cleanup rules. */
  retention: KnowledgeRetentionPolicy;
  /** Access control and trust. */
  access: KnowledgeAccessPolicy;
  /** Optional embedding/indexing config. */
  indexing?: KnowledgeIndexingConfig;
  /** Documentation. */
  description?: string;
}

// ... (imports)

// ... (interfaces)

export class KnowledgeSpaceRegistry extends SpecContractRegistry<
  'knowledge-space',
  KnowledgeSpaceSpec
> {
  constructor(items?: KnowledgeSpaceSpec[]) {
    super('knowledge-space', items);
  }

  getByCategory(category: KnowledgeCategory): KnowledgeSpaceSpec[] {
    return this.list().filter((spec) => spec.meta.category === category);
  }
}

export function makeKnowledgeSpaceKey(meta: KnowledgeSpaceMeta) {
  return `${meta.key}.v${meta.version}`;
}
