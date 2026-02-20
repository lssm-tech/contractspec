/**
 * @docblock
 * @title Voice Library
 * @domain voice
 * @description
 * Umbrella library for voice capabilities: TTS, STT, and Conversational AI.
 *
 * ## Sub-domains
 * - **TTS**: Text-to-speech synthesis with pacing, emphasis, and video-gen integration
 * - **STT**: Speech-to-text transcription with diarization and subtitle generation
 * - **Conversational**: Real-time bidirectional voice conversations
 * - **Sync**: Video-gen timing integration layer
 *
 * ## Import paths
 * ```ts
 * import { VoiceSynthesizer } from "@contractspec/lib.voice/tts";
 * import { Transcriber } from "@contractspec/lib.voice/stt";
 * import { VoiceSessionManager } from "@contractspec/lib.voice/conversational";
 * import { TimingCalculator } from "@contractspec/lib.voice/sync";
 * ```
 */
export const voiceDocblock = true;
