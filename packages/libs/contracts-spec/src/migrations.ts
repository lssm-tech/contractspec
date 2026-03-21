import type { OwnerShipMeta } from './ownership';

import type { DocBlock } from './docs/types';
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

export const tech_contracts_migrations_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.migrations',
		title: 'MigrationSpec Overview',
		summary:
			'`MigrationSpec` provides a declarative plan for schema/data/validation steps so migrations can be generated, reviewed, and executed safely by tooling. Each spec captures ownership metadata, ordered up/down steps, and optional dependency information. Runtime tooling can consume the spec to run SQL/data scripts with pre/post checks and produce audit logs.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/migrations',
		tags: ['tech', 'contracts', 'migrations'],
		body: "# MigrationSpec Overview\n\n## Purpose\n\n`MigrationSpec` provides a declarative plan for schema/data/validation steps so migrations can be generated, reviewed, and executed safely by tooling. Each spec captures ownership metadata, ordered up/down steps, and optional dependency information. Runtime tooling can consume the spec to run SQL/data scripts with pre/post checks and produce audit logs.\n\n## Location\n\n- Spec + registry: `packages/libs/contracts/src/migrations.ts`\n- Tests: `packages/.../migrations.test.ts`\n\n## Schema\n\n```ts\nexport interface MigrationSpec {\n  meta: MigrationMeta;   // ownership metadata + { name, version }\n  plan: {\n    up: MigrationStep[];   // required forward plan\n    down?: MigrationStep[];// optional rollback steps\n  };\n  dependencies?: string[]; // optional list of migration keys this depends on\n}\n```\n\n- **MigrationStep**\n  - `kind`: `'schema' | 'data' | 'validation'`\n  - Shared fields: `description?`, `timeoutMs?`, `retries?`, `preChecks?`, `postChecks?`\n  - `schema`: `sql` string executed in transactional context\n  - `data`: arbitrary `script` (e.g., JS/TS snippet, path to file, instructions)\n  - `validation`: `assertion` expression verifying state (e.g., SQL returning boolean)\n- **MigrationCheck** (`preChecks`/`postChecks`)\n  - `description`: human context\n  - `expression`: expression or SQL snippet to evaluate before/after the step\n- **Dependencies**\n  - Array of migration keys (`\"boundedContext.namespace.timestamp_slug\"`) used to ensure the registry executes prerequisites first\n\n## Registry Usage\n\n```ts\nimport { MigrationRegistry } from '@contractspec/lib.contracts-spec/migrations';\nimport { AddUsersMigration } from './migrations/core.db.2025_01_add_users';\n\nconst registry = new MigrationRegistry();\nregistry.register(AddUsersMigration);\n\nconst migration = registry.get('core.db.2025_01_add_users');\nconst all = registry.list(); // sorted by name/version\n```\n\n## Authoring Guidelines\n\n1. Name migrations with timestamped slugs (`domain.db.YYYY_MM_description`) for clarity.\n2. Capture ownership metadata (`owners`, `tags`, `stability`) so tooling can route approvals.\n3. Prefer small, reversible steps. Use `plan.down` when safe; otherwise document fallback.\n4. Use `preChecks`/`postChecks` for critical invariants (row counts, schema existence).\n5. Specify dependencies explicitly to avoid parallel execution hazards.\n6. For large data scripts, use `script` as a pointer (URL, file path) rather than embedding code directly.\n\n## Tooling Roadmap\n\nUpcoming CLI support (Phase 4 plan):\n\n- `contractspec create --type migration` (scaffolds spec skeleton)\n- `contractspec build <migration>` (generate executor harness)\n- `contractspec migrate create/up/down/status` orchestration commands\n\nThe current implementation focuses on the spec/registry foundation so downstream tooling can be layered iteratively.\n\n",
	},
];
