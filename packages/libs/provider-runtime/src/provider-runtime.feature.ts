import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ProviderRuntimeFeature = defineFeature({
	meta: {
		key: 'libs.provider-runtime',
		version: '1.0.0',
		title: 'Provider Runtime',
		description:
			'Builder provider-runtime helpers for routing, context prep, runtime targets, and receipt normalization.',
		domain: 'provider-runtime',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'provider-runtime'],
		stability: 'experimental',
	},
});
