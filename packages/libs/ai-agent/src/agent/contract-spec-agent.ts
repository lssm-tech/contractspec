import {
  Experimental_Agent as ToolLoopAgent,
  type LanguageModel,
  stepCountIs,
  type StepResult,
  type Tool,
  type ToolSet,
} from 'ai';
import { randomUUID } from 'node:crypto';
import * as z from 'zod';
import type { KnowledgeRetriever } from '@contractspec/lib.knowledge/retriever';
import type { AgentSpec } from '../spec/spec';
import { agentKey } from '../spec/spec';
import type {
  AgentCallOptions,
  AgentGenerateParams,
  AgentGenerateResult,
  AgentStreamParams,
  ToolHandler,
} from '../types';
import { specToolsToAISDKTools } from '../tools/tool-adapter';
import { createKnowledgeQueryTool } from '../tools/knowledge-tool';
import { injectStaticKnowledge } from '../knowledge/injector';
import { type AgentSessionStore, generateSessionId } from '../session/store';
import { type TelemetryCollector, trackAgentStep } from '../telemetry/adapter';
import type {
  PostHogLLMConfig,
  PostHogTracingOptions,
} from '../telemetry/posthog-types';

/**
 * Call options schema for AI SDK v6.
 * Maps ContractSpec's tenant/actor system to AI SDK callOptionsSchema.
 */
