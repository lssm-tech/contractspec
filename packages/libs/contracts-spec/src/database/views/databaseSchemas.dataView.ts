import { defineDataView } from '../../data-views';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from '../constants';
import { DatabaseSchemaDescribeQuery } from '../queries/databaseSchemaDescribe.query';

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
		docId: [docId('docs.tech.database.schema.index')],
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
