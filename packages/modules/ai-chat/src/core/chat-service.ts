/**
 * Main chat orchestration service
 */
import { generateText, streamText } from 'ai';
import type { Provider as ChatProvider } from '@lssm/lib.ai-providers';
import type { WorkspaceContext } from '../context/workspace-context';
import type { ConversationStore } from './conversation-store';
import { InMemoryConversationStore } from './conversation-store';
import type {
  ChatConversation,
  ChatMessage,
  ChatStreamChunk,
  SendMessageOptions,
  SendMessageResult,
  StreamMessageResult,
} from './message-types';

/**
 * Configuration for ChatService
 */
export interface ChatServiceConfig {
  /** LLM provider to use */
  provider: ChatProvider;
  /** Optional workspace context for code-aware chat */
  context?: WorkspaceContext;
  /** Optional conversation store (defaults to in-memory) */
  store?: ConversationStore;
  /** Default system prompt */
  systemPrompt?: string;
  /** Maximum conversation history to include */
  maxHistoryMessages?: number;
  /** Callback for usage tracking */
  onUsage?: (usage: { inputTokens: number; outputTokens: number }) => void;
}

/**
 * Default system prompt for ContractSpec vibe coding
 */
const DEFAULT_SYSTEM_PROMPT = `You are ContractSpec AI, an expert coding assistant specialized in ContractSpec development.

Your capabilities:
- Help users create, modify, and understand ContractSpec specifications
- Generate code that follows ContractSpec patterns and best practices
- Explain concepts from the ContractSpec documentation
- Suggest improvements and identify issues in specs and implementations

Guidelines:
- Be concise but thorough
- Provide code examples when helpful
- Reference relevant ContractSpec concepts and patterns
- Ask clarifying questions when the user's intent is unclear
- When suggesting code changes, explain the rationale`;

/**
 * Main chat service for AI-powered conversations
 */
export class ChatService {
  private readonly provider: ChatProvider;
  private readonly context?: WorkspaceContext;
  private readonly store: ConversationStore;
  private readonly systemPrompt: string;
  private readonly maxHistoryMessages: number;
  private readonly onUsage?: (usage: {
    inputTokens: number;
    outputTokens: number;
  }) => void;

  constructor(config: ChatServiceConfig) {
    this.provider = config.provider;
    this.context = config.context;
    this.store = config.store ?? new InMemoryConversationStore();
    this.systemPrompt = config.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
    this.maxHistoryMessages = config.maxHistoryMessages ?? 20;
    this.onUsage = config.onUsage;
  }

  /**
   * Send a message and get a complete response
   */
  async send(options: SendMessageOptions): Promise<SendMessageResult> {
    // Get or create conversation
    let conversation: ChatConversation;
    if (options.conversationId) {
      const existing = await this.store.get(options.conversationId);
      if (!existing) {
        throw new Error(`Conversation ${options.conversationId} not found`);
      }
      conversation = existing;
    } else {
      conversation = await this.store.create({
        status: 'active',
        provider: this.provider.name,
        model: this.provider.model,
        messages: [],
        workspacePath: this.context?.workspacePath,
      });
    }

    // Add user message
    const userMessage = await this.store.appendMessage(conversation.id, {
      role: 'user',
      content: options.content,
      status: 'completed',
      attachments: options.attachments,
    });

    // Build prompt from messages
    const prompt = this.buildPrompt(conversation, options);

    // Get the language model
    const model = this.provider.getModel();

    try {
      // Generate response
      const result = await generateText({
        model,
        prompt,
        system: this.systemPrompt,
      });

      // Save assistant message
      const assistantMessage = await this.store.appendMessage(conversation.id, {
        role: 'assistant',
        content: result.text,
        status: 'completed',
      });

      // Refresh conversation
      const updatedConversation = await this.store.get(conversation.id);
      if (!updatedConversation) {
        throw new Error('Conversation lost after update');
      }

      return {
        message: assistantMessage,
        conversation: updatedConversation,
      };
    } catch (error) {
      // Save error message
      await this.store.appendMessage(conversation.id, {
        role: 'assistant',
        content: '',
        status: 'error',
        error: {
          code: 'generation_failed',
          message: error instanceof Error ? error.message : String(error),
        },
      });

      throw error;
    }
  }

