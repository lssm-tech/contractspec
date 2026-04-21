import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const PresentationRuntimeReactFeature = defineFeature({
	meta: {
		key: 'libs.presentation-runtime-react',
		version: '1.0.0',
		title: 'Presentation Runtime React',
		description: 'React presentation runtime with workflow components',
		domain: 'presentation-runtime-react',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'presentation-runtime-react'],
		stability: 'experimental',
	},
});
