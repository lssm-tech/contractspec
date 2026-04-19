import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const ActionValidationBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.action-validation',
			version: '1.0.0',
			title: 'Action Validation',
			description: 'GitHub Action for running ContractSpec CI checks',
			domain: 'action-validation',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'action-validation'],
			stability: 'experimental',
		},
		appId: 'action-validation',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
