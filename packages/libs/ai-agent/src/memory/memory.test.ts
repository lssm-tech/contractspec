import { describe, it, expect, beforeEach } from 'bun:test';
import { InMemoryAgentMemory } from './in-memory';
import type { AgentSessionMemory } from './manager';

describe('InMemoryAgentMemory', () => {
  let memory: InMemoryAgentMemory;

  beforeEach(() => {
    memory = new InMemoryAgentMemory({ ttlMinutes: 60 });
  });

  it('should save and load session', async () => {
    const sessionData: AgentSessionMemory = {
      session: {
        sessionId: 'session-1',
        agentId: 'agent-1',
        status: 'running',
        messages: [],
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      memory: {
        entries: [],
        summary: '',
        lastSummarizedAt: new Date(),
      },
    };

    await memory.save(sessionData);
    const loaded = await memory.load('session-1');

    expect(loaded).toEqual(sessionData);
  });

  it('should return null for non-existent session', async () => {
    const loaded = await memory.load('non-existent');
    expect(loaded).toBeNull();
  });

  it('should evict expired sessions', async () => {
    const shortLivedMemory = new InMemoryAgentMemory({ ttlMinutes: -1 }); // Already expired
    const sessionData: AgentSessionMemory = {
      session: {
        sessionId: 'session-1',
        agentId: 'agent-1',
        status: 'running',
        messages: [],
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      memory: {
        entries: [],
        summary: '',
        lastSummarizedAt: new Date(),
      },
    };

    await shortLivedMemory.save(sessionData);
    // On load, it triggers eviction
    const loaded = await shortLivedMemory.load('session-1');
    expect(loaded).toBeNull();
  });
});
