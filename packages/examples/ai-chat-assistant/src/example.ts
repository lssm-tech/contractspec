import { defineExample } from '@contractspec/lib.contracts-spec';

const example = defineExample({
	meta: {
		key: 'ai-chat-assistant',
		version: '1.0.0',
		title: 'AI Chat Assistant',
		description:
			'Focused template: full ai-chat with reasoning, chain of thought, sources, suggestions, and MCP tools.',
		kind: 'template',
		visibility: 'public',
		stability: 'beta',
		owners: ['@platform.core'],
		tags: ['ai', 'chat', 'mcp', 'tools'],
	},
	docs: {
		rootDocId: 'docs.examples.ai-chat-assistant',
		goalDocId: 'docs.examples.ai-chat-assistant.goal',
		usageDocId: 'docs.examples.ai-chat-assistant.usage',
	},
	entrypoints: {
		packageName: '@contractspec/example.ai-chat-assistant',
		contracts: './contracts',
		handlers: './handlers',
		docs: './docs',
	},
	surfaces: {
		templates: true,
		sandbox: {
			enabled: true,
			modes: ['playground', 'specs', 'markdown'],
		},
		studio: { enabled: true, installable: true },
		mcp: { enabled: true },
	},
});

export default example;
