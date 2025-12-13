import { Mistral } from '@mistralai/mistralai';
import type * as components from '@mistralai/mistralai/models/components/index.js';

import type {
  LLMChatOptions,
  LLMContentPart,
  LLMMessage,
  LLMProvider,
  LLMResponse,
  LLMStreamChunk,
  LLMToolCallPart,
  LLMTokenUsage,
} from '../llm';

export interface MistralLLMProviderOptions {
  apiKey: string;
  defaultModel?: string;
  serverURL?: string;
  client?: Mistral;
  userAgentSuffix?: string;
}

export class MistralLLMProvider implements LLMProvider {
  private readonly client: Mistral;
  private readonly defaultModel: string;

  constructor(options: MistralLLMProviderOptions) {
    if (!options.apiKey) {
      throw new Error('MistralLLMProvider requires an apiKey');
    }

    this.client =
      options.client ??
      new Mistral({
        apiKey: options.apiKey,
        serverURL: options.serverURL,
        userAgent: options.userAgentSuffix
          ? `${options.userAgentSuffix}`
          : undefined,
      });
    this.defaultModel = options.defaultModel ?? 'mistral-large-latest';
  }

  async chat(
    messages: LLMMessage[],
    options: LLMChatOptions = {}
  ): Promise<LLMResponse> {
    const request = this.buildChatRequest(messages, options);
    const response = await this.client.chat.complete(request);
    return this.buildLLMResponse(response);
  }

  async *stream(
    messages: LLMMessage[],
    options: LLMChatOptions = {}
  ): AsyncIterable<LLMStreamChunk> {
    const request = this.buildChatRequest(messages, options);
    request.stream = true;
    const stream = await this.client.chat.stream(request);

    const aggregatedParts: LLMContentPart[] = [];
    const aggregatedToolCalls: LLMToolCallPart[] = [];
    let usage: LLMTokenUsage | undefined;
    let finishReason: string | undefined;

    for await (const event of stream) {
      for (const choice of event.data.choices) {
        const delta = choice.delta;
        if (typeof delta.content === 'string') {
          if (delta.content.length > 0) {
            aggregatedParts.push({ type: 'text', text: delta.content });
            yield {
              type: 'message_delta',
              delta: { type: 'text', text: delta.content },
              index: choice.index,
            };
          }
        } else if (Array.isArray(delta.content)) {
          for (const chunk of delta.content) {
            if (chunk.type === 'text' && 'text' in chunk) {
              aggregatedParts.push({ type: 'text', text: chunk.text });
              yield {
                type: 'message_delta',
                delta: { type: 'text', text: chunk.text },
                index: choice.index,
              };
            }
          }
        }

        if (delta.toolCalls) {
          let localIndex = 0;
          for (const call of delta.toolCalls) {
            const toolCall = this.fromMistralToolCall(call, localIndex);
            aggregatedToolCalls.push(toolCall);
            yield {
              type: 'tool_call',
              call: toolCall,
              index: choice.index,
            };
            localIndex += 1;
          }
        }

        if (choice.finishReason && choice.finishReason !== 'null') {
          finishReason = choice.finishReason;
        }
      }

      if (event.data.usage) {
        const usageEntry = this.fromUsage(event.data.usage);
        if (usageEntry) {
          usage = usageEntry;
          yield { type: 'usage', usage: usageEntry };
        }
      }
    }

    const message: LLMMessage = {
      role: 'assistant',
      content: aggregatedParts.length
        ? aggregatedParts
        : [{ type: 'text', text: '' }],
    };
    if (aggregatedToolCalls.length > 0) {
      message.content = [
        ...aggregatedToolCalls,
        ...(aggregatedParts.length ? aggregatedParts : []),
      ];
    }

    yield {
      type: 'end',
      response: {
        message,
        usage,
        finishReason: mapFinishReason(finishReason),
      },
    };
  }

  async countTokens(messages: LLMMessage[]): Promise<{ promptTokens: number }> {
    throw new Error('Mistral API does not currently support token counting');
  }

