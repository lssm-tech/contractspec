/**
 * Schema migrations for PGLite sandbox runtime.
 *
 * These migrations create all tables defined in schema.ts.
 * Using raw SQL for migrations to work with DatabasePort interface.
 */
import type { Migration } from '@contractspec/lib.runtime-sandbox';

/**
 * All migrations for the sandbox runtime database.
 * Each migration should be idempotent (CREATE TABLE IF NOT EXISTS).
 */
export const SANDBOX_MIGRATIONS: Migration[] = [
  // ============ Todos Template ============
  {
    id: '001_template_task_category',
    sql: `
      CREATE TABLE IF NOT EXISTS template_task_category (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        name TEXT NOT NULL,
        color TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '002_template_task',
    sql: `
      CREATE TABLE IF NOT EXISTS template_task (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "categoryId" TEXT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'MEDIUM',
        "dueDate" TEXT,
        tags TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Messaging Template ============
  {
    id: '003_template_conversation',
    sql: `
      CREATE TABLE IF NOT EXISTS template_conversation (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        name TEXT,
        "isGroup" INTEGER DEFAULT 0,
        "avatarUrl" TEXT,
        "lastMessageId" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '004_template_conversation_participant',
    sql: `
      CREATE TABLE IF NOT EXISTS template_conversation_participant (
        id TEXT PRIMARY KEY,
        "conversationId" TEXT NOT NULL,
        "projectId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "displayName" TEXT,
        role TEXT,
        "joinedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "lastReadAt" TEXT
      );
    `,
  },
  {
    id: '005_template_message',
    sql: `
      CREATE TABLE IF NOT EXISTS template_message (
        id TEXT PRIMARY KEY,
        "conversationId" TEXT NOT NULL,
        "projectId" TEXT NOT NULL,
        "senderId" TEXT NOT NULL,
        "senderName" TEXT,
        content TEXT NOT NULL,
        attachments TEXT,
        status TEXT DEFAULT 'SENT',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Recipes Template ============
  {
    id: '006_template_recipe_category',
    sql: `
      CREATE TABLE IF NOT EXISTS template_recipe_category (
        id TEXT PRIMARY KEY,
        "nameEn" TEXT NOT NULL,
        "nameFr" TEXT NOT NULL,
        icon TEXT
      );
    `,
  },
  {
    id: '007_template_recipe',
    sql: `
      CREATE TABLE IF NOT EXISTS template_recipe (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "categoryId" TEXT,
        "slugEn" TEXT NOT NULL,
        "slugFr" TEXT NOT NULL,
        "nameEn" TEXT NOT NULL,
        "nameFr" TEXT NOT NULL,
        "descriptionEn" TEXT,
        "descriptionFr" TEXT,
        "heroImageUrl" TEXT,
        "prepTimeMinutes" INTEGER,
        "cookTimeMinutes" INTEGER,
        servings INTEGER,
        "isFavorite" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '008_template_recipe_ingredient',
    sql: `
      CREATE TABLE IF NOT EXISTS template_recipe_ingredient (
        id TEXT PRIMARY KEY,
        "recipeId" TEXT NOT NULL,
        "nameEn" TEXT NOT NULL,
        "nameFr" TEXT NOT NULL,
        quantity TEXT NOT NULL,
        ordering INTEGER DEFAULT 0
      );
    `,
  },
  {
    id: '009_template_recipe_instruction',
    sql: `
      CREATE TABLE IF NOT EXISTS template_recipe_instruction (
        id TEXT PRIMARY KEY,
        "recipeId" TEXT NOT NULL,
        "contentEn" TEXT NOT NULL,
        "contentFr" TEXT NOT NULL,
        ordering INTEGER DEFAULT 0
      );
    `,
  },
  // ============ CRM Template ============
  {
    id: '010_crm_pipeline',
    sql: `
      CREATE TABLE IF NOT EXISTS crm_pipeline (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        name TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '011_crm_stage',
    sql: `
      CREATE TABLE IF NOT EXISTS crm_stage (
        id TEXT PRIMARY KEY,
        "pipelineId" TEXT NOT NULL,
        name TEXT NOT NULL,
        position INTEGER NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '012_crm_deal',
    sql: `
      CREATE TABLE IF NOT EXISTS crm_deal (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "pipelineId" TEXT NOT NULL,
        "stageId" TEXT NOT NULL,
        name TEXT NOT NULL,
        value REAL NOT NULL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'OPEN',
        "contactId" TEXT,
        "companyId" TEXT,
        "ownerId" TEXT NOT NULL,
        "expectedCloseDate" TEXT,
        "wonSource" TEXT,
        "lostReason" TEXT,
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '013_crm_company',
    sql: `
      CREATE TABLE IF NOT EXISTS crm_company (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        name TEXT NOT NULL,
        domain TEXT,
        industry TEXT,
        size TEXT,
        website TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '014_crm_contact',
    sql: `
      CREATE TABLE IF NOT EXISTS crm_contact (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "companyId" TEXT,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT,
        email TEXT,
        phone TEXT,
        title TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ SaaS Template ============
  {
    id: '015_saas_project',
    sql: `
      CREATE TABLE IF NOT EXISTS saas_project (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'DRAFT',
        tier TEXT DEFAULT 'FREE',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '016_saas_subscription',
    sql: `
      CREATE TABLE IF NOT EXISTS saas_subscription (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'FREE',
        status TEXT DEFAULT 'ACTIVE',
        "billingCycle" TEXT DEFAULT 'MONTHLY',
        "currentPeriodStart" TEXT,
        "currentPeriodEnd" TEXT,
        "cancelAtPeriodEnd" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '017_saas_usage',
    sql: `
      CREATE TABLE IF NOT EXISTS saas_usage (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        "metricName" TEXT NOT NULL,
        value REAL NOT NULL DEFAULT 0,
        "periodStart" TEXT NOT NULL,
        "periodEnd" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Agent Console Template ============
  {
    id: '018_agent_tool',
    sql: `
      CREATE TABLE IF NOT EXISTS agent_tool (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        version TEXT DEFAULT '1.0.0',
        category TEXT DEFAULT 'UTILITY',
        status TEXT DEFAULT 'ACTIVE',
        "inputSchema" TEXT,
        "outputSchema" TEXT,
        endpoint TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '019_agent_definition',
    sql: `
      CREATE TABLE IF NOT EXISTS agent_definition (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        "modelProvider" TEXT DEFAULT 'openai',
        "modelName" TEXT DEFAULT 'gpt-4',
        "systemPrompt" TEXT,
        temperature REAL DEFAULT 0.7,
        "maxTokens" INTEGER DEFAULT 4096,
        status TEXT DEFAULT 'DRAFT',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '020_agent_tool_assignment',
    sql: `
      CREATE TABLE IF NOT EXISTS agent_tool_assignment (
        id TEXT PRIMARY KEY,
        "agentId" TEXT NOT NULL,
        "toolId" TEXT NOT NULL,
        "assignedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '021_agent_run',
    sql: `
      CREATE TABLE IF NOT EXISTS agent_run (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "agentId" TEXT NOT NULL,
        status TEXT DEFAULT 'QUEUED',
        input TEXT,
        output TEXT,
        "totalTokens" INTEGER DEFAULT 0,
        "promptTokens" INTEGER DEFAULT 0,
        "completionTokens" INTEGER DEFAULT 0,
        "estimatedCostUsd" REAL DEFAULT 0,
        "durationMs" INTEGER,
        "errorMessage" TEXT,
        "queuedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "startedAt" TEXT,
        "completedAt" TEXT
      );
    `,
  },
  {
    id: '022_agent_run_step',
    sql: `
      CREATE TABLE IF NOT EXISTS agent_run_step (
        id TEXT PRIMARY KEY,
        "runId" TEXT NOT NULL,
        "stepNumber" INTEGER NOT NULL,
        type TEXT NOT NULL,
        "toolId" TEXT,
        "toolInput" TEXT,
        "toolOutput" TEXT,
        reasoning TEXT,
        "tokensUsed" INTEGER DEFAULT 0,
        "durationMs" INTEGER,
        status TEXT DEFAULT 'PENDING',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '023_agent_run_log',
    sql: `
      CREATE TABLE IF NOT EXISTS agent_run_log (
        id TEXT PRIMARY KEY,
        "runId" TEXT NOT NULL,
        level TEXT DEFAULT 'INFO',
        message TEXT NOT NULL,
        metadata TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Workflow Template ============
  {
    id: '024_workflow_definition',
    sql: `
      CREATE TABLE IF NOT EXISTS workflow_definition (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'APPROVAL',
        status TEXT DEFAULT 'DRAFT',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '025_workflow_step',
    sql: `
      CREATE TABLE IF NOT EXISTS workflow_step (
        id TEXT PRIMARY KEY,
        "definitionId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        "stepOrder" INTEGER NOT NULL,
        type TEXT DEFAULT 'APPROVAL',
        "requiredRoles" TEXT,
        "autoApproveCondition" TEXT,
        "timeoutHours" INTEGER,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '026_workflow_instance',
    sql: `
      CREATE TABLE IF NOT EXISTS workflow_instance (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "definitionId" TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        "currentStepId" TEXT,
        data TEXT,
        "requestedBy" TEXT NOT NULL,
        "startedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "completedAt" TEXT
      );
    `,
  },
  {
    id: '027_workflow_approval',
    sql: `
      CREATE TABLE IF NOT EXISTS workflow_approval (
        id TEXT PRIMARY KEY,
        "instanceId" TEXT NOT NULL,
        "stepId" TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        "actorId" TEXT,
        comment TEXT,
        "decidedAt" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Marketplace Template ============
  {
    id: '028_marketplace_store',
    sql: `
      CREATE TABLE IF NOT EXISTS marketplace_store (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'PENDING',
        rating REAL DEFAULT 0,
        "reviewCount" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '029_marketplace_product',
    sql: `
      CREATE TABLE IF NOT EXISTS marketplace_product (
        id TEXT PRIMARY KEY,
        "storeId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'DRAFT',
        stock INTEGER DEFAULT 0,
        category TEXT,
        "imageUrl" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '030_marketplace_order',
    sql: `
      CREATE TABLE IF NOT EXISTS marketplace_order (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "storeId" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        status TEXT DEFAULT 'PENDING',
        total REAL NOT NULL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        "shippingAddress" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '031_marketplace_order_item',
    sql: `
      CREATE TABLE IF NOT EXISTS marketplace_order_item (
        id TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        price REAL NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '032_marketplace_payout',
    sql: `
      CREATE TABLE IF NOT EXISTS marketplace_payout (
        id TEXT PRIMARY KEY,
        "storeId" TEXT NOT NULL,
        amount REAL NOT NULL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'PENDING',
        "processedAt" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '033_marketplace_review',
    sql: `
      CREATE TABLE IF NOT EXISTS marketplace_review (
        id TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "orderId" TEXT,
        rating INTEGER NOT NULL,
        comment TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Integration Hub Template ============
  {
    id: '034_integration',
    sql: `
      CREATE TABLE IF NOT EXISTS integration (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'INACTIVE',
        "iconUrl" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '035_integration_connection',
    sql: `
      CREATE TABLE IF NOT EXISTS integration_connection (
        id TEXT PRIMARY KEY,
        "integrationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'DISCONNECTED',
        credentials TEXT,
        config TEXT,
        "lastSyncAt" TEXT,
        "errorMessage" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '036_integration_sync_config',
    sql: `
      CREATE TABLE IF NOT EXISTS integration_sync_config (
        id TEXT PRIMARY KEY,
        "connectionId" TEXT NOT NULL,
        name TEXT NOT NULL,
        "sourceEntity" TEXT NOT NULL,
        "targetEntity" TEXT NOT NULL,
        frequency TEXT DEFAULT 'DAILY',
        status TEXT DEFAULT 'ACTIVE',
        "lastRunAt" TEXT,
        "lastRunStatus" TEXT,
        "recordsSynced" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '037_integration_field_mapping',
    sql: `
      CREATE TABLE IF NOT EXISTS integration_field_mapping (
        id TEXT PRIMARY KEY,
        "syncConfigId" TEXT NOT NULL,
        "sourceField" TEXT NOT NULL,
        "targetField" TEXT NOT NULL,
        "transformType" TEXT,
        "transformConfig" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Analytics Dashboard Template ============
  {
    id: '038_analytics_dashboard',
    sql: `
      CREATE TABLE IF NOT EXISTS analytics_dashboard (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'DRAFT',
        "refreshInterval" TEXT DEFAULT 'NONE',
        "isPublic" INTEGER DEFAULT 0,
        "shareToken" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '039_analytics_widget',
    sql: `
      CREATE TABLE IF NOT EXISTS analytics_widget (
        id TEXT PRIMARY KEY,
        "dashboardId" TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        "gridX" INTEGER DEFAULT 0,
        "gridY" INTEGER DEFAULT 0,
        "gridWidth" INTEGER DEFAULT 6,
        "gridHeight" INTEGER DEFAULT 4,
        "queryId" TEXT,
        config TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '040_analytics_query',
    sql: `
      CREATE TABLE IF NOT EXISTS analytics_query (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        definition TEXT NOT NULL,
        sql TEXT,
        "cacheTtlSeconds" INTEGER DEFAULT 300,
        "isShared" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  // ============ Policy-Safe Knowledge Assistant Template ============
  {
    id: '041_psa_user_context',
    sql: `
      CREATE TABLE IF NOT EXISTS psa_user_context (
        "projectId" TEXT PRIMARY KEY,
        locale TEXT NOT NULL,
        jurisdiction TEXT NOT NULL,
        "allowedScope" TEXT NOT NULL,
        "kbSnapshotId" TEXT
      );
    `,
  },
  {
    id: '042_psa_rule',
    sql: `
      CREATE TABLE IF NOT EXISTS psa_rule (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        jurisdiction TEXT NOT NULL,
        "topicKey" TEXT NOT NULL
      );
    `,
  },
  {
    id: '043_psa_rule_version',
    sql: `
      CREATE TABLE IF NOT EXISTS psa_rule_version (
        id TEXT PRIMARY KEY,
        "ruleId" TEXT NOT NULL,
        jurisdiction TEXT NOT NULL,
        "topicKey" TEXT NOT NULL,
        version INTEGER NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL,
        "sourceRefsJson" TEXT NOT NULL,
        "approvedBy" TEXT,
        "approvedAt" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '044_psa_snapshot',
    sql: `
      CREATE TABLE IF NOT EXISTS psa_snapshot (
        id TEXT PRIMARY KEY,
        jurisdiction TEXT NOT NULL,
        "asOfDate" TEXT NOT NULL,
        "includedRuleVersionIdsJson" TEXT NOT NULL,
        "publishedAt" TEXT NOT NULL
      );
    `,
  },
  {
    id: '045_psa_change_candidate',
    sql: `
      CREATE TABLE IF NOT EXISTS psa_change_candidate (
        id TEXT PRIMARY KEY,
        "projectId" TEXT NOT NULL,
        jurisdiction TEXT NOT NULL,
        "detectedAt" TEXT NOT NULL,
        "diffSummary" TEXT NOT NULL,
        "riskLevel" TEXT NOT NULL,
        "proposedRuleVersionIdsJson" TEXT NOT NULL
      );
    `,
  },
  {
    id: '046_psa_review_task',
    sql: `
      CREATE TABLE IF NOT EXISTS psa_review_task (
        id TEXT PRIMARY KEY,
        "changeCandidateId" TEXT NOT NULL,
        status TEXT NOT NULL,
        "assignedRole" TEXT NOT NULL,
        decision TEXT,
        "decidedAt" TEXT,
        "decidedBy" TEXT
      );
    `,
  },
];
