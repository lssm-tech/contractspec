import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ExporterFeature = defineFeature({
	meta: {
		key: 'libs.exporter',
		version: '1.0.0',
		title: 'Exporter',
		description: 'Generic CSV and XML exporters usable across web and mobile.',
		domain: 'exporter',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'exporter'],
		stability: 'experimental',
	},
});
