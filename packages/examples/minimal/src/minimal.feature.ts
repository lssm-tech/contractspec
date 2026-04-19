import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const MinimalFeature = defineFeature({
	meta: {
		key: 'minimal',
		version: '1.0.0',
		title: 'Minimal Example',
		description:
			'Bare-minimum contract definition showing the simplest possible setup',
		domain: 'example',
		owners: ['@team'],
		tags: ['minimal', 'example'],
		stability: 'stable',
	},

	operations: [{ key: 'user.create', version: '1.0.0' }],
});
