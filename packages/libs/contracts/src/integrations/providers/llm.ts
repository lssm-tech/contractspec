export type LLMRole = 'system' | 'user' | 'assistant' | 'tool';

export interface LLMTextPart {
  type: 'text';
  text: string;
}

export interface LLMToolCallPart {
  type: 'tool-call';
  id: string;
  name: string;
  arguments: string;
}

export interface LLMToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  output: string;
}

export type LLMContentPart = LLMTextPart | LLMToolCallPart | LLMToolResultPart;

export interface LLMMessage {
  role: LLMRole;
  content: LLMContentPart[];
  name?: string;
  toolCallId?: string;
  metadata?: Record<string, string>;
}

export interface LLMToolDefinition {
  name: string;
  description?: string;
  inputSchema: unknown;
}

export interface LLMTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMChatOptions {
  model?: string;
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  responseFormat?: 'text' | 'json';
  tools?: LLMToolDefinition[];
  userId?: string;
  metadata?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface LLMResponse {
  message: LLMMessage;
  usage?: LLMTokenUsage;
  finishReason?: 'stop' | 'length' | 'tool_call' | 'content_filter';
  raw?: unknown;
}

export type LLMStreamChunk =
  | {
      type: 'message_delta';
      delta: LLMContentPart;
      index: number;
    }
  | {
      type: 'tool_call';
      call: LLMToolCallPart;
      index: number;
    }
  | {
      type: 'usage';
      usage: LLMTokenUsage;
    }
  | {
      type: 'error';
      error: Error;
    }
  | {
      type: 'end';
      response: LLMResponse;
    };

export interface TokenCountResult {
  promptTokens: number;
}

export interface LLMProvider {
  chat(messages: LLMMessage[], options?: LLMChatOptions): Promise<LLMResponse>;
  stream(
    messages: LLMMessage[],
    options?: LLMChatOptions
  ): AsyncIterable<LLMStreamChunk>;
  countTokens(messages: LLMMessage[]): Promise<TokenCountResult>;
}
