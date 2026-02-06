import {
  Experimental_Agent as ToolLoopAgent,
  type LanguageModel,
  stepCountIs,
  type StepResult,
  type Tool,
  type ToolSet,
} from 'ai';
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

  private readonly inner: ToolLoopAgent<
    z.infer<typeof ContractSpecCallOptionsSchema>,
    ToolSet,
    never
  >;
  private readonly config: ContractSpecAgentConfig;
  private instructions: string;

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

    // Create the inner ToolLoopAgent with AI SDK v6 settings
    this.inner = new ToolLoopAgent({
      model: config.model,
      instructions,
      tools: tools as ToolSet,
      // Use stopWhen instead of maxSteps (AI SDK v6 API)
      stopWhen: stepCountIs(config.spec.maxSteps ?? 10),
      // Schema for call options (tenant/actor context)
      callOptionsSchema: ContractSpecCallOptionsSchema,
      // Step-level telemetry callback
      onStepFinish: async (step: StepResult<ToolSet>) => {
        await this.handleStepFinish(step);
      },
    });
  }

  /**
   * Create a ContractSpecAgent instance.
   * This is async because knowledge injection may need to fetch static content.
   */
  static async create(
    config: ContractSpecAgentConfig
  ): Promise<ContractSpecAgent> {
    // 1. Inject static knowledge into instructions
    const instructions = await injectStaticKnowledge(
      config.spec.instructions,
      config.spec.knowledge ?? [],
      config.knowledgeRetriever
    );

    // 2. Build tools from spec
    const specTools = specToolsToAISDKTools(
      config.spec.tools,
      config.toolHandlers,
      { agentId: agentKey(config.spec.meta) }
    );

    // 3. Add dynamic knowledge query tool
    const knowledgeTool = config.knowledgeRetriever
      ? createKnowledgeQueryTool(
          config.knowledgeRetriever,
          config.spec.knowledge ?? []
        )
      : null;

    // 4. Combine all tools
    const tools: Record<string, ExecutableTool> = {
      ...specTools,
      ...(knowledgeTool ? { query_knowledge: knowledgeTool } : {}),
      ...(config.additionalTools ?? {}),
    };

    return new ContractSpecAgent(config, instructions, tools);
  }

  /**
   * Generate a response (non-streaming).
   */
  async generate(params: AgentGenerateParams): Promise<AgentGenerateResult> {
    const sessionId = params.options?.sessionId ?? generateSessionId();

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

    // AI SDK v6: maxSteps is controlled via stopWhen in agent settings
    const result = await this.inner.generate({
      prompt,
      abortSignal: params.signal,
      options: {
        tenantId: params.options?.tenantId,
        actorId: params.options?.actorId,
        sessionId,
        metadata: params.options?.metadata,
      },
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

    const prompt = params.systemOverride
      ? `${this.instructions}\n\n${params.systemOverride}\n\n${params.prompt}`
      : params.prompt;

    // AI SDK v6: maxSteps is controlled via stopWhen in agent settings
    // onStepFinish callback is already set in agent construction
    return this.inner.stream({
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
      await trackAgentStep(this.config.telemetryCollector, this.id, step);
    }
  }
}