  /**
   * Send a message and get a streaming response
   */
  async stream(options: SendMessageOptions): Promise<StreamMessageResult> {
    // Get or create conversation
    let conversation: ChatConversation;
    if (options.conversationId) {
      const existing = await this.store.get(options.conversationId);
      if (!existing) {
        throw new Error(`Conversation ${options.conversationId} not found`);
      }
      conversation = existing;
    } else {
      conversation = await this.store.create({
        status: 'active',
        provider: this.provider.name,
        model: this.provider.model,
        messages: [],
        workspacePath: this.context?.workspacePath,
      });
    }

    // Add user message
    await this.store.appendMessage(conversation.id, {
      role: 'user',
      content: options.content,
      status: 'completed',
      attachments: options.attachments,
    });

    // Create placeholder for assistant message
    const assistantMessage = await this.store.appendMessage(conversation.id, {
      role: 'assistant',
      content: '',
      status: 'streaming',
    });

    // Build prompt
    const prompt = this.buildPrompt(conversation, options);

    // Get the language model
    const model = this.provider.getModel();

    // Create async generator for streaming
    const self = this;
    async function* streamGenerator(): AsyncIterable<ChatStreamChunk> {
      let fullContent = '';

      try {
        const result = streamText({
          model,
          prompt,
          system: self.systemPrompt,
        });

        for await (const chunk of result.textStream) {
          fullContent += chunk;
          yield { type: 'text', content: chunk };
        }

        // Update message with final content
        await self.store.updateMessage(conversation.id, assistantMessage.id, {
          content: fullContent,
          status: 'completed',
        });

        yield {
          type: 'done',
        };
      } catch (error) {
        await self.store.updateMessage(conversation.id, assistantMessage.id, {
          content: fullContent,
          status: 'error',
          error: {
            code: 'stream_failed',
            message: error instanceof Error ? error.message : String(error),
          },
        });

        yield {
          type: 'error',
          error: {
            code: 'stream_failed',
            message: error instanceof Error ? error.message : String(error),
          },
        };
      }
    }

    return {
      conversationId: conversation.id,
      messageId: assistantMessage.id,
      stream: streamGenerator(),
    };
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(
    conversationId: string
  ): Promise<ChatConversation | null> {
    return this.store.get(conversationId);
  }

  /**
   * List conversations
   */
  async listConversations(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ChatConversation[]> {
    return this.store.list({
      status: 'active',
      ...options,
    });
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    return this.store.delete(conversationId);
  }

  /**
   * Build prompt string for LLM
   */
  private buildPrompt(
    conversation: ChatConversation,
    options: SendMessageOptions
  ): string {
    let prompt = '';

    // Add conversation history (limited)
    const historyStart = Math.max(
      0,
      conversation.messages.length - this.maxHistoryMessages
    );
    for (let i = historyStart; i < conversation.messages.length; i++) {
      const msg = conversation.messages[i];
      if (!msg) continue;
      if (msg.role === 'user' || msg.role === 'assistant') {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
      }
    }

    // Add current message with attachments
    let content = options.content;
    if (options.attachments?.length) {
      const attachmentInfo = options.attachments
        .map((a) => {
          if (a.type === 'file' || a.type === 'code') {
            return `\n\n### ${a.name}\n\`\`\`\n${a.content}\n\`\`\``;
          }
          return `\n\n[Attachment: ${a.name}]`;
        })
        .join('');
      content += attachmentInfo;
    }

    prompt += `User: ${content}\n\nAssistant:`;

    return prompt;
  }
}

/**
 * Create a chat service with the given configuration
 */
export function createChatService(config: ChatServiceConfig): ChatService {
  return new ChatService(config);
}
