import { randomUUID } from 'node:crypto';
import type { AgentMessage, AgentSessionState } from '../types';

export interface AgentMemoryEntry {
  id: string;
  type: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  createdAt: Date;
  metadata?: Record<string, string>;
}

export interface AgentMemorySnapshot {
  entries: AgentMemoryEntry[];
  summary?: string;
  lastSummarizedAt?: Date;
}

export interface AgentSessionMemory {
  session: AgentSessionState;
  memory: AgentMemorySnapshot;
}

export interface AgentMemoryManager {
  load(sessionId: string): Promise<AgentSessionMemory | null>;
  save(snapshot: AgentSessionMemory): Promise<void>;
  append(
    session: AgentSessionState,
    entry: Omit<AgentMemoryEntry, 'id' | 'createdAt'> & { createdAt?: Date }
  ): Promise<AgentSessionMemory>;
  summarize(
    session: AgentSessionState
  ): Promise<AgentMemorySnapshot | undefined>;
  prune(session: AgentSessionState): Promise<void>;
}

export abstract class BaseAgentMemoryManager implements AgentMemoryManager {
  abstract load(sessionId: string): Promise<AgentSessionMemory | null>;
  abstract save(snapshot: AgentSessionMemory): Promise<void>;

  async append(
    session: AgentSessionState,
    entry: Omit<AgentMemoryEntry, 'id' | 'createdAt'> & { createdAt?: Date }
  ): Promise<AgentSessionMemory> {
    const current =
      (await this.load(session.sessionId)) ?? this.bootstrapMemory(session);
    const finalEntry: AgentMemoryEntry = {
      id: randomUUID(),
      createdAt: entry.createdAt ?? new Date(),
      ...entry,
    };
    current.memory.entries.push(finalEntry);
    await this.save(current);
    return current;
  }

  async summarize(
    _session: AgentSessionState
  ): Promise<AgentMemorySnapshot | undefined> {
    return undefined;
  }

  async prune(_session: AgentSessionState): Promise<void> {
    // noop by default
  }

  protected bootstrapMemory(session: AgentSessionState): AgentSessionMemory {
    return {
      session,
      memory: {
        entries: session.messages.map<AgentMemoryEntry>((message) => ({
          id: randomUUID(),
          createdAt: new Date(),
          type: message.role === 'assistant' ? 'assistant' : 'user',
          content: message.content
            .map((part) => ('text' in part ? part.text : ''))
            .join(''),
          metadata: message.metadata,
        })),
      },
    };
  }
}

export function trackMessageInMemory(
  manager: AgentMemoryManager | undefined,
  session: AgentSessionState,
  message: AgentMessage
) {
  if (!manager) return;
  void manager.append(session, {
    type: message.role,
    content: message.content
      .map((part) => ('text' in part ? part.text : ''))
      .join(''),
    metadata: message.metadata,
  });
}
