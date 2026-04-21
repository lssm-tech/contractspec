import { defineFeature } from '@contractspec/lib.contracts-spec';

export const DataExchangeServerFeature = defineFeature({
	meta: {
		key: 'libs.data-exchange-server',
		version: '1.0.0',
		title: 'Data Exchange Server',
		description:
			'Server-side adapters, execution services, and workflow templates for data interchange.',
		domain: 'data-exchange',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'data-exchange', 'server'],
		stability: 'experimental',
	},
});
