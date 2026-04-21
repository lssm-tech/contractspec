import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const UiLinkFeature = defineFeature({
	meta: {
		key: 'libs.ui-link',
		version: '1.0.0',
		title: 'Ui Link',
		description: 'Deep linking utilities for navigation',
		domain: 'ui-link',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'ui-link'],
		stability: 'experimental',
	},
});
