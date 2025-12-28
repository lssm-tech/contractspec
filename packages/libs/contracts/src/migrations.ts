import type { OwnerShipMeta } from './ownership';

export type MigrationStepKind = 'schema' | 'data' | 'validation';

export interface MigrationCheck {
  description: string;
  expression: string;
}

export interface MigrationStepBase {
  kind: MigrationStepKind;
  description?: string;
  timeoutMs?: number;
  retries?: number;
  preChecks?: MigrationCheck[];
  postChecks?: MigrationCheck[];
}

export interface SchemaMigrationStep extends MigrationStepBase {
  kind: 'schema';
  sql: string;
}

export interface DataMigrationStep extends MigrationStepBase {
  kind: 'data';
  script: string;
}

export interface ValidationMigrationStep extends MigrationStepBase {
  kind: 'validation';
  assertion: string;
}

export type MigrationStep =
  | SchemaMigrationStep
  | DataMigrationStep
  | ValidationMigrationStep;

export interface MigrationMeta extends OwnerShipMeta {
  /** Fully qualified migration name (e.g., "sigil.db.2025_01_add_users"). */
  key: string;
  /** Increment when the migration changes. */
  version: string;
}

export interface MigrationPlan {
  up: MigrationStep[];
  down?: MigrationStep[];
}

export interface MigrationSpec {
  meta: MigrationMeta;
  plan: MigrationPlan;
  dependencies?: string[];
}

import { compareVersions } from 'compare-versions';

// ... (existing lines 1-56)

const migrationKey = (name: string, version: string) => `${name}.v${version}`;

export class MigrationRegistry {
  private readonly items = new Map<string, MigrationSpec>();

  register(spec: MigrationSpec): this {
    const key = migrationKey(spec.meta.key, spec.meta.version);
    if (this.items.has(key)) throw new Error(`Duplicate migration ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): MigrationSpec[] {
    return [...this.items.values()].sort((a, b) => {
      const byName = a.meta.key.localeCompare(b.meta.key);
      return byName !== 0
        ? byName
        : compareVersions(a.meta.version, b.meta.version);
    });
  }

  get(name: string, version?: string): MigrationSpec | undefined {
    if (version != null) return this.items.get(migrationKey(name, version));
    let candidate: MigrationSpec | undefined;

    for (const spec of this.items.values()) {
      if (spec.meta.key !== name) continue;
      if (
        !candidate ||
        compareVersions(spec.meta.version, candidate.meta.version) > 0
      ) {
        candidate = spec;
      }
    }
    return candidate;
  }
}
