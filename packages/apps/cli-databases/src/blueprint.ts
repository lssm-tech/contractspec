import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const CliDatabasesBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.cli-databases',
			version: '1.0.0',
			title: 'Cli Databases',
			description:
				'ContractSpec package declaration for @contractspec/app.cli-databases.',
			domain: 'cli-databases',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'cli-databases'],
			stability: 'experimental',
		},
		appId: 'cli-databases',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
