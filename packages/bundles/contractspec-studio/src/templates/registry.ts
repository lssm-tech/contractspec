export type TemplateId = 'todos-app' | 'messaging-app' | 'recipe-app-i18n';

export type TemplateCategory = 'productivity' | 'communication' | 'content';

export type TemplateComplexity = 'beginner' | 'intermediate' | 'advanced';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  icon: string;
  features: string[];
  tags: string[];
  schema: {
    models: string[];
    contracts: string[];
  };
  components: {
    list: string;
    detail: string;
    form?: string;
  };
  preview?: {
    demoUrl?: string;
    videoUrl?: string;
  };
  docs?: {
    quickstart?: string;
    reference?: string;
  };
}

export interface TemplateFilter {
  category?: TemplateCategory;
  complexity?: TemplateComplexity;
  tag?: string;
}

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
  {
    id: 'todos-app',
    name: 'To-dos List App',
    description:
      'CRUD flows, filtering, priorities, and ceremonies for handing off work across crews.',
    category: 'productivity',
    complexity: 'beginner',
    icon: '✅',
    features: ['CRUD tasks', 'Filters', 'Categories', 'Search', 'Priorities'],
    tags: ['tasks', 'ops', 'starter'],
    schema: {
      models: ['Task', 'TaskCategory'],
      contracts: ['template.todos.crud'],
    },
    components: {
      list: 'TaskList',
      detail: 'TaskDetailPanel',
      form: 'TaskForm',
    },
    preview: {
      demoUrl: '/sandbox?template=todos-app',
    },
    docs: {
      quickstart: '/docs/templates/todos-app',
    },
  },
  {
    id: 'messaging-app',
    name: 'Messaging Application',
    description:
      'Conversation roster, optimistic sending, typing indicators, and delivery telemetry.',
    category: 'communication',
    complexity: 'intermediate',
    icon: '💬',
    features: [
      'Conversations',
      'Real-time feed',
      'Typing indicators',
      'Read receipts',
    ],
    tags: ['messaging', 'realtime', 'ws'],
    schema: {
      models: ['Conversation', 'ConversationParticipant', 'Message'],
      contracts: ['template.messaging.core'],
    },
    components: {
      list: 'ConversationList',
      detail: 'MessageThread',
      form: 'MessageComposer',
    },
    preview: {
      demoUrl: '/sandbox?template=messaging-app',
    },
    docs: {
      quickstart: '/docs/templates/messaging-app',
    },
  },
  {
    id: 'recipe-app-i18n',
    name: 'Recipe App (i18n)',
    description:
      'Localized browsing experience with bilingual content, categories, and favorites.',
    category: 'content',
    complexity: 'intermediate',
    icon: '🍲',
    features: ['i18n', 'Favorites', 'Categories', 'Search', 'RTL-ready'],
    tags: ['content', 'i18n', 'localization'],
    schema: {
      models: [
        'RecipeCategory',
        'Recipe',
        'RecipeIngredient',
        'RecipeInstruction',
      ],
      contracts: ['template.recipes.browse'],
    },
    components: {
      list: 'RecipeList',
      detail: 'RecipeDetail',
      form: 'RecipeForm',
    },
    preview: {
      demoUrl: '/sandbox?template=recipe-app-i18n',
    },
    docs: {
      quickstart: '/docs/templates/recipe-app-i18n',
    },
  },
];

export function listTemplates(filter?: TemplateFilter): TemplateDefinition[] {
  if (!filter) return TEMPLATE_REGISTRY;
  return TEMPLATE_REGISTRY.filter((template) => {
    if (filter.category && template.category !== filter.category) {
      return false;
    }
    if (filter.complexity && template.complexity !== filter.complexity) {
      return false;
    }
    if (
      filter.tag &&
      !template.tags.some(
        (tag) => tag.toLowerCase() === filter.tag?.toLowerCase()
      )
    ) {
      return false;
    }
    return true;
  });
}

export function getTemplate(id: TemplateId): TemplateDefinition | undefined {
  return TEMPLATE_REGISTRY.find((template) => template.id === id);
}
