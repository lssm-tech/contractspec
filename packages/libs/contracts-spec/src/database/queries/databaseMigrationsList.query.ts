import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { defineQuery } from '../../operations';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from '../constants';

const DatabaseMigrationsListInput = new SchemaModel({
	name: 'DatabaseMigrationsListInput',
	fields: {
		databaseKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const DatabaseMigrationSummary = new SchemaModel({
	name: 'DatabaseMigrationSummary',
	fields: {
		key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		appliedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

const DatabaseMigrationsListOutput = new SchemaModel({
	name: 'DatabaseMigrationsListOutput',
	fields: {
		migrations: {
			type: DatabaseMigrationSummary,
			isOptional: false,
			isArray: true,
		},
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const DatabaseMigrationsListDocBlock = {
	id: 'docs.tech.database.migrations.list',
	title: 'List database migrations',
	summary: 'List migration history for a database.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/database/migrations/list',
	tags: ['database', 'migrations'],
	body: `# database.migrations.list

Returns migration registry entries and statuses for auditability.
`,
} satisfies DocBlock;

export const DatabaseMigrationsListQuery = defineQuery({
	meta: {
		key: 'database.migrations.list',
		title: 'List Database Migrations',
		version: '1.0.0',
		description: 'List registered database migrations and statuses.',
		goal: 'Provide migration context and auditability for schema changes.',
		context: 'Used by Studio, ops, and agents before data migrations.',
		domain: DATABASE_DOMAIN,
		owners: DATABASE_OWNERS,
		tags: [...DATABASE_TAGS, 'migrations'],
		stability: DATABASE_STABILITY,
		docId: [docRef(DatabaseMigrationsListDocBlock.id)],
	},
	capability: {
		key: 'database.context',
		version: '1.0.0',
	},
	io: {
		input: DatabaseMigrationsListInput,
		output: DatabaseMigrationsListOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
