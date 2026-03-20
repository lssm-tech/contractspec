'use client';

import type { McpClientConfig } from '@contractspec/lib.ai-agent/tools/mcp-client.browser';
/**
 * AI Chat Assistant Dashboard
 *
 * Focused template: ChatWithSidebar with reasoning, chain of thought,
 * sources, suggestions, and optional MCP tools. Use proxyUrl when the
 * host app provides a chat API route (e.g. /api/chat).
 */
import { ChatWithSidebar } from '@contractspec/module.ai-chat';

const DEFAULT_SUGGESTIONS = [
	'Search for files',
	'List directory contents',
	'Read a file',
];

const DEFAULT_SYSTEM_PROMPT = `You are an AI Chat Assistant. Help users with file operations, search, and general questions. When MCP tools are available, use them to read files, list directories, or search. Be concise and actionable.`;

export interface AiChatAssistantDashboardProps {
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

export function AiChatAssistantDashboard({
	proxyUrl = '/api/chat',
	mcpServers,
	thinkingLevel = 'thinking',
	suggestions = DEFAULT_SUGGESTIONS,
	systemPrompt = DEFAULT_SYSTEM_PROMPT,
	className,
}: AiChatAssistantDashboardProps) {
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
