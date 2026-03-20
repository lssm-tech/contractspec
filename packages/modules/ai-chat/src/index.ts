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

export {
	type CreateAiSdkBundleAdapterDeps,
	createAiSdkBundleAdapter,
} from './adapters';
export * from './ai-chat.feature';
export * from './ai-chat.operations';
export * from './context';
export {
	type ChatAgentAdapter,
	createChatAgentAdapter,
} from './core/agent-adapter';
export * from './events'; // Assuming events exists or was added in step 1013 logic
export * from './presentation';

// Re-export presentation components (but not message types to avoid conflicts)
export {
	ChatContainer,
	ChatExportToolbar,
	ChatInput,
	ChatMessage as ChatMessageComponent,
	ChatSidebar,
	ChatWithExport,
	ChatWithSidebar,
	ThinkingLevelPicker,
} from './presentation/components';
export {
	useChat,
	useConversations,
	useMessageSelection,
	useProviders,
} from './presentation/hooks';
export * from './providers';
// Specs
export * from './schema';
