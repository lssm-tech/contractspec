import { listExamples } from '../registry';

export type TemplateId = string;

export type TemplateCategory =
  | 'productivity'
  | 'communication'
  | 'content'
  | 'business'
  | 'ai';

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
    dashboard?: string;
  };
  preview?: {
    demoUrl?: string;
    videoUrl?: string;
  };
  docs?: {
    quickstart?: string;
    reference?: string;
  };
  /** Package name for external examples that can be cloned via Git */
  package?: string;
  /** Whether this template uses the new cross-cutting modules */
  usesModules?: string[];
  /** Feature spec key from the example package */
  featureSpec?: string;
  /** List of presentation names available for this template */
  presentations?: string[];
  /** List of render targets supported (default: ['react']) */
  renderTargets?: ('react' | 'markdown' | 'json' | 'xml')[];
}

export interface TemplateFilter {
  category?: TemplateCategory;
  complexity?: TemplateComplexity;
  tag?: string;
}

const PRESENTATIONS_BY_TEMPLATE: Record<string, string[]> = {
  'saas-boilerplate': [
    'saas-boilerplate.dashboard',
    'saas-boilerplate.project.list',
    'saas-boilerplate.billing.settings',
  ],
  'crm-pipeline': ['crm-pipeline.dashboard', 'crm-pipeline.deal.pipeline'],
  'agent-console': [
    'agent-console.dashboard',
    'agent-console.agent.list',
    'agent-console.run.list',
    'agent-console.tool.registry',
  ],
  'workflow-system': [
    'workflow-system.dashboard',
    'workflow-system.definition.list',
    'workflow-system.instance.detail',
  ],
  marketplace: [
    'marketplace.dashboard',
    'marketplace.product.catalog',
    'marketplace.order.list',
    'marketplace.store.manage',
  ],
  'integration-hub': [
    'integration-hub.dashboard',
    'integration-hub.connection.list',
    'integration-hub.sync.config',
  ],
  'analytics-dashboard': [
    'analytics-dashboard.dashboard',
    'analytics-dashboard.list',
    'analytics-dashboard.query.builder',
  ],
  'learning-journey-studio-onboarding': [
    'learning.journey.track_list',
    'learning.journey.track_detail',
    'learning.journey.progress_widget',
  ],
  'learning-journey-platform-tour': [
    'learning.journey.track_list',
    'learning.journey.track_detail',
    'learning.journey.progress_widget',
  ],
  'learning-journey-crm-onboarding': [
    'learning.journey.track_list',
    'learning.journey.track_detail',
    'learning.journey.progress_widget',
  ],
  'learning-journey-duo-drills': [
    'learning.journey.track_list',
    'learning.journey.track_detail',
    'learning.journey.progress_widget',
  ],
  'learning-journey-ambient-coach': [
    'learning.journey.track_list',
    'learning.journey.track_detail',
    'learning.journey.progress_widget',
  ],
  'learning-journey-quest-challenges': [
    'learning.journey.track_list',
    'learning.journey.track_detail',
    'learning.journey.progress_widget',
  ],
};

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
  ...listExamples().map((example) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- meta.keywords fallback if tags missing
    const tags = (example.meta as any).keywords ?? [];

    const category: TemplateCategory =
      tags.some((t: string) => t.toLowerCase() === 'ai') ||
      tags.some((t: string) => t.toLowerCase() === 'assistant')
        ? 'ai'
        : 'business';

    const complexity: TemplateComplexity = 'beginner';

    const icon = '📦';

    return {
      id: example.meta.key,
      name: example.meta.title ?? example.meta.key,
      description: example.meta.description ?? '',
      category,
      complexity,
      icon,
      features: [],
      tags: [...tags],
      schema: { models: [], contracts: [] },
      components: { list: 'ExampleList', detail: 'ExampleDetail' },
      preview: {
        demoUrl: `/sandbox?template=${encodeURIComponent(example.meta.key)}`,
      },
      package: example.entrypoints.packageName,
      presentations: PRESENTATIONS_BY_TEMPLATE[example.meta.key] ?? [],
      renderTargets: ['react', 'markdown'],
    } satisfies TemplateDefinition;
  }),
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

/**
 * Get templates that use a specific cross-cutting module
 */
export function getTemplatesByModule(
  modulePackage: string
): TemplateDefinition[] {
  return TEMPLATE_REGISTRY.filter((template) =>
    template.usesModules?.includes(modulePackage)
  );
}

/**
 * Get all templates with external packages (clonable via Git)
 */
export function getClonableTemplates(): TemplateDefinition[] {
  return TEMPLATE_REGISTRY.filter((template) => !!template.package);
}
