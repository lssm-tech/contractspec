import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const VideoGenFeature = defineFeature({
	meta: {
		key: 'libs.video-gen',
		version: '1.0.0',
		title: 'Video Gen',
		description:
			'ContractSpec package declaration for @contractspec/lib.video-gen.',
		domain: 'video-gen',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'video-gen'],
		stability: 'experimental',
	},
	operations: [{ key: 'createUser', version: '1.0.0' }],
});
