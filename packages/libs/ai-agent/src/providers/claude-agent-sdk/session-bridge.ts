/**
 * Session bridge for mapping between ContractSpec and Claude Agent SDK sessions.
 *
 * Handles session state synchronization, message history conversion,
 * and context preservation across the two systems.
 */
import type { AgentSessionState } from '../../types';
import type { AgentCallOptions } from '../../types';

// =============================================================================
// Claude Agent SDK Session Types
// =============================================================================

/**
 * Claude Agent SDK content block (text or tool use).
 */
export interface ClaudeAgentContentBlock {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  id?: string;
  name?: string;
  input?: unknown;
  tool_use_id?: string;
  content?: string | ClaudeAgentContentBlock[];
  is_error?: boolean;
}

/**
 * Claude Agent SDK message format.
 */
export interface ClaudeAgentMessage {
  role: 'user' | 'assistant';
  content: string | ClaudeAgentContentBlock[];
}

/**
 * Claude Agent SDK session state.
 */
export interface ClaudeAgentSession {
  sessionId?: string;
  messages: ClaudeAgentMessage[];
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Session Conversion
// =============================================================================

/**
 * Claude Agent SDK session state (alias).
 */
export type ClaudeAgentSessionState = ClaudeAgentSession;

/**
 * Convert ContractSpec session to Claude Agent SDK session.
 */
export function toClaudeAgentSession(
  state: AgentSessionState
): ClaudeAgentSession {
  const messages: ClaudeAgentMessage[] = [];

  for (const msg of state.messages) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      const content =
        typeof msg.content === 'string'
          ? msg.content
          : JSON.stringify(msg.content);
      messages.push({
        role: msg.role,
        content,
      });
    }
  }

  return {
    sessionId: state.sessionId,
    messages,
    metadata: {
      agentId: state.agentId,
      tenantId: state.tenantId,
      actorId: state.actorId,
    },
  };
}

/**
 * Create a new Claude Agent session from call options.
 */
export function createClaudeAgentSession(
  options?: AgentCallOptions
): ClaudeAgentSession {
  return {
    sessionId: options?.sessionId,
    messages: [],
    metadata: {
      tenantId: options?.tenantId,
      actorId: options?.actorId,
      ...options?.metadata,
    },
  };
}

/**
 * Create an empty Claude Agent session.
 */
export function createEmptyClaudeSession(): ClaudeAgentSession {
  return createClaudeAgentSession();
}

/**
 * Build Claude Agent context metadata from call options.
 */
export function buildClaudeAgentContext(
  options?: AgentCallOptions
): Record<string, unknown> {
  return {
    tenantId: options?.tenantId,
    actorId: options?.actorId,
    sessionId: options?.sessionId,
    ...options?.metadata,
  };
}

/**
 * Append a user message to the session.
 */
export function appendUserMessage(
  session: ClaudeAgentSession,
  content: string
): ClaudeAgentSession {
  return {
    ...session,
    messages: [...session.messages, { role: 'user', content }],
  };
}

/**
 * Append an assistant message to the session.
 */
export function appendAssistantMessage(
  session: ClaudeAgentSession,
  content: string | ClaudeAgentContentBlock[]
): ClaudeAgentSession {
  return {
    ...session,
    messages: [...session.messages, { role: 'assistant', content }],
  };
}

/**
 * Clear the session history.
 */
export function clearSession(session: ClaudeAgentSession): ClaudeAgentSession {
  return {
    ...session,
    messages: [],
  };
}

/**
 * Get the last N messages from the session.
 */
export function getRecentMessages(
  session: ClaudeAgentSession,
  count: number
): ClaudeAgentMessage[] {
  return session.messages.slice(-count);
}

/**
 * Extract tool calls from a message content.
 */
export function extractToolUseBlocks(
  content: string | ClaudeAgentContentBlock[]
): ClaudeAgentContentBlock[] {
  if (typeof content === 'string') {
    return [];
  }
  return content.filter((block) => block.type === 'tool_use');
}

/**
 * Create a tool result block.
 */
export function createToolResultBlock(
  toolUseId: string,
  result: unknown,
  isError = false
): ClaudeAgentContentBlock {
  return {
    type: 'tool_result',
    tool_use_id: toolUseId,
    content: typeof result === 'string' ? result : JSON.stringify(result),
    is_error: isError,
  };
}

// =============================================================================
// Session Metadata
// =============================================================================

/**
 * Update session metadata.
 */
export function updateSessionMetadata(
  session: ClaudeAgentSession,
  metadata: Record<string, unknown>
): ClaudeAgentSession {
  return {
    ...session,
    metadata: {
      ...session.metadata,
      ...metadata,
    },
  };
}

/**
 * Get session message count.
 */
export function getMessageCount(session: ClaudeAgentSession): number {
  return session.messages.length;
}

/**
 * Get the total token estimate for the session.
 * This is a rough estimate based on character count.
 */
export function estimateTokens(session: ClaudeAgentSession): number {
  let chars = 0;
  for (const msg of session.messages) {
    if (typeof msg.content === 'string') {
      chars += msg.content.length;
    } else {
      chars += JSON.stringify(msg.content).length;
    }
  }
  // Rough estimate: ~4 chars per token
  return Math.ceil(chars / 4);
}

/**
 * Summarize the session for logging.
 */
export function summarizeSession(session: ClaudeAgentSession): {
  messageCount: number;
  userMessages: number;
  assistantMessages: number;
  estimatedTokens: number;
} {
  let userMessages = 0;
  let assistantMessages = 0;

  for (const msg of session.messages) {
    if (msg.role === 'user') {
      userMessages++;
    } else {
      assistantMessages++;
    }
  }

  return {
    messageCount: session.messages.length,
    userMessages,
    assistantMessages,
    estimatedTokens: estimateTokens(session),
  };
}
