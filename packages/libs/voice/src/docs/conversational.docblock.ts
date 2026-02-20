/**
 * @docblock
 * @title Conversational Sub-domain
 * @domain voice.conversational
 * @description
 * Real-time bidirectional voice conversations.
 *
 * Supports two strategies:
 * 1. Native: Delegate to ConversationalProvider
 * 2. Composed: Chain STT + LLM + TTS via ResponseOrchestrator
 *
 * The VoiceSessionManager class manages session lifecycle.
 */
export const conversationalDocblock = true;
