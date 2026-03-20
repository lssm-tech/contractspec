import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LifecycleCliFeature = defineFeature({
	meta: {
		key: 'lifecycle-cli',
		version: '1.0.0',
		title: 'Lifecycle CLI',
		description:
			'CLI-based lifecycle assessment using the lifecycle-managed bundle',
		domain: 'lifecycle',
		owners: ['@examples'],
		tags: ['lifecycle', 'cli', 'assessment'],
		stability: 'experimental',
	},

	docs: ['docs.examples.lifecycle-cli', 'docs.examples.lifecycle-cli.usage'],
});
