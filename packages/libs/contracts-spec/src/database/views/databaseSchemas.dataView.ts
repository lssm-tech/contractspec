import { defineDataView } from '../../data-views';
import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from '../constants';
import { DatabaseSchemaDescribeQuery } from '../queries/databaseSchemaDescribe.query';

export const DatabaseSchemasDataViewDocBlock = {
	id: 'docs.tech.database.schema.index',
	title: 'Database schema index view',
	summary: 'Data view for listing schemas and model counts.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/database/schema/index',
	tags: ['database', 'data-view'],
	body: `# database.schema.index

List view for database schemas and their metadata.
`,
} satisfies DocBlock;

export const DatabaseSchemasDataView = defineDataView({
	meta: {
		key: 'database.schema.index',
		title: 'Database Schemas',
		version: '1.0.0',
		description: 'List database schemas and model counts.',
		domain: DATABASE_DOMAIN,
		owners: DATABASE_OWNERS,
		tags: [...DATABASE_TAGS, 'schema', 'index'],
		stability: DATABASE_STABILITY,
		entity: 'database_schema',
		docId: [docRef(DatabaseSchemasDataViewDocBlock.id)],
	},
	source: {
		primary: {
			key: DatabaseSchemaDescribeQuery.meta.key,
			version: DatabaseSchemaDescribeQuery.meta.version,
		},
	},
	view: {
		kind: 'list',
		fields: [
			{ key: 'databaseKey', label: 'Database', dataPath: 'databaseKey' },
			{ key: 'schemaKey', label: 'Schema', dataPath: 'schemaKey' },
			{ key: 'version', label: 'Version', dataPath: 'version' },
			{ key: 'modelCount', label: 'Models', dataPath: 'modelCount' },
			{ key: 'updatedAt', label: 'Updated', dataPath: 'updatedAt' },
		],
		primaryField: 'schemaKey',
		secondaryFields: ['databaseKey', 'version'],
		filters: [
			{
				key: 'databaseKey',
				label: 'Database',
				field: 'databaseKey',
				type: 'search',
			},
			{ key: 'schemaKey', label: 'Schema', field: 'schemaKey', type: 'search' },
		],
	},
	policy: {
		flags: [],
		pii: [],
	},
});
