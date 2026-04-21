import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const WebLandingBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.web-landing',
			version: '1.0.0',
			title: 'Web Landing',
			description:
				'ContractSpec package declaration for @contractspec/app.web-landing.',
			domain: 'web-landing',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'web-landing'],
			stability: 'experimental',
		},
		appId: 'web-landing',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
