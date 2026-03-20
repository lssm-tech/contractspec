/**
 * React hooks for AI Chat
 */

/** Re-export useCompletion from @ai-sdk/react for non-chat completion use cases */
export { useCompletion } from '@ai-sdk/react';
export {
	type UseChatOptions,
	type UseChatReturn,
	type UseChatToolDef,
	useChat,
} from './useChat';
export {
	type UseConversationsOptions,
	type UseConversationsReturn,
	useConversations,
} from './useConversations';
export {
	type UseMessageSelectionReturn,
	useMessageSelection,
} from './useMessageSelection';
export { type UseProvidersReturn, useProviders } from './useProviders';
