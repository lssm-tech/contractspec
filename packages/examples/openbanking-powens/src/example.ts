import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesOpenbankingPowensExample = defineExample({
	meta: {
		key: 'examples.openbanking-powens',
		version: '1.0.0',
		title: 'Openbanking Powens',
		description:
			'OpenBanking Powens example: OAuth callback + webhook handler patterns (provider + workflows).',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'openbanking-powens'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.openbanking-powens',
	},
});

export default ExamplesOpenbankingPowensExample;
export { ExamplesOpenbankingPowensExample };
