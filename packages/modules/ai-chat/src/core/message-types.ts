/**
 * Message and conversation types for AI Chat
 */

/**
 * Role of a message participant
 */
export type ChatRole = 'user' | 'assistant' | 'system';

/**
 * Status of a message
 */
export type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error';

/**
 * Attachment type for messages
 */
export interface ChatAttachment {
  id: string;
  type: 'file' | 'image' | 'code' | 'spec';
  name: string;
  content?: string;
  mimeType?: string;
  size?: number;
  path?: string;
}

/**
 * Code block within a message
 */
export interface ChatCodeBlock {
  id: string;
  language: string;
  code: string;
  filename?: string;
  startLine?: number;
  endLine?: number;
}

/**
 * Tool call information
 */
export interface ChatToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'running' | 'completed' | 'error';
  error?: string;
}

/**
 * Source/citation in a message
 */
export interface ChatSource {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  type: 'file' | 'spec' | 'doc' | 'web';
}

/**
 * A single chat message
 */
export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;

  // Optional rich content
  attachments?: ChatAttachment[];
  codeBlocks?: ChatCodeBlock[];
  toolCalls?: ChatToolCall[];
  sources?: ChatSource[];

  // Reasoning/thinking for models that support it
  reasoning?: string;

  // Token usage
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };

  // Error information
  error?: {
    code: string;
    message: string;
  };

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Conversation status
 */
export type ConversationStatus = 'active' | 'archived' | 'deleted';

/**
 * A conversation containing multiple messages
 */
export interface ChatConversation {
  id: string;
  title?: string;
  status: ConversationStatus;
  createdAt: Date;
  updatedAt: Date;

  // Provider info
  provider: string;
  model: string;

  // Context info
  workspacePath?: string;
  contextFiles?: string[];

  // Messages
  messages: ChatMessage[];

  // Summary for context
  summary?: string;

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Options for sending a message
 */
export interface SendMessageOptions {
  conversationId?: string;
  content: string;
  attachments?: ChatAttachment[];
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * Streaming chunk from AI response
 */
export interface ChatStreamChunk {
  type: 'text' | 'reasoning' | 'tool_call' | 'source' | 'error' | 'done';
  content?: string;
  toolCall?: ChatToolCall;
  source?: ChatSource;
  error?: { code: string; message: string };
  usage?: { inputTokens: number; outputTokens: number };
}

/**
 * Result of sending a message
 */
export interface SendMessageResult {
  message: ChatMessage;
  conversation: ChatConversation;
}

/**
 * Streaming result
 */
export interface StreamMessageResult {
  conversationId: string;
  messageId: string;
  stream: AsyncIterable<ChatStreamChunk>;
}

