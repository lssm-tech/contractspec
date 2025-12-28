'use client';

import * as React from 'react';
import type {
  ChatAttachment,
  ChatConversation,
  ChatMessage,
} from '../../core/message-types';
import { ChatService } from '../../core/chat-service';
import {
  createProvider,
  type ProviderMode,
  type ProviderName,
} from '@contractspec/lib.ai-providers';

/**
 * Options for useChat hook
 */
export interface UseChatOptions {
  /** Provider to use */
  provider?: ProviderName;
  /** Provider mode */
  mode?: ProviderMode;
  /** Model to use */
  model?: string;
  /** API key for BYOK mode */
  apiKey?: string;
  /** API proxy URL for managed mode */
  proxyUrl?: string;
  /** Initial conversation ID to resume */
  conversationId?: string;
  /** System prompt override */
  systemPrompt?: string;
  /** Enable streaming */
  streaming?: boolean;
  /** Called when a message is sent */
  onSend?: (message: ChatMessage) => void;
  /** Called when a response is received */
  onResponse?: (message: ChatMessage) => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Called when usage is recorded */
  onUsage?: (usage: { inputTokens: number; outputTokens: number }) => void;
}

/**
 * Return type for useChat hook
 */
export interface UseChatReturn {
  /** Current messages */
  messages: ChatMessage[];
  /** Current conversation */
  conversation: ChatConversation | null;
  /** Whether currently loading/streaming */
  isLoading: boolean;
  /** Current error */
  error: Error | null;
  /** Send a message */
  sendMessage: (
    content: string,
    attachments?: ChatAttachment[]
  ) => Promise<void>;
  /** Clear conversation and start fresh */
  clearConversation: () => void;
  /** Set conversation ID to resume */
  setConversationId: (id: string | null) => void;
  /** Regenerate last response */
  regenerate: () => Promise<void>;
  /** Stop current generation */
  stop: () => void;
}

/**
 * Hook for managing AI chat state
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    provider = 'openai',
    mode = 'byok',
    model,
    apiKey,
    proxyUrl,
    conversationId: initialConversationId,
    systemPrompt,
    streaming = true,
    onSend,
    onResponse,
    onError,
    onUsage,
  } = options;

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [conversation, setConversation] =
    React.useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(
    initialConversationId ?? null
  );

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const chatServiceRef = React.useRef<ChatService | null>(null);

  // Initialize chat service
  React.useEffect(() => {
    const chatProvider = createProvider({
      provider,
      model,
      apiKey,
      proxyUrl,
    });

    chatServiceRef.current = new ChatService({
      provider: chatProvider,
      systemPrompt,
      onUsage,
    });
  }, [provider, mode, model, apiKey, proxyUrl, systemPrompt, onUsage]);

  // Load existing conversation
  React.useEffect(() => {
    if (!conversationId || !chatServiceRef.current) return;

    const loadConversation = async () => {
      if (!chatServiceRef.current) return;

      const conv = await chatServiceRef.current.getConversation(conversationId);
      if (conv) {
        setConversation(conv);
        setMessages(conv.messages);
      }
    };

    loadConversation().catch(console.error);
  }, [conversationId]);

  const sendMessage = React.useCallback(
    async (content: string, attachments?: ChatAttachment[]) => {
      if (!chatServiceRef.current) {
        throw new Error('Chat service not initialized');
      }

      setIsLoading(true);
      setError(null);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Add user message immediately
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          conversationId: conversationId ?? '',
          role: 'user',
          content,
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
          attachments,
        };
        setMessages((prev) => [...prev, userMessage]);
        onSend?.(userMessage);

        if (streaming) {
          // Streaming mode
          const result = await chatServiceRef.current.stream({
            conversationId: conversationId ?? undefined,
            content,
            attachments,
          });

          // Update conversation ID if new
          if (!conversationId) {
            setConversationId(result.conversationId);
          }

          // Add placeholder for assistant message
          const assistantMessage: ChatMessage = {
            id: result.messageId,
            conversationId: result.conversationId,
            role: 'assistant',
            content: '',
            status: 'streaming',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Process stream
          let fullContent = '';
          for await (const chunk of result.stream) {
            if (chunk.type === 'text' && chunk.content) {
              fullContent += chunk.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId ? { ...m, content: fullContent } : m
                )
              );
            } else if (chunk.type === 'done') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? {
                        ...m,
                        status: 'completed',
                        usage: chunk.usage,
                        updatedAt: new Date(),
                      }
                    : m
                )
              );
              onResponse?.(
                messages.find((m) => m.id === result.messageId) ??
                  assistantMessage
              );
            } else if (chunk.type === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? {
                        ...m,
                        status: 'error',
                        error: chunk.error,
                        updatedAt: new Date(),
                      }
                    : m
                )
              );
              if (chunk.error) {
                const err = new Error(chunk.error.message);
                setError(err);
                onError?.(err);
              }
            }
          }
        } else {
          // Non-streaming mode
          const result = await chatServiceRef.current.send({
            conversationId: conversationId ?? undefined,
            content,
            attachments,
          });

          setConversation(result.conversation);
          setMessages(result.conversation.messages);

          if (!conversationId) {
            setConversationId(result.conversation.id);
          }

          onResponse?.(result.message);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [conversationId, streaming, onSend, onResponse, onError, messages]
  );

  const clearConversation = React.useCallback(() => {
    setMessages([]);
    setConversation(null);
    setConversationId(null);
    setError(null);
  }, []);

  const regenerate = React.useCallback(async () => {
    // Find the last user message
    const lastUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages((prev) => prev.slice(0, lastUserMessageIndex + 1));

    // Resend
    await sendMessage(lastUserMessage.content, lastUserMessage.attachments);
  }, [messages, sendMessage]);

  const stop = React.useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  return {
    messages,
    conversation,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    setConversationId,
    regenerate,
    stop,
  };
}
