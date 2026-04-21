import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesAiSupportBotExample = defineExample({
	meta: {
		key: 'examples.ai-support-bot',
		version: '1.0.0',
		title: 'Ai Support Bot',
		description:
			'AI support bot example: classify and resolve a support ticket using @contractspec/lib.support-bot.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'ai-support-bot'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.ai-support-bot',
	},
});

export default ExamplesAiSupportBotExample;
export { ExamplesAiSupportBotExample };
