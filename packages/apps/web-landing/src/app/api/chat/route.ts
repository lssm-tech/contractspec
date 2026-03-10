import {
  createChatRoute,
  CHAT_ROUTE_MAX_DURATION,
} from '@contractspec/module.ai-chat/core';
import { createProvider } from '@contractspec/lib.ai-providers';

const provider = createProvider({
  provider: 'anthropic',
  mode: 'byok',
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const POST = createChatRoute({
  provider,
  systemPrompt:
    'You are a helpful AI assistant. Be concise and accurate. When using tools, explain what you are doing.',
  sendSources: true,
  sendReasoning: true,
});

export const maxDuration = CHAT_ROUTE_MAX_DURATION;
