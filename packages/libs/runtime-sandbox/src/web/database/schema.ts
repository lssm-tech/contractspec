/**
 * Drizzle schema for sandbox runtime database tables.
 *
 * This schema defines all tables used by the template examples:
 * - Todos (tasks, categories)
 * - Messaging (conversations, participants, messages)
 * - Recipes (categories, recipes, ingredients, instructions)
 * - CRM (pipelines, stages, deals, companies, contacts)
 * - SaaS (projects, subscriptions, usage)
 * - Agent Console (tools, definitions, runs, steps, logs)
 * - Workflow System (definitions, steps, instances, approvals)
 * - Marketplace (stores, products, orders, items, payouts, reviews)
 * - Integration Hub (integrations, connections, syncs, mappings)
 * - Analytics (dashboards, widgets, queries)
 * - Policy-Safe Knowledge Assistant (contexts, rules, versions, snapshots, candidates, tasks)
 */
import { integer, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core';

// ============ Todos Template ============

export const templateTaskCategory = pgTable('template_task_category', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const templateTask = pgTable('template_task', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  categoryId: text('categoryId'),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed').default(0),
  priority: text('priority').default('MEDIUM'),
  dueDate: text('dueDate'),
  tags: text('tags'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============ Messaging Template ============

export const templateConversation = pgTable('template_conversation', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  name: text('name'),
  isGroup: integer('isGroup').default(0),
  avatarUrl: text('avatarUrl'),
  lastMessageId: text('lastMessageId'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const templateConversationParticipant = pgTable(
  'template_conversation_participant',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversationId').notNull(),
    projectId: text('projectId').notNull(),
    userId: text('userId').notNull(),
    displayName: text('displayName'),
    role: text('role'),
    joinedAt: timestamp('joinedAt').defaultNow(),
    lastReadAt: text('lastReadAt'),
  }
);

export const templateMessage = pgTable('template_message', {
  id: text('id').primaryKey(),
  conversationId: text('conversationId').notNull(),
  projectId: text('projectId').notNull(),
  senderId: text('senderId').notNull(),
  senderName: text('senderName'),
  content: text('content').notNull(),
  attachments: text('attachments'),
  status: text('status').default('SENT'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============ Recipes Template ============

export const templateRecipeCategory = pgTable('template_recipe_category', {
  id: text('id').primaryKey(),
  nameEn: text('nameEn').notNull(),
  nameFr: text('nameFr').notNull(),
  icon: text('icon'),
});

export const templateRecipe = pgTable('template_recipe', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  categoryId: text('categoryId'),
  slugEn: text('slugEn').notNull(),
  slugFr: text('slugFr').notNull(),
  nameEn: text('nameEn').notNull(),
  nameFr: text('nameFr').notNull(),
  descriptionEn: text('descriptionEn'),
  descriptionFr: text('descriptionFr'),
  heroImageUrl: text('heroImageUrl'),
  prepTimeMinutes: integer('prepTimeMinutes'),
  cookTimeMinutes: integer('cookTimeMinutes'),
  servings: integer('servings'),
  isFavorite: integer('isFavorite').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const templateRecipeIngredient = pgTable('template_recipe_ingredient', {
  id: text('id').primaryKey(),
  recipeId: text('recipeId').notNull(),
  nameEn: text('nameEn').notNull(),
  nameFr: text('nameFr').notNull(),
  quantity: text('quantity').notNull(),
  ordering: integer('ordering').default(0),
});

export const templateRecipeInstruction = pgTable(
  'template_recipe_instruction',
  {
    id: text('id').primaryKey(),
    recipeId: text('recipeId').notNull(),
    contentEn: text('contentEn').notNull(),
    contentFr: text('contentFr').notNull(),
    ordering: integer('ordering').default(0),
  }
);

// ============ CRM Template ============

export const crmPipeline = pgTable('crm_pipeline', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const crmStage = pgTable('crm_stage', {
  id: text('id').primaryKey(),
  pipelineId: text('pipelineId').notNull(),
  name: text('name').notNull(),
  position: integer('position').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const crmDeal = pgTable('crm_deal', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  pipelineId: text('pipelineId').notNull(),
  stageId: text('stageId').notNull(),
  name: text('name').notNull(),
  value: real('value').notNull().default(0),
  currency: text('currency').default('USD'),
  status: text('status').default('OPEN'),
  contactId: text('contactId'),
  companyId: text('companyId'),
  ownerId: text('ownerId').notNull(),
  expectedCloseDate: text('expectedCloseDate'),
  wonSource: text('wonSource'),
  lostReason: text('lostReason'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const crmCompany = pgTable('crm_company', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  name: text('name').notNull(),
  domain: text('domain'),
  industry: text('industry'),
  size: text('size'),
  website: text('website'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const crmContact = pgTable('crm_contact', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  companyId: text('companyId'),
  firstName: text('firstName').notNull(),
  lastName: text('lastName'),
  email: text('email'),
  phone: text('phone'),
  title: text('title'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============ SaaS Template ============

export const saasProject = pgTable('saas_project', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('DRAFT'),
  tier: text('tier').default('FREE'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const saasSubscription = pgTable('saas_subscription', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  plan: text('plan').notNull().default('FREE'),
  status: text('status').default('ACTIVE'),
  billingCycle: text('billingCycle').default('MONTHLY'),
  currentPeriodStart: text('currentPeriodStart'),
  currentPeriodEnd: text('currentPeriodEnd'),
  cancelAtPeriodEnd: integer('cancelAtPeriodEnd').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const saasUsage = pgTable('saas_usage', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  metricName: text('metricName').notNull(),
  value: real('value').notNull().default(0),
  periodStart: text('periodStart').notNull(),
  periodEnd: text('periodEnd').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

// ============ Agent Console Template ============

export const agentTool = pgTable('agent_tool', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  version: text('version').default('1.0.0'),
  category: text('category').default('UTILITY'),
  status: text('status').default('ACTIVE'),
  inputSchema: text('inputSchema'),
  outputSchema: text('outputSchema'),
  endpoint: text('endpoint'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const agentDefinition = pgTable('agent_definition', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  modelProvider: text('modelProvider').default('openai'),
  modelName: text('modelName').default('gpt-4'),
  systemPrompt: text('systemPrompt'),
  temperature: real('temperature').default(0.7),
  maxTokens: integer('maxTokens').default(4096),
  status: text('status').default('DRAFT'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const agentToolAssignment = pgTable('agent_tool_assignment', {
  id: text('id').primaryKey(),
  agentId: text('agentId').notNull(),
  toolId: text('toolId').notNull(),
  assignedAt: timestamp('assignedAt').defaultNow(),
});

export const agentRun = pgTable('agent_run', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  agentId: text('agentId').notNull(),
  status: text('status').default('QUEUED'),
  input: text('input'),
  output: text('output'),
  totalTokens: integer('totalTokens').default(0),
  promptTokens: integer('promptTokens').default(0),
  completionTokens: integer('completionTokens').default(0),
  estimatedCostUsd: real('estimatedCostUsd').default(0),
  durationMs: integer('durationMs'),
  errorMessage: text('errorMessage'),
  queuedAt: timestamp('queuedAt').defaultNow(),
  startedAt: text('startedAt'),
  completedAt: text('completedAt'),
});

export const agentRunStep = pgTable('agent_run_step', {
  id: text('id').primaryKey(),
  runId: text('runId').notNull(),
  stepNumber: integer('stepNumber').notNull(),
  type: text('type').notNull(),
  toolId: text('toolId'),
  toolInput: text('toolInput'),
  toolOutput: text('toolOutput'),
  reasoning: text('reasoning'),
  tokensUsed: integer('tokensUsed').default(0),
  durationMs: integer('durationMs'),
  status: text('status').default('PENDING'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const agentRunLog = pgTable('agent_run_log', {
  id: text('id').primaryKey(),
  runId: text('runId').notNull(),
  level: text('level').default('INFO'),
  message: text('message').notNull(),
  metadata: text('metadata'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// ============ Workflow Template ============

export const workflowDefinition = pgTable('workflow_definition', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').default('APPROVAL'),
  status: text('status').default('DRAFT'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const workflowStep = pgTable('workflow_step', {
  id: text('id').primaryKey(),
  definitionId: text('definitionId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  stepOrder: integer('stepOrder').notNull(),
  type: text('type').default('APPROVAL'),
  requiredRoles: text('requiredRoles'),
  autoApproveCondition: text('autoApproveCondition'),
  timeoutHours: integer('timeoutHours'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const workflowInstance = pgTable('workflow_instance', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  definitionId: text('definitionId').notNull(),
  status: text('status').default('PENDING'),
  currentStepId: text('currentStepId'),
  data: text('data'),
  requestedBy: text('requestedBy').notNull(),
  startedAt: timestamp('startedAt').defaultNow(),
  completedAt: text('completedAt'),
});

export const workflowApproval = pgTable('workflow_approval', {
  id: text('id').primaryKey(),
  instanceId: text('instanceId').notNull(),
  stepId: text('stepId').notNull(),
  status: text('status').default('PENDING'),
  actorId: text('actorId'),
  comment: text('comment'),
  decidedAt: text('decidedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
});

// ============ Marketplace Template ============

export const marketplaceStore = pgTable('marketplace_store', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('PENDING'),
  rating: real('rating').default(0),
  reviewCount: integer('reviewCount').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const marketplaceProduct = pgTable('marketplace_product', {
  id: text('id').primaryKey(),
  storeId: text('storeId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull().default(0),
  currency: text('currency').default('USD'),
  status: text('status').default('DRAFT'),
  stock: integer('stock').default(0),
  category: text('category'),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const marketplaceOrder = pgTable('marketplace_order', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  storeId: text('storeId').notNull(),
  customerId: text('customerId').notNull(),
  status: text('status').default('PENDING'),
  total: real('total').notNull().default(0),
  currency: text('currency').default('USD'),
  shippingAddress: text('shippingAddress'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const marketplaceOrderItem = pgTable('marketplace_order_item', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull(),
  productId: text('productId').notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: real('price').notNull().default(0),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const marketplacePayout = pgTable('marketplace_payout', {
  id: text('id').primaryKey(),
  storeId: text('storeId').notNull(),
  amount: real('amount').notNull().default(0),
  currency: text('currency').default('USD'),
  status: text('status').default('PENDING'),
  processedAt: text('processedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const marketplaceReview = pgTable('marketplace_review', {
  id: text('id').primaryKey(),
  productId: text('productId').notNull(),
  customerId: text('customerId').notNull(),
  orderId: text('orderId'),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('createdAt').defaultNow(),
});

// ============ Integration Hub Template ============

export const integration = pgTable('integration', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  status: text('status').default('INACTIVE'),
  iconUrl: text('iconUrl'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const integrationConnection = pgTable('integration_connection', {
  id: text('id').primaryKey(),
  integrationId: text('integrationId').notNull(),
  name: text('name').notNull(),
  status: text('status').default('DISCONNECTED'),
  credentials: text('credentials'),
  config: text('config'),
  lastSyncAt: text('lastSyncAt'),
  errorMessage: text('errorMessage'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const integrationSyncConfig = pgTable('integration_sync_config', {
  id: text('id').primaryKey(),
  connectionId: text('connectionId').notNull(),
  name: text('name').notNull(),
  sourceEntity: text('sourceEntity').notNull(),
  targetEntity: text('targetEntity').notNull(),
  frequency: text('frequency').default('DAILY'),
  status: text('status').default('ACTIVE'),
  lastRunAt: text('lastRunAt'),
  lastRunStatus: text('lastRunStatus'),
  recordsSynced: integer('recordsSynced').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const integrationFieldMapping = pgTable('integration_field_mapping', {
  id: text('id').primaryKey(),
  syncConfigId: text('syncConfigId').notNull(),
  sourceField: text('sourceField').notNull(),
  targetField: text('targetField').notNull(),
  transformType: text('transformType'),
  transformConfig: text('transformConfig'),
  createdAt: timestamp('createdAt').defaultNow(),
});

// ============ Analytics Dashboard Template ============

export const analyticsDashboard = pgTable('analytics_dashboard', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  status: text('status').default('DRAFT'),
  refreshInterval: text('refreshInterval').default('NONE'),
  isPublic: integer('isPublic').default(0),
  shareToken: text('shareToken'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const analyticsWidget = pgTable('analytics_widget', {
  id: text('id').primaryKey(),
  dashboardId: text('dashboardId').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  gridX: integer('gridX').default(0),
  gridY: integer('gridY').default(0),
  gridWidth: integer('gridWidth').default(6),
  gridHeight: integer('gridHeight').default(4),
  queryId: text('queryId'),
  config: text('config'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const analyticsQuery = pgTable('analytics_query', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  organizationId: text('organizationId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  definition: text('definition').notNull(),
  sql: text('sql'),
  cacheTtlSeconds: integer('cacheTtlSeconds').default(300),
  isShared: integer('isShared').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// ============ Policy-Safe Knowledge Assistant Template ============

export const psaUserContext = pgTable('psa_user_context', {
  projectId: text('projectId').primaryKey(),
  locale: text('locale').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  allowedScope: text('allowedScope').notNull(),
  kbSnapshotId: text('kbSnapshotId'),
});

export const psaRule = pgTable('psa_rule', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  topicKey: text('topicKey').notNull(),
});

export const psaRuleVersion = pgTable('psa_rule_version', {
  id: text('id').primaryKey(),
  ruleId: text('ruleId').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  topicKey: text('topicKey').notNull(),
  version: integer('version').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull(),
  sourceRefsJson: text('sourceRefsJson').notNull(),
  approvedBy: text('approvedBy'),
  approvedAt: text('approvedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const psaSnapshot = pgTable('psa_snapshot', {
  id: text('id').primaryKey(),
  jurisdiction: text('jurisdiction').notNull(),
  asOfDate: text('asOfDate').notNull(),
  includedRuleVersionIdsJson: text('includedRuleVersionIdsJson').notNull(),
  publishedAt: text('publishedAt').notNull(),
});

export const psaChangeCandidate = pgTable('psa_change_candidate', {
  id: text('id').primaryKey(),
  projectId: text('projectId').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  detectedAt: text('detectedAt').notNull(),
  diffSummary: text('diffSummary').notNull(),
  riskLevel: text('riskLevel').notNull(),
  proposedRuleVersionIdsJson: text('proposedRuleVersionIdsJson').notNull(),
});

export const psaReviewTask = pgTable('psa_review_task', {
  id: text('id').primaryKey(),
  changeCandidateId: text('changeCandidateId').notNull(),
  status: text('status').notNull(),
  assignedRole: text('assignedRole').notNull(),
  decision: text('decision'),
  decidedAt: text('decidedAt'),
  decidedBy: text('decidedBy'),
});
