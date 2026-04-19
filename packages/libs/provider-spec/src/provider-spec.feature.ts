import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ProviderSpecFeature = defineFeature({
	meta: {
		key: 'libs.provider-spec',
		version: '1.0.0',
		title: 'Provider Spec',
		description:
			'Provider routing and runtime-target contracts for ContractSpec Builder.',
		domain: 'provider-spec',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'provider-spec'],
		stability: 'experimental',
	},
});
