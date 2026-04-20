import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesOpencodeCliExample = defineExample({
	meta: {
		key: 'opencode-cli',
		version: '1.0.0',
		title: 'Opencode Cli',
		description:
			'ContractSpec package declaration for @contractspec/example.opencode-cli.',
		kind: 'template',
		visibility: 'public',
		stability: 'stable',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'opencode-cli'],
	},
	surfaces: {
		templates: false,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.opencode-cli',
	},
});

export default ExamplesOpencodeCliExample;
export { ExamplesOpencodeCliExample };
