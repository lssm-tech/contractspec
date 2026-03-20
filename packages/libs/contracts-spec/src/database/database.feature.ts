import { defineFeature } from '../features';
import {
	DATABASE_DOMAIN,
	DATABASE_OWNERS,
	DATABASE_STABILITY,
	DATABASE_TAGS,
} from './constants';

export const DatabaseFeature = defineFeature({
	meta: {
		key: 'platform.database',
		version: '1.0.0',
		title: 'Database Context',
		description:
			'Describe schemas, list migrations, query data dictionaries, and execute read-only queries',
		domain: DATABASE_DOMAIN,
		owners: DATABASE_OWNERS,
		tags: [...DATABASE_TAGS],
		stability: DATABASE_STABILITY,
	},

	operations: [
		{ key: 'database.schema.describe', version: '1.0.0' },
		{ key: 'database.migrations.list', version: '1.0.0' },
		{ key: 'database.dictionary.get', version: '1.0.0' },
		{ key: 'database.query.readonly', version: '1.0.0' },
	],

	capabilities: {
		provides: [{ key: 'database.context', version: '1.0.0' }],
	},

	dataViews: [{ key: 'database.schema.index', version: '1.0.0' }],
});
