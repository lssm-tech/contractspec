import { defineCapability } from '../capabilities';
import { StabilityEnum } from '../ownership';

export const KnowledgeCapability = defineCapability({
  meta: {
    key: 'knowledge',
    version: '1.0.0',
    kind: 'data',
    stability: StabilityEnum.Experimental,
    description: 'Knowledge base and content management capability',
    owners: ['platform.content'],
    tags: ['knowledge', 'content', 'data'],
  },
});
