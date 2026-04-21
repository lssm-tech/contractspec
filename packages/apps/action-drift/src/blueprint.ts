import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ActionDriftBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.action-drift',
			version: '1.0.0',
			title: 'Action Drift',
			description: 'GitHub Action for ContractSpec drift detection',
			domain: 'action-drift',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'action-drift'],
			stability: 'experimental',
		},
		appId: 'action-drift',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
