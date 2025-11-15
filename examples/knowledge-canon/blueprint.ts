import type { AppBlueprintSpec } from '@lssm/lib.contracts/app-config/spec';
import { OwnersEnum, StabilityEnum, TagsEnum } from '@lssm/lib.contracts/ownership';

export const artisanKnowledgeBlueprint: AppBlueprintSpec = {
  meta: {
    name: 'artisan.knowledge.product',
    version: 1,
    appId: 'artisan',
    title: 'ArtisanOS Knowledge – Product Canon',
    description:
      'Blueprint that surfaces canonical product knowledge to agents and workflows.',
    domain: 'knowledge',
    owners: [OwnersEnum.PlatformContent],
    tags: ['knowledge', 'product-canon', TagsEnum.Guide],
    stability: StabilityEnum.Experimental,
  },
  workflows: {
    answerFaq: { name: 'artisan.knowledge.answerFaq', version: 1 },
  },
  notes:
    'Workflows and assistants running on this blueprint should bind the Product Canon knowledge space.',
};





