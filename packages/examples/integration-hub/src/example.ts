import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesIntegrationHubExample = defineExample({
	meta: {
		key: 'examples.integration-hub',
		version: '1.0.0',
		title: 'Integration Hub',
		description:
			'Integration Hub example with sync engine and field mappings for ContractSpec',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'integration-hub'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.integration-hub',
	},
});

export default ExamplesIntegrationHubExample;
export { ExamplesIntegrationHubExample };
