/**
 * @lssm/module.ai-chat
 *
 * ContractSpec Vibe Coding Chat - AI-powered conversational coding assistant.
 */

// Feature definition
export { AiChatFeature } from './ai-chat.feature';

// Core exports
export * from './core';

// Provider exports
export * from './providers';

// Context exports
export * from './context';

// Re-export presentation components (but not message types to avoid conflicts)
export {
  ChatContainer,
  ChatMessage as ChatMessageComponent,
  ChatInput,
} from './presentation/components';
export { useChat, useProviders } from './presentation/hooks';
