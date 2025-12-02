import type { CoreMessage, StepResult, LanguageModelUsage, ToolSet } from 'ai';

// ============================================================================
// Tool Call/Result Types (simplified from AI SDK v6)
// ============================================================================

/**
 * Simplified tool call type for ContractSpec usage.
 * Compatible with AI SDK v6 TypedToolCall.
 */
export interface ToolCallInfo {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
}

/**
 * Simplified tool result type for ContractSpec usage.
 * Compatible with AI SDK v6 TypedToolResult.
 */
export interface ToolResultInfo {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  output: unknown;
}

// ============================================================================
// Agent Message (CoreMessage with metadata extension)
// ============================================================================

/**
 * Extended message type that adds metadata support to CoreMessage.
 * Used for session memory tracking.
 */
export interface AgentMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | { type: string; text?: string; [key: string]: unknown }[];
  metadata?: Record<string, string>;
}

// ============================================================================
// Agent Status & Events
// ============================================================================

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
  | 'agent.step.started'
  | 'agent.step.completed'
  | 'agent.tool.called'
  | 'agent.tool.completed'
  | 'agent.tool.failed'
  | 'agent.tool.approval_requested'
  | 'agent.escalated'
  | 'agent.completed'
  | 'agent.failed';

export interface AgentEventPayload {
  sessionId: string;
  agentId: string;
  tenantId?: string;
  stepIndex?: number;
  toolName?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Call Options (AI SDK v6 callOptionsSchema integration)
// ============================================================================

/**
 * Runtime context passed to agent calls via AI SDK v6 callOptionsSchema.
 * Maps to ContractSpec's tenant/actor system.
 */
export interface AgentCallOptions {
  /** Tenant scoping for guardrails and data isolation */
  tenantId?: string;
  /** Unique end-user identifier (for personalization) */
  actorId?: string;
  /** Session to resume; new session created when omitted */
  sessionId?: string;
  /** Arbitrary metadata forwarded to events and tool handlers */
  metadata?: Record<string, string>;
}

// ============================================================================
// Session Management
// ============================================================================

export interface AgentSessionState {
  sessionId: string;
  agentId: string;
  tenantId?: string;
  actorId?: string;
  status: AgentStatus;
  messages: CoreMessage[];
  steps: StepResult<ToolSet>[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, string>;
}

// ============================================================================
// Agent Generation Parameters
// ============================================================================

export interface AgentGenerateParams {
  /** User prompt or message */
  prompt: string;
  /** System prompt override (appended to agent instructions) */
  systemOverride?: string;
  /** Runtime context options */
  options?: AgentCallOptions;
  /** Maximum number of steps/iterations */
  maxSteps?: number;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

export interface AgentStreamParams extends AgentGenerateParams {
  /** Called when a step completes */
  onStepFinish?: (step: StepResult<ToolSet>) => void | Promise<void>;
}

// ============================================================================
// Agent Results
// ============================================================================

export interface AgentGenerateResult<TOutput = string> {
  /** The final text response */
  text: string;
  /** Structured output if configured */
  output?: TOutput;
  /** All steps taken during generation */
  steps: StepResult<ToolSet>[];
  /** All tool calls made during generation */
  toolCalls: ToolCallInfo[];
  /** All tool results */
  toolResults: ToolResultInfo[];
  /** Reason generation finished */
  finishReason:
    | 'stop'
    | 'tool-calls'
    | 'length'
    | 'content-filter'
    | 'error'
    | 'other'
    | 'unknown';
  /** Token usage statistics */
  usage?: LanguageModelUsage;
  /** Updated session state */
  session?: AgentSessionState;
  /** Whether approval is pending for a tool call */
  pendingApproval?: {
    toolName: string;
    toolCallId: string;
    args: unknown;
  };
}

// ============================================================================
// Tool Types (AI SDK aligned)
// ============================================================================

/**
 * Context provided to tool handlers during execution.
 */
export interface ToolExecutionContext {
  agentId: string;
  sessionId: string;
  tenantId?: string;
  actorId?: string;
  metadata?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * Handler function for a tool.
 */
export type ToolHandler<TInput = unknown, TOutput = string> = (
  input: TInput,
  context: ToolExecutionContext
) => Promise<TOutput>;

// ============================================================================
// Telemetry Types (for Evolution integration)
// ============================================================================

export interface AgentStepMetrics {
  agentId: string;
  stepIndex: number;
  toolCalls: {
    toolName: string;
    durationMs?: number;
    success: boolean;
    error?: string;
  }[];
  finishReason: string;
  usage?: LanguageModelUsage;
  timestamp: Date;
}

// ============================================================================
// Event Emitter
// ============================================================================

export type AgentEventEmitter = (
  event: AgentEventName,
  payload: AgentEventPayload
) => void | Promise<void>;

// ============================================================================
// Legacy Compatibility Types (for migration)
// ============================================================================

/** @deprecated Use AgentGenerateParams instead */
export interface AgentRunRequestInput {
  agent: string;
  version?: number;
  input: string;
  tenantId?: string;
  actorId?: string;
  sessionId?: string;
  metadata?: Record<string, string>;
  instructionsOverride?: string;
}

/** @deprecated Use AgentGenerateResult instead */
export interface AgentRunResult {
  session: AgentSessionState;
  outputText: string;
  confidence: number;
  iterations: number;
  requiresEscalation: boolean;
  approvalRequestId?: string;
  finishReason: string;
  toolInvocations: AgentToolInvocation[];
}

/** @deprecated Use ToolCallInfo instead */
export interface AgentToolInvocation {
  name: string;
  arguments: unknown;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  success: boolean;
  error?: string;
}

/** @deprecated Use ToolExecutionContext instead */
export interface AgentToolContext {
  session: AgentSessionState;
  tenantId?: string;
  actorId?: string;
  metadata?: Record<string, string>;
  emit: (event: AgentEventName, payload: AgentEventPayload) => void;
}

/** @deprecated Use ToolHandler instead */
export interface AgentToolResult {
  content: string;
  citations?: { label: string; url?: string; snippet?: string }[];
  metadata?: Record<string, string>;
}
