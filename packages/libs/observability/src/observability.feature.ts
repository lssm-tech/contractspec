import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ObservabilityFeature = defineFeature({
	meta: {
		key: 'libs.observability',
		version: '1.0.0',
		title: 'Observability',
		description: 'OpenTelemetry-based observability primitives',
		domain: 'observability',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'observability'],
		stability: 'experimental',
	},
});
