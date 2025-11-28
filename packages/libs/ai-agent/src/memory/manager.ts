import { randomUUID } from 'node:crypto';
import type { CoreMessage } from 'ai';
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

/**
 * Extract text content from a CoreMessage.
 * Handles both string content and array content parts.
 */
function extractMessageContent(message: CoreMessage): string {
  const content = message.content;

  // Handle string content directly
  if (typeof content === 'string') {
    return content;
  }

  // Handle array content (parts)
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if ('text' in part && typeof part.text === 'string') return part.text;
        return '';
      })
      .filter(Boolean)
      .join('');
  }

  return '';
}

/**
 * Extract text content from an AgentMessage.
 */
function extractAgentMessageContent(message: AgentMessage): string {
  const content = message.content;

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if ('text' in part && typeof part.text === 'string') return part.text;
        return '';
      })
      .filter(Boolean)
      .join('');
  }

  return '';
}

/**
 * Map CoreMessage role to memory entry type.
 */
function roleToEntryType(
  role: CoreMessage['role']
): 'user' | 'assistant' | 'tool' | 'system' {
  switch (role) {
    case 'assistant':
      return 'assistant';
    case 'system':
      return 'system';
    case 'tool':
      return 'tool';
    case 'user':
    default:
      return 'user';
  }
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
          type: roleToEntryType(message.role),
          content: extractMessageContent(message),
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
    content: extractAgentMessageContent(message),
    metadata: message.metadata,
  });
}
