# Implementation Plan: Voice (`@contractspec/lib.voice`)

> **Breaking changes**: Allowed everywhere (video-gen, contracts-integrations, contracts-spec)
> **Scope**: Three aspects -- **TTS**, **STT**, **Conversational**
> **Deliverable**: One umbrella lib `@contractspec/lib.voice` with three sub-domains

---

## 1. Why One Lib, Not Three

| Option                                          | Verdict                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 3 libs (`voice-tts`, `voice-stt`, `voice-conv`) | Over-fragmented. All three share: audio primitives, voice catalog, provider ecosystem, i18n |
| 2 libs (batch + realtime)                       | Reasonable but artificially splits the voice catalog and audio utilities                    |
| **1 lib with 3 sub-domains**                    | **Chosen**. Shared foundations, 3 clean import paths, single provider binding               |

All three aspects share the same **provider ecosystem** (ElevenLabs does TTS+STT+conversational, Deepgram does STT+conversational, Fal does TTS, Gradium does TTS+realtime). A single lib keeps the voice catalog, audio primitives, and provider bindings DRY.

Consumer import paths are clean:

```ts
import { VoiceSynthesizer } from "@contractspec/lib.voice/tts";
import { Transcriber }      from "@contractspec/lib.voice/stt";
import { VoiceSession }     from "@contractspec/lib.voice/conversational";
import { VoiceTimingMap }    from "@contractspec/lib.voice/sync";
```

---

## 2. The Three Aspects

### 2.1 TTS (Text-to-Speech)

**Direction**: text -> audio

- Per-segment synthesis with pacing, emphasis, tone control
- Deep integration with video-gen: scene-aware narration, timing feedback loop
- Standalone usage: podcasts, audio articles, accessibility

### 2.2 STT (Speech-to-Text)

**Direction**: audio -> text

- Batch transcription (upload file -> get transcript)
- Speaker diarization (who said what)
- Word-level timestamps (for subtitles, lip-sync, knowledge indexing)
- Feeds into: meeting-recorder pipeline, knowledge ingestion, video subtitle generation

### 2.3 Conversational

**Direction**: audio <-> text <-> audio (real-time bidirectional)

- WebSocket/streaming session management
- Turn-taking detection (voice activity detection)
- LLM integration for response generation mid-conversation
- Use cases: voice agents, live support, interactive demos

---

## 3. Contract Layer Changes (Breaking)

> **IMPORTANT — Mirror Pattern**: `contracts-spec` and `contracts-integrations` maintain **identical mirrored copies** of all integration files (`spec.ts`, `providers/voice.ts`, `providers/elevenlabs.ts`, etc.). Every change in this section MUST be applied to **both** packages in lockstep.

### 3.1 Restructure `IntegrationCategory`

**Files** (BOTH):

- `contracts-spec/src/integrations/spec.ts`
- `contracts-integrations/src/integrations/spec.ts`

Replace `'ai-voice'` + `'speech-to-text'` with a unified set:

```ts
// BEFORE
| 'ai-voice'
| 'speech-to-text'

// AFTER
| 'ai-voice-tts'
| 'ai-voice-stt'
| 'ai-voice-conversational'
```

**Breaking**: All existing integration specs using `'ai-voice'` must be updated (`elevenlabs.ts`, `fal.ts`, `gradium.ts`).

### 3.2 Replace `VoiceProvider` contract

**Files** (BOTH -- rewrite entirely):

- `contracts-spec/src/integrations/providers/voice.ts`
- `contracts-integrations/src/integrations/providers/voice.ts`

Current state (35 lines, identical in both):

```ts
export interface Voice { id, name, description?, language?, gender?, previewUrl?, metadata? }
export interface VoiceSynthesisInput { text, voiceId?, language?, style?, stability?, similarityBoost?, format?, sampleRateHz?, metadata? }
export interface VoiceSynthesisResult { audio: Uint8Array, format, sampleRateHz, durationSeconds?, url? }
export interface VoiceProvider { listVoices(), synthesize(input) }
```

Replace with:

```ts
// ═══════════════════════════════════════════════════════════════════════════
// Shared Voice Types
// ═══════════════════════════════════════════════════════════════════════════

export interface Voice {
  id: string;
  name: string;
  description?: string;
  language?: string;
  gender?: "male" | "female" | "neutral";
  previewUrl?: string;
  capabilities?: ("tts" | "conversational")[];
  metadata?: Record<string, string>;
}

export type AudioFormat = "mp3" | "wav" | "ogg" | "pcm" | "opus";

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

// ═══════════════════════════════════════════════════════════════════════════
// TTS Provider
// ═══════════════════════════════════════════════════════════════════════════

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
  emphasis?: "reduced" | "normal" | "strong";
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

// ═══════════════════════════════════════════════════════════════════════════
// STT Provider
// ═══════════════════════════════════════════════════════════════════════════

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
    options?: Omit<STTTranscriptionInput, "audio">
  ): AsyncIterable<TranscriptionSegment>;
}

// ═══════════════════════════════════════════════════════════════════════════
// Conversational Provider
// ═══════════════════════════════════════════════════════════════════════════

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
  turnDetection?: "server_vad" | "push_to_talk";
  /** Silence threshold in ms to detect end of turn */
  silenceThresholdMs?: number;
  /** Maximum session duration in seconds */
  maxDurationSeconds?: number;
  metadata?: Record<string, string>;
}

export type ConversationalEvent =
  | { type: "session_started"; sessionId: string }
  | { type: "user_speech_started" }
  | { type: "user_speech_ended"; transcript: string }
  | { type: "agent_speech_started"; text: string }
  | { type: "agent_audio"; audio: Uint8Array }
  | { type: "agent_speech_ended" }
  | { type: "transcript"; role: "user" | "agent"; text: string; timestamp: number }
  | { type: "error"; error: Error }
  | { type: "session_ended"; reason: string; durationMs: number };

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
  turns: { role: "user" | "agent"; text: string; startMs: number; endMs: number }[];
  transcript: string;
}

export interface ConversationalProvider {
  startSession(config: ConversationalSessionConfig): Promise<ConversationalSession>;
  listVoices(): Promise<Voice[]>;
}
```

### 3.3 New: Voice-Video Sync Types

**Files** (BOTH):

- `contracts-spec/src/integrations/providers/voice-video-sync.ts`
- `contracts-integrations/src/integrations/providers/voice-video-sync.ts`

