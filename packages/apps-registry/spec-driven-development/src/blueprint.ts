import { defineAppConfig } from '@contractspec/lib.contracts-spec/app-config/spec';

export const SpecDrivenDevelopmentBlueprint = defineAppConfig({
	meta: {
		...{
			key: 'apps-registry.spec-driven-development',
			version: '1.0.0',
			title: 'Spec Driven Development',
			description:
				'CLI tool for creating, building, and validating contract specifications',
			domain: 'spec-driven-development',
			owners: ['@contractspec-core'],
			tags: ['package', 'appsRegistry', 'spec-driven-development'],
			stability: 'experimental',
		},
		appId: 'spec-driven-development',
	},
	capabilities: {
		enabled: [
			// Add capability refs here
		],
	},
});
