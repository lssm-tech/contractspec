'use client';

import * as React from 'react';
import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import type {
  ChatAttachment,
  ChatConversation,
  ChatMessage,
  ChatSource,
  ChatToolCall,
} from '../../core/message-types';
import { ChatService } from '../../core/chat-service';
import type { ConversationStore } from '../../core/conversation-store';
import type { ThinkingLevel } from '../../core/thinking-levels';
import {
  createProvider,
  type ModelSelector,
  type ProviderMode,
  type ProviderName,
} from '@contractspec/lib.ai-providers';
import type { WorkflowComposer } from '@contractspec/lib.workflow-composer';
import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import type { ContractsContextConfig } from '../../core/contracts-context';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import type { SurfacePatchProposal } from '@contractspec/lib.surface-runtime/spec/types';
import type { McpClientConfig } from '@contractspec/lib.ai-agent/tools/mcp-client';

/** Tool definition for planner integration (reserved for bundle spec 07_ai_native_chat). */
export interface UseChatToolDef {
  name: string;
  description?: string;
  schema?: Record<string, unknown>;
  /** When true, stream pauses for user approval before tool execution */
  requireApproval?: boolean;
}

/** Convert UseChatToolDef to AI SDK ToolSet */
function toolsToToolSet(defs: UseChatToolDef[]): ToolSet {
  const result: Record<string, unknown> = {};
  for (const def of defs) {
    result[def.name] = tool({
      description: def.description ?? def.name,
      inputSchema: z.object({}).passthrough(),
      execute: async () => ({}),
    });
  }
  return result as ToolSet;
}

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
  /** Optional store for persistence (enables history, fork, edit) */
  store?: ConversationStore;
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
  /**
   * Tools for the model to call. Passed to streamText.
   * Use requireApproval: true for tools that need user confirmation.
   */
  tools?: UseChatToolDef[];
  /** Thinking level: instant, thinking, extra_thinking, max. Maps to provider reasoning options. */
  thinkingLevel?: ThinkingLevel;
  /** Workflow creation tools: base workflows and optional composer */
  workflowToolsConfig?: {
    baseWorkflows: WorkflowSpec[];
    composer?: WorkflowComposer;
  };
  /** Optional model selector for dynamic model selection by task dimension */
  modelSelector?: ModelSelector;
  /** Contracts-spec context: agent, data-views, operations, forms, presentations */
  contractsContext?: ContractsContextConfig;
  /** Surface plan config: enables propose-patch tool when used in surface-runtime */
  surfacePlanConfig?: {
    plan: ResolvedSurfacePlan;
    onPatchProposal?: (proposal: SurfacePatchProposal) => void;
  };
  /** MCP server configs: tools from these servers are merged into chat tools */
  mcpServers?: McpClientConfig[];
  /** Agent mode: use provided agent instead of ChatService for generation */
  agentMode?: {
    agent: import('../../core/agent-adapter').ChatAgentAdapter;
  };
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
    attachments?: ChatAttachment[],
    options?: { skipUserAppend?: boolean }
  ) => Promise<void>;
  /** Clear conversation and start fresh */
  clearConversation: () => void;
  /** Set conversation ID to resume */
  setConversationId: (id: string | null) => void;
  /** Regenerate last response */
  regenerate: () => Promise<void>;
  /** Stop current generation */
  stop: () => void;
  /** Start a new conversation (alias for clearConversation) */
  createNewConversation: () => void;
  /** Edit a user message and regenerate from that point */
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  /** Fork current conversation, optionally up to a message; returns new conversation ID */
  forkConversation: (upToMessageId?: string) => Promise<string | null>;
  /** Update conversation metadata (title, projectId, tags) */
  updateConversation: (
    updates: Parameters<ConversationStore['update']>[1]
  ) => Promise<ChatConversation | null>;
  /**
   * Add tool approval response when tools have requireApproval.
   * Required when stream pauses for approval. Full support requires server route.
   */
  addToolApprovalResponse?: (toolCallId: string, result: unknown) => void;
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
    store,
    systemPrompt,
    streaming = true,
    onSend,
    onResponse,
    onError,
    onUsage,
    tools: toolsDefs,
    thinkingLevel,
    workflowToolsConfig,
    modelSelector,
    contractsContext,
    surfacePlanConfig,
    mcpServers,
    agentMode,
  } = options;

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [mcpTools, setMcpTools] = React.useState<Record<string, unknown> | null>(
    null
  );
  const mcpCleanupRef = React.useRef<(() => Promise<void>) | null>(null);
  const [conversation, setConversation] =
    React.useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [conversationId, setConversationId] = React.useState<string | null>(
    initialConversationId ?? null
  );

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const chatServiceRef = React.useRef<ChatService | null>(null);

  // Load MCP tools when mcpServers is provided
  React.useEffect(() => {
    if (!mcpServers?.length) {
      setMcpTools(null);
      return;
    }
    let cancelled = false;
    import('@contractspec/lib.ai-agent/tools/mcp-client').then(
      ({ createMcpToolsets }) => {
        createMcpToolsets(mcpServers)
          .then(({ tools, cleanup }) => {
            if (!cancelled) {
              setMcpTools(tools as Record<string, unknown>);
              mcpCleanupRef.current = cleanup;
            } else {
              cleanup().catch(() => undefined);
            }
          })
          .catch(() => {
            if (!cancelled) setMcpTools(null);
          });
      }
    );
    return () => {
      cancelled = true;
      const cleanup = mcpCleanupRef.current;
      mcpCleanupRef.current = null;
      if (cleanup) cleanup().catch(() => undefined);
      setMcpTools(null);
    };
  }, [mcpServers]);

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
      store,
      systemPrompt,
      onUsage,
      tools: toolsDefs?.length ? toolsToToolSet(toolsDefs) : undefined,
      thinkingLevel,
      workflowToolsConfig,
      modelSelector,
      contractsContext,
      surfacePlanConfig,
      mcpTools: mcpTools as ToolSet | undefined,
    });
  }, [
    provider,
    mode,
    model,
    apiKey,
    proxyUrl,
    store,
    systemPrompt,
    onUsage,
    toolsDefs,
    thinkingLevel,
    workflowToolsConfig,
    modelSelector,
    contractsContext,
    surfacePlanConfig,
    mcpTools,
  ]);

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
    async (
      content: string,
      attachments?: ChatAttachment[],
      opts?: { skipUserAppend?: boolean }
    ) => {
      if (agentMode?.agent) {
        // Agent mode: use agent.generate() instead of ChatService
        setIsLoading(true);
        setError(null);
        abortControllerRef.current = new AbortController();
        try {
          if (!opts?.skipUserAppend) {
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
          }
          const result = await agentMode.agent.generate({
            prompt: content,
            signal: abortControllerRef.current.signal,
          });
          const toolCallsMap = new Map<string, ChatToolCall>();
          for (const tc of result.toolCalls ?? []) {
            const tr = result.toolResults?.find((r) => r.toolCallId === tc.toolCallId);
            toolCallsMap.set(tc.toolCallId, {
              id: tc.toolCallId,
              name: tc.toolName,
              args: ((tc as { args?: unknown }).args ?? {}) as Record<
                string,
                unknown
              >,
              result: tr?.output,
              status: 'completed',
            });
          }
          const assistantMessage: ChatMessage = {
            id: `msg_${Date.now()}_a`,
            conversationId: conversationId ?? '',
            role: 'assistant',
            content: result.text,
            status: 'completed',
            createdAt: new Date(),
            updatedAt: new Date(),
            toolCalls: toolCallsMap.size
              ? Array.from(toolCallsMap.values())
              : undefined,
            usage: result.usage,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          onResponse?.(assistantMessage);
          onUsage?.(result.usage ?? { inputTokens: 0, outputTokens: 0 });
          if (store && !conversationId) {
            const conv = await store.create({
              status: 'active',
              provider: 'agent',
              model: 'agent',
              messages: [],
            });
            if (!opts?.skipUserAppend) {
              await store.appendMessage(conv.id, {
                role: 'user',
                content,
                status: 'completed',
                attachments,
              });
            }
            await store.appendMessage(conv.id, {
              role: 'assistant',
              content: result.text,
              status: 'completed',
              toolCalls: assistantMessage.toolCalls,
              usage: result.usage,
            });
            const updated = await store.get(conv.id);
            if (updated) setConversation(updated);
            setConversationId(conv.id);
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
          onError?.(err instanceof Error ? err : new Error(String(err)));
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (!chatServiceRef.current) {
        throw new Error('Chat service not initialized');
      }

      setIsLoading(true);
      setError(null);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Add user message immediately (skip when regenerating from edit)
        if (!opts?.skipUserAppend) {
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
        }

        if (streaming) {
          // Streaming mode
          const result = await chatServiceRef.current.stream({
            conversationId: conversationId ?? undefined,
            content,
            attachments,
            skipUserAppend: opts?.skipUserAppend,
          });

          // Update conversation ID if new (skip when regenerating)
          if (!conversationId && !opts?.skipUserAppend) {
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
          let fullReasoning = '';
          const toolCallsMap = new Map<string, ChatToolCall>();
          const sources: ChatSource[] = [];

          for await (const chunk of result.stream) {
            if (chunk.type === 'text' && chunk.content) {
              fullContent += chunk.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? {
                        ...m,
                        content: fullContent,
                        reasoning: fullReasoning || undefined,
                        sources: sources.length ? sources : undefined,
                        toolCalls: toolCallsMap.size
                          ? Array.from(toolCallsMap.values())
                          : undefined,
                      }
                    : m
                )
              );
            } else if (chunk.type === 'reasoning' && chunk.content) {
              fullReasoning += chunk.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? { ...m, reasoning: fullReasoning }
                    : m
                )
              );
            } else if (chunk.type === 'source' && chunk.source) {
              sources.push(chunk.source as ChatSource);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? { ...m, sources: [...sources] }
                    : m
                )
              );
            } else if (chunk.type === 'tool_call' && chunk.toolCall) {
              const tc = chunk.toolCall;
              const chatTc: ChatToolCall = {
                id: tc.id,
                name: tc.name,
                args: tc.args,
                status: 'running',
              };
              toolCallsMap.set(tc.id, chatTc);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? { ...m, toolCalls: Array.from(toolCallsMap.values()) }
                    : m
                )
              );
            } else if (chunk.type === 'tool_result' && chunk.toolResult) {
              const tr = chunk.toolResult;
              const tc = toolCallsMap.get(tr.toolCallId);
              if (tc) {
                tc.result = tr.result;
                tc.status = 'completed';
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? { ...m, toolCalls: Array.from(toolCallsMap.values()) }
                    : m
                )
              );
            } else if (chunk.type === 'done') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === result.messageId
                    ? {
                        ...m,
                        content: fullContent,
                        reasoning: fullReasoning || undefined,
                        sources: sources.length ? sources : undefined,
                        toolCalls: toolCallsMap.size
                          ? Array.from(toolCallsMap.values())
                          : undefined,
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
            skipUserAppend: opts?.skipUserAppend,
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
    [conversationId, streaming, onSend, onResponse, onError, onUsage, messages, agentMode, store]
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

  const createNewConversation = clearConversation;

  const editMessage = React.useCallback(
    async (messageId: string, newContent: string) => {
      if (!chatServiceRef.current || !conversationId) return;

      const msg = messages.find((m) => m.id === messageId);
      if (!msg || msg.role !== 'user') return;

      await chatServiceRef.current.updateMessage(
        conversationId,
        messageId,
        { content: newContent }
      );
      const truncated = await chatServiceRef.current.truncateAfter(
        conversationId,
        messageId
      );
      if (truncated) {
        setMessages(truncated.messages);
      }

      await sendMessage(newContent, undefined, { skipUserAppend: true });
    },
    [conversationId, messages, sendMessage]
  );

  const forkConversation = React.useCallback(
    async (upToMessageId?: string): Promise<string | null> => {
      if (!chatServiceRef.current) return null;
      const idToFork = conversationId ?? conversation?.id;
      if (!idToFork) return null;

      try {
        const forked = await chatServiceRef.current.forkConversation(
          idToFork,
          upToMessageId
        );
        setConversationId(forked.id);
        setConversation(forked);
        setMessages(forked.messages);
        return forked.id;
      } catch {
        return null;
      }
    },
    [conversationId, conversation]
  );

  const updateConversationFn = React.useCallback(
    async (
      updates: Parameters<ConversationStore['update']>[1]
    ): Promise<ChatConversation | null> => {
      if (!chatServiceRef.current || !conversationId) return null;
      const updated = await chatServiceRef.current.updateConversation(
        conversationId,
        updates
      );
      if (updated) setConversation(updated);
      return updated;
    },
    [conversationId]
  );

  const addToolApprovalResponse = React.useCallback(
    (_toolCallId: string, _result: unknown) => {
      // Tool approval with custom ChatService requires server route.
      // Use createChatRoute + @ai-sdk/react useChat for full support.
      throw new Error(
        `addToolApprovalResponse: Tool approval requires server route with toUIMessageStreamResponse. ` +
          `Use createChatRoute and @ai-sdk/react useChat for tools with requireApproval.`
      );
    },
    []
  );

  const hasApprovalTools = toolsDefs?.some((t) => t.requireApproval) ?? false;

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
    createNewConversation,
    editMessage,
    forkConversation,
    updateConversation: updateConversationFn,
    ...(hasApprovalTools && { addToolApprovalResponse }),
  };
}
