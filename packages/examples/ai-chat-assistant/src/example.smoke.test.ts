import { describe, expect, test } from 'bun:test';
import { AiChatAssistantFeature } from './ai-chat-assistant.feature';
import { AssistantSearchContract } from './contracts';
import example from './example';

describe('@contractspec/example.ai-chat-assistant smoke', () => {
	test('publishes beta-ready example metadata', () => {
		expect(example.meta.stability).toBe('beta');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.ai-chat-assistant'
		);
		expect(example.surfaces.templates).toBe(true);
		expect(example.surfaces.sandbox?.enabled).toBe(true);
		expect(AiChatAssistantFeature.meta.stability).toBe('beta');
		expect(AiChatAssistantFeature.operations?.[0]?.key).toBe(
			AssistantSearchContract.meta.key
		);
	});
});
