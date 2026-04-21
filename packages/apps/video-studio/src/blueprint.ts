import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const VideoStudioBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps.video-studio',
			version: '1.0.0',
			title: 'Video Studio',
			description:
				'ContractSpec package declaration for @contractspec/app.video-studio.',
			domain: 'video-studio',
			owners: ['@contractspec-core'],
			tags: ['package', 'apps', 'video-studio'],
			stability: 'experimental',
		},
		appId: 'video-studio',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