```ts
/**
 * Timing map produced by voice/tts, consumed by video-gen.
 * Video-gen uses this to adjust scene durations to match voice.
 */
export interface VoiceTimingMap {
  totalDurationMs: number;
  segments: VoiceSegmentTiming[];
  fps: number;
}

export interface VoiceSegmentTiming {
  /** Matches a sceneId from video-gen's ScenePlan */
  sceneId: string;
  /** Voice audio duration for this segment in ms */
  durationMs: number;
  /** Equivalent duration in frames */
  durationInFrames: number;
  /** Recommended scene duration (voice + breathing room) */
  recommendedSceneDurationInFrames: number;
  wordTimings?: WordTiming[];
}

export interface VoicePacingDirective {
  sceneId: string;
  rate: number;
  emphasis: "reduced" | "normal" | "strong";
  tone: "neutral" | "urgent" | "excited" | "calm" | "authoritative";
  leadingSilenceMs: number;
  trailingSilenceMs: number;
}
```

### 3.4 Update Integration Specs (Breaking -- BOTH packages mirrored)

All files below exist identically in both `contracts-spec/src/integrations/providers/` and `contracts-integrations/src/integrations/providers/`. Apply changes to BOTH.

**Existing files to update:**

| File            | Current key           | Current category | New category     | New capabilities                |
| --------------- | --------------------- | ---------------- | ---------------- | ------------------------------- |
| `elevenlabs.ts` | `ai-voice.elevenlabs` | `'ai-voice'`     | `'ai-voice-tts'` | `ai.voice.tts` + `ai.voice.stt` |
| `fal.ts`        | `ai-voice.fal`        | `'ai-voice'`     | `'ai-voice-tts'` | `ai.voice.tts`                  |
| `gradium.ts`    | `ai-voice.gradium`    | `'ai-voice'`     | `'ai-voice-tts'` | `ai.voice.tts`                  |

**Note**: Existing capability key `'ai.voice.synthesis'` (used by all three) changes to `'ai.voice.tts'`.

**New files to create (in BOTH packages):**

| File                 | Key                     | Category                    | Capabilities                               |
| -------------------- | ----------------------- | --------------------------- | ------------------------------------------ |
| `deepgram.ts`        | `ai-voice-stt.deepgram` | `'ai-voice-stt'`            | `ai.voice.stt` + `ai.voice.conversational` |
| `openai-realtime.ts` | `ai-voice-conv.openai`  | `'ai-voice-conversational'` | `ai.voice.conversational`                  |

### 3.5 Exports (BOTH packages)

Add to `providers/index.ts` (both `contracts-spec` and `contracts-integrations`):

```ts
export * from './voice';           // rewritten (already present)
export * from './voice-video-sync'; // new
export * from './deepgram';         // new
export * from './openai-realtime';  // new
```

Update `package.json` exports in BOTH packages:

```json
"./integrations/providers/voice-video-sync": "./src/integrations/providers/voice-video-sync.ts",
"./integrations/providers/deepgram": "./src/integrations/providers/deepgram.ts",
"./integrations/providers/openai-realtime": "./src/integrations/providers/openai-realtime.ts"
```

Plus corresponding `publishConfig` entries (follow the `{ types, bun, node, default }` pattern from existing entries).

---

## 4. Package Structure

```
packages/libs/voice/
  AGENTS.md
  package.json
  tsconfig.json
  tsdown.config.js
  README.md
  src/
    index.ts                          # Re-exports core types + all sub-domain barrels

    types.ts                          # Shared types: VoiceBrief, AudioData re-exports

    audio/                            # Shared audio utilities
      index.ts
      format-converter.ts             # wav<->mp3<->ogg conversion helpers
      silence-generator.ts            # Generate silence buffers per format
      audio-concatenator.ts           # Concatenate AudioData segments
      duration-estimator.ts           # Estimate speech duration from word count

    tts/                              # Text-to-Speech sub-domain
      index.ts
      types.ts                        # TTSBrief, TTSProject, SynthesizedSegment
      voice-synthesizer.ts            # Main TTS orchestrator
      pace-analyzer.ts                # Content -> pacing directives
      emphasis-planner.ts             # Content -> tone/emphasis per segment
      segment-synthesizer.ts          # Per-segment synthesis with pacing
      audio-assembler.ts              # Concatenate segments + silences

    stt/                              # Speech-to-Text sub-domain
      index.ts
      types.ts                        # STTBrief, TranscriptionProject
      transcriber.ts                  # Main STT orchestrator
      diarization-mapper.ts           # Map speaker IDs to names
      subtitle-formatter.ts           # Convert transcription -> SRT/VTT
      segment-splitter.ts             # Split long audio into processable chunks

    conversational/                   # Conversational voice sub-domain
      index.ts
      types.ts                        # SessionConfig, SessionState, TurnHistory
      voice-session-manager.ts        # Session lifecycle (start, manage, end)
      turn-detector.ts                # VAD + silence detection for turn-taking
      response-orchestrator.ts        # Coordinate STT -> LLM -> TTS per turn
      transcript-builder.ts           # Build conversation transcript in real-time

    sync/                             # Video-gen integration layer
      index.ts
      timing-calculator.ts            # SynthesizedSegments -> VoiceTimingMap
      scene-adapter.ts                # video-gen ScenePlan -> TTS segments
      duration-negotiator.ts          # Balance voice duration vs scene duration

    i18n/
      index.ts
      keys.ts
      locale.ts
      messages.ts
      catalogs/
        index.ts
        en.ts
        fr.ts
        es.ts

    docs/
      voice.docblock.ts              # Main overview
      tts.docblock.ts
      stt.docblock.ts
      conversational.docblock.ts
      sync.docblock.ts
```

---

## 5. Type System

### 5.1 Shared Types (`src/types.ts`)

```ts
import type { LLMProvider } from "@contractspec/lib.contracts-integrations/integrations/providers/llm";
import type {
  TTSProvider, STTProvider, ConversationalProvider,
  Voice, AudioData, AudioFormat, WordTiming,
} from "@contractspec/lib.contracts-integrations/integrations/providers/voice";
import type {
  VoiceTimingMap, VoicePacingDirective,
} from "@contractspec/lib.contracts-integrations/integrations/providers/voice-video-sync";
import type { ContentBrief } from "@contractspec/lib.content-gen/types";

// Re-export everything
export type {
  TTSProvider, STTProvider, ConversationalProvider,
  Voice, AudioData, AudioFormat, WordTiming,
  VoiceTimingMap, VoicePacingDirective,
};

// Shared options base
export interface VoiceOptions {
  llm?: LLMProvider;
  model?: string;
  temperature?: number;
  locale?: string;
}
```

### 5.2 TTS Types (`src/tts/types.ts`)

