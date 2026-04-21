import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContractsRuntimeServerRestFeature = defineFeature({
	meta: {
		key: 'libs.contracts-runtime-server-rest',
		version: '1.0.0',
		title: 'Contracts Runtime Server Rest',
		description: 'REST server runtime adapters for ContractSpec contracts',
		domain: 'contracts-runtime-server-rest',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'contracts-runtime-server-rest'],
		stability: 'experimental',
	},
});
