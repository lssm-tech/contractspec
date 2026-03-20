'use client';

import type { McpClientConfig } from '@contractspec/lib.ai-agent/tools/mcp-client.browser';
/**
 * Integration Hub Chat
 *
 * Full ai-chat with ChatWithSidebar: reasoning, chain of thought, sources,
 * suggestions, and optional MCP tools. Use proxyUrl when the host app
 * provides a chat API route (e.g. /api/chat).
 */
import { ChatWithSidebar } from '@contractspec/module.ai-chat';

const DEFAULT_SUGGESTIONS = [
	'List my integrations',
	'Show sync status',
	'Add a connection',
];

const DEFAULT_SYSTEM_PROMPT = `You are an Integration Hub assistant. Help users manage integrations, connections, and sync configurations. When asked about integrations, connections, or syncs, provide clear, actionable guidance.`;

export interface IntegrationHubChatProps {
	/** Chat API URL (e.g. /api/chat). Required for streaming. */
	proxyUrl?: string;
	/** MCP server configs. Browser supports http/sse only; stdio returns empty tools. */
	mcpServers?: McpClientConfig[];
	/** Initial thinking level */
	thinkingLevel?: 'instant' | 'thinking' | 'extra_thinking' | 'max';
	/** Suggestion chips for empty state */
	suggestions?: string[];
	/** System prompt override */
	systemPrompt?: string;
	className?: string;
}

export function IntegrationHubChat({
	proxyUrl = '/api/chat',
	mcpServers,
	thinkingLevel = 'thinking',
	suggestions = DEFAULT_SUGGESTIONS,
	systemPrompt = DEFAULT_SYSTEM_PROMPT,
	className,
}: IntegrationHubChatProps) {
	return (
		<div className={className ?? 'flex h-[500px] flex-col'}>
			<ChatWithSidebar
				className="flex-1"
				systemPrompt={systemPrompt}
				proxyUrl={proxyUrl}
				mcpServers={mcpServers}
				thinkingLevel={thinkingLevel}
				suggestions={suggestions}
				showSuggestionsWhenEmpty
			/>
		</div>
	);
}
