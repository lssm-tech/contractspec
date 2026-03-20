import { defineFeature } from '../features';
import {
	CONTEXT_DOMAIN,
	CONTEXT_OWNERS,
	CONTEXT_STABILITY,
	CONTEXT_TAGS,
} from './constants';

export const ContextFeature = defineFeature({
	meta: {
		key: 'platform.context',
		version: '1.0.0',
		title: 'Context System',
		description:
			'Snapshot, search, and describe context packs for AI-driven workflows',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS],
		stability: CONTEXT_STABILITY,
	},

	operations: [
		{ key: 'context.pack.snapshot', version: '1.0.0' },
		{ key: 'context.pack.describe', version: '1.0.0' },
		{ key: 'context.pack.search', version: '1.0.0' },
	],

	events: [{ key: 'context.snapshot.created', version: '1.0.0' }],

	presentations: [{ key: 'context.snapshot.summary', version: '1.0.0' }],

	capabilities: {
		provides: [{ key: 'context.system', version: '1.0.0' }],
	},

	dataViews: [{ key: 'context.snapshot.index', version: '1.0.0' }],

	forms: [{ key: 'context.pack.search.form', version: '1.0.0' }],
});
