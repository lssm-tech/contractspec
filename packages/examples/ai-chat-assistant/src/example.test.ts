import { describe, expect, test } from 'bun:test';
import { AiChatAssistantFeature } from './ai-chat-assistant.feature';
import { AssistantSearchContract } from './contracts';
import example from './example';
import { assistantSearch } from './handlers';

describe('@contractspec/example.ai-chat-assistant', () => {
	test('publishes meetup-ready example metadata', () => {
		const assistantSearchOperation = AiChatAssistantFeature.operations?.[0];

		expect(example.meta.key).toBe('ai-chat-assistant');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.ai-chat-assistant'
		);
		expect(example.surfaces.templates).toBe(true);
		expect(example.surfaces.sandbox?.enabled).toBe(true);
		expect(assistantSearchOperation?.key).toBe(
			AssistantSearchContract.meta.key
		);
	});

	test('returns deterministic assistant search results', async () => {
		const response = await assistantSearch({
			query: 'ContractSpec',
			limit: 2,
		});

		expect(response.results).toHaveLength(2);
		expect(response.results[0]?.title).toContain('ContractSpec');
		expect(response.results[0]?.snippet).toContain('contractspec');
		expect(response.results[0]?.url).toBe('https://contractspec.io/docs');
	});
});
