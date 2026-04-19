import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const CursorMarketplaceBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps-registry.cursor-marketplace',
			version: '1.0.0',
			title: 'Cursor Marketplace',
			description:
				'Cursor marketplace catalog for ContractSpec product and core libraries',
			domain: 'cursor-marketplace',
			owners: ['@contractspec-core'],
			tags: ['package', 'appsRegistry', 'cursor-marketplace'],
			stability: 'experimental',
		},
		appId: 'cursor-marketplace',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
