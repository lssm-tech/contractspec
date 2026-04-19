import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AccessibilityFeature = defineFeature({
	meta: {
		key: 'libs.accessibility',
		version: '1.0.0',
		title: 'Accessibility',
		description: 'WCAG compliance utilities and validators',
		domain: 'accessibility',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'accessibility'],
		stability: 'experimental',
	},
});
