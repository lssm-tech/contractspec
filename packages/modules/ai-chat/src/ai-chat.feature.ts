/**
 * AI Chat Feature Module Specification
 *
 * Defines the feature module for AI-powered vibe coding chat.
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

/**
 * AI Chat feature module that bundles conversational AI assistance
 * for ContractSpec development across CLI, VSCode, and Studio.
 */
export const AiChatFeature: FeatureModuleSpec = {
  meta: {
    key: 'ai-chat',
    title: 'AI Vibe Coding Chat',
    description:
      'AI-powered conversational coding assistant with full workspace context',
    domain: 'platform',
    owners: ['@platform.ai'],
    tags: ['ai', 'chat', 'llm', 'vibe-coding', 'assistant'],
    stability: 'experimental',
  },

  // Contract operations for chat functionality
  operations: [
    { name: 'ai-chat.send', version: 1 },
    { name: 'ai-chat.stream', version: 1 },
    { name: 'ai-chat.conversations.list', version: 1 },
    { name: 'ai-chat.conversations.get', version: 1 },
    { name: 'ai-chat.conversations.delete', version: 1 },
    { name: 'ai-chat.providers.list', version: 1 },
    { name: 'ai-chat.context.scan', version: 1 },
  ],

  // Events emitted by the chat system
  events: [
    { name: 'ai-chat.message.sent', version: 1 },
    { name: 'ai-chat.message.received', version: 1 },
    { name: 'ai-chat.conversation.created', version: 1 },
    { name: 'ai-chat.conversation.deleted', version: 1 },
    { name: 'ai-chat.error', version: 1 },
  ],

  // No presentations for core module
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],

  // Capability definitions
  capabilities: {
    provides: [{ key: 'ai-chat', version: 1 }],
    requires: [
      { key: 'identity', version: 1 },
      { key: 'metering', version: 1 },
    ],
  },
};
