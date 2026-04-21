import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const PresentationRuntimeCoreFeature = defineFeature({
	meta: {
		key: 'libs.presentation-runtime-core',
		version: '1.0.0',
		title: 'Presentation Runtime Core',
		description: 'Core presentation runtime for contract-driven UIs',
		domain: 'presentation-runtime-core',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'presentation-runtime-core'],
		stability: 'experimental',
	},
});
