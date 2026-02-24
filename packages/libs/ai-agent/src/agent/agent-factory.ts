import type { LanguageModel, Tool } from 'ai';
import type { KnowledgeRetriever } from '@contractspec/lib.knowledge/retriever';
import type { AgentSpec } from '../spec/spec';
import type { AgentRegistry } from '../spec/registry';
import type { ToolHandler } from '../types';
import type { McpClientConfig } from '../tools/mcp-client';
import type { AgentSessionStore } from '../session/store';
import type { TelemetryCollector } from '../telemetry/adapter';
import type {
  PostHogLLMConfig,
  PostHogTracingOptions,
} from '../telemetry/posthog-types';
import { ContractSpecAgent } from './contract-spec-agent';

/**
 * Factory configuration for creating agents.
 */
export interface AgentFactoryConfig {
  /** Default language model to use */
  defaultModel: LanguageModel;
  /** Agent registry for looking up specs */
  registry: AgentRegistry;
  /** Global tool handlers map */
  toolHandlers: Map<string, ToolHandler>;
  /** Optional knowledge retriever */
  knowledgeRetriever?: KnowledgeRetriever;
  /** Optional session store */
  sessionStore?: AgentSessionStore;
  /** Optional telemetry collector */
  telemetryCollector?: TelemetryCollector;
  /** PostHog LLM Analytics config for automatic $ai_generation event capture */
  posthogConfig?: PostHogLLMConfig & {
    tracingOptions?: PostHogTracingOptions;
  };
  /** Additional tools to provide to all agents */
  additionalTools?: Record<string, Tool<unknown, unknown>>;
  /** MCP servers to provide to all agents */
  mcpServers?: McpClientConfig[];
}

/**
 * Options for creating an agent instance.
 */
export interface CreateAgentOptions {
  /** Override the default model */
  model?: LanguageModel;
  /** Additional tool handlers specific to this instance */
  toolHandlers?: Map<string, ToolHandler>;
  /** Additional tools for this instance */
  additionalTools?: Record<string, Tool<unknown, unknown>>;
  /** MCP servers for this instance */
  mcpServers?: McpClientConfig[];
}

/**
 * Factory for creating ContractSpec agents from specs.
 *
 * Provides a centralized way to instantiate agents with
 * consistent configuration.
 *
 * @example
 * ```typescript
 * const factory = createAgentFactory({
 *   defaultModel: mistral('mistral-large-latest'),
 *   registry: agentRegistry,
 *   toolHandlers: globalToolHandlers,
 *   sessionStore: mySessionStore,
 * });
 *
 * const agent = await factory.create('support.bot');
 * const result = await agent.generate({ prompt: 'Help me with...' });
 * ```
 */
export class AgentFactory {
  private readonly config: AgentFactoryConfig;
  private readonly cache = new Map<string, ContractSpecAgent>();

  constructor(config: AgentFactoryConfig) {
    this.config = config;
  }

  /**
   * Create an agent by name.
   *
   * @param name - Agent name (e.g., "support.bot")
   * @param version - Optional specific version
   * @param options - Optional creation options
   */
  async create(
    name: string,
    version?: string,
    options?: CreateAgentOptions
  ): Promise<ContractSpecAgent> {
    const spec = this.config.registry.require(name, version);
    return this.createFromSpec(spec, options);
  }

  /**
   * Create an agent from a spec directly.
   *
   * @param spec - Agent specification
   * @param options - Optional creation options
   */
  async createFromSpec(
    spec: AgentSpec,
    options?: CreateAgentOptions
  ): Promise<ContractSpecAgent> {
    // Merge tool handlers
    const mergedHandlers = new Map<string, ToolHandler>(
      this.config.toolHandlers
    );
    if (options?.toolHandlers) {
      for (const [key, handler] of options.toolHandlers) {
        mergedHandlers.set(key, handler);
      }
    }

    // Merge additional tools
    const mergedTools = {
      ...this.config.additionalTools,
      ...options?.additionalTools,
    };
    const mergedMcpServers = [
      ...(this.config.mcpServers ?? []),
      ...(options?.mcpServers ?? []),
    ];

    return ContractSpecAgent.create({
      spec,
      model: options?.model ?? this.config.defaultModel,
      toolHandlers: mergedHandlers,
      knowledgeRetriever: this.config.knowledgeRetriever,
      sessionStore: this.config.sessionStore,
      telemetryCollector: this.config.telemetryCollector,
      posthogConfig: this.config.posthogConfig,
      additionalTools: mergedTools,
      mcpServers: mergedMcpServers.length > 0 ? mergedMcpServers : undefined,
    });
  }

  /**
   * Get or create a cached agent instance.
   *
   * Use this when you want to reuse agent instances.
   *
   * @param name - Agent name
   * @param version - Optional specific version
   */
  async getOrCreate(
    name: string,
    version?: string
  ): Promise<ContractSpecAgent> {
    const spec = this.config.registry.require(name, version);
    const cacheKey = `${spec.meta.key}.v${spec.meta.version}`;

    let agent = this.cache.get(cacheKey);
    if (!agent) {
      agent = await this.createFromSpec(spec);
      this.cache.set(cacheKey, agent);
    }

    return agent;
  }

  /**
   * Clear the agent cache.
   */
  clearCache(): void {
    for (const agent of this.cache.values()) {
      void agent.cleanup().catch(() => undefined);
    }
    this.cache.clear();
  }

  /**
   * List all available agent names.
   */
  listAvailable(): string[] {
    return this.config.registry.listNames();
  }
}

/**
 * Create an agent factory.
 */
export function createAgentFactory(config: AgentFactoryConfig): AgentFactory {
  return new AgentFactory(config);
}
