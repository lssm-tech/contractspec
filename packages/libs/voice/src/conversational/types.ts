import type {
  ConversationalProvider,
  ConversationalEvent,
  ConversationalSessionSummary,
  AudioFormat,
  STTProvider,
  TTSProvider,
} from '../types';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';

export interface ConversationConfig {
  voiceId: string;
  language?: string;
  systemPrompt: string;
  llmModel?: string;
  inputFormat?: AudioFormat;
  outputFormat?: AudioFormat;
  turnDetection?: 'server_vad' | 'push_to_talk';
  silenceThresholdMs?: number;
  maxDurationSeconds?: number;
  /** Tools the agent can invoke mid-conversation */
  tools?: ConversationalTool[];
}

export interface ConversationalTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<string>;
}

export interface ConversationState {
  sessionId: string;
  status: 'connecting' | 'active' | 'paused' | 'ended';
  currentTurn: 'user' | 'agent' | 'idle';
  turnCount: number;
  durationMs: number;
  transcript: ConversationTurn[];
}

export interface ConversationTurn {
  role: 'user' | 'agent';
  text: string;
  startMs: number;
  endMs: number;
  toolCalls?: { name: string; result: string }[];
}

export interface ConversationalOptions {
  conversational: ConversationalProvider;
  /** Optional fallback: use separate STT + LLM + TTS if provider doesn't support native conversational */
  fallbackSTT?: STTProvider;
  fallbackTTS?: TTSProvider;
  fallbackLLM?: LLMProvider;
}

export interface ManagedSession {
  state: ConversationState;
  sendAudio(chunk: Uint8Array): void;
  sendText(text: string): void;
  interrupt(): void;
  close(): Promise<ConversationalSessionSummary>;
  events: AsyncIterable<ConversationalEvent>;
}

export type { ConversationalEvent, ConversationalSessionSummary };
