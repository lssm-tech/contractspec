import { setTimeout as delay } from 'node:timers/promises';
import type { LLMToolDefinition } from '@lssm/lib.contracts/integrations/providers/llm';
import type {
  AgentToolContext,
  AgentToolDefinitionWithHandler,
  AgentToolInvocation,
  AgentToolResult,
} from '../types';

export interface ToolExecutorOptions {
  tools?: AgentToolDefinitionWithHandler[];
  /** Maximum time to wait for graceful cancellation after timeout. */
  abortGracePeriodMs?: number;
}

export class ToolExecutor {
  private readonly tools = new Map<string, AgentToolDefinitionWithHandler>();
  private readonly abortGracePeriodMs: number;

  constructor(options?: ToolExecutorOptions) {
    this.abortGracePeriodMs = options?.abortGracePeriodMs ?? 250;
    options?.tools?.forEach((tool) => this.register(tool));
  }

  register(tool: AgentToolDefinitionWithHandler): this {
    this.tools.set(tool.definition.name, tool);
    return this;
  }

  listLLMTools(allowed?: string[]): LLMToolDefinition[] {
    if (!allowed?.length) {
      return [...this.tools.values()].map((tool) => tool.definition);
    }
    return allowed
      .map((name) => this.tools.get(name)?.definition)
      .filter((tool): tool is LLMToolDefinition => Boolean(tool));
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  async execute(
    name: string,
    args: unknown,
    ctx: AgentToolContext
  ): Promise<{ invocation: AgentToolInvocation; result?: AgentToolResult }> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Agent tool ${name} is not registered`);
    }

    const invocation: AgentToolInvocation = {
      name,
      arguments: args,
      startedAt: new Date(),
      success: false,
    };

    try {
      const controller = new AbortController();
      const timeout = tool.timeoutMs ?? 10_000;
      const timer = setTimeout(() => controller.abort(), timeout);
      try {
        const result = await Promise.race([
          tool.handler(args, {
            ...ctx,
            emit: ctx.emit,
          }),
          this.rejectOnAbort(controller.signal, timeout),
        ]);
        invocation.success = true;
        return { invocation, result };
      } finally {
        clearTimeout(timer);
        if (controller.signal.aborted) {
          await delay(this.abortGracePeriodMs).catch(() => undefined);
        }
      }
    } catch (error) {
      invocation.error = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      invocation.completedAt = new Date();
      invocation.durationMs =
        invocation.completedAt.getTime() - invocation.startedAt.getTime();
    }
  }

  private async rejectOnAbort(signal: AbortSignal, timeout: number) {
    if (signal.aborted) {
      throw new Error('Tool execution aborted');
    }
    return new Promise<never>((_, reject) => {
      signal.addEventListener(
        'abort',
        () => reject(new Error(`Tool execution timed out after ${timeout}ms`)),
        { once: true }
      );
    });
  }
}
