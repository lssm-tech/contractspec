import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const DataExchangeCoreFeature = defineFeature({
	meta: {
		key: 'libs.data-exchange-core',
		version: '1.0.0',
		title: 'Data Exchange Core',
		description:
			'SchemaModel-first core primitives for data import/export and mapping',
		domain: 'data-exchange-core',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'data-exchange-core'],
		stability: 'experimental',
	},
});
