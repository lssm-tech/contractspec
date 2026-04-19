import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const PluginsFeature = defineFeature({
	meta: {
		key: 'libs.plugins',
		version: '1.0.0',
		title: 'Plugins',
		description: 'Plugin API and registry for ContractSpec extensions',
		domain: 'plugins',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'plugins'],
		stability: 'experimental',
	},
});
