/**
 * @contractspec/module.ai-chat
 *
 * ContractSpec Vibe Coding Chat - AI-powered conversational coding assistant.
 */

// Feature definition
export { AiChatFeature } from './ai-chat.feature';

/// Core exports
// export * from './core'; // Commented out to avoid ChatMessage duplicate export
// Instead, import only what is needed from core if necessary, or let other modules import it directly

export * from './presentation';
export * from './providers';
export * from './context';

// Specs
export * from './schema';
export * from './ai-chat.operations';
export * from './events'; // Assuming events exists or was added in step 1013 logic
export * from './ai-chat.feature';

// Re-export presentation components (but not message types to avoid conflicts)
export {
  ChatContainer,
  ChatMessage as ChatMessageComponent,
  ChatInput,
  ChatExportToolbar,
  ChatWithExport,
  ChatSidebar,
  ChatWithSidebar,
  ThinkingLevelPicker,
} from './presentation/components';
export {
  useChat,
  useProviders,
  useMessageSelection,
  useConversations,
} from './presentation/hooks';
export {
  createAiSdkBundleAdapter,
  type CreateAiSdkBundleAdapterDeps,
} from './adapters';
export {
  createChatAgentAdapter,
  type ChatAgentAdapter,
} from './core/agent-adapter';
