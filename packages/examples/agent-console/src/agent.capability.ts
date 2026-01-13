import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

export const AgentCapability = defineCapability({
  meta: {
    key: 'agent',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'AI agent management and console capability',
    owners: ['platform.core'],
    tags: ['agent', 'ai', 'console'],
  },
});
