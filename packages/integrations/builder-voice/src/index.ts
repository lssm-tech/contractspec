import type { BuilderVoiceTranscriptionInput } from '@contractspec/lib.builder-runtime';
import type { STTProvider } from '@contractspec/lib.voice';

export interface BuilderBrowserVoicePayload {
	workspaceId: string;
	sourceId: string;
	audioContentBase64: string;
	language?: string;
	model?: string;
	retainAudio?: boolean;
	approvedLocales?: string[];
}

export function createBuilderVoiceTranscriptionInput(
	payload: BuilderBrowserVoicePayload,
	sttProvider: STTProvider
): BuilderVoiceTranscriptionInput {
	return {
		workspaceId: payload.workspaceId,
		sourceId: payload.sourceId,
		audioContentBase64: payload.audioContentBase64,
		language: payload.language,
		model: payload.model,
		retainAudio: payload.retainAudio,
		approvedLocales: payload.approvedLocales,
		sttProvider,
	};
}
export * from './integration';
