/**
 * Conversation storage interface and implementations
 */
import type {
  ChatConversation,
  ChatMessage,
  ConversationStatus,
} from './message-types';

/**
 * Interface for conversation persistence
 */
export interface ConversationStore {
  /**
   * Get a conversation by ID
   */
  get(conversationId: string): Promise<ChatConversation | null>;

  /**
   * Create a new conversation
   */
  create(
    conversation: Omit<ChatConversation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ChatConversation>;

  /**
   * Update conversation properties
   */
  update(
    conversationId: string,
    updates: Partial<
      Pick<ChatConversation, 'title' | 'status' | 'summary' | 'metadata'>
    >
  ): Promise<ChatConversation | null>;

  /**
   * Append a message to a conversation
   */
  appendMessage(
    conversationId: string,
    message: Omit<ChatMessage, 'id' | 'conversationId' | 'createdAt' | 'updatedAt'>
  ): Promise<ChatMessage>;

  /**
   * Update a message in a conversation
   */
  updateMessage(
    conversationId: string,
    messageId: string,
    updates: Partial<ChatMessage>
  ): Promise<ChatMessage | null>;

  /**
   * Delete a conversation
   */
  delete(conversationId: string): Promise<boolean>;

  /**
   * List conversations with optional filters
   */
  list(options?: {
    status?: ConversationStatus;
    limit?: number;
    offset?: number;
  }): Promise<ChatConversation[]>;

  /**
   * Search conversations by content
   */
  search(query: string, limit?: number): Promise<ChatConversation[]>;
}

/**
 * Generate a unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * In-memory conversation store for development and testing
 */
export class InMemoryConversationStore implements ConversationStore {
  private readonly conversations = new Map<string, ChatConversation>();

  async get(conversationId: string): Promise<ChatConversation | null> {
    return this.conversations.get(conversationId) ?? null;
  }

  async create(
    conversation: Omit<ChatConversation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ChatConversation> {
    const now = new Date();
    const fullConversation: ChatConversation = {
      ...conversation,
      id: generateId('conv'),
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(fullConversation.id, fullConversation);
    return fullConversation;
  }

  async update(
    conversationId: string,
    updates: Partial<
      Pick<ChatConversation, 'title' | 'status' | 'summary' | 'metadata'>
    >
  ): Promise<ChatConversation | null> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    const updated = {
      ...conversation,
      ...updates,
      updatedAt: new Date(),
    };
    this.conversations.set(conversationId, updated);
    return updated;
  }

  async appendMessage(
    conversationId: string,
    message: Omit<ChatMessage, 'id' | 'conversationId' | 'createdAt' | 'updatedAt'>
  ): Promise<ChatMessage> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const now = new Date();
    const fullMessage: ChatMessage = {
      ...message,
      id: generateId('msg'),
      conversationId,
      createdAt: now,
      updatedAt: now,
    };

    conversation.messages.push(fullMessage);
    conversation.updatedAt = now;
    return fullMessage;
  }

  async updateMessage(
    conversationId: string,
    messageId: string,
    updates: Partial<ChatMessage>
  ): Promise<ChatMessage | null> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    const messageIndex = conversation.messages.findIndex(
      (m) => m.id === messageId
    );
    if (messageIndex === -1) return null;

    const message = conversation.messages[messageIndex];
    if (!message) return null;

    const updated = {
      ...message,
      ...updates,
      updatedAt: new Date(),
    };
    conversation.messages[messageIndex] = updated;
    conversation.updatedAt = new Date();
    return updated;
  }

  async delete(conversationId: string): Promise<boolean> {
    return this.conversations.delete(conversationId);
  }

  async list(options?: {
    status?: ConversationStatus;
    limit?: number;
    offset?: number;
  }): Promise<ChatConversation[]> {
    let results = Array.from(this.conversations.values());

    if (options?.status) {
      results = results.filter((c) => c.status === options.status);
    }

    // Sort by updatedAt descending
    results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 100;
    return results.slice(offset, offset + limit);
  }

  async search(query: string, limit = 20): Promise<ChatConversation[]> {
    const lowerQuery = query.toLowerCase();
    const results: ChatConversation[] = [];

    for (const conversation of this.conversations.values()) {
      // Search in title
      if (conversation.title?.toLowerCase().includes(lowerQuery)) {
        results.push(conversation);
        continue;
      }

      // Search in messages
      const hasMatch = conversation.messages.some((m) =>
        m.content.toLowerCase().includes(lowerQuery)
      );
      if (hasMatch) {
        results.push(conversation);
      }

      if (results.length >= limit) break;
    }

    return results;
  }

  /**
   * Clear all conversations (for testing)
   */
  clear(): void {
    this.conversations.clear();
  }
}

/**
 * Create an in-memory conversation store
 */
export function createInMemoryConversationStore(): ConversationStore {
  return new InMemoryConversationStore();
}

