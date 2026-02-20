import type { ConversationalEvent } from '../types';
import type { ConversationTurn } from './types';

/**
 * Build a conversation transcript in real-time from event stream.
 *
 * Accumulates turns as events arrive and provides access to the
 * full transcript at any point during the conversation.
 */
export class TranscriptBuilder {
  private readonly turns: ConversationTurn[] = [];
  private currentTurn: Partial<ConversationTurn> | null = null;
  private sessionStartMs: number = Date.now();

  /** Get the current transcript */
  getTranscript(): ConversationTurn[] {
    return [...this.turns];
  }

  /** Get the full transcript as plain text */
  toText(): string {
    return this.turns.map((t) => `[${t.role}] ${t.text}`).join('\n');
  }

  /** Get the total number of turns */
  getTurnCount(): number {
    return this.turns.length;
  }

  /**
   * Process a conversational event and update the transcript.
   */
  processEvent(event: ConversationalEvent): void {
    switch (event.type) {
      case 'session_started':
        this.sessionStartMs = Date.now();
        break;

      case 'user_speech_started':
        this.currentTurn = {
          role: 'user',
          startMs: Date.now() - this.sessionStartMs,
        };
        break;

      case 'user_speech_ended':
        if (this.currentTurn && this.currentTurn.role === 'user') {
          this.currentTurn.text = event.transcript;
          this.currentTurn.endMs = Date.now() - this.sessionStartMs;
          this.turns.push(this.currentTurn as ConversationTurn);
          this.currentTurn = null;
        }
        break;

      case 'agent_speech_started':
        this.currentTurn = {
          role: 'agent',
          text: event.text,
          startMs: Date.now() - this.sessionStartMs,
        };
        break;

      case 'agent_speech_ended':
        if (this.currentTurn && this.currentTurn.role === 'agent') {
          this.currentTurn.endMs = Date.now() - this.sessionStartMs;
          this.turns.push(this.currentTurn as ConversationTurn);
          this.currentTurn = null;
        }
        break;

      case 'transcript':
        // Transcript events can serve as corrections
        break;

      default:
        break;
    }
  }

  /** Reset the transcript */
  reset(): void {
    this.turns.length = 0;
    this.currentTurn = null;
    this.sessionStartMs = Date.now();
  }
}
