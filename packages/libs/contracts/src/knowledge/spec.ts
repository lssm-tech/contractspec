import type { OwnerShipMeta } from '../ownership';
import type { PolicyRef } from '../policy/spec';

export type KnowledgeCategory =
  | 'canonical'
  | 'operational'
  | 'external'
  | 'ephemeral';

export interface KnowledgeSpaceMeta extends OwnerShipMeta {
  /** Stable space identifier (e.g., "product-canon", "support-faq"). */
  key: string;
  version: number;
  category: KnowledgeCategory;
  displayName: string;
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

const knowledgeKey = (meta: Pick<KnowledgeSpaceMeta, 'key' | 'version'>) =>
  `${meta.key}.v${meta.version}`;

export class KnowledgeSpaceRegistry {
  private readonly items = new Map<string, KnowledgeSpaceSpec>();

  register(spec: KnowledgeSpaceSpec): this {
    const key = knowledgeKey(spec.meta);
    if (this.items.has(key)) {
      throw new Error(`Duplicate KnowledgeSpaceSpec ${key}`);
    }
    this.items.set(key, spec);
    return this;
  }

  list(): KnowledgeSpaceSpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: number): KnowledgeSpaceSpec | undefined {
    if (version != null) {
      return this.items.get(knowledgeKey({ key, version }));
    }
    let latest: KnowledgeSpaceSpec | undefined;
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

  getByCategory(category: KnowledgeCategory): KnowledgeSpaceSpec[] {
    return this.list().filter((spec) => spec.meta.category === category);
  }
}

export function makeKnowledgeSpaceKey(meta: KnowledgeSpaceMeta) {
  return knowledgeKey(meta);
}





