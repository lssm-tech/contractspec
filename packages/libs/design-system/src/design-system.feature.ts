import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const DesignSystemFeature = defineFeature({
	meta: {
		key: 'libs.design-system',
		version: '1.0.0',
		title: 'Design System',
		description: 'Design tokens and theming primitives',
		domain: 'design-system',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'design-system'],
		stability: 'experimental',
	},
});
