import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesIntegrationStripeExample = defineExample({
	meta: {
		key: 'examples.integration-stripe',
		version: '1.0.0',
		title: 'Integration Stripe',
		description:
			'Integration example – Stripe Payments (blueprint + workflow + tenant config).',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'integration-stripe'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.integration-stripe',
	},
});

export default ExamplesIntegrationStripeExample;
export { ExamplesIntegrationStripeExample };
