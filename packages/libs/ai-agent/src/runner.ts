import { randomUUID } from 'node:crypto';
import type {
  LLMMessage,
  LLMProvider,
  LLMResponse,
  LLMToolCallPart,
} from '@lssm/lib.contracts/integrations/providers/llm';
import type { AgentSpec, AgentRegistry } from './spec';
import type {
  AgentEventName,
  AgentEventPayload,
  AgentMessage,
  AgentRunRequestInput,
  AgentRunResult,
  AgentSessionState,
  AgentToolInvocation,
  AgentRunnerEventEmitter,
} from './types';
import { ToolExecutor } from './tools/executor';
import type { AgentMemoryManager } from './memory/manager';
import { trackMessageInMemory } from './memory/manager';
import type { ApprovalWorkflow } from './approval';

interface AgentSessionStore {
  get(sessionId: string): Promise<AgentSessionState | null>;
  save(session: AgentSessionState): Promise<void>;
}

class InMemoryAgentSessionStore implements AgentSessionStore {
  private readonly store = new Map<string, AgentSessionState>();

  async get(sessionId: string): Promise<AgentSessionState | null> {
    return this.store.get(sessionId) ?? null;
  }

  async save(session: AgentSessionState): Promise<void> {
    this.store.set(session.sessionId, { ...session });
  }
}

export interface AgentRunnerConfig {
  registry: AgentRegistry;
  llm: LLMProvider;
  toolExecutor: ToolExecutor;
  memoryManager?: AgentMemoryManager;
  sessionStore?: AgentSessionStore;
  eventEmitter?: AgentRunnerEventEmitter;
  maxIterations?: number;
  defaultSystemPrompt?: string;
  approvalWorkflow?: ApprovalWorkflow;
}

export class AgentRunner {
  private readonly registry: AgentRegistry;
  private readonly llm: LLMProvider;
  private readonly toolExecutor: ToolExecutor;
  private readonly memoryManager?: AgentMemoryManager;
  private readonly sessionStore: AgentSessionStore;
  private readonly eventEmitter?: AgentRunnerEventEmitter;
  private readonly maxIterations: number;
  private readonly defaultSystemPrompt: string;
  private readonly approvalWorkflow?: ApprovalWorkflow;

  constructor(config: AgentRunnerConfig) {
    this.registry = config.registry;
    this.llm = config.llm;
    this.toolExecutor = config.toolExecutor;
    this.memoryManager = config.memoryManager;
    this.sessionStore = config.sessionStore ?? new InMemoryAgentSessionStore();
    this.eventEmitter = config.eventEmitter;
    this.maxIterations = config.maxIterations ?? 6;
    this.defaultSystemPrompt =
      config.defaultSystemPrompt ??
      'You are a ContractSpec agent. Follow policies, cite sources, and escalate when unsure.';
    this.approvalWorkflow = config.approvalWorkflow;
  }

  async run(request: AgentRunRequestInput): Promise<AgentRunResult> {
    const spec = this.registry.require(request.agent, request.version);
    this.ensureTools(spec);
    const session = await this.loadSession(spec, request);
    this.appendUserMessage(session, request);
    await this.persistSession(session);

    const toolInvocations: AgentToolInvocation[] = [];
    let response: LLMResponse | null = null;
    let approvalRequestId: string | undefined;

    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      await this.emit('agent.iteration.started', {
        sessionId: session.sessionId,
        agent: spec.meta.name,
        iteration: iteration + 1,
        tenantId: request.tenantId,
      });

      response = await this.llm.chat(
        this.buildMessages(spec, session, request),
        {
          tools: this.toolExecutor.listLLMTools(
            spec.tools.map((tool) => tool.name)
          ),
          metadata: {
            agent: spec.meta.name,
            tenantId: request.tenantId ?? '',
          },
          userId: request.actorId,
        }
      );

      const assistantMessage = response.message as AgentMessage;
      session.messages.push(assistantMessage);
      session.iterations += 1;
      session.updatedAt = new Date();
      trackMessageInMemory(this.memoryManager, session, assistantMessage);
      await this.persistSession(session);

      const toolCalls = extractToolCalls(assistantMessage);
      if (toolCalls.length > 0) {
        for (const call of toolCalls) {
          const args = safeParse(call.arguments);
          const { invocation, result } = await this.toolExecutor.execute(
            call.name,
            args,
            {
              session,
              tenantId: request.tenantId,
              actorId: request.actorId,
              metadata: request.metadata,
              emit: (event, payload) => this.emit(event, payload),
            }
          );
          toolInvocations.push(invocation);
          const toolMessage: AgentMessage = {
            role: 'tool',
            name: call.name,
            toolCallId: call.id,
            content: [
              {
                type: 'tool-result',
                toolCallId: call.id,
                output: JSON.stringify(result ?? {}),
              },
            ],
          } as LLMMessage;
          session.messages.push(toolMessage);
          trackMessageInMemory(this.memoryManager, session, toolMessage);
          await this.persistSession(session);
          await this.emit('agent.tool.completed', {
            sessionId: session.sessionId,
            agent: spec.meta.name,
            toolName: call.name,
            tenantId: request.tenantId,
          });
        }
        continue;
      }

      const outputText = getAssistantText(assistantMessage);
      const confidence = deriveConfidence(
        assistantMessage,
        spec.policy?.confidence
      );
      const requiresEscalation = shouldEscalate(confidence, spec);
      session.status = requiresEscalation ? 'escalated' : 'completed';
      session.lastConfidence = confidence;
      await this.persistSession(session);
      if (requiresEscalation && this.approvalWorkflow) {
        const approval = await this.approvalWorkflow.requestApproval(
          session,
          'Low confidence response',
          {
            confidence,
            outputText,
          }
        );
        approvalRequestId = approval.id;
        await this.emit('agent.approval_requested', {
          sessionId: session.sessionId,
          agent: spec.meta.name,
          tenantId: request.tenantId,
          metadata: { approvalId: approval.id },
        });
      }
      await this.emit(
        requiresEscalation ? 'agent.escalated' : 'agent.completed',
        {
          sessionId: session.sessionId,
          agent: spec.meta.name,
          tenantId: request.tenantId,
          metadata: {
            confidence,
            finishReason: response.finishReason ?? 'stop',
          },
        }
      );

      return {
        session,
        response,
        outputText,
        confidence,
        iterations: session.iterations,
        requiresEscalation,
        approvalRequestId,
        finishReason: response.finishReason ?? 'stop',
        toolInvocations,
      };
    }

