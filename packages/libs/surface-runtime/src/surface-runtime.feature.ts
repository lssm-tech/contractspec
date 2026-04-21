import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const SurfaceRuntimeFeature = defineFeature({
	meta: {
		key: 'libs.surface-runtime',
		version: '1.0.0',
		title: 'Surface Runtime',
		description:
			'AI-native surface specs and web runtime for adaptive ContractSpec surfaces',
		domain: 'surface-runtime',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'surface-runtime'],
		stability: 'experimental',
	},
});
