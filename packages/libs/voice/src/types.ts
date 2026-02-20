import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
import type {
  TTSProvider,
  STTProvider,
  ConversationalProvider,
  ConversationalEvent,
  ConversationalSessionSummary,
  Voice,
  AudioData,
  AudioFormat,
  WordTiming,
} from '@contractspec/lib.contracts-integrations/integrations/providers/voice';
import type {
  VoiceTimingMap,
  VoicePacingDirective,
} from '@contractspec/lib.contracts-integrations/integrations/providers/voice-video-sync';
import type { ContentBrief } from '@contractspec/lib.content-gen/types';

// Re-export contract types for convenience
export type {
  TTSProvider,
  STTProvider,
  ConversationalProvider,
  ConversationalEvent,
  ConversationalSessionSummary,
  Voice,
  AudioData,
  AudioFormat,
  WordTiming,
  VoiceTimingMap,
  VoicePacingDirective,
  ContentBrief,
  LLMProvider,
};

/** Shared options base for all voice generators */
export interface VoiceOptions {
  llm?: LLMProvider;
  model?: string;
  temperature?: number;
  locale?: string;
}
