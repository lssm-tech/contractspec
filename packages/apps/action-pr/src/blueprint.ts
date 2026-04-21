import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ActionPrBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.action-pr',
			version: '1.0.0',
			title: 'Action Pr',
			description: 'GitHub Action for ContractSpec PR checks',
			domain: 'action-pr',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'action-pr'],
			stability: 'experimental',
		},
		appId: 'action-pr',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
