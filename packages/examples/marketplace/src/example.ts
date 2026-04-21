import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesMarketplaceExample = defineExample({
	meta: {
		key: 'examples.marketplace',
		version: '1.0.0',
		title: 'Marketplace',
		description:
			'Marketplace example with orders, payouts, and reviews for ContractSpec',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'marketplace'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.marketplace',
	},
});

export default ExamplesMarketplaceExample;
export { ExamplesMarketplaceExample };
