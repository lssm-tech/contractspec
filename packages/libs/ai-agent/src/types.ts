import type {
  LLMMessage,
  LLMResponse,
  LLMToolDefinition,
} from '@lssm/lib.contracts/integrations/providers/llm';

export type AgentStatus =
  | 'idle'
  | 'running'
  | 'waiting'
  | 'completed'
  | 'failed'
  | 'escalated';

export type AgentEventName =
  | 'agent.session.created'
  | 'agent.session.updated'
  | 'agent.iteration.started'
  | 'agent.iteration.completed'
  | 'agent.tool.called'
  | 'agent.tool.completed'
  | 'agent.tool.failed'
  | 'agent.escalated'
  | 'agent.approval_requested'
  | 'agent.approval_resolved'
  | 'agent.completed'
  | 'agent.failed';

export interface AgentEventPayload {
  sessionId: string;
  agent: string;
  tenantId?: string;
  iteration?: number;
  toolName?: string;
  metadata?: Record<string, unknown>;
}

export type AgentMessageMetadata = Record<string, string>;

export interface AgentMessage extends Omit<LLMMessage, 'metadata'> {
  metadata?: AgentMessageMetadata;
}

export interface AgentSessionState {
  sessionId: string;
  agent: string;
  version: number;
  tenantId?: string;
  status: AgentStatus;
  messages: AgentMessage[];
  createdAt: Date;
  updatedAt: Date;
  iterations: number;
  lastConfidence?: number;
  lastToolName?: string;
  metadata?: Record<string, string>;
}

export interface AgentRunRequestInput {
  /** Agent name, e.g. `support.bot`. */
  agent: string;
  /** Optional version. Defaults to latest registered version. */
  version?: number;
  /** User-provided input or ticket description. */
  input: string;
  /** Tenant scoping for guardrails. */
  tenantId?: string;
  /** Unique end-user identifier (for personalization). */
  actorId?: string;
  /** Session to resume; new session created when omitted. */
  sessionId?: string;
  /** Arbitrary metadata forwarded to events and tool handlers. */
  metadata?: Record<string, string>;
  /** Optional additional system instructions appended to the agent spec. */
  instructionsOverride?: string;
}

export interface AgentRunResult {
  session: AgentSessionState;
  response: LLMResponse;
  outputText: string;
  confidence: number;
  iterations: number;
  requiresEscalation: boolean;
  approvalRequestId?: string;
  finishReason:
    | 'stop'
    | 'tool_call'
    | 'timeout'
    | 'max_iterations'
    | 'length'
    | 'content_filter';
  toolInvocations: AgentToolInvocation[];
}

export interface AgentToolInvocation {
  name: string;
  arguments: unknown;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  success: boolean;
  error?: string;
}

export interface AgentToolContext {
  session: AgentSessionState;
  tenantId?: string;
  actorId?: string;
  metadata?: Record<string, string>;
  emit: (event: AgentEventName, payload: AgentEventPayload) => void;
}

export interface AgentToolResult {
  content: string;
  citations?: { label: string; url?: string; snippet?: string }[];
  metadata?: Record<string, string>;
}

export interface AgentToolDefinitionWithHandler {
  definition: LLMToolDefinition;
  timeoutMs?: number;
  requiresApproval?: boolean;
  allowedAgents?: string[];
  handler: (input: unknown, ctx: AgentToolContext) => Promise<AgentToolResult>;
}

export type AgentRunnerEventEmitter = (
  event: AgentEventName,
  payload: AgentEventPayload
) => void | Promise<void>;
