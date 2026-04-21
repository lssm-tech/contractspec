import { defineFeature } from '@contractspec/lib.contracts-spec';

export const DataExchangeClientFeature = defineFeature({
	meta: {
		key: 'libs.data-exchange-client',
		version: '1.0.0',
		title: 'Data Exchange Client',
		description:
			'Shared controllers plus web and native UI surfaces for data interchange.',
		domain: 'data-exchange',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'data-exchange', 'client'],
		stability: 'experimental',
	},
});
