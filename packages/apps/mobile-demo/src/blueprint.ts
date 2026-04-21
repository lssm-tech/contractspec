import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const MobileDemoBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.mobile-demo',
			version: '1.0.0',
			title: 'Mobile Landing Companion',
			description:
				'Expo landing companion for the shared ContractSpec OSS-first product story',
			domain: 'mobile-demo',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'mobile-demo', 'landing'],
			stability: 'experimental',
		},
		appId: 'mobile-demo',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
	features: {
		include: [{ key: 'mobile-demo.landing' }],
	},
});
