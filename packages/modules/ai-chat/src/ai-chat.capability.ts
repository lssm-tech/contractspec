import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts-spec';

export const AiChatCapability = defineCapability({
  meta: {
    key: 'ai-chat',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'AI-powered chat interface',
    owners: ['@platform.core'],
    tags: ['ai', 'chat', 'ui'],
  },
});
