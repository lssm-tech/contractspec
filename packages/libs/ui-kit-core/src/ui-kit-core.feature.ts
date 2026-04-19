import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const UiKitCoreFeature = defineFeature({
	meta: {
		key: 'libs.ui-kit-core',
		version: '1.0.0',
		title: 'Ui Kit Core',
		description: 'Core UI primitives and utilities',
		domain: 'ui-kit-core',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'ui-kit-core'],
		stability: 'experimental',
	},
});
