import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const OverlayEngineFeature = defineFeature({
	meta: {
		key: 'libs.overlay-engine',
		version: '1.0.0',
		title: 'Overlay Engine',
		description:
			'Runtime overlay engine for ContractSpec personalization and adaptive UI rendering.',
		domain: 'overlay-engine',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'overlay-engine'],
		stability: 'experimental',
	},
});
