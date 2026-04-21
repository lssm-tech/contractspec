import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const RegistryServerBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.registry-server',
			version: '1.0.0',
			title: 'Registry Server',
			description:
				'ContractSpec package declaration for @contractspec/app.registry-server.',
			domain: 'registry-server',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'registry-server'],
			stability: 'experimental',
		},
		appId: 'registry-server',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
