# MigrationSpec Overview

## Purpose

`MigrationSpec` provides a declarative plan for schema/data/validation steps so migrations can be generated, reviewed, and executed safely by tooling. Each spec captures ownership metadata, ordered up/down steps, and optional dependency information. Runtime tooling can consume the spec to run SQL/data scripts with pre/post checks and produce audit logs.

## Location

- Spec + registry: `packages/libs/contracts/src/migrations.ts`
- Tests: `packages/.../migrations.test.ts`

## Schema

```ts
export interface MigrationSpec {
  meta: MigrationMeta;   // ownership metadata + { name, version }
  plan: {
    up: MigrationStep[];   // required forward plan
    down?: MigrationStep[];// optional rollback steps
  };
  dependencies?: string[]; // optional list of migration keys this depends on
}
```

- **MigrationStep**
  - `kind`: `'schema' | 'data' | 'validation'`
  - Shared fields: `description?`, `timeoutMs?`, `retries?`, `preChecks?`, `postChecks?`
  - `schema`: `sql` string executed in transactional context
  - `data`: arbitrary `script` (e.g., JS/TS snippet, path to file, instructions)
  - `validation`: `assertion` expression verifying state (e.g., SQL returning boolean)
- **MigrationCheck** (`preChecks`/`postChecks`)
  - `description`: human context
  - `expression`: expression or SQL snippet to evaluate before/after the step
- **Dependencies**
  - Array of migration keys (`"boundedContext.namespace.timestamp_slug"`) used to ensure the registry executes prerequisites first

## Registry Usage

```ts
import { MigrationRegistry } from '@lssm/lib.contracts/migrations';
import { AddUsersMigration } from './migrations/core.db.2025_01_add_users';

const registry = new MigrationRegistry();
registry.register(AddUsersMigration);

const migration = registry.get('core.db.2025_01_add_users');
const all = registry.list(); // sorted by name/version
```

## Authoring Guidelines

1. Name migrations with timestamped slugs (`domain.db.YYYY_MM_description`) for clarity.
2. Capture ownership metadata (`owners`, `tags`, `stability`) so tooling can route approvals.
3. Prefer small, reversible steps. Use `plan.down` when safe; otherwise document fallback.
4. Use `preChecks`/`postChecks` for critical invariants (row counts, schema existence).
5. Specify dependencies explicitly to avoid parallel execution hazards.
6. For large data scripts, use `script` as a pointer (URL, file path) rather than embedding code directly.

## Tooling Roadmap

Upcoming CLI support (Phase 4 plan):

- `contractspec create --type migration` (scaffolds spec skeleton)
- `contractspec build <migration>` (generate executor harness)
- `contractspec migrate create/up/down/status` orchestration commands

The current implementation focuses on the spec/registry foundation so downstream tooling can be layered iteratively.

