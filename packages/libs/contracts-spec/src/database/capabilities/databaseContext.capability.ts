import { defineCapability } from '../../capabilities';
import type { DocBlock } from '../../docs/types';
import { docRef } from '../../docs/registry';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from '../constants';

export const DatabaseContextDocBlock = {
	id: 'docs.tech.database.context',
	title: 'Database context',
	summary: 'Schema, migrations, dictionary, and read-only query surfaces.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/database/context',
	tags: ['database', 'context'],
	body: `# Database context

Database context covers schema descriptions, migrations, data dictionary entries, and governed read-only access.
`,
} satisfies DocBlock;

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
		docId: [docRef(DatabaseContextDocBlock.id)],
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
