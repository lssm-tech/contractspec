import type {
  AudioFormat,
  ConversationalEvent,
  ConversationalSession,
  ConversationalSessionConfig,
  ConversationalSessionSummary,
  STTProvider,
} from '../voice';
import { AsyncEventQueue } from './async-event-queue';

interface ConversationTurn {
  role: 'user' | 'assistant';
  text: string;
  startMs: number;
  endMs: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class MistralConversationSession implements ConversationalSession {
  readonly events: AsyncIterable<ConversationalEvent>;

  private readonly queue = new AsyncEventQueue<ConversationalEvent>();
  private readonly turns: ConversationTurn[] = [];
  private readonly history: ConversationMessage[] = [];
  private readonly sessionId = crypto.randomUUID();
  private readonly startedAt = Date.now();

  private readonly sessionConfig: ConversationalSessionConfig;
  private readonly defaultModel: string;
  private readonly complete: (
    history: ConversationMessage[],
    sessionConfig: ConversationalSessionConfig
  ) => Promise<string>;
  private readonly sttProvider: STTProvider;

  private pending: Promise<void> = Promise.resolve();
  private closed = false;
  private closedSummary?: ConversationalSessionSummary;

  constructor(options: {
    sessionConfig: ConversationalSessionConfig;
    defaultModel: string;
    complete: (
      history: ConversationMessage[],
      sessionConfig: ConversationalSessionConfig
    ) => Promise<string>;
    sttProvider: STTProvider;
  }) {
    this.sessionConfig = options.sessionConfig;
    this.defaultModel = options.defaultModel;
    this.complete = options.complete;
    this.sttProvider = options.sttProvider;
    this.events = this.queue;

    this.queue.push({
      type: 'session_started',
      sessionId: this.sessionId,
    });
  }

  sendAudio(chunk: Uint8Array): void {
    if (this.closed) {
      return;
    }

    this.pending = this.pending
      .then(async () => {
        const transcription = await this.sttProvider.transcribe({
          audio: {
            data: chunk,
            format: (this.sessionConfig.inputFormat ?? 'pcm') as AudioFormat,
            sampleRateHz: 16000,
          },
          language: this.sessionConfig.language,
        });

        const transcriptText = transcription.text.trim();
        if (transcriptText.length > 0) {
          await this.handleUserText(transcriptText);
        }
      })
      .catch((error) => {
        this.emitError(error);
      });
  }

  sendText(text: string): void {
    if (this.closed) {
      return;
    }
    const normalized = text.trim();
    if (normalized.length === 0) {
      return;
    }

    this.pending = this.pending
      .then(() => this.handleUserText(normalized))
      .catch((error) => {
        this.emitError(error);
      });
  }

  interrupt(): void {
    if (this.closed) {
      return;
    }

    this.queue.push({
      type: 'error',
      error: new Error(
        'Interrupt is not supported for non-streaming sessions.'
      ),
    });
  }

  async close(): Promise<ConversationalSessionSummary> {
    if (this.closedSummary) {
      return this.closedSummary;
    }

    this.closed = true;
    await this.pending;

    const durationMs = Date.now() - this.startedAt;
    const summary: ConversationalSessionSummary = {
      sessionId: this.sessionId,
      durationMs,
      turns: this.turns.map((turn) => ({
        role: turn.role === 'assistant' ? 'agent' : turn.role,
        text: turn.text,
        startMs: turn.startMs,
        endMs: turn.endMs,
      })),
      transcript: this.turns
        .map((turn) => `${turn.role}: ${turn.text}`)
        .join('\n'),
    };

    this.closedSummary = summary;
    this.queue.push({
      type: 'session_ended',
      reason: 'closed_by_client',
      durationMs,
    });
    this.queue.close();

    return summary;
  }

  private async handleUserText(text: string): Promise<void> {
    if (this.closed) {
      return;
    }

    const userStart = Date.now();
    this.queue.push({ type: 'user_speech_started' });
    this.queue.push({ type: 'user_speech_ended', transcript: text });
    this.queue.push({
      type: 'transcript',
      role: 'user',
      text,
      timestamp: userStart,
    });

    this.turns.push({
      role: 'user',
      text,
      startMs: userStart,
      endMs: Date.now(),
    });
    this.history.push({ role: 'user', content: text });

    const assistantStart = Date.now();
    const assistantText = await this.complete(this.history, {
      ...this.sessionConfig,
      llmModel: this.sessionConfig.llmModel ?? this.defaultModel,
    });

    if (this.closed) {
      return;
    }

    const normalizedAssistantText = assistantText.trim();
    const finalAssistantText =
      normalizedAssistantText.length > 0
        ? normalizedAssistantText
        : 'I was unable to produce a response.';

    this.queue.push({
      type: 'agent_speech_started',
      text: finalAssistantText,
    });
    this.queue.push({
      type: 'transcript',
      role: 'agent',
      text: finalAssistantText,
      timestamp: assistantStart,
    });
    this.queue.push({ type: 'agent_speech_ended' });

    this.turns.push({
      role: 'assistant',
      text: finalAssistantText,
      startMs: assistantStart,
      endMs: Date.now(),
    });
    this.history.push({ role: 'assistant', content: finalAssistantText });
  }

  private emitError(error: unknown): void {
    if (this.closed) {
      return;
    }
    this.queue.push({ type: 'error', error: toError(error) });
  }
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}
