export type TemplateId =
  | 'todos-app'
  | 'messaging-app'
  | 'recipe-app-i18n'
  | 'saas-boilerplate'
  | 'crm-pipeline'
  | 'agent-console'
  // Phase 2-3 Examples
  | 'workflow-system'
  | 'marketplace'
  | 'integration-hub'
  | 'analytics-dashboard';

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
  // ============================================
  // New Phase 1 Examples (using cross-cutting modules)
  // ============================================
  {
    id: 'saas-boilerplate',
    name: 'SaaS Boilerplate',
    description:
      'Complete SaaS foundation with multi-tenant organizations, projects, settings, and billing usage tracking.',
    category: 'business',
    complexity: 'intermediate',
    icon: '🚀',
    features: [
      'Multi-tenancy',
      'Organizations',
      'Projects',
      'Settings',
      'Billing Usage',
      'RBAC',
    ],
    tags: ['saas', 'multi-tenant', 'billing', 'starter', 'boilerplate'],
    schema: {
      models: [
        'Organization',
        'Member',
        'Project',
        'AppSettings',
        'UserSettings',
        'BillingUsage',
      ],
      contracts: [
        'saas.project.create',
        'saas.project.get',
        'saas.billing.recordUsage',
        'saas.billing.getOrganizationUsage',
      ],
    },
    components: {
      list: 'SaasProjectList',
      detail: 'SaasSettingsPanel',
      form: 'ProjectForm',
      dashboard: 'SaasDashboard',
    },
    preview: {
      demoUrl: '/sandbox?template=saas-boilerplate',
    },
    docs: {
      quickstart: '/docs/templates/saas-boilerplate',
    },
    package: '@lssm/example.saas-boilerplate',
    usesModules: ['@lssm/lib.identity-rbac', '@lssm/modules.audit-trail'],
    featureSpec: 'saas-boilerplate',
    presentations: [
      'saas-boilerplate.dashboard',
      'saas-boilerplate.project.list',
      'saas-boilerplate.billing.settings',
    ],
    renderTargets: ['react', 'markdown'],
  },
  {
    id: 'crm-pipeline',
    name: 'CRM Pipeline',
    description:
      'Sales CRM with contacts, companies, deals, pipeline stages, and task management.',
    category: 'business',
    complexity: 'advanced',
    icon: '💼',
    features: [
      'Contacts',
      'Companies',
      'Deals',
      'Pipelines',
      'Stages',
      'Tasks',
      'Kanban',
    ],
    tags: ['crm', 'sales', 'pipeline', 'deals', 'contacts'],
    schema: {
      models: ['Contact', 'Company', 'Deal', 'Pipeline', 'Stage', 'Task'],
      contracts: ['crm.deal.create', 'crm.deal.updateStage', 'crm.deal.get'],
    },
    components: {
      list: 'CrmPipelineBoard',
      detail: 'CrmDealCard',
      form: 'DealForm',
      dashboard: 'CrmDashboard',
    },
    preview: {
      demoUrl: '/sandbox?template=crm-pipeline',
    },
    docs: {
      quickstart: '/docs/templates/crm-pipeline',
    },
    package: '@lssm/example.crm-pipeline',
    usesModules: ['@lssm/lib.identity-rbac', '@lssm/modules.audit-trail'],
    featureSpec: 'crm-pipeline',
    presentations: ['crm-pipeline.dashboard', 'crm-pipeline.deal.pipeline'],
    renderTargets: ['react', 'markdown'],
  },
  {
    id: 'agent-console',
    name: 'Agent Console',
    description:
      'AI agent orchestration platform with tools, agents, runs, and execution logs.',
    category: 'ai',
    complexity: 'advanced',
    icon: '🤖',
    features: [
      'Tool Registry',
      'Agent Configuration',
      'Run Execution',
      'Step Tracking',
      'Execution Logs',
      'Token Tracking',
      'Cost Estimation',
    ],
    tags: ['ai', 'agents', 'llm', 'tools', 'orchestration'],
    schema: {
      models: ['Tool', 'Agent', 'AgentTool', 'Run', 'RunStep', 'RunLog'],
      contracts: [
        'agent.tool.create',
        'agent.agent.create',
        'agent.run.execute',
        'agent.run.get',
        'agent.run.getSteps',
        'agent.run.getLogs',
        'agent.run.getMetrics',
      ],
    },
    components: {
      list: 'AgentListView',
      detail: 'AgentRunList',
      form: 'AgentToolRegistry',
      dashboard: 'AgentDashboard',
    },
    preview: {
      demoUrl: '/sandbox?template=agent-console',
    },
    docs: {
      quickstart: '/docs/templates/agent-console',
    },
    package: '@lssm/example.agent-console',
    usesModules: [
      '@lssm/lib.identity-rbac',
      '@lssm/lib.jobs',
      '@lssm/modules.audit-trail',
    ],
    featureSpec: 'agent-console',
    presentations: [
      'agent-console.dashboard',
      'agent-console.agent.list',
      'agent-console.run.list',
      'agent-console.tool.registry',
    ],
    renderTargets: ['react', 'markdown'],
  },
  // ============================================
  // Phase 2 Examples
  // ============================================
  {
    id: 'workflow-system',
    name: 'Workflow / Approval System',
    description:
      'Configurable workflow engine with role-based approvals, state machines, and audit trails.',
    category: 'business',
    complexity: 'advanced',
    icon: '🔄',
    features: [
      'Workflow Definitions',
      'State Machines',
      'Multi-step Approvals',
      'Role-based Transitions',
      'Delegation',
      'Audit Trail',
    ],
    tags: ['workflow', 'approval', 'bpm', 'state-machine', 'enterprise'],
    schema: {
      models: [
        'WorkflowDefinition',
        'WorkflowStep',
        'WorkflowInstance',
        'Approval',
      ],
      contracts: [
        'workflow.definition.create',
        'workflow.instance.start',
        'workflow.step.approve',
        'workflow.step.reject',
      ],
    },
    components: {
      list: 'WorkflowDefinitionList',
      detail: 'WorkflowInstanceDetail',
      form: 'WorkflowDefinitionEditor',
      dashboard: 'WorkflowDashboard',
    },
    preview: {
      demoUrl: '/sandbox?template=workflow-system',
    },
    docs: {
      quickstart: '/docs/templates/workflow-system',
    },
    package: '@lssm/example.workflow-system',
    usesModules: [
      '@lssm/lib.identity-rbac',
      '@lssm/lib.feature-flags',
      '@lssm/modules.audit-trail',
      '@lssm/modules.notifications',
    ],
    featureSpec: 'workflow-system',
    presentations: [
      'workflow-system.dashboard',
      'workflow-system.definition.list',
      'workflow-system.instance.detail',
    ],
    renderTargets: ['react', 'markdown'],
  },
  {
    id: 'marketplace',
    name: 'Marketplace (2-sided)',
    description:
      'Full marketplace platform with stores, products, orders, payouts, and reviews.',
    category: 'business',
    complexity: 'advanced',
    icon: '🛒',
    features: [
      'Stores',
      'Products',
      'Orders',
      'Payments',
      'Payouts',
      'Reviews',
      'File Uploads',
    ],
    tags: ['marketplace', 'ecommerce', 'orders', 'payments', 'reviews'],
    schema: {
      models: ['Store', 'Product', 'Order', 'OrderItem', 'Payout', 'Review'],
      contracts: [
        'marketplace.store.create',
        'marketplace.product.add',
        'marketplace.order.place',
        'marketplace.payout.process',
        'marketplace.review.submit',
      ],
    },
    components: {
      list: 'ProductCatalog',
      detail: 'OrderDetail',
      form: 'ProductForm',
      dashboard: 'MarketplaceDashboard',
    },
    preview: {
      demoUrl: '/sandbox?template=marketplace',
    },
    docs: {
      quickstart: '/docs/templates/marketplace',
    },
    package: '@lssm/example.marketplace',
    usesModules: [
      '@lssm/lib.identity-rbac',
      '@lssm/lib.files',
      '@lssm/lib.metering',
      '@lssm/modules.audit-trail',
      '@lssm/modules.notifications',
    ],
    featureSpec: 'marketplace',
    presentations: [
      'marketplace.dashboard',
      'marketplace.product.catalog',
      'marketplace.order.list',
      'marketplace.store.manage',
    ],
    renderTargets: ['react', 'markdown'],
  },
  // ============================================
  // Phase 3 Examples
  // ============================================
  {
    id: 'integration-hub',
    name: 'Integration Hub',
    description:
      'Connect and sync data between external services with field mappings and scheduled syncs.',
    category: 'business',
    complexity: 'advanced',
    icon: '🔗',
    features: [
      'Integrations',
      'Connections',
      'Sync Configs',
      'Field Mappings',
      'Scheduled Syncs',
      'Sync Logs',
    ],
    tags: ['integrations', 'api', 'sync', 'etl', 'connectors'],
    schema: {
      models: ['Integration', 'Connection', 'SyncConfig', 'FieldMapping'],
      contracts: [
        'integration.create',
        'integration.connect',
        'integration.configureSync',
        'integration.mapFields',
        'integration.runSync',
      ],
    },
    components: {
      list: 'IntegrationList',
      detail: 'ConnectionDetail',
      form: 'SyncConfigEditor',
      dashboard: 'IntegrationDashboard',
    },
    preview: {
      demoUrl: '/sandbox?template=integration-hub',
    },
    docs: {
      quickstart: '/docs/templates/integration-hub',
    },
    package: '@lssm/example.integration-hub',
    usesModules: [
      '@lssm/lib.identity-rbac',
      '@lssm/lib.files',
      '@lssm/lib.feature-flags',
      '@lssm/modules.audit-trail',
      '@lssm/modules.notifications',
    ],
    featureSpec: 'integration-hub',
    presentations: [
      'integration-hub.dashboard',
      'integration-hub.connection.list',
      'integration-hub.sync.config',
    ],
    renderTargets: ['react', 'markdown'],
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description:
      'Build custom dashboards with drag-and-drop widgets, query builder, and scheduled reports.',
    category: 'business',
    complexity: 'advanced',
    icon: '📊',
    features: [
      'Dashboards',
      'Widgets',
      'Query Builder',
      'Visualizations',
      'Scheduled Reports',
      'Public Sharing',
    ],
    tags: ['analytics', 'dashboards', 'reporting', 'visualization', 'bi'],
    schema: {
      models: ['Dashboard', 'Widget', 'Query', 'Report'],
      contracts: [
        'analytics.dashboard.create',
        'analytics.widget.add',
        'analytics.query.execute',
        'analytics.dashboard.get',
      ],
    },
    components: {
      list: 'DashboardList',
      detail: 'DashboardView',
      form: 'QueryBuilder',
      dashboard: 'AnalyticsDashboard',
    },
    preview: {
      demoUrl: '/sandbox?template=analytics-dashboard',
    },
    docs: {
      quickstart: '/docs/templates/analytics-dashboard',
    },
    package: '@lssm/example.analytics-dashboard',
    usesModules: [
      '@lssm/lib.identity-rbac',
      '@lssm/lib.metering',
      '@lssm/modules.audit-trail',
      '@lssm/modules.notifications',
    ],
    featureSpec: 'analytics-dashboard',
    presentations: [
      'analytics-dashboard.dashboard',
      'analytics-dashboard.list',
      'analytics-dashboard.query.builder',
    ],
    renderTargets: ['react', 'markdown'],
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
