import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const CliContractspecBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.cli-contractspec',
			version: '1.0.0',
			title: 'Cli Contractspec',
			description:
				'CLI tool for creating, building, and validating contract specifications',
			domain: 'cli-contractspec',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'cli-contractspec'],
			stability: 'experimental',
		},
		appId: 'cli-contractspec',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
