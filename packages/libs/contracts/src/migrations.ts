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
  name: string;
  /** Increment when the migration changes. */
  version: number;
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

const migrationKey = (name: string, version: number) => `${name}.v${version}`;

export class MigrationRegistry {
  private readonly items = new Map<string, MigrationSpec>();

  register(spec: MigrationSpec): this {
    const key = migrationKey(spec.meta.name, spec.meta.version);
    if (this.items.has(key)) throw new Error(`Duplicate migration ${key}`);
    this.items.set(key, spec);
    return this;
  }

  list(): MigrationSpec[] {
    return [...this.items.values()].sort((a, b) =>
      compareKey(
        migrationKey(a.meta.name, a.meta.version),
        migrationKey(b.meta.name, b.meta.version)
      )
    );
  }

  get(name: string, version?: number): MigrationSpec | undefined {
    if (version != null) return this.items.get(migrationKey(name, version));
    let candidate: MigrationSpec | undefined;
    let max = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.name !== name) continue;
      if (spec.meta.version > max) {
        max = spec.meta.version;
        candidate = spec;
      }
    }
    return candidate;
  }
}

function compareKey(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}
