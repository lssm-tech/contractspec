import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const MobileDemoBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.mobile-demo',
			version: '1.0.0',
			title: 'Mobile Demo',
			description:
				'Minimal Expo React Native app - Task List demo for ContractSpec mobile runtime',
			domain: 'mobile-demo',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'mobile-demo'],
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
		include: [{ key: 'mobile-demo.tasks' }],
	},
});
