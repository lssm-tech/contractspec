import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const BuilderSpecFeature = defineFeature({
	meta: {
		key: 'libs.builder-spec',
		version: '1.0.0',
		title: 'Builder Spec',
		description:
			'Builder control-plane contracts, capabilities, and validation for ContractSpec.',
		domain: 'builder-spec',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'builder-spec'],
		stability: 'experimental',
	},
});
