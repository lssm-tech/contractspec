import type { AgentSessionState } from '../types';
import {
  BaseAgentMemoryManager,
  type AgentMemoryEntry,
  type AgentMemorySnapshot,
  type AgentSessionMemory,
} from './manager';

interface StoredSession {
  data: AgentSessionMemory;
  expiresAt: number;
}

export interface InMemoryAgentMemoryOptions {
  ttlMinutes?: number;
  maxEntries?: number;
}

export class InMemoryAgentMemory extends BaseAgentMemoryManager {
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly store = new Map<string, StoredSession>();

  constructor(options?: InMemoryAgentMemoryOptions) {
    super();
    this.ttlMs = (options?.ttlMinutes ?? 60) * 60 * 1000;
    this.maxEntries = options?.maxEntries ?? 250;
  }

  async load(sessionId: string): Promise<AgentSessionMemory | null> {
    this.evictExpired();
    const stored = this.store.get(sessionId);
    if (!stored) return null;
    stored.data.session.updatedAt = new Date();
    stored.expiresAt = Date.now() + this.ttlMs;
    return stored.data;
  }

  async save(snapshot: AgentSessionMemory): Promise<void> {
    this.trim(snapshot.memory.entries);
    this.store.set(snapshot.session.sessionId, {
      data: snapshot,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  async summarize(session: AgentSessionState): Promise<AgentMemorySnapshot> {
    const current =
      (await this.load(session.sessionId)) ?? this.bootstrapMemory(session);
    const content = current.memory.entries
      .slice(-10)
      .map((entry) => `- ${entry.type}: ${entry.content}`)
      .join('\n');
    current.memory.summary = content;
    current.memory.lastSummarizedAt = new Date();
    await this.save(current);
    return current.memory;
  }

  private trim(entries: AgentMemoryEntry[]) {
    if (entries.length <= this.maxEntries) return;
    entries.splice(0, entries.length - this.maxEntries);
  }

  private evictExpired() {
    const now = Date.now();
    for (const [sessionId, stored] of this.store.entries()) {
      if (stored.expiresAt <= now) {
        this.store.delete(sessionId);
      }
    }
  }
}
