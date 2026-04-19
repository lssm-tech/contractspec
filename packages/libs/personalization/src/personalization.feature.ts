import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const PersonalizationFeature = defineFeature({
	meta: {
		key: 'libs.personalization',
		version: '1.0.0',
		title: 'Personalization',
		description:
			'Behavior tracking, analysis, and adaptation helpers for ContractSpec personalization.',
		domain: 'personalization',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'personalization'],
		stability: 'experimental',
	},
});
