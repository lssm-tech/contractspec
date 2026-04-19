import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesVideoDocsTerminalExample = defineExample({
	meta: {
		key: 'examples.video-docs-terminal',
		version: '1.0.0',
		title: 'Video Docs Terminal',
		description:
			'Generate terminal demo videos from CLI walkthroughs using the TerminalDemo composition and ScriptGenerator.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'video-docs-terminal'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.video-docs-terminal',
	},
});

export default ExamplesVideoDocsTerminalExample;
export { ExamplesVideoDocsTerminalExample };