```ts
import type { ContentBrief } from "@contractspec/lib.content-gen/types";
import type { TTSProvider, AudioData, VoiceTimingMap, VoicePacingDirective, VoiceOptions } from "../types";

export interface TTSBrief {
  content: ContentBrief;
  voice: TTSVoiceConfig;
  pacing?: PacingConfig;
  targetDurationSeconds?: number;
  locale?: string;
}

export interface TTSVoiceConfig {
  voiceId: string;
  language?: string;
  style?: number;
  stability?: number;
}

export interface PacingConfig {
  baseRate?: number;                          // Default 1.0
  strategy: "uniform" | "dynamic" | "scene-matched";
  segmentPauseMs?: number;                    // Default 500
  breathingRoomFactor?: number;               // Default 1.15
}

export interface TTSProject {
  id: string;
  script: TTSScript;
  pacingDirectives: VoicePacingDirective[];
  segments?: SynthesizedSegment[];
  assembledAudio?: AudioData;
  timingMap?: VoiceTimingMap;
}

export interface TTSScript {
  fullText: string;
  segments: TTSScriptSegment[];
  estimatedDurationSeconds: number;
}

export interface TTSScriptSegment {
  sceneId: string;
  text: string;
  estimatedDurationSeconds: number;
  contentType: "intro" | "problem" | "solution" | "metric" | "cta" | "transition";
}

export interface SynthesizedSegment {
  sceneId: string;
  audio: AudioData;
  durationMs: number;
  wordTimings?: Array<{ word: string; startMs: number; endMs: number }>;
}

export interface TTSOptions extends VoiceOptions {
  tts: TTSProvider;
  defaultVoiceId?: string;
  fps?: number;
  defaultPacing?: PacingConfig;
}

/** Video-aware brief: takes a ScenePlan instead of standalone content */
export interface VideoTTSBrief {
  content: ContentBrief;
  scenePlan: {
    scenes: Array<{
      id: string;
      compositionId: string;
      durationInFrames: number;
      narrationText?: string;
    }>;
    estimatedDurationSeconds: number;
  };
  voice: TTSVoiceConfig;
  pacing?: PacingConfig;
  fps: number;
  locale?: string;
}
```

### 5.3 STT Types (`src/stt/types.ts`)

```ts
import type { STTProvider, AudioData } from "../types";

export interface STTBrief {
  audio: AudioData;
  language?: string;
  diarize?: boolean;
  speakerCount?: number;
  vocabularyHints?: string[];
  /** Output subtitle format */
  subtitleFormat?: "srt" | "vtt" | "none";
}

export interface TranscriptionProject {
  id: string;
  transcript: TranscriptionResult;
  subtitles?: string;            // SRT or VTT content
  speakers?: SpeakerMap[];
}

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
  language: string;
  durationMs: number;
  wordTimings?: Array<{ word: string; startMs: number; endMs: number }>;
}

export interface TranscriptionSegment {
  text: string;
  startMs: number;
  endMs: number;
  speakerId?: string;
  speakerLabel?: string;
  confidence?: number;
}

export interface SpeakerMap {
  id: string;
  label: string;
  segmentCount: number;
  totalSpeakingMs: number;
}

export interface STTOptions extends VoiceOptions {
  stt: STTProvider;
}
```

### 5.4 Conversational Types (`src/conversational/types.ts`)

```ts
import type {
  ConversationalProvider, ConversationalEvent,
  ConversationalSessionSummary, AudioFormat,
} from "../types";
import type { LLMProvider } from "@contractspec/lib.contracts-integrations/integrations/providers/llm";

export interface ConversationConfig {
  voiceId: string;
  language?: string;
  systemPrompt: string;
  llmModel?: string;
  inputFormat?: AudioFormat;
  outputFormat?: AudioFormat;
  turnDetection?: "server_vad" | "push_to_talk";
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
  status: "connecting" | "active" | "paused" | "ended";
  currentTurn: "user" | "agent" | "idle";
  turnCount: number;
  durationMs: number;
  transcript: ConversationTurn[];
}

export interface ConversationTurn {
  role: "user" | "agent";
  text: string;
  startMs: number;
  endMs: number;
  toolCalls?: { name: string; result: string }[];
}

export interface ConversationalOptions {
  conversational: ConversationalProvider;
  /** Optional fallback: use separate STT + LLM + TTS if provider doesn't support native conversational */
  fallbackSTT?: STTProvider;      // from '../types' re-export
  fallbackTTS?: TTSProvider;      // from '../types' re-export
  fallbackLLM?: LLMProvider;      // from '@contractspec/lib.contracts-integrations/integrations/providers/llm'
}
// NOTE: imports needed at top of file:
// import type { ConversationalProvider, ConversationalEvent, ConversationalSessionSummary, AudioFormat, STTProvider, TTSProvider } from '../types';
// import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
```

---

## 6. Generator / Orchestrator Architecture

### 6.1 TTS Pipeline

```
                         ┌──────────────────┐
                         │   ContentBrief    │
                         │  (or ScenePlan)   │
                         └────────┬─────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │       PaceAnalyzer         │
                    │  text complexity, sentence  │
                    │  length -> pacing directives│
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │     EmphasisPlanner         │
                    │  content type -> tone,      │
                    │  emphasis, rate adjustments  │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │    SegmentSynthesizer       │
                    │  per-segment TTSProvider     │
                    │  calls with pacing control   │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │     AudioAssembler          │
                    │  concatenate + silences     │
                    └─────────────┬──────────────┘
                                  │
                         ┌────────▼─────────┐
                         │   TTSProject      │
                         │  (script, audio,  │
                         │   timingMap)       │
                         └──────────────────┘
```

**`VoiceSynthesizer`** (main orchestrator, `src/tts/voice-synthesizer.ts`):

```ts
export class VoiceSynthesizer {
  constructor(options: TTSOptions)

  /** Standalone TTS from content brief */
  async synthesize(brief: TTSBrief): Promise<TTSProject>

  /** Scene-aware TTS for video-gen */
  async synthesizeForVideo(brief: VideoTTSBrief): Promise<TTSProject>
}
```

**`PaceAnalyzer`** (`src/tts/pace-analyzer.ts`):

Content type -> pacing mapping (deterministic fallback, LLM-enhanced):

| contentType | rate | emphasis | tone          |
| ----------- | ---- | -------- | ------------- |
| intro       | 0.95 | normal   | authoritative |
| problem     | 0.90 | strong   | urgent        |
| solution    | 1.00 | normal   | calm          |
| metric      | 0.85 | strong   | excited       |
| cta         | 0.90 | strong   | authoritative |
| transition  | 1.10 | reduced  | neutral       |

**`EmphasisPlanner`** (`src/tts/emphasis-planner.ts`):

With LLM: asks for fine-grained tone/emphasis per segment. Without: uses content type mapping above.

**`SegmentSynthesizer`** (`src/tts/segment-synthesizer.ts`):

Calls `TTSProvider.synthesize()` per segment with rate/pitch/emphasis from directives. Parallel synthesis via `Promise.all()`.

**`AudioAssembler`** (`src/tts/audio-assembler.ts`):

