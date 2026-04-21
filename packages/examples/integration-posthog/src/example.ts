import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesIntegrationPosthogExample = defineExample({
	meta: {
		key: 'examples.integration-posthog',
		version: '1.0.0',
		title: 'Integration Posthog',
		description:
			'PostHog analytics integration example: capture events, run HogQL, and manage feature flags.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'integration-posthog'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.integration-posthog',
	},
});

export default ExamplesIntegrationPosthogExample;
export { ExamplesIntegrationPosthogExample };
