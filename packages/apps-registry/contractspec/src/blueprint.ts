import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ContractspecBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps-registry.contractspec',
			version: '1.0.0',
			title: 'Contractspec',
			description:
				'CLI tool for creating, building, and validating contract specifications',
			domain: 'contractspec',
			owners: ['@contractspec-core'],
			tags: ['package', 'appsRegistry', 'contractspec'],
			stability: 'experimental',
		},
		appId: 'contractspec',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
