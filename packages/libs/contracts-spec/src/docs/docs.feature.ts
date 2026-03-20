import { defineFeature } from '../features';
import {
	DOCS_DOMAIN,
	DOCS_OWNERS,
	DOCS_STABILITY,
	DOCS_TAGS,
} from './constants';

export const DocsFeature = defineFeature({
	meta: {
		key: 'platform.docs',
		version: '1.0.0',
		title: 'Documentation System',
		description:
			'Generate, publish, search, and reference contract documentation and DocBlocks',
		domain: DOCS_DOMAIN,
		owners: DOCS_OWNERS,
		tags: [...DOCS_TAGS],
		stability: DOCS_STABILITY,
	},

	operations: [
		{ key: 'docs.generate', version: '1.0.0' },
		{ key: 'docs.publish', version: '1.0.0' },
		{ key: 'docs_search', version: '1.0.0' },
		{ key: 'docs.contract.reference', version: '1.0.0' },
	],

	events: [
		{ key: 'docs.generated', version: '1.0.0' },
		{ key: 'docs.published', version: '1.0.0' },
	],

	presentations: [
		{ key: 'docs.layout', version: '1.0.0' },
		{ key: 'docs.reference.page', version: '1.0.0' },
	],

	capabilities: {
		provides: [{ key: 'docs.system', version: '1.0.0' }],
	},

	dataViews: [
		{ key: 'docs.index.view', version: '1.0.0' },
		{ key: 'docs.contract.reference.view', version: '1.0.0' },
		{ key: 'docs.examples.catalog.view', version: '1.0.0' },
	],

	forms: [{ key: 'docs_search.form', version: '1.0.0' }],
});