const ContractSpecCallOptionsSchema = z.object({
  tenantId: z.string().optional(),
  actorId: z.string().optional(),
  sessionId: z.string().optional(),
  // Zod v4: z.record() requires both key and value schemas
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Type for tool with execute function (compatible with AI SDK Tool)
 */
type ExecutableTool = Tool;

/**
 * Configuration for creating a ContractSpecAgent.
 */
export interface ContractSpecAgentConfig {
  /** The agent specification */
  spec: AgentSpec;
  /** AI SDK language model */
  model: LanguageModel;
  /** Map of tool name to handler function */
  toolHandlers: Map<string, ToolHandler>;
  /** Optional knowledge retriever for RAG */
  knowledgeRetriever?: KnowledgeRetriever;
  /** Optional session store for persistence */
  sessionStore?: AgentSessionStore;
  /** Optional telemetry collector for evolution */
  telemetryCollector?: TelemetryCollector;
  /** PostHog LLM Analytics config for automatic $ai_generation event capture */
  posthogConfig?: PostHogLLMConfig & {
    /** Per-call tracing overrides (e.g., distinctId from the current user) */
    tracingOptions?: PostHogTracingOptions;
  };
  /** Additional AI SDK tools (e.g., from MCP servers) */
  additionalTools?: Record<string, ExecutableTool>;
}

/**
 * ContractSpec Agent implementation using AI SDK v6.
 *
 * Integrates ContractSpec's spec-first governance with AI SDK's
 * ToolLoopAgent, providing:
 * - Spec-defined tools with type-safe handlers
 * - Hybrid knowledge injection (static + dynamic RAG)
 * - Session persistence
 * - Telemetry for evolution
 * - MCP interoperability
 */
export class ContractSpecAgent {
  readonly version = 'agent-v1';
  readonly id: string;
  readonly spec: AgentSpec;
  readonly tools: Record<string, ExecutableTool>;

  private readonly config: ContractSpecAgentConfig;
  private instructions: string;
  private readonly activeStepContexts = new Map<
    string,
    {
      traceId: string;
      tenantId?: string;
      actorId?: string;
      stepIndex: number;
      stepStartedAt: Date;
    }
  >();

  private constructor(
    config: ContractSpecAgentConfig,
    instructions: string,
    tools: Record<string, ExecutableTool>
  ) {
    this.config = config;
    this.spec = config.spec;
    this.id = agentKey(config.spec.meta);
    this.tools = tools;
    this.instructions = instructions;
  }

  /**
   * Create a ContractSpecAgent instance.
   * This is async because knowledge injection may need to fetch static content.
   */
  static async create(
    config: ContractSpecAgentConfig
  ): Promise<ContractSpecAgent> {
    const effectiveConfig = config;

    // 1. Inject static knowledge into instructions
    const instructions = await injectStaticKnowledge(
      effectiveConfig.spec.instructions,
      effectiveConfig.spec.knowledge ?? [],
      effectiveConfig.knowledgeRetriever
    );

    // 2. Build tools from spec
    const specTools = specToolsToAISDKTools(
      effectiveConfig.spec.tools,
      effectiveConfig.toolHandlers,
      { agentId: agentKey(effectiveConfig.spec.meta) }
    );

    // 3. Add dynamic knowledge query tool
    const knowledgeTool = effectiveConfig.knowledgeRetriever
      ? createKnowledgeQueryTool(
          effectiveConfig.knowledgeRetriever,
          effectiveConfig.spec.knowledge ?? []
        )
      : null;

    // 4. Combine all tools
    const tools: Record<string, ExecutableTool> = {
      ...specTools,
      ...(knowledgeTool ? { query_knowledge: knowledgeTool } : {}),
      ...(effectiveConfig.additionalTools ?? {}),
    };

    return new ContractSpecAgent(effectiveConfig, instructions, tools);
  }

  /**
   * Generate a response (non-streaming).
   */
  async generate(params: AgentGenerateParams): Promise<AgentGenerateResult> {
    const sessionId = params.options?.sessionId ?? generateSessionId();
    const traceId =
      params.options?.metadata?.['traceId'] ??
      this.config.posthogConfig?.tracingOptions?.posthogTraceId ??
      randomUUID();
    this.activeStepContexts.set(sessionId, {
      traceId,
      tenantId: params.options?.tenantId,
      actorId: params.options?.actorId,
      stepIndex: 0,
      stepStartedAt: new Date(),
    });

    // Ensure session exists
    if (this.config.sessionStore) {
      const existing = await this.config.sessionStore.get(sessionId);
      if (!existing) {
        await this.config.sessionStore.create({
          sessionId,
          agentId: this.id,
          tenantId: params.options?.tenantId,
          actorId: params.options?.actorId,
          status: 'running',
          messages: [],
          steps: [],
          metadata: params.options?.metadata,
        });
      }
    }

    // Build prompt with optional system override
    const prompt = params.systemOverride
      ? `${this.instructions}\n\n${params.systemOverride}\n\n${params.prompt}`
      : params.prompt;

    const model = await this.resolveModelForCall({
      sessionId,
      traceId,
      options: params.options,
    });
    const inner = this.createInnerAgent(model);

    // AI SDK v6: maxSteps is controlled via stopWhen in agent settings
    const result = await inner
      .generate({
        prompt,
        abortSignal: params.signal,
        options: {
          tenantId: params.options?.tenantId,
          actorId: params.options?.actorId,
          sessionId,
          metadata: params.options?.metadata,
        },
      })
      .finally(() => {
        this.activeStepContexts.delete(sessionId);
      });

    // Update session status
    if (this.config.sessionStore) {
      await this.config.sessionStore.update(sessionId, {
        status: 'completed',
      });
    }

    return {
      text: result.text,
      steps: result.steps,
      // Map AI SDK types to our simplified types
      toolCalls: result.toolCalls.map((tc) => ({
        type: 'tool-call' as const,
        toolCallId: tc.toolCallId,
        toolName: tc.toolName,
        args: 'args' in tc ? tc.args : 'input' in tc ? tc.input : undefined,
      })),
      toolResults: result.toolResults.map((tr) => ({
        type: 'tool-result' as const,
        toolCallId: tr.toolCallId,
        toolName: tr.toolName,
        output: tr.output,
      })),
      finishReason: result.finishReason,
      usage: result.usage,
    };
  }

  /**
   * Stream a response with real-time updates.
   */
  async stream(params: AgentStreamParams) {
    const sessionId = params.options?.sessionId ?? generateSessionId();
    const traceId =
      params.options?.metadata?.['traceId'] ??
      this.config.posthogConfig?.tracingOptions?.posthogTraceId ??
      randomUUID();
    this.activeStepContexts.set(sessionId, {
      traceId,
      tenantId: params.options?.tenantId,
      actorId: params.options?.actorId,
      stepIndex: 0,
      stepStartedAt: new Date(),
    });

    const prompt = params.systemOverride
      ? `${this.instructions}\n\n${params.systemOverride}\n\n${params.prompt}`
      : params.prompt;

    const model = await this.resolveModelForCall({
      sessionId,
      traceId,
      options: params.options,
    });
    const inner = this.createInnerAgent(model);

    // AI SDK v6: maxSteps is controlled via stopWhen in agent settings
    // onStepFinish callback is already set in agent construction
    return inner.stream({
      prompt,
      abortSignal: params.signal,
      options: {
        tenantId: params.options?.tenantId,
        actorId: params.options?.actorId,
        sessionId,
        metadata: params.options?.metadata,
      },
    });
  }

  /**
   * Handle step completion for persistence and telemetry.
   */
  private async handleStepFinish(step: StepResult<ToolSet>): Promise<void> {
    // 1. Persist to session store
    const sessionId = (step as { options?: AgentCallOptions }).options
      ?.sessionId;
    if (sessionId && this.config.sessionStore) {
      await this.config.sessionStore.appendStep(sessionId, step);
    }

    // 2. Feed telemetry to evolution engine
    if (this.config.telemetryCollector) {
      const now = new Date();
      const context = sessionId
        ? this.activeStepContexts.get(sessionId)
        : undefined;
      const stepStartedAt = context?.stepStartedAt ?? now;
      const durationMs = Math.max(now.getTime() - stepStartedAt.getTime(), 0);

      if (context) {
        context.stepIndex += 1;
        context.stepStartedAt = now;
      }

      await trackAgentStep(
        this.config.telemetryCollector,
        this.id,
        step,
        durationMs,
        {
          sessionId,
          tenantId: context?.tenantId,
          actorId: context?.actorId,
          traceId: context?.traceId,
          stepIndex: context?.stepIndex,
          stepStartedAt,
        }
      );

      if (sessionId && step.finishReason !== 'tool-calls') {
        this.activeStepContexts.delete(sessionId);
      }
    }
  }

  private createInnerAgent(
    model: LanguageModel
  ): ToolLoopAgent<
    z.infer<typeof ContractSpecCallOptionsSchema>,
    ToolSet,
    never
  > {
    return new ToolLoopAgent({
      model,
      instructions: this.instructions,
      tools: this.tools as ToolSet,
      stopWhen: stepCountIs(this.spec.maxSteps ?? 10),
      callOptionsSchema: ContractSpecCallOptionsSchema,
      onStepFinish: async (step: StepResult<ToolSet>) => {
        await this.handleStepFinish(step);
      },
    });
  }

  private async resolveModelForCall(params: {
    sessionId: string;
    traceId: string;
    options?: AgentCallOptions;
  }): Promise<LanguageModel> {
    const posthogConfig = this.config.posthogConfig;
    if (!posthogConfig) {
      return this.config.model;
    }

    const mergedProperties: Record<string, unknown> = {
      ...posthogConfig.defaults?.posthogProperties,
      ...posthogConfig.tracingOptions?.posthogProperties,
      $ai_session_id: params.sessionId,
      contractspec_session_id: params.sessionId,
      contractspec_trace_id: params.traceId,
      contractspec_agent_id: this.id,
      contractspec_tenant_id: params.options?.tenantId,
      contractspec_actor_id: params.options?.actorId,
    };

    const tracingOptions: PostHogTracingOptions = {
      ...posthogConfig.tracingOptions,
      posthogDistinctId:
        posthogConfig.tracingOptions?.posthogDistinctId ??
        params.options?.actorId,
      posthogTraceId: params.traceId,
      posthogProperties: mergedProperties,
    };

    const { createPostHogTracedModel } = await import('../telemetry/posthog');
    return createPostHogTracedModel(
      this.config.model,
      posthogConfig,
      tracingOptions
    );
  }
}
