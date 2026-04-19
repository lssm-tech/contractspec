import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesAiChatAssistantExample = defineExample({
	meta: {
		key: 'examples.ai-chat-assistant',
		version: '1.0.0',
		title: 'Ai Chat Assistant',
		description:
			'Focused AI chat assistant template with MCP tools, reasoning, chain of thought, sources, and suggestions.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'ai-chat-assistant'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.ai-chat-assistant',
	},
});

export default ExamplesAiChatAssistantExample;
export { ExamplesAiChatAssistantExample };
