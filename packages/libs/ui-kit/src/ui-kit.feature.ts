import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const UiKitFeature = defineFeature({
	meta: {
		key: 'libs.ui-kit',
		version: '1.0.0',
		title: 'Ui Kit',
		description: 'Cross-platform UI components for React Native and web',
		domain: 'ui-kit',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'ui-kit'],
		stability: 'experimental',
	},
});
