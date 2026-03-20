import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const aiChatAssistantDocBlocks: DocBlock[] = [
	{
		id: 'docs.examples.ai-chat-assistant',
		title: 'AI Chat Assistant',
		summary:
			'Focused assistant template with deterministic sources, curated sandbox docs, and meetup-safe beta coverage.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/examples/ai-chat-assistant',
		tags: ['ai', 'chat', 'mcp', 'tools'],
		body: `## Overview

- AI Chat Assistant with ChatWithSidebar: reasoning, sources, suggestions, and curated demo coverage.
- Deterministic search-backed handler output so docs and sandbox routes stay stable during live demos.
- Optional MCP tools (filesystem, etc.) when configured. Browser supports http/sse only.
- One OperationSpec: \`assistant.search\` for demo; apps can add more.

## Contracts

- \`assistant.search\`: input query, output search results. Mock handler for sandbox.

## UI

- AiChatAssistantDashboard: ChatWithSidebar with proxyUrl, mcpServers, thinkingLevel, suggestions.
- Use proxyUrl when host app provides /api/chat route for streaming.

## Notes

- MCP stdio does not run in browser; use http/sse MCP configs for tools in sandbox.
- createChatRoute from @contractspec/module.ai-chat/core for backend chat API.`,
	},
	{
		id: 'docs.examples.ai-chat-assistant.goal',
		title: 'AI Chat Assistant — Goal',
		summary: 'Why this template exists and what success looks like.',
		kind: 'goal',
		visibility: 'public',
		route: '/docs/examples/ai-chat-assistant/goal',
		tags: ['ai', 'chat', 'goal'],
		body: `## Why it matters
- Provides a minimal, focused example combining ai-chat with contracts and MCP.
- Demonstrates reasoning, chain of thought, sources, and suggestions in one place.

## Success criteria
- Chat works with proxyUrl; streaming via /api/chat.
- MCP tools available when http/sse config provided.
- assistant.search contract shows handler pattern.`,
	},
	{
		id: 'docs.examples.ai-chat-assistant.usage',
		title: 'AI Chat Assistant — Usage',
		summary: 'How to use and extend the AI Chat Assistant template.',
		kind: 'usage',
		visibility: 'public',
		route: '/docs/examples/ai-chat-assistant/usage',
		tags: ['ai', 'chat', 'usage'],
		body: `## Setup
1) Add @contractspec/module.ai-chat and @contractspec/example.ai-chat-assistant.
2) Create /api/chat route with createChatRoute (see web-landing).
3) Render AiChatAssistantDashboard with proxyUrl="/api/chat".
4) Run \`bun run smoke\` for the deterministic meetup lane before presenting.

## MCP
- For browser: use http/sse MCP server configs. stdio returns empty tools.
- Run MCP server separately (e.g. npx -y @modelcontextprotocol/server-filesystem .).

## Extend
- Add more OperationSpecs and handlers.
- Register handlers with OperationSpecRegistry for agent tools.`,
	},
];

registerDocBlocks(aiChatAssistantDocBlocks);
