import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const RegistryPacksBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.registry-packs',
			version: '1.0.0',
			title: 'Registry Packs',
			description:
				'ContractSpec package declaration for @contractspec/app.registry-packs.',
			domain: 'registry-packs',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'registry-packs'],
			stability: 'experimental',
		},
		appId: 'registry-packs',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