  private buildChatRequest(
    messages: LLMMessage[],
    options: LLMChatOptions
  ): components.ChatCompletionRequest {
    const model = options.model ?? this.defaultModel;
    const mappedMessages = messages.map((message) =>
      this.toMistralMessage(message)
    );

    const request: components.ChatCompletionRequest = {
      model,
      messages: mappedMessages,
    };

    if (options.temperature != null) {
      request.temperature = options.temperature;
    }
    if (options.topP != null) {
      request.topP = options.topP;
    }
    if (options.maxOutputTokens != null) {
      request.maxTokens = options.maxOutputTokens;
    }
    if (options.stopSequences?.length) {
      request.stop =
        options.stopSequences.length === 1
          ? options.stopSequences[0]
          : options.stopSequences;
    }
    if (options.tools?.length) {
      request.tools = options.tools.map((tool) => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters:
            typeof tool.inputSchema === 'object' && tool.inputSchema !== null
              ? tool.inputSchema
              : {},
        },
      }));
    }
    if (options.responseFormat === 'json') {
      request.responseFormat = { type: 'json_object' };
    }

    return request;
  }

  private buildLLMResponse(
    response: components.ChatCompletionResponse
  ): LLMResponse {
    const firstChoice = response.choices[0];
    if (!firstChoice) {
      return {
        message: {
          role: 'assistant',
          content: [{ type: 'text', text: '' }],
        },
        usage: this.fromUsage(response.usage),
        raw: response,
      };
    }
    const message = this.fromAssistantMessage(firstChoice.message);
    return {
      message,
      usage: this.fromUsage(response.usage),
      finishReason: mapFinishReason(firstChoice.finishReason),
      raw: response,
    };
  }

  private fromUsage(
    usage: components.UsageInfo | undefined
  ): LLMTokenUsage | undefined {
    if (!usage) return undefined;
    return {
      promptTokens: usage.promptTokens ?? 0,
      completionTokens: usage.completionTokens ?? 0,
      totalTokens: usage.totalTokens ?? 0,
    };
  }

  private fromAssistantMessage(
    message: components.AssistantMessage
  ): LLMMessage {
    const parts: LLMContentPart[] = [];
    if (typeof message.content === 'string') {
      parts.push({ type: 'text', text: message.content });
    } else if (Array.isArray(message.content)) {
      message.content.forEach((chunk) => {
        if (chunk.type === 'text' && 'text' in chunk) {
          parts.push({ type: 'text', text: chunk.text });
        }
      });
    }

    const toolCalls =
      message.toolCalls?.map((call, index) =>
        this.fromMistralToolCall(call, index)
      ) ?? [];

    if (toolCalls.length > 0) {
      parts.splice(0, 0, ...toolCalls);
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', text: '' });
    }

    return {
      role: 'assistant',
      content: parts,
    };
  }

  private fromMistralToolCall(
    call: components.ToolCall,
    index: number
  ): LLMToolCallPart {
    const args =
      typeof call.function.arguments === 'string'
        ? call.function.arguments
        : JSON.stringify(call.function.arguments);
    return {
      type: 'tool-call',
      id: call.id ?? `tool-call-${index}`,
      name: call.function.name,
      arguments: args,
    };
  }

  private toMistralMessage(message: LLMMessage): components.Messages {
    const textContent = this.extractText(message.content);
    const toolCalls = this.extractToolCalls(message);

    switch (message.role) {
      case 'system':
        return {
          role: 'system',
          content: textContent ?? '',
        };
      case 'user':
        return {
          role: 'user',
          content: textContent ?? '',
        };
      case 'assistant':
        return {
          role: 'assistant',
          content: toolCalls.length > 0 ? null : (textContent ?? ''),
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        };
      case 'tool':
        return {
          role: 'tool',
          content: textContent ?? '',
          toolCallId: message.toolCallId ?? toolCalls[0]?.id,
        };
      default:
        return {
          role: 'user',
          content: textContent ?? '',
        };
    }
  }

  private extractText(parts: LLMContentPart[]): string | null {
    const textParts = parts
      .filter((part) => part.type === 'text')
      .map((part) => (part as Extract<LLMContentPart, { type: 'text' }>).text);
    if (textParts.length === 0) return null;
    return textParts.join('');
  }

  private extractToolCalls(message: LLMMessage): components.ToolCall[] {
    const toolCallParts = message.content.filter(
      (part): part is LLMToolCallPart => part.type === 'tool-call'
    );
    return toolCallParts.map((call, index) => ({
      id: call.id ?? `call_${index}`,
      type: 'function',
      index,
      function: {
        name: call.name,
        arguments: call.arguments,
      },
    }));
  }
}

function mapFinishReason(
  reason?: string | null
): LLMResponse['finishReason'] | undefined {
  if (!reason) return undefined;
  const normalized = reason.toLowerCase();
  switch (normalized) {
    case 'stop':
      return 'stop';
    case 'length':
      return 'length';
    case 'tool_call':
    case 'tool_calls':
      return 'tool_call';
    case 'content_filter':
      return 'content_filter';
    default:
      return undefined;
  }
}
