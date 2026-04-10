import { describe, expect, it } from 'bun:test';
import { createBuilderVoiceTranscriptionInput } from '.';

describe('builder voice integration', () => {
	it('creates Builder voice transcription inputs', () => {
		const provider = {
			transcribe: async () => ({
				text: 'hello',
				segments: [],
				durationMs: 0,
				language: 'en',
			}),
		};
		const input = createBuilderVoiceTranscriptionInput(
			{
				workspaceId: 'ws_1',
				sourceId: 'src_1',
				audioContentBase64: 'ZGF0YQ==',
				language: 'en',
				retainAudio: true,
				approvedLocales: ['en', 'fr'],
			},
			provider as never
		);

		expect(input.workspaceId).toBe('ws_1');
		expect(input.sourceId).toBe('src_1');
		expect(input.retainAudio).toBe(true);
		expect(input.approvedLocales).toEqual(['en', 'fr']);
	});
});
