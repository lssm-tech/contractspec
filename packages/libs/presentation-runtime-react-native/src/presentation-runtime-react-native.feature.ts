import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const PresentationRuntimeReactNativeFeature = defineFeature({
	meta: {
		key: 'libs.presentation-runtime-react-native',
		version: '1.0.0',
		title: 'Presentation Runtime React Native',
		description: 'React Native presentation runtime for mobile apps',
		domain: 'presentation-runtime-react-native',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'presentation-runtime-react-native'],
		stability: 'experimental',
	},
});
