import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const UiKitWebFeature = defineFeature({
	meta: {
		key: 'libs.ui-kit-web',
		version: '1.0.0',
		title: 'Ui Kit Web',
		description: 'Web UI components with Radix primitives',
		domain: 'ui-kit-web',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'ui-kit-web'],
		stability: 'experimental',
	},
});
