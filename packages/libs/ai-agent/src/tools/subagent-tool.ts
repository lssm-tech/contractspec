/**
 * Subagent tool factory for AI SDK parent-child agent delegation.
 *
 * Creates a tool whose execute calls a subagent, optionally streaming
 * preliminary results and controlling what the model sees via toModelOutput.
 *
 * @see https://ai-sdk.dev/docs/agents/subagents
 */
import { readUIMessageStream, tool, type Tool } from 'ai';
import { z } from 'zod';

/** Subagent interface compatible with ToolLoopAgent stream. */
export interface SubagentLike {
  stream(params: { prompt: string; abortSignal?: AbortSignal }): Promise<{
    toUIMessageStream(): AsyncIterable<unknown> | ReadableStream<unknown>;
  }>;
  /** Optional: for passConversationHistory; when present, used instead of stream when messages are passed */
  generate?(params: {
    messages: { role: string; content: string | unknown[] }[];
    abortSignal?: AbortSignal;
  }): Promise<{ text: string }>;
}

export interface CreateSubagentToolOptions {
  /** Subagent to delegate to (ToolLoopAgent or compatible) */
  subagent: SubagentLike;
  /** Tool name (unique within the parent agent) */
  name?: string;
  /** Human-readable description for the LLM */
  description?: string;
  /** Input parameter name for the task (default: 'task') */
  taskParam?: string;
  /** Whether to extract summary for toModelOutput (default: true) */
  toModelSummary?: boolean;
  /** Pass full conversation history to subagent (opt-in; defeats context isolation; disables streaming) */
  passConversationHistory?: boolean;
}

/** Convert AsyncIterable to ReadableStream for readUIMessageStream. */
function toReadableStream(
  iterable: AsyncIterable<unknown> | ReadableStream<unknown>
): ReadableStream<unknown> {
  if (iterable instanceof ReadableStream) {
    return iterable;
  }
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of iterable as AsyncIterable<unknown>) {
          controller.enqueue(chunk);
        }
      } finally {
        controller.close();
      }
    },
  });
}

/**
 * Create an AI SDK tool that delegates to a subagent.
 *
 * Supports streaming preliminary results via async generator execute.
 * When toModelSummary is true, toModelOutput extracts the last text part
 * so the parent model sees only a summary.
 *
 * @example
 * ```ts
 * const researchSubagent = new ToolLoopAgent({ model, instructions, tools });
 * const researchTool = createSubagentTool({
 *   subagent: researchSubagent,
 *   name: 'research',
 *   description: 'Research a topic in depth.',
 * });
 * const mainAgent = new ToolLoopAgent({
 *   model,
 *   tools: { research: researchTool },
 * });
 * ```
 */
export function createSubagentTool(
  options: CreateSubagentToolOptions
): Tool<{ task: string }, unknown> {
  const {
    subagent,
    description = 'Research a topic or question in depth.',
    taskParam = 'task',
    toModelSummary = true,
    passConversationHistory = false,
  } = options;

  const inputSchema = z.object({
    [taskParam]: z.string().describe('The research task to complete'),
  });

  const execute = async function* (
    input: Record<string, unknown>,
    options?: {
      abortSignal?: AbortSignal;
      messages?: { role: string; content: string | unknown[] }[];
    }
  ): AsyncGenerator<unknown> {
    const task = String(input[taskParam] ?? input.task ?? '');
    const { abortSignal, messages } = options ?? {};

    if (
      passConversationHistory &&
      messages &&
      messages.length > 0 &&
      typeof subagent.generate === 'function'
    ) {
      const result = await subagent.generate({
        messages: [...messages, { role: 'user', content: task }],
        abortSignal,
      });
      yield { parts: [{ type: 'text' as const, text: result.text }] };
      return;
    }

    const result = await subagent.stream({
      prompt: task,
      abortSignal,
    });

    const uiStream = result.toUIMessageStream();
    const stream = toReadableStream(uiStream);

    for await (const message of readUIMessageStream({
      stream: stream as Parameters<typeof readUIMessageStream>[0]['stream'],
    })) {
      yield message;
    }
  };

  const toolOptions = {
    description,
    inputSchema,
    execute,
    ...(toModelSummary && {
      toModelOutput: ({
        output,
      }: {
        output?: { parts?: { type?: string; text?: string }[] };
      }) => {
        const parts = output?.parts;
        if (!Array.isArray(parts)) {
          return { type: 'text' as const, value: 'Task completed.' };
        }
        const lastTextPart = [...parts]
          .reverse()
          .find(
            (p): p is { type: 'text'; text?: string } => p?.type === 'text'
          );
        return {
          type: 'text' as const,
          value: lastTextPart?.text ?? 'Task completed.',
        };
      },
    }),
  };

  // AI SDK tool() has strict overloads; async generator execute is supported at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tool(toolOptions as any) as Tool<{ task: string }, unknown>;
}