Uses shared `audio/silence-generator.ts` and `audio/audio-concatenator.ts` to stitch segments with pauses.

### 6.2 STT Pipeline

```
  Audio File/Stream
        │
  ┌─────▼──────────┐
  │ SegmentSplitter │  (chunk long audio)
  └─────┬──────────┘
        │
  ┌─────▼──────────────┐
  │ STTProvider.transcribe│
  └─────┬──────────────┘
        │
  ┌─────▼──────────────┐
  │ DiarizationMapper  │  (speaker ID -> label)
  └─────┬──────────────┘
        │
  ┌─────▼──────────────┐
  │ SubtitleFormatter   │  (segments -> SRT/VTT)
  └─────┬──────────────┘
        │
  ┌─────▼──────────────┐
  │ TranscriptionProject│
  └────────────────────┘
```

**`Transcriber`** (main orchestrator, `src/stt/transcriber.ts`):

```ts
export class Transcriber {
  constructor(options: STTOptions)

  /** Transcribe audio to text */
  async transcribe(brief: STTBrief): Promise<TranscriptionProject>

  /** Stream transcription (real-time, if provider supports it) */
  async *transcribeStream(
    audio: AsyncIterable<Uint8Array>,
    options?: Partial<STTBrief>
  ): AsyncIterable<TranscriptionSegment>
}
```

**`SubtitleFormatter`** (`src/stt/subtitle-formatter.ts`):

```ts
export class SubtitleFormatter {
  toSRT(segments: TranscriptionSegment[]): string
  toVTT(segments: TranscriptionSegment[]): string
}
```

This is directly useful for video-gen: generate subtitles from narration audio.

### 6.3 Conversational Pipeline

```
  User Audio (mic)
        │
  ┌─────▼──────────────────────┐
  │    VoiceSessionManager     │
  │  ┌─────────────────────┐   │
  │  │   TurnDetector      │   │  (VAD / silence detection)
  │  └─────────┬───────────┘   │
  │            │               │
  │  ┌─────────▼───────────┐   │
  │  │ ResponseOrchestrator │   │  STT -> LLM -> TTS per turn
  │  └─────────┬───────────┘   │
  │            │               │
  │  ┌─────────▼───────────┐   │
  │  │ TranscriptBuilder   │   │  Real-time transcript accumulation
  │  └─────────────────────┘   │
  └────────────┬───────────────┘
               │
     ConversationalEvent stream
```

**`VoiceSessionManager`** (`src/conversational/voice-session-manager.ts`):

```ts
export class VoiceSessionManager {
  constructor(options: ConversationalOptions)

  /** Start a new voice conversation session */
  async startSession(config: ConversationConfig): Promise<ManagedSession>
}

export interface ManagedSession {
  state: ConversationState;
  sendAudio(chunk: Uint8Array): void;
  sendText(text: string): void;
  interrupt(): void;
  close(): Promise<ConversationalSessionSummary>;
  events: AsyncIterable<ConversationalEvent>;
}
```

Two implementation strategies:

1. **Native**: If `ConversationalProvider` supports full conversational (ElevenLabs Conversational AI, OpenAI Realtime), delegate entirely.
2. **Composed**: If only `STTProvider` + `LLMProvider` + `TTSProvider` are available, `ResponseOrchestrator` chains them: user audio -> STT -> LLM chat -> TTS -> audio back.

---

## 7. Sync Layer (Video Integration -- Breaking)

### 7.1 Breaking changes to `video-gen`

> **Cross-plan note**: The image plan (`implementation_plan_image.md`) also makes breaking changes to video-gen (`ImageGenerator` in options, `thumbnail?: ImageProject` on `VideoProject`). Apply both sets of changes in a **single coordinated PR**.

**Remove from video-gen entirely**:

- `src/generators/script-generator.ts` (260 lines) -- moves to `voice/tts/` (the script generation is voice responsibility now)
- Remove from `src/generators/index.ts`: `ScriptGenerator`, `ScriptGeneratorOptions`, `NarrationScript`, `NarrationSegment` exports
- Remove `"./generators/script-generator"` from `package.json` exports AND `publishConfig.exports`
- `VoiceProvider` usage in `VideoGenerator` (line 8, 22-23) -- replaced by `VoiceSynthesizer`
- `NarrationScript`, `NarrationSegment` types -- replaced by `TTSScript`, `TTSScriptSegment` from voice lib

