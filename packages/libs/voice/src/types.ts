import type { ContentBrief } from '@contractspec/lib.content-gen/types';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
import type {
	AudioData,
	AudioFormat,
	ConversationalEvent,
	ConversationalProvider,
	ConversationalSessionSummary,
	STTProvider,
	TTSProvider,
	Voice,
	WordTiming,
} from '@contractspec/lib.contracts-integrations/integrations/providers/voice';
import type {
	VoicePacingDirective,
	VoiceTimingMap,
} from '@contractspec/lib.contracts-integrations/integrations/providers/voice-video-sync';

// Re-export contract types for convenience
export type {
	AudioData,
	AudioFormat,
	ContentBrief,
	ConversationalEvent,
	ConversationalProvider,
	ConversationalSessionSummary,
	LLMProvider,
	STTProvider,
	TTSProvider,
	Voice,
	VoicePacingDirective,
	VoiceTimingMap,
	WordTiming,
};

/** Shared options base for all voice generators */
export interface VoiceOptions {
	llm?: LLMProvider;
	model?: string;
	temperature?: number;
	locale?: string;
	/** Transport mode for voice providers. */
	transport?: 'rest' | 'mcp' | 'sdk';
	/** Auth method for voice providers. */
	authMethod?: 'api-key' | 'oauth2' | 'bearer';
	/** Custom auth headers for voice providers. */
	authHeaders?: Record<string, string>;
}
