import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const BusFeature = defineFeature({
	meta: {
		key: 'libs.bus',
		version: '1.0.0',
		title: 'Bus',
		description: 'Event bus and messaging primitives',
		domain: 'bus',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'bus'],
		stability: 'experimental',
	},
});