**Pre-existing bug fix**: Add missing `@contractspec/lib.contracts-integrations` to `package.json` dependencies (video-gen imports from it in `types.ts`, `video-generator.ts`, `scene-planner.ts` but doesn't declare the dependency).

**Rewrite `VideoGenerator`** (currently 128 lines) to take voice lib as a direct dependency:

```ts
// video-gen/src/generators/video-generator.ts -- AFTER

import { VoiceSynthesizer } from "@contractspec/lib.voice/tts";
import type { TTSProject } from "@contractspec/lib.voice/tts";
import { Transcriber } from "@contractspec/lib.voice/stt";

export interface VideoGeneratorOptions {
  llm?: LLMProvider;
  voice?: VoiceSynthesizer;     // replaces raw VoiceProvider
  transcriber?: Transcriber;     // NEW: for subtitle generation
  fps?: number;
  locale?: string;
}

export class VideoGenerator {
  async generate(brief: VideoBrief): Promise<VideoProject> {
    // 1. Plan scenes
    const scenePlan = await this.scenePlanner.plan(brief);

    // 2. Generate voice with scene awareness (delegated to voice lib)
    let ttsProject: TTSProject | undefined;
    if (brief.narration?.enabled && this.voice) {
      ttsProject = await this.voice.synthesizeForVideo({
        content: brief.content,
        scenePlan: {
          scenes: scenePlan.scenes.map((s, i) => ({
            id: `scene-${i}`,
            compositionId: s.compositionId,
            durationInFrames: s.durationInFrames,
            narrationText: s.narrationText,
          })),
          estimatedDurationSeconds: scenePlan.estimatedDurationSeconds,
        },
        voice: { voiceId: brief.narration.voiceId! },
        pacing: { strategy: "scene-matched" },
        fps: this.fps,
      });

      // 3. Adjust scene durations from voice timing map
      if (ttsProject.timingMap) {
        for (const seg of ttsProject.timingMap.segments) {
          const scene = scenes.find(s => s.id === seg.sceneId);
          if (scene) {
            scene.durationInFrames = seg.recommendedSceneDurationInFrames;
          }
        }
      }
    }

    // 4. Auto-generate subtitles if transcriber available + ttsProject has audio
    let subtitles: string | undefined;
    if (this.transcriber && ttsProject?.assembledAudio) {
      const transcription = await this.transcriber.transcribe({
        audio: ttsProject.assembledAudio,
        wordTimestamps: true,
      });
      subtitles = transcription.subtitles; // VTT format
    }

    // 5. Build VideoProject with voice-gen audio + subtitles
    return {
      id: generateProjectId(),
      scenes,
      totalDurationInFrames,
      fps: this.fps,
      format,
      audio: ttsProject?.assembledAudio
        ? { narration: { data: ttsProject.assembledAudio.data, ... } }
        : undefined,
      subtitles,
      voiceTimingMap: ttsProject?.timingMap,
    };
  }
}
```

### 7.2 `VideoProject` type changes (Breaking)

**File**: `contracts-integrations/src/integrations/providers/video.ts` ONLY (video.ts is NOT mirrored in contracts-spec)

Current `VideoProject` (lines 116-132):

```ts
export interface VideoProject {
  id: string;
  scenes: VideoScene[];
  totalDurationInFrames: number;
  fps: number;
  format: VideoFormat;
  audio?: { narration?: AudioTrack; backgroundMusic?: AudioTrack; };
  metadata?: VideoProjectMetadata;
}
```

**Add** (combined voice + image plan changes):

```ts
export interface VideoProject {
  id: string;
  scenes: VideoScene[];
  totalDurationInFrames: number;
  fps: number;
  format: VideoFormat;
  audio?: { narration?: AudioTrack; backgroundMusic?: AudioTrack; };
  metadata?: VideoProjectMetadata;
  /** VTT subtitles generated from voice narration (voice plan) */
  subtitles?: string;
  /** Voice timing map for per-scene audio sync (voice plan) */
  voiceTimingMap?: VoiceTimingMap;
  /** Generated thumbnail image (image plan) */
  thumbnail?: { prompt: string; imageUrl?: string; };
}
```

**Import needed**: `import type { VoiceTimingMap } from './voice-video-sync';`

### 7.3 Sync module (`src/sync/`)

**`TimingCalculator`**: Converts `SynthesizedSegment[]` -> `VoiceTimingMap` with frame calculations.

**`SceneAdapter`**: Bridges video-gen `ScenePlan` -> `TTSScript` preserving scene IDs.

**`DurationNegotiator`**: One-pass duration balancing:

- Voice fits scene -> no change
- Voice > 110% of scene -> trim silences, suggest rate increase (cap 1.3x), extend scene
- Voice < 70% of scene -> pad silence, suggest rate decrease (floor 0.8x)

---

## 8. Package Configuration

### 8.1 `package.json` (full)

```json
{
  "name": "@contractspec/lib.voice",
  "version": "0.1.0",
  "description": "Voice capabilities: TTS, STT, and conversational AI",
  "keywords": [
    "contractspec",
    "voice",
    "tts",
    "stt",
    "conversational",
    "ai",
    "typescript"
  ],
  "type": "module",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"],
  "scripts": {
    "publish:pkg": "bun publish --tolerate-republish --ignore-scripts --verbose",
    "publish:pkg:canary": "bun publish:pkg --tag canary",
    "build": "bun run prebuild && bun run build:bundle && bun run build:types",
    "build:bundle": "contractspec-bun-build transpile",
    "build:types": "contractspec-bun-build types",
    "dev": "contractspec-bun-build dev",
    "clean": "rimraf dist .turbo",
    "lint": "bun lint:fix",
    "lint:fix": "eslint src --fix",
    "lint:check": "eslint src",
    "test": "bun test --pass-with-no-tests",
    "prebuild": "contractspec-bun-build prebuild",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@contractspec/lib.contracts-spec": "workspace:*",
    "@contractspec/lib.contracts-integrations": "workspace:*",
    "@contractspec/lib.content-gen": "workspace:*"
  },
  "devDependencies": {
    "@contractspec/tool.typescript": "workspace:*",
    "@contractspec/tool.bun": "workspace:*",
    "typescript": "catalog:"
  },
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types.ts",
    "./audio": "./src/audio/index.ts",
    "./audio/index": "./src/audio/index.ts",
    "./audio/format-converter": "./src/audio/format-converter.ts",
    "./audio/silence-generator": "./src/audio/silence-generator.ts",
    "./audio/audio-concatenator": "./src/audio/audio-concatenator.ts",
    "./audio/duration-estimator": "./src/audio/duration-estimator.ts",
    "./tts": "./src/tts/index.ts",
    "./tts/index": "./src/tts/index.ts",
    "./tts/types": "./src/tts/types.ts",
    "./tts/voice-synthesizer": "./src/tts/voice-synthesizer.ts",
    "./tts/pace-analyzer": "./src/tts/pace-analyzer.ts",
    "./tts/emphasis-planner": "./src/tts/emphasis-planner.ts",
    "./tts/segment-synthesizer": "./src/tts/segment-synthesizer.ts",
    "./tts/audio-assembler": "./src/tts/audio-assembler.ts",
    "./stt": "./src/stt/index.ts",
    "./stt/index": "./src/stt/index.ts",
    "./stt/types": "./src/stt/types.ts",
    "./stt/transcriber": "./src/stt/transcriber.ts",
    "./stt/diarization-mapper": "./src/stt/diarization-mapper.ts",
    "./stt/subtitle-formatter": "./src/stt/subtitle-formatter.ts",
    "./stt/segment-splitter": "./src/stt/segment-splitter.ts",
    "./conversational": "./src/conversational/index.ts",
    "./conversational/index": "./src/conversational/index.ts",
    "./conversational/types": "./src/conversational/types.ts",
    "./conversational/voice-session-manager": "./src/conversational/voice-session-manager.ts",
    "./conversational/turn-detector": "./src/conversational/turn-detector.ts",
    "./conversational/response-orchestrator": "./src/conversational/response-orchestrator.ts",
    "./conversational/transcript-builder": "./src/conversational/transcript-builder.ts",
    "./sync": "./src/sync/index.ts",
    "./sync/index": "./src/sync/index.ts",
    "./sync/timing-calculator": "./src/sync/timing-calculator.ts",
    "./sync/scene-adapter": "./src/sync/scene-adapter.ts",
    "./sync/duration-negotiator": "./src/sync/duration-negotiator.ts",
    "./i18n": "./src/i18n/index.ts",
    "./i18n/index": "./src/i18n/index.ts",
    "./i18n/keys": "./src/i18n/keys.ts",
    "./i18n/locale": "./src/i18n/locale.ts",
    "./i18n/messages": "./src/i18n/messages.ts",
    "./i18n/catalogs": "./src/i18n/catalogs/index.ts",
    "./i18n/catalogs/index": "./src/i18n/catalogs/index.ts",
    "./i18n/catalogs/en": "./src/i18n/catalogs/en.ts",
    "./i18n/catalogs/fr": "./src/i18n/catalogs/fr.ts",
    "./i18n/catalogs/es": "./src/i18n/catalogs/es.ts"
  },
  "publishConfig": {
    "access": "public",
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "bun": "./dist/index.js",
        "node": "./dist/node/index.js",
        "browser": "./dist/browser/index.js",
        "default": "./dist/index.js"
      },
      "./types": {
        "types": "./dist/types.d.ts",
        "bun": "./dist/types.js",
        "node": "./dist/node/types.js",
        "browser": "./dist/browser/types.js",
        "default": "./dist/types.js"
      },
      "./audio": {
        "types": "./dist/audio/index.d.ts",
        "bun": "./dist/audio/index.js",
        "node": "./dist/node/audio/index.js",
        "browser": "./dist/browser/audio/index.js",
        "default": "./dist/audio/index.js"
      },
      "./tts": {
        "types": "./dist/tts/index.d.ts",
        "bun": "./dist/tts/index.js",
        "node": "./dist/node/tts/index.js",
        "browser": "./dist/browser/tts/index.js",
        "default": "./dist/tts/index.js"
      },
      "./tts/types": {
        "types": "./dist/tts/types.d.ts",
        "bun": "./dist/tts/types.js",
        "node": "./dist/node/tts/types.js",
        "browser": "./dist/browser/tts/types.js",
        "default": "./dist/tts/types.js"
      },
      "./tts/voice-synthesizer": {
        "types": "./dist/tts/voice-synthesizer.d.ts",
        "bun": "./dist/tts/voice-synthesizer.js",
        "node": "./dist/node/tts/voice-synthesizer.js",
        "browser": "./dist/browser/tts/voice-synthesizer.js",
        "default": "./dist/tts/voice-synthesizer.js"
      },
      "./stt": {
        "types": "./dist/stt/index.d.ts",
        "bun": "./dist/stt/index.js",
        "node": "./dist/node/stt/index.js",
        "browser": "./dist/browser/stt/index.js",
        "default": "./dist/stt/index.js"
      },
      "./stt/types": {
        "types": "./dist/stt/types.d.ts",
        "bun": "./dist/stt/types.js",
        "node": "./dist/node/stt/types.js",
        "browser": "./dist/browser/stt/types.js",
        "default": "./dist/stt/types.js"
      },
      "./stt/transcriber": {
        "types": "./dist/stt/transcriber.d.ts",
        "bun": "./dist/stt/transcriber.js",
        "node": "./dist/node/stt/transcriber.js",
        "browser": "./dist/browser/stt/transcriber.js",
        "default": "./dist/stt/transcriber.js"
      },
      "./stt/subtitle-formatter": {
        "types": "./dist/stt/subtitle-formatter.d.ts",
        "bun": "./dist/stt/subtitle-formatter.js",
        "node": "./dist/node/stt/subtitle-formatter.js",
        "browser": "./dist/browser/stt/subtitle-formatter.js",
        "default": "./dist/stt/subtitle-formatter.js"
      },
      "./conversational": {
        "types": "./dist/conversational/index.d.ts",
        "bun": "./dist/conversational/index.js",
        "node": "./dist/node/conversational/index.js",
        "browser": "./dist/browser/conversational/index.js",
        "default": "./dist/conversational/index.js"
      },
      "./conversational/types": {
        "types": "./dist/conversational/types.d.ts",
        "bun": "./dist/conversational/types.js",
        "node": "./dist/node/conversational/types.js",
        "browser": "./dist/browser/conversational/types.js",
        "default": "./dist/conversational/types.js"
      },
      "./conversational/voice-session-manager": {
        "types": "./dist/conversational/voice-session-manager.d.ts",
        "bun": "./dist/conversational/voice-session-manager.js",
        "node": "./dist/node/conversational/voice-session-manager.js",
        "browser": "./dist/browser/conversational/voice-session-manager.js",
        "default": "./dist/conversational/voice-session-manager.js"
      },
      "./sync": {
        "types": "./dist/sync/index.d.ts",
        "bun": "./dist/sync/index.js",
        "node": "./dist/node/sync/index.js",
        "browser": "./dist/browser/sync/index.js",
        "default": "./dist/sync/index.js"
      },
      "./sync/timing-calculator": {
        "types": "./dist/sync/timing-calculator.d.ts",
        "bun": "./dist/sync/timing-calculator.js",
        "node": "./dist/node/sync/timing-calculator.js",
        "browser": "./dist/browser/sync/timing-calculator.js",
        "default": "./dist/sync/timing-calculator.js"
      },
      "./i18n": {
        "types": "./dist/i18n/index.d.ts",
        "bun": "./dist/i18n/index.js",
        "node": "./dist/node/i18n/index.js",
        "browser": "./dist/browser/i18n/index.js",
        "default": "./dist/i18n/index.js"
      },
      "./i18n/keys": {
        "types": "./dist/i18n/keys.d.ts",
        "bun": "./dist/i18n/keys.js",
        "node": "./dist/node/i18n/keys.js",
        "browser": "./dist/browser/i18n/keys.js",
        "default": "./dist/i18n/keys.js"
      },
      "./i18n/locale": {
        "types": "./dist/i18n/locale.d.ts",
        "bun": "./dist/i18n/locale.js",
        "node": "./dist/node/i18n/locale.js",
        "browser": "./dist/browser/i18n/locale.js",
        "default": "./dist/i18n/locale.js"
      },
      "./i18n/messages": {
        "types": "./dist/i18n/messages.d.ts",
        "bun": "./dist/i18n/messages.js",
        "node": "./dist/node/i18n/messages.js",
        "browser": "./dist/browser/i18n/messages.js",
        "default": "./dist/i18n/messages.js"
      },
      "./i18n/catalogs": {
        "types": "./dist/i18n/catalogs/index.d.ts",
        "bun": "./dist/i18n/catalogs/index.js",
        "node": "./dist/node/i18n/catalogs/index.js",
        "browser": "./dist/browser/i18n/catalogs/index.js",
        "default": "./dist/i18n/catalogs/index.js"
      },
      "./i18n/catalogs/en": {
        "types": "./dist/i18n/catalogs/en.d.ts",
        "bun": "./dist/i18n/catalogs/en.js",
        "node": "./dist/node/i18n/catalogs/en.js",
        "browser": "./dist/browser/i18n/catalogs/en.js",
        "default": "./dist/i18n/catalogs/en.js"
      },
      "./i18n/catalogs/fr": {
        "types": "./dist/i18n/catalogs/fr.d.ts",
        "bun": "./dist/i18n/catalogs/fr.js",
        "node": "./dist/node/i18n/catalogs/fr.js",
        "browser": "./dist/browser/i18n/catalogs/fr.js",
        "default": "./dist/i18n/catalogs/fr.js"
      },
      "./i18n/catalogs/es": {
        "types": "./dist/i18n/catalogs/es.d.ts",
        "bun": "./dist/i18n/catalogs/es.js",
        "node": "./dist/node/i18n/catalogs/es.js",
        "browser": "./dist/browser/i18n/catalogs/es.js",
        "default": "./dist/i18n/catalogs/es.js"
      }
    },
    "registry": "https://registry.npmjs.org/"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/lssm-tech/contractspec.git",
    "directory": "packages/libs/voice"
  },
  "homepage": "https://contractspec.io"
}
```

> **Note**: Individual file exports (like `./audio/format-converter`, `./tts/pace-analyzer`, etc.) are omitted from `publishConfig` for brevity — follow the same `{ types, bun, node, browser, default }` pattern for each. The full set should be generated/mirrored from the `exports` field.

### 8.2 `tsconfig.json`

```json
{
  "extends": "@contractspec/tool.typescript/react-library.json",
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  }
}
```

### 8.3 `tsdown.config.js`

```js
import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
  ...moduleLibrary,
}));
```

### 8.4 Dependency graph

```
video-gen ──► voice ──► content-gen ──► contracts-integrations ──► contracts-spec
   │            │
   │            └──► (shared audio utilities are internal, no external audio deps)
   │
   └──► image-gen ──► content-gen  (from image plan)
```

video-gen takes `voice` as a **direct dependency** (breaking -- was optional `VoiceProvider`).

**video-gen `package.json` changes** (combined with image plan):

```json
{
  "dependencies": {
    "@contractspec/lib.contracts-spec": "workspace:*",
    "@contractspec/lib.contracts-integrations": "workspace:*", // ADD (pre-existing bug fix)
    "@contractspec/lib.content-gen": "workspace:*",
    "@contractspec/lib.design-system": "workspace:*",
    "@contractspec/lib.voice": "workspace:*", // ADD (voice plan)
    "@contractspec/lib.image-gen": "workspace:*", // ADD (image plan)
    "remotion": "^4.0.0"
  }
}
```

---

## 9. Cross-Domain Use Cases

| Use Case                         | Sub-domains used                    | Consumer                              |
| -------------------------------- | ----------------------------------- | ------------------------------------- |
| Video narration with pacing      | TTS + sync                          | video-gen                             |
| Video subtitle generation        | TTS + STT + sync                    | video-gen                             |
| Blog audio version               | TTS (standalone)                    | content-gen pipeline                  |
| Meeting transcript ingestion     | STT                                 | meeting-recorder, knowledge ingestion |
| Voice agent for support          | Conversational                      | apps (agents)                         |
| Podcast from ContentBrief        | TTS (standalone, long-form)         | content-gen pipeline                  |
| Accessibility audio descriptions | TTS + STT (round-trip verification) | accessibility lib                     |

---

## 10. i18n Layer

### Keys organized by sub-domain:

```
TTS_PROMPT_KEYS:
  "prompt.tts.system"
  "prompt.pace.sceneMatched"
  "prompt.emphasis.system"

TTS_PACE_KEYS:
  "pace.intro.description"
  "pace.problem.description"
  "pace.solution.description"
  ...

STT_KEYS:
  "stt.transcribing"
  "stt.diarization.speaker"
  "stt.subtitle.timestamp"

CONVERSATIONAL_KEYS:
  "conv.session.started"
  "conv.turn.user"
  "conv.turn.agent"
  "conv.session.ended"
```

Catalogs: en/fr/es (matching other packages).

---

## 11. Testing Strategy

| Test                           | File                                           | Coverage                            |
| ------------------------------ | ---------------------------------------------- | ----------------------------------- |
| **TTS**                        |
| `VoiceSynthesizer` standalone  | `tts/voice-synthesizer.test.ts`                | Full pipeline without provider      |
| `VoiceSynthesizer` for video   | same                                           | Scene-aware with mock ScenePlan     |
| `PaceAnalyzer`                 | `tts/pace-analyzer.test.ts`                    | Content type -> rate/emphasis       |
| `SegmentSynthesizer`           | `tts/segment-synthesizer.test.ts`              | Per-segment mock synthesis          |
| `AudioAssembler`               | `tts/audio-assembler.test.ts`                  | Silence insertion, concatenation    |
| **STT**                        |
| `Transcriber`                  | `stt/transcriber.test.ts`                      | Mock STTProvider transcription      |
| `SubtitleFormatter`            | `stt/subtitle-formatter.test.ts`               | SRT + VTT output format             |
| `DiarizationMapper`            | `stt/diarization-mapper.test.ts`               | Speaker ID labeling                 |
| **Conversational**             |
| `VoiceSessionManager` native   | `conversational/voice-session-manager.test.ts` | Mock ConversationalProvider session |
| `VoiceSessionManager` composed | same                                           | STT+LLM+TTS fallback chain          |
| `TranscriptBuilder`            | `conversational/transcript-builder.test.ts`    | Real-time transcript accumulation   |
| **Sync**                       |
| `TimingCalculator`             | `sync/timing-calculator.test.ts`               | Frame conversion, breathing room    |
| `SceneAdapter`                 | `sync/scene-adapter.test.ts`                   | ScenePlan -> TTSScript              |
| `DurationNegotiator`           | `sync/duration-negotiator.test.ts`             | Too-long, too-short, fits           |
| **Audio**                      |
| `SilenceGenerator`             | `audio/silence-generator.test.ts`              | Format-specific silence             |
| `DurationEstimator`            | `audio/duration-estimator.test.ts`             | Word count -> seconds               |
| **i18n**                       |
| All locales                    | `i18n/i18n.test.ts`                            | Keys completeness                   |

---

## 12. Implementation Order

### Phase 1: Contract Layer (Day 1-2) -- Breaking, MIRRORED

> All steps 1-6 must be applied to **BOTH** `contracts-spec` and `contracts-integrations` in lockstep.

1. Rewrite `voice.ts` with `TTSProvider`, `STTProvider`, `ConversationalProvider` (BOTH packages)
2. Add `voice-video-sync.ts` with `VoiceTimingMap`, `VoicePacingDirective` (BOTH packages)
3. Update `IntegrationCategory` in `spec.ts` (BOTH packages)
4. Update integration specs: `elevenlabs.ts`, `fal.ts`, `gradium.ts` (BOTH packages)
5. Add new specs: `deepgram.ts`, `openai-realtime.ts` (BOTH packages)
6. Update `providers/index.ts` + `package.json` exports (BOTH packages)
7. Add `subtitles?` + `voiceTimingMap?` + `thumbnail?` to `VideoProject` in `video.ts` (contracts-integrations ONLY -- video.ts not mirrored)

### Phase 2: Package Scaffold (Day 2)

8. Scaffold `packages/libs/voice/` (package.json, tsconfig, tsdown.config)
9. `src/types.ts` -- shared re-exports
10. `src/audio/` -- utilities (format-converter, silence-generator, concatenator, duration-estimator)

### Phase 3: TTS Sub-domain (Day 3-5)

11. `src/tts/types.ts`
12. `src/tts/pace-analyzer.ts`
13. `src/tts/emphasis-planner.ts`
14. `src/tts/segment-synthesizer.ts`
15. `src/tts/audio-assembler.ts`
16. `src/tts/voice-synthesizer.ts` (orchestrator)

### Phase 4: Sync Layer (Day 5-6)

17. `src/sync/timing-calculator.ts`
18. `src/sync/scene-adapter.ts`
19. `src/sync/duration-negotiator.ts`

### Phase 5: STT Sub-domain (Day 6-7)

20. `src/stt/types.ts`
21. `src/stt/segment-splitter.ts`
22. `src/stt/diarization-mapper.ts`
23. `src/stt/subtitle-formatter.ts`
24. `src/stt/transcriber.ts` (orchestrator)

### Phase 6: Conversational Sub-domain (Day 7-9)

25. `src/conversational/types.ts`
26. `src/conversational/turn-detector.ts`
27. `src/conversational/response-orchestrator.ts`
28. `src/conversational/transcript-builder.ts`
29. `src/conversational/voice-session-manager.ts` (orchestrator)

### Phase 7: Integration + Polish (Day 9-10)

30. `src/i18n/` -- keys, catalogs, locale factory
31. `src/docs/` -- DocBlocks (5 files)
32. `src/index.ts` -- barrel export
33. **video-gen breaking rewrite** (single coordinated PR with image plan):
    - Fix missing `contracts-integrations` dependency
    - Add `voice` + `image-gen` dependencies
    - Remove `script-generator.ts` + its exports/publishConfig entries
    - Rewrite `video-generator.ts` (replace `VoiceProvider` → `VoiceSynthesizer`, add `Transcriber`)
    - Update `types.ts` (remove `VoiceProvider` import, add voice/image imports)
    - Update `generators/index.ts` barrel
34. Tests across all sub-domains
35. `AGENTS.md` + `README.md`

---

## 13. Risks & Mitigations

| Risk                                                         | Mitigation                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Per-segment TTS is slow (N API calls)                        | `Promise.all()` parallel synthesis; single-text fallback if timing is acceptable                                    |
| Audio concatenation across formats                           | Normalize to WAV internally, convert to target on output. Keep segments separate for Remotion per-scene `<Audio>`   |
| Conversational requires WebSocket infra                      | `ConversationalProvider` contract delegates transport to the provider adapter; voice lib manages session state only |
| Composed conversational (STT+LLM+TTS chain) has high latency | Mark as "beta". Native provider path is preferred. Composed is fallback only.                                       |
| Breaking video-gen changes                                   | Single coordinated PR. video-gen version bump. All consumers update at once (monorepo advantage).                   |
| STT word timings vary by provider                            | `wordTimings` is optional everywhere. SubtitleFormatter works at segment level if word timings unavailable.         |

---

## 14. Estimated Effort

| Phase                               | Effort       |
| ----------------------------------- | ------------ |
| Contract layer (breaking rewrite)   | 2 days       |
| Package scaffold + audio utilities  | 1 day        |
| TTS sub-domain (6 files)            | 3 days       |
| Sync layer (3 files)                | 1.5 days     |
| STT sub-domain (4 files)            | 2 days       |
| Conversational sub-domain (4 files) | 2.5 days     |
| i18n + docs                         | 1 day        |
| video-gen breaking rewrite          | 1 day        |
| Tests                               | 2 days       |
| **Total**                           | **~16 days** |

---

## 15. Validation Checklist (verified against codebase)

- [x] `IntegrationCategory` confirmed identical in both `contracts-spec/src/integrations/spec.ts` and `contracts-integrations/src/integrations/spec.ts` (117 lines each)
- [x] Current `VoiceProvider` confirmed: 35 lines, `{ listVoices(), synthesize() }` -- identical in both packages
- [x] Current integration specs confirmed identical in both packages: `elevenlabs.ts` (72 lines), `fal.ts` (100 lines), `gradium.ts` (97 lines)
- [x] All three specs use `category: 'ai-voice'`, capability key `'ai.voice.synthesis'`, `StabilityEnum` from `contracts-spec/ownership`
- [x] `'speech-to-text'` confirmed as existing `IntegrationCategory` value (line 16 in both spec.ts files)
- [x] `providers/index.ts` barrel confirmed identical in both packages (39 lines each), minus `video` which is only in contracts-integrations
- [x] `video.ts` (VideoProject, AudioTrack, etc.) confirmed at 219 lines, EXISTS ONLY in `contracts-integrations` (not mirrored)
- [x] `VideoGenerator` confirmed: 128 lines, imports `VoiceProvider` (line 8), creates `ScriptGenerator` (line 39), calls `this.voice.synthesize()` with flat text (line 73)
- [x] `ScriptGenerator` confirmed: 260 lines, exports `NarrationScript` + `NarrationSegment`, uses i18n, dual-mode LLM/deterministic
- [x] `ScenePlanner` confirmed: 228 lines, `PlannedScene` has no `id` field (assigned as `scene-${i}` in VideoGenerator line 96)
- [x] `generators/index.ts` barrel confirmed: exports `VideoGenerator`, `ScenePlanner`, `ScriptGenerator` + types
- [x] `video-gen/package.json` confirmed: missing `contracts-integrations` dependency despite importing from it
- [x] `ContentBrief` shape confirmed: `{ title, summary, problems[], solutions[], metrics?, proofPoints?, complianceNotes?, audience, callToAction?, references? }`
- [x] `tsconfig.json` extends `@contractspec/tool.typescript/react-library.json` (confirmed from content-gen + video-gen)
- [x] `tsdown.config.js` uses `{ ...moduleLibrary }` from `@contractspec/tool.bun` (confirmed)
- [x] `package.json` pattern confirmed: `exports` (dev, points to `src/`), `publishConfig.exports` (published, `{ types, bun, node, browser?, default }`)

---

## 16. Future Extensions

- **Lip sync data**: `WordTiming` -> mouth position keyframes for animated avatars in video-gen compositions
- **Multi-voice TTS**: Multiple voices per project (narrator + characters)
- **Voice cloning**: Reference audio input in `TTSVoiceConfig` for voice cloning providers
- **Real-time subtitles**: STT streaming -> live VTT for video player overlay
- **Conversation analytics**: Sentiment, talk ratio, interruption count from `ConversationalSessionSummary`
- **Podcast generation**: Long-form TTS with chapter markers, intro/outro music mixing
- **Meeting-recorder bridge**: STT `TranscriptionProject` -> `MeetingTranscriptRecord` conversion utility for knowledge pipeline
