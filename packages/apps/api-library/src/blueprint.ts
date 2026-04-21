import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ApiLibraryBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.api-library',
			version: '1.0.0',
			title: 'Api Library',
			description:
				'ContractSpec package declaration for @contractspec/app.api-library.',
			domain: 'api-library',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'api-library'],
			stability: 'experimental',
		},
		appId: 'api-library',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
