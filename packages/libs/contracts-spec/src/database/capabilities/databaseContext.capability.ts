import { defineCapability } from '../../capabilities';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from '../constants';

export const DatabaseContextCapability = defineCapability({
	meta: {
		key: 'database.context',
		version: '1.0.0',
		kind: 'data',
		title: 'Database Context',
		description: 'Schema, migration, dictionary, and read-only query surfaces.',
		domain: DATABASE_DOMAIN,
		owners: DATABASE_OWNERS,
		tags: [...DATABASE_TAGS, 'context'],
		stability: DATABASE_STABILITY,
		docId: [docId('docs.tech.database.context')],
	},
	provides: [
		{
			surface: 'operation',
			key: 'database.schema.describe',
			version: '1.0.0',
			description: 'Describe schemas and models.',
		},
		{
			surface: 'operation',
			key: 'database.migrations.list',
			version: '1.0.0',
			description: 'List database migrations.',
		},
		{
			surface: 'operation',
			key: 'database.dictionary.get',
			version: '1.0.0',
			description: 'Get data dictionary entry.',
		},
		{
			surface: 'operation',
			key: 'database.query.readonly',
			version: '1.0.0',
			description: 'Perform read-only data query via data views.',
		},
	],
});
