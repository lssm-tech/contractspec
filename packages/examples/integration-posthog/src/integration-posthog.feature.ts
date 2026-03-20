import { defineFeature } from '@contractspec/lib.contracts-spec';

export const IntegrationPosthogFeature = defineFeature({
	meta: {
		key: 'integration-posthog',
		version: '1.0.0',
		title: 'PostHog Analytics Integration',
		description:
			'PostHog analytics integration with event capture, HogQL, and feature flags',
		domain: 'integration',
		owners: ['@examples'],
		tags: ['integration', 'posthog', 'analytics', 'feature-flags'],
		stability: 'experimental',
	},

	integrations: [
		{ key: 'integration-posthog.integration.posthog', version: '1.0.0' },
	],

	telemetry: [{ key: 'integration-posthog.telemetry', version: '1.0.0' }],

	docs: [
		'docs.examples.integration-posthog',
		'docs.examples.integration-posthog.usage',
	],
});
