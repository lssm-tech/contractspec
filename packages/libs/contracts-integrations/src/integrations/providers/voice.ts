export interface Voice {
  id: string;
  name: string;
  description?: string;
  language?: string;
  gender?: 'male' | 'female' | 'neutral';
  previewUrl?: string;
  capabilities?: ('tts' | 'conversational')[];
  metadata?: Record<string, string>;
}

export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'pcm' | 'opus';

export interface AudioData {
  data: Uint8Array;
  format: AudioFormat;
  sampleRateHz: number;
  durationMs?: number;
  channels?: 1 | 2;
}

export interface WordTiming {
  word: string;
  startMs: number;
  endMs: number;
  confidence?: number;
}

export interface TTSSynthesisInput {
  text: string;
  voiceId: string;
  language?: string;
  format?: AudioFormat;
  sampleRateHz?: number;
  /** Speech rate multiplier (0.5-2.0). Default 1.0 */
  rate?: number;
  /** Pitch adjustment in semitones (-12 to +12). Default 0 */
  pitch?: number;
  /** Emphasis level */
  emphasis?: 'reduced' | 'normal' | 'strong';
  /** Style (0-1, provider-specific) */
  style?: number;
  /** Stability (0-1, provider-specific) */
  stability?: number;
  /** SSML markup. Overrides text if set. */
  ssml?: string;
  metadata?: Record<string, string>;
}

export interface TTSSynthesisResult {
  audio: AudioData;
  wordTimings?: WordTiming[];
  /** Provider may return revised/normalized text */
  normalizedText?: string;
}

export interface TTSProvider {
  synthesize(input: TTSSynthesisInput): Promise<TTSSynthesisResult>;
  listVoices(): Promise<Voice[]>;
}

export interface STTTranscriptionInput {
  audio: AudioData;
  language?: string;
  /** Enable speaker diarization */
  diarize?: boolean;
  /** Expected number of speakers (hint for diarization) */
  speakerCount?: number;
  /** Include word-level timestamps */
  wordTimestamps?: boolean;
  /** Vocabulary hints for domain-specific terms */
  vocabularyHints?: string[];
  /** Model to use (provider-specific) */
  model?: string;
  metadata?: Record<string, string>;
}

export interface TranscriptionSegment {
  text: string;
  startMs: number;
  endMs: number;
  speakerId?: string;
  speakerName?: string;
  confidence?: number;
  wordTimings?: WordTiming[];
}

export interface STTTranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  language: string;
  durationMs: number;
  speakers?: { id: string; name?: string }[];
  wordTimings?: WordTiming[];
}

export interface STTProvider {
  transcribe(input: STTTranscriptionInput): Promise<STTTranscriptionResult>;
  /** Stream transcription (real-time audio input) */
  transcribeStream?(
    audio: AsyncIterable<Uint8Array>,
    options?: Omit<STTTranscriptionInput, 'audio'>
  ): AsyncIterable<TranscriptionSegment>;
}

export interface ConversationalSessionConfig {
  voiceId: string;
  language?: string;
  systemPrompt?: string;
  /** LLM model for response generation */
  llmModel?: string;
  /** Audio input format */
  inputFormat?: AudioFormat;
  /** Audio output format */
  outputFormat?: AudioFormat;
  /** Turn detection mode */
  turnDetection?: 'server_vad' | 'push_to_talk';
  /** Silence threshold in ms to detect end of turn */
  silenceThresholdMs?: number;
  /** Maximum session duration in seconds */
  maxDurationSeconds?: number;
  metadata?: Record<string, string>;
}

export type ConversationalEvent =
  | { type: 'session_started'; sessionId: string }
  | { type: 'user_speech_started' }
  | { type: 'user_speech_ended'; transcript: string }
  | { type: 'agent_speech_started'; text: string }
  | { type: 'agent_audio'; audio: Uint8Array }
  | { type: 'agent_speech_ended' }
  | {
      type: 'transcript';
      role: 'user' | 'agent';
      text: string;
      timestamp: number;
    }
  | { type: 'error'; error: Error }
  | { type: 'session_ended'; reason: string; durationMs: number };

export interface ConversationalSession {
  /** Send audio chunk from user */
  sendAudio(chunk: Uint8Array): void;
  /** Send text input (bypass STT) */
  sendText(text: string): void;
  /** Interrupt the agent's current speech */
  interrupt(): void;
  /** End the session */
  close(): Promise<ConversationalSessionSummary>;
  /** Event stream */
  events: AsyncIterable<ConversationalEvent>;
}

export interface ConversationalSessionSummary {
  sessionId: string;
  durationMs: number;
  turns: {
    role: 'user' | 'agent';
    text: string;
    startMs: number;
    endMs: number;
  }[];
  transcript: string;
}

export interface ConversationalProvider {
  startSession(
    config: ConversationalSessionConfig
  ): Promise<ConversationalSession>;
  listVoices(): Promise<Voice[]>;
}
