/**
 * React hooks for AI Chat
 */
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
  type UseChatToolDef,
} from './useChat';
export { useProviders, type UseProvidersReturn } from './useProviders';
export {
  useMessageSelection,
  type UseMessageSelectionReturn,
} from './useMessageSelection';
export {
  useConversations,
  type UseConversationsOptions,
  type UseConversationsReturn,
} from './useConversations';

/** Re-export useCompletion from @ai-sdk/react for non-chat completion use cases */
export { useCompletion } from '@ai-sdk/react';
