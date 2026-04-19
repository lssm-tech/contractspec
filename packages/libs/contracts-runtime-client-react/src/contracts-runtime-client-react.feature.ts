import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContractsRuntimeClientReactFeature = defineFeature({
	meta: {
		key: 'libs.contracts-runtime-client-react',
		version: '1.0.0',
		title: 'Contracts Runtime Client React',
		description: 'React runtime adapters for ContractSpec contracts',
		domain: 'contracts-runtime-client-react',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'contracts-runtime-client-react'],
		stability: 'experimental',
	},
});
