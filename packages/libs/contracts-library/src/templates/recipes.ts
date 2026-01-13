import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

const OWNERS = ['platform.contractspec-studio'] as const;

export const RecipeCapability = defineCapability({
  meta: {
    key: 'template.recipes.browse',
    version: '1.0.0',
    kind: 'api',
    title: 'Template Recipe Browser',
    description:
      'Internationalized recipe browsing, search, and detail operations for template applications.',
    domain: 'templates',
    owners: [...OWNERS],
    tags: ['templates', 'recipes', 'i18n', 'content'],
    stability: StabilityEnum.Stable,
  },
  provides: [
    {
      surface: 'operation',
      key: 'template.recipe.list',
      version: '1.0.0',
      description:
        'List recipes with category, difficulty, and locale filters.',
    },
    {
      surface: 'operation',
      key: 'template.recipe.get',
      version: '1.0.0',
      description: 'Fetch a recipe detail view including localized content.',
    },
    {
      surface: 'operation',
      key: 'template.recipe.search',
      version: '1.0.0',
      description:
        'Search recipes by ingredient, tag, or free text with i18n support.',
    },
    {
      surface: 'operation',
      key: 'template.recipe.favorite',
      version: '1.0.0',
      description:
        'Toggle recipe favorites for showcasing personalization patterns.',
    },
  ],
  requires: [{ key: 'studio.project', version: '1.0.0' }],
});
