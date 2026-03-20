/**
 * AI Chat Assistant handlers.
 * Mock implementation for sandbox; apps can replace with real search.
 */

export interface AssistantSearchInput {
	query: string;
	limit?: number;
}

export interface AssistantSearchResult {
	title: string;
	snippet: string;
	url?: string;
}

export interface AssistantSearchOutput {
	results: AssistantSearchResult[];
}

/**
 * Mock search handler for the assistant.
 * Returns sample results for demo; replace with real search in production.
 */
export async function assistantSearch(
	input: AssistantSearchInput
): Promise<AssistantSearchOutput> {
	const limit = input.limit ?? 5;
	const query = input.query.toLowerCase();

	// Mock results for demo
	const mockResults: AssistantSearchResult[] = [
		{
			title: 'ContractSpec Documentation',
			snippet: `Information about ContractSpec and ${query}.`,
			url: 'https://contractspec.io/docs',
		},
		{
			title: 'AI Chat Module',
			snippet: 'ChatWithSidebar, useChat, and MCP tools integration.',
			url: 'https://contractspec.io/docs/ai-chat',
		},
		{
			title: 'MCP Tools',
			snippet: 'Model Context Protocol tools for chat assistants.',
			url: 'https://modelcontextprotocol.io',
		},
	].slice(0, limit);

	return { results: mockResults };
}

/** Type for the contract (for handler binding) */
export type AssistantSearchHandler = (
	input: Parameters<typeof assistantSearch>[0]
) => Promise<AssistantSearchOutput>;
