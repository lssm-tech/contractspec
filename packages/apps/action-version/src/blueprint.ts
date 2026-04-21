import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ActionVersionBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.action-version',
			version: '1.0.0',
			title: 'Action Version',
			description: 'GitHub Action for ContractSpec version management',
			domain: 'action-version',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'action-version'],
			stability: 'experimental',
		},
		appId: 'action-version',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
