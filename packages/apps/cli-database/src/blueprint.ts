import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const CliDatabaseBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.cli-database',
			version: '1.0.0',
			title: 'Cli Database',
			description:
				'ContractSpec package declaration for @contractspec/app.cli-database.',
			domain: 'cli-database',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'cli-database'],
			stability: 'experimental',
		},
		appId: 'cli-database',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
