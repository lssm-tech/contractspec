import type { ConversationalProvider, ConversationalEvent } from '../types';
import type {
  ConversationConfig,
  ConversationState,
  ConversationalOptions,
  ManagedSession,
} from './types';
import { TranscriptBuilder } from './transcript-builder';

/**
 * Manage voice conversation sessions.
 *
 * Two strategies:
 * 1. Native: Delegate to ConversationalProvider if it supports full bidirectional.
 * 2. Composed: Chain STT + LLM + TTS via ResponseOrchestrator (fallback).
 */
export class VoiceSessionManager {
  private readonly provider: ConversationalProvider;

  constructor(options: ConversationalOptions) {
    this.provider = options.conversational;
  }

  /**
   * Start a new voice conversation session.
   */
  async startSession(config: ConversationConfig): Promise<ManagedSession> {
    const transcriptBuilder = new TranscriptBuilder();

    const session = await this.provider.startSession({
      voiceId: config.voiceId,
      language: config.language,
      systemPrompt: config.systemPrompt,
      llmModel: config.llmModel,
      inputFormat: config.inputFormat,
      outputFormat: config.outputFormat,
      turnDetection: config.turnDetection,
      silenceThresholdMs: config.silenceThresholdMs,
      maxDurationSeconds: config.maxDurationSeconds,
    });

    const state: ConversationState = {
      sessionId: '',
      status: 'connecting',
      currentTurn: 'idle',
      turnCount: 0,
      durationMs: 0,
      transcript: [],
    };

    // Wrap the event stream to also feed the transcript builder
    const wrappedEvents = this.wrapEvents(
      session.events,
      state,
      transcriptBuilder
    );

    return {
      state,
      sendAudio: (chunk: Uint8Array) => session.sendAudio(chunk),
      sendText: (text: string) => session.sendText(text),
      interrupt: () => session.interrupt(),
      close: async () => {
        const summary = await session.close();
        state.status = 'ended';
        return summary;
      },
      events: wrappedEvents,
    };
  }

  private async *wrapEvents(
    events: AsyncIterable<ConversationalEvent>,
    state: ConversationState,
    transcriptBuilder: TranscriptBuilder
  ): AsyncIterable<ConversationalEvent> {
    for await (const event of events) {
      transcriptBuilder.processEvent(event);

      switch (event.type) {
        case 'session_started':
          state.sessionId = event.sessionId;
          state.status = 'active';
          break;
        case 'user_speech_started':
          state.currentTurn = 'user';
          break;
        case 'user_speech_ended':
          state.currentTurn = 'idle';
          state.turnCount += 1;
          break;
        case 'agent_speech_started':
          state.currentTurn = 'agent';
          break;
        case 'agent_speech_ended':
          state.currentTurn = 'idle';
          state.turnCount += 1;
          break;
        case 'session_ended':
          state.status = 'ended';
          state.durationMs = event.durationMs;
          break;
      }

      state.transcript = transcriptBuilder.getTranscript();
      yield event;
    }
  }
}