    session.status = 'failed';
    await this.persistSession(session);
    await this.emit('agent.failed', {
      sessionId: session.sessionId,
      agent: spec.meta.name,
      tenantId: request.tenantId,
      metadata: { reason: 'max_iterations' },
    });

    return {
      session,
      response:
        response ??
        ({
          message: { role: 'assistant', content: [{ type: 'text', text: '' }] },
        } as LLMResponse),
      outputText: response
        ? getAssistantText(response.message as AgentMessage)
        : '',
      confidence: session.lastConfidence ?? 0,
      iterations: session.iterations,
      requiresEscalation: true,
      approvalRequestId,
      finishReason: 'max_iterations',
      toolInvocations,
    };
  }

  private async loadSession(
    spec: AgentSpec,
    request: AgentRunRequestInput
  ): Promise<AgentSessionState> {
    if (request.sessionId) {
      const existing = await this.sessionStore.get(request.sessionId);
      if (existing) return existing;
    }
    const now = new Date();
    const session: AgentSessionState = {
      sessionId: request.sessionId ?? randomUUID(),
      agent: spec.meta.name,
      version: spec.meta.version,
      tenantId: request.tenantId,
      status: 'running',
      messages: [],
      createdAt: now,
      updatedAt: now,
      iterations: 0,
      metadata: request.metadata,
    };
    await this.emit('agent.session.created', {
      sessionId: session.sessionId,
      agent: spec.meta.name,
      tenantId: request.tenantId,
    });
    return session;
  }

  private appendUserMessage(
    session: AgentSessionState,
    request: AgentRunRequestInput
  ) {
    const userMessage: AgentMessage = {
      role: 'user',
      content: [{ type: 'text', text: request.input }],
      metadata: request.metadata,
    } as LLMMessage;
    session.messages.push(userMessage);
    trackMessageInMemory(this.memoryManager, session, userMessage);
  }

  private buildMessages(
    spec: AgentSpec,
    session: AgentSessionState,
    request: AgentRunRequestInput
  ): AgentMessage[] {
    const systemPrompt = [
      this.defaultSystemPrompt,
      spec.instructions,
      request.instructionsOverride,
      this.renderKnowledgeInstructions(spec),
    ]
      .filter(Boolean)
      .join('\n\n');

    const systemMessage: AgentMessage = {
      role: 'system',
      content: [{ type: 'text', text: systemPrompt }],
    } as LLMMessage;

    return [systemMessage, ...session.messages];
  }

  private renderKnowledgeInstructions(spec: AgentSpec): string {
    if (!spec.knowledge?.length) return '';
    const bullets = spec.knowledge
      .map((binding) => {
        const category = binding.category ?? 'unspecified';
        const instruction = binding.instructions
          ? ` Guidance: ${binding.instructions}`
          : '';
        return `- ${binding.key} (category: ${category})${instruction}`;
      })
      .join('\n');
    return `Knowledge spaces available:\n${bullets}`;
  }

  private async persistSession(session: AgentSessionState) {
    session.updatedAt = new Date();
    await this.sessionStore.save(session);
    await this.emit('agent.session.updated', {
      sessionId: session.sessionId,
      agent: session.agent,
      tenantId: session.tenantId,
      metadata: { status: session.status },
    });
  }

  private async emit(event: AgentEventName, payload: AgentEventPayload) {
    await this.eventEmitter?.(event, payload);
  }

  private ensureTools(spec: AgentSpec) {
    for (const tool of spec.tools) {
      if (!this.toolExecutor.has(tool.name)) {
        throw new Error(
          `Agent ${spec.meta.name} requires tool "${tool.name}" but it is not registered.`
        );
      }
    }
  }
}

function extractToolCalls(message: AgentMessage): LLMToolCallPart[] {
  return message.content.filter(
    (part): part is LLMToolCallPart => part.type === 'tool-call'
  );
}

function safeParse(payload?: string): unknown {
  if (!payload) return {};
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

function getAssistantText(message: AgentMessage): string {
  return message.content
    .map((part) => ('text' in part ? part.text : ''))
    .join('')
    .trim();
}

function deriveConfidence(
  message: AgentMessage,
  config?: { min?: number; default?: number }
): number {
  const raw = message.metadata?.confidence ?? message.metadata?.Confidence;
  const parsed = raw ? Number.parseFloat(raw) : NaN;
  if (!Number.isNaN(parsed)) return Math.max(0, Math.min(1, parsed));
  return config?.default ?? 0.5;
}

function shouldEscalate(confidence: number, spec: AgentSpec): boolean {
  const min = spec.policy?.confidence?.min ?? 0.7;
  const threshold = spec.policy?.escalation?.confidenceThreshold ?? min;
  return confidence < threshold;
}
