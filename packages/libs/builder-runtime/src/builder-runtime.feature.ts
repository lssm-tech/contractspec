import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const BuilderRuntimeFeature = defineFeature({
	meta: {
		key: 'libs.builder-runtime',
		version: '1.0.0',
		title: 'Builder Runtime',
		description:
			'Backend-neutral Builder runtime, ingestion, fusion, readiness, and replay services.',
		domain: 'builder-runtime',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'builder-runtime'],
		stability: 'experimental',
	},
});
