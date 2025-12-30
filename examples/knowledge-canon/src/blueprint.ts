import type { AppBlueprintSpec } from '@contractspec/lib.contracts/app-config/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts/ownership';

export const artisanKnowledgeBlueprint: AppBlueprintSpec = {
  meta: {
    key: 'artisan.knowledge.product',
    version: '1.0.0',
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
    answerFaq: { key: 'artisan.knowledge.answerFaq', version: '1.0.0' },
  },
  notes:
    'Workflows and assistants running on this blueprint should bind the Product Canon knowledge space.',
};
