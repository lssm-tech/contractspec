import type {
  STTProvider,
  TTSProvider,
  AudioData,
  ConversationalEvent,
} from '../types';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';
import type { ConversationConfig } from './types';

/**
 * Orchestrate STT -> LLM -> TTS per conversation turn.
 *
 * Used as a fallback when the ConversationalProvider doesn't support
 * native bidirectional conversation.
 */
export class ResponseOrchestrator {
  private readonly stt: STTProvider;
  private readonly llm: LLMProvider;
  private readonly tts: TTSProvider;
  private readonly conversationHistory: {
    role: 'user' | 'assistant';
    content: string;
  }[] = [];

  constructor(stt: STTProvider, llm: LLMProvider, tts: TTSProvider) {
    this.stt = stt;
    this.llm = llm;
    this.tts = tts;
  }

  /**
   * Process a user's audio turn and generate an agent response.
   *
   * @param userAudio - Audio from the user's turn
   * @param config - Session configuration
   * @returns Stream of conversational events
   */
  async *processUserTurn(
    userAudio: AudioData,
    config: ConversationConfig
  ): AsyncGenerator<ConversationalEvent> {
    // 1. STT: Convert user audio to text
    const transcription = await this.stt.transcribe({
      audio: userAudio,
      language: config.language,
      wordTimestamps: false,
    });

    const userText = transcription.text;
    yield { type: 'user_speech_ended', transcript: userText };
    yield {
      type: 'transcript',
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    // 2. LLM: Generate response
    this.conversationHistory.push({ role: 'user', content: userText });

    const llmResponse = await this.llm.chat(
      [
        {
          role: 'system',
          content: [{ type: 'text', text: config.systemPrompt }],
        },
        ...this.conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: [{ type: 'text' as const, text: msg.content }],
        })),
      ],
      { model: config.llmModel }
    );

    const responseText = llmResponse.message.content.find(
      (p) => p.type === 'text'
    );
    const agentText =
      responseText && responseText.type === 'text'
        ? responseText.text
        : 'I apologize, I could not generate a response.';

    this.conversationHistory.push({ role: 'assistant', content: agentText });
    yield { type: 'agent_speech_started', text: agentText };

    // 3. TTS: Synthesize agent response
    const synthesis = await this.tts.synthesize({
      text: agentText,
      voiceId: config.voiceId,
      language: config.language,
      format: config.outputFormat,
    });

    yield { type: 'agent_audio', audio: synthesis.audio.data };
    yield { type: 'agent_speech_ended' };
    yield {
      type: 'transcript',
      role: 'agent',
      text: agentText,
      timestamp: Date.now(),
    };
  }

  /** Reset conversation history */
  reset(): void {
    this.conversationHistory.length = 0;
  }
}
