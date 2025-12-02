import type { ModelMessage, StepResult, ToolSet } from 'ai';
import type { AgentSessionState } from '../types';

/**
 * Interface for persisting agent session state.
 *
 * Implementations can use in-memory storage, databases,
 * or external services like Redis.
 */
export interface AgentSessionStore {
  /**
   * Get a session by ID.
   */
  get(sessionId: string): Promise<AgentSessionState | null>;

  /**
   * Create a new session.
   */
  create(
    session: Omit<AgentSessionState, 'createdAt' | 'updatedAt'>
  ): Promise<AgentSessionState>;

  /**
   * Append a step to a session.
   */
  appendStep(sessionId: string, step: StepResult<ToolSet>): Promise<void>;

  /**
   * Append a message to a session.
   */
  appendMessage(sessionId: string, message: ModelMessage): Promise<void>;

  /**
   * Update session properties.
   */
  update(
    sessionId: string,
    updates: Partial<Pick<AgentSessionState, 'status' | 'metadata'>>
  ): Promise<void>;

  /**
   * Delete a session.
   */
  delete(sessionId: string): Promise<boolean>;

  /**
   * List sessions by agent ID.
   */
  listByAgent(agentId: string, limit?: number): Promise<AgentSessionState[]>;

  /**
   * List sessions by tenant ID.
   */
  listByTenant(tenantId: string, limit?: number): Promise<AgentSessionState[]>;
}

/**
 * In-memory session store for development and testing.
 */
export class InMemorySessionStore implements AgentSessionStore {
  private readonly sessions = new Map<string, AgentSessionState>();

  async get(sessionId: string): Promise<AgentSessionState | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  async create(
    session: Omit<AgentSessionState, 'createdAt' | 'updatedAt'>
  ): Promise<AgentSessionState> {
    const now = new Date();
    const fullSession: AgentSessionState = {
      ...session,
      createdAt: now,
      updatedAt: now,
    };
    this.sessions.set(session.sessionId, fullSession);
    return fullSession;
  }

  async appendStep(
    sessionId: string,
    step: StepResult<ToolSet>
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.steps.push(step);
      session.updatedAt = new Date();
    }
  }

  async appendMessage(sessionId: string, message: ModelMessage): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = new Date();
    }
  }

  async update(
    sessionId: string,
    updates: Partial<Pick<AgentSessionState, 'status' | 'metadata'>>
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates, { updatedAt: new Date() });
    }
  }

  async delete(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }

  async listByAgent(
    agentId: string,
    limit = 100
  ): Promise<AgentSessionState[]> {
    const results: AgentSessionState[] = [];
    for (const session of this.sessions.values()) {
      if (session.agentId === agentId) {
        results.push(session);
        if (results.length >= limit) break;
      }
    }
    return results.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  async listByTenant(
    tenantId: string,
    limit = 100
  ): Promise<AgentSessionState[]> {
    const results: AgentSessionState[] = [];
    for (const session of this.sessions.values()) {
      if (session.tenantId === tenantId) {
        results.push(session);
        if (results.length >= limit) break;
      }
    }
    return results.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /**
   * Clear all sessions (for testing).
   */
  clear(): void {
    this.sessions.clear();
  }
}

/**
 * Create an in-memory session store.
 */
export function createInMemorySessionStore(): AgentSessionStore {
  return new InMemorySessionStore();
}

/**
 * Generate a unique session ID.
 */
export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
