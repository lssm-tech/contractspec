import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';

export type LocalDbValue =
  | string
  | number
  | boolean
  | null
  | Uint8Array
  | undefined;

type SqlBindValue = string | number | null | Uint8Array;

export type LocalRow = Record<string, LocalDbValue>;

export interface LocalDatabaseInitOptions {
  modulesPath?: string;
  seed?: Uint8Array;
  migrations?: string[];
}

const DEFAULT_MIGRATIONS: string[] = [
  // Tasks
  `
  CREATE TABLE IF NOT EXISTS template_task_category (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_task (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    categoryId TEXT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'MEDIUM',
    dueDate TEXT,
    tags TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  // Messaging
  `
  CREATE TABLE IF NOT EXISTS template_conversation (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    name TEXT,
    isGroup INTEGER DEFAULT 0,
    avatarUrl TEXT,
    lastMessageId TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_conversation_participant (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    projectId TEXT NOT NULL,
    userId TEXT NOT NULL,
    displayName TEXT,
    role TEXT,
    joinedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    lastReadAt TEXT
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_message (
    id TEXT PRIMARY KEY,
    conversationId TEXT NOT NULL,
    projectId TEXT NOT NULL,
    senderId TEXT NOT NULL,
    senderName TEXT,
    content TEXT NOT NULL,
    attachments TEXT,
    status TEXT DEFAULT 'SENT',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  // Recipes
  `
  CREATE TABLE IF NOT EXISTS template_recipe_category (
    id TEXT PRIMARY KEY,
    nameEn TEXT NOT NULL,
    nameFr TEXT NOT NULL,
    icon TEXT
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_recipe (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    categoryId TEXT,
    slugEn TEXT NOT NULL,
    slugFr TEXT NOT NULL,
    nameEn TEXT NOT NULL,
    nameFr TEXT NOT NULL,
    descriptionEn TEXT,
    descriptionFr TEXT,
    heroImageUrl TEXT,
    prepTimeMinutes INTEGER,
    cookTimeMinutes INTEGER,
    servings INTEGER,
    isFavorite INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_recipe_ingredient (
    id TEXT PRIMARY KEY,
    recipeId TEXT NOT NULL,
    nameEn TEXT NOT NULL,
    nameFr TEXT NOT NULL,
    quantity TEXT NOT NULL,
    ordering INTEGER DEFAULT 0
  );
`,
  `
  CREATE TABLE IF NOT EXISTS template_recipe_instruction (
    id TEXT PRIMARY KEY,
    recipeId TEXT NOT NULL,
    contentEn TEXT NOT NULL,
    contentFr TEXT NOT NULL,
    ordering INTEGER DEFAULT 0
  );
`,
  // ============ CRM Pipeline Tables ============
  `
  CREATE TABLE IF NOT EXISTS crm_pipeline (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    name TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS crm_stage (
    id TEXT PRIMARY KEY,
    pipelineId TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pipelineId) REFERENCES crm_pipeline(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS crm_deal (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    pipelineId TEXT NOT NULL,
    stageId TEXT NOT NULL,
    name TEXT NOT NULL,
    value REAL NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'OPEN',
    contactId TEXT,
    companyId TEXT,
    ownerId TEXT NOT NULL,
    expectedCloseDate TEXT,
    wonSource TEXT,
    lostReason TEXT,
    notes TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pipelineId) REFERENCES crm_pipeline(id),
    FOREIGN KEY (stageId) REFERENCES crm_stage(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS crm_company (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    name TEXT NOT NULL,
    domain TEXT,
    industry TEXT,
    size TEXT,
    website TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS crm_contact (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    companyId TEXT,
    firstName TEXT NOT NULL,
    lastName TEXT,
    email TEXT,
    phone TEXT,
    title TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (companyId) REFERENCES crm_company(id)
  );
`,
  // ============ SaaS Boilerplate Tables ============
  `
  CREATE TABLE IF NOT EXISTS saas_project (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'DRAFT',
    tier TEXT DEFAULT 'FREE',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS saas_subscription (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'FREE',
    status TEXT DEFAULT 'ACTIVE',
    billingCycle TEXT DEFAULT 'MONTHLY',
    currentPeriodStart TEXT,
    currentPeriodEnd TEXT,
    cancelAtPeriodEnd INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS saas_usage (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    metricName TEXT NOT NULL,
    value REAL NOT NULL DEFAULT 0,
    periodStart TEXT NOT NULL,
    periodEnd TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  // ============ Agent Console Tables ============
  `
  CREATE TABLE IF NOT EXISTS agent_tool (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0.0',
    category TEXT DEFAULT 'UTILITY',
    status TEXT DEFAULT 'ACTIVE',
    inputSchema TEXT,
    outputSchema TEXT,
    endpoint TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS agent_definition (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    modelProvider TEXT DEFAULT 'openai',
    modelName TEXT DEFAULT 'gpt-4',
    systemPrompt TEXT,
    temperature REAL DEFAULT 0.7,
    maxTokens INTEGER DEFAULT 4096,
    status TEXT DEFAULT 'DRAFT',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS agent_tool_assignment (
    id TEXT PRIMARY KEY,
    agentId TEXT NOT NULL,
    toolId TEXT NOT NULL,
    assignedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agentId) REFERENCES agent_definition(id),
    FOREIGN KEY (toolId) REFERENCES agent_tool(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS agent_run (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    agentId TEXT NOT NULL,
    status TEXT DEFAULT 'QUEUED',
    input TEXT,
    output TEXT,
    totalTokens INTEGER DEFAULT 0,
    promptTokens INTEGER DEFAULT 0,
    completionTokens INTEGER DEFAULT 0,
    estimatedCostUsd REAL DEFAULT 0,
    durationMs INTEGER,
    errorMessage TEXT,
    queuedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    startedAt TEXT,
    completedAt TEXT,
    FOREIGN KEY (agentId) REFERENCES agent_definition(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS agent_run_step (
    id TEXT PRIMARY KEY,
    runId TEXT NOT NULL,
    stepNumber INTEGER NOT NULL,
    type TEXT NOT NULL,
    toolId TEXT,
    toolInput TEXT,
    toolOutput TEXT,
    reasoning TEXT,
    tokensUsed INTEGER DEFAULT 0,
    durationMs INTEGER,
    status TEXT DEFAULT 'PENDING',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (runId) REFERENCES agent_run(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS agent_run_log (
    id TEXT PRIMARY KEY,
    runId TEXT NOT NULL,
    level TEXT DEFAULT 'INFO',
    message TEXT NOT NULL,
    metadata TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (runId) REFERENCES agent_run(id)
  );
`,
  // ============ Workflow System Tables ============
  `
  CREATE TABLE IF NOT EXISTS workflow_definition (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'APPROVAL',
    status TEXT DEFAULT 'DRAFT',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS workflow_step (
    id TEXT PRIMARY KEY,
    definitionId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    stepOrder INTEGER NOT NULL,
    type TEXT DEFAULT 'APPROVAL',
    requiredRoles TEXT,
    autoApproveCondition TEXT,
    timeoutHours INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (definitionId) REFERENCES workflow_definition(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS workflow_instance (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    definitionId TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    currentStepId TEXT,
    data TEXT,
    requestedBy TEXT NOT NULL,
    startedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    completedAt TEXT,
    FOREIGN KEY (definitionId) REFERENCES workflow_definition(id),
    FOREIGN KEY (currentStepId) REFERENCES workflow_step(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS workflow_approval (
    id TEXT PRIMARY KEY,
    instanceId TEXT NOT NULL,
    stepId TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    actorId TEXT,
    comment TEXT,
    decidedAt TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instanceId) REFERENCES workflow_instance(id),
    FOREIGN KEY (stepId) REFERENCES workflow_step(id)
  );
`,
  // ============ Marketplace Tables ============
  `
  CREATE TABLE IF NOT EXISTS marketplace_store (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'PENDING',
    rating REAL DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS marketplace_product (
    id TEXT PRIMARY KEY,
    storeId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'DRAFT',
    stock INTEGER DEFAULT 0,
    category TEXT,
    imageUrl TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES marketplace_store(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS marketplace_order (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    storeId TEXT NOT NULL,
    customerId TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    total REAL NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    shippingAddress TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES marketplace_store(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS marketplace_order_item (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    productId TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price REAL NOT NULL DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES marketplace_order(id),
    FOREIGN KEY (productId) REFERENCES marketplace_product(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS marketplace_payout (
    id TEXT PRIMARY KEY,
    storeId TEXT NOT NULL,
    amount REAL NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'PENDING',
    processedAt TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES marketplace_store(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS marketplace_review (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    customerId TEXT NOT NULL,
    orderId TEXT,
    rating INTEGER NOT NULL,
    comment TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES marketplace_product(id)
  );
`,
  // ============ Integration Hub Tables ============
  `
  CREATE TABLE IF NOT EXISTS integration (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'INACTIVE',
    iconUrl TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS integration_connection (
    id TEXT PRIMARY KEY,
    integrationId TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'DISCONNECTED',
    credentials TEXT,
    config TEXT,
    lastSyncAt TEXT,
    errorMessage TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (integrationId) REFERENCES integration(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS integration_sync_config (
    id TEXT PRIMARY KEY,
    connectionId TEXT NOT NULL,
    name TEXT NOT NULL,
    sourceEntity TEXT NOT NULL,
    targetEntity TEXT NOT NULL,
    frequency TEXT DEFAULT 'DAILY',
    status TEXT DEFAULT 'ACTIVE',
    lastRunAt TEXT,
    lastRunStatus TEXT,
    recordsSynced INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (connectionId) REFERENCES integration_connection(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS integration_field_mapping (
    id TEXT PRIMARY KEY,
    syncConfigId TEXT NOT NULL,
    sourceField TEXT NOT NULL,
    targetField TEXT NOT NULL,
    transformType TEXT,
    transformConfig TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (syncConfigId) REFERENCES integration_sync_config(id)
  );
`,
  // ============ Analytics Dashboard Tables ============
  `
  CREATE TABLE IF NOT EXISTS analytics_dashboard (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'DRAFT',
    refreshInterval TEXT DEFAULT 'NONE',
    isPublic INTEGER DEFAULT 0,
    shareToken TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  `
  CREATE TABLE IF NOT EXISTS analytics_widget (
    id TEXT PRIMARY KEY,
    dashboardId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    gridX INTEGER DEFAULT 0,
    gridY INTEGER DEFAULT 0,
    gridWidth INTEGER DEFAULT 6,
    gridHeight INTEGER DEFAULT 4,
    queryId TEXT,
    config TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dashboardId) REFERENCES analytics_dashboard(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS analytics_query (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    organizationId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    definition TEXT NOT NULL,
    sql TEXT,
    cacheTtlSeconds INTEGER DEFAULT 300,
    isShared INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`,
  // ============ Policy-safe Knowledge Assistant (template) ============
  `
  CREATE TABLE IF NOT EXISTS psa_user_context (
    projectId TEXT PRIMARY KEY,
    locale TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    allowedScope TEXT NOT NULL,
    kbSnapshotId TEXT
  );
`,
  `
  CREATE TABLE IF NOT EXISTS psa_rule (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    topicKey TEXT NOT NULL
  );
`,
  `
  CREATE TABLE IF NOT EXISTS psa_rule_version (
    id TEXT PRIMARY KEY,
    ruleId TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    topicKey TEXT NOT NULL,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL,
    sourceRefsJson TEXT NOT NULL,
    approvedBy TEXT,
    approvedAt TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ruleId) REFERENCES psa_rule(id)
  );
`,
  `
  CREATE TABLE IF NOT EXISTS psa_snapshot (
    id TEXT PRIMARY KEY,
    jurisdiction TEXT NOT NULL,
    asOfDate TEXT NOT NULL,
    includedRuleVersionIdsJson TEXT NOT NULL,
    publishedAt TEXT NOT NULL
  );
`,
  `
  CREATE TABLE IF NOT EXISTS psa_change_candidate (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    detectedAt TEXT NOT NULL,
    diffSummary TEXT NOT NULL,
    riskLevel TEXT NOT NULL,
    proposedRuleVersionIdsJson TEXT NOT NULL
  );
`,
  `
  CREATE TABLE IF NOT EXISTS psa_review_task (
    id TEXT PRIMARY KEY,
    changeCandidateId TEXT NOT NULL,
    status TEXT NOT NULL,
    assignedRole TEXT NOT NULL,
    decision TEXT,
    decidedAt TEXT,
    decidedBy TEXT,
    FOREIGN KEY (changeCandidateId) REFERENCES psa_change_candidate(id)
  );
`,
];

export class LocalDatabase {
  private SQL?: SqlJsStatic;
  private db?: Database;
  private initialized = false;

  async init(options: LocalDatabaseInitOptions = {}): Promise<void> {
    if (this.initialized) return;
    this.SQL = await initSqlJs({
      locateFile: (file: string) => {
        if (options.modulesPath) {
          return `${options.modulesPath.replace(/\/+$/, '')}/${file}`;
        }
        // In Node/test environments we must not fetch wasm over the network.
        // Use the workspace-installed sql.js wasm from node_modules.
        if (typeof window === 'undefined') {
          return `${process.cwd()}/node_modules/sql.js/dist/${file}`;
        }
        // In browser sandbox, fall back to the public CDN.
        return `https://sql.js.org/dist/${file}`;
      },
    });
    this.db = options.seed
      ? new this.SQL.Database(options.seed)
      : new this.SQL.Database();
    this.initialized = true;
    await this.runMigrations(options.migrations ?? []);
  }

  async exec<T extends LocalRow = LocalRow>(
    sql: string,
    params: LocalDbValue[] = []
  ): Promise<T[]> {
    const database = this.ensureDb();
    const statement = database.prepare(sql);
    try {
      const bindParams = params.map((value) =>
        this.normalizeValue(value)
      ) as SqlBindValue[];
      statement.bind(bindParams);
      const rows: T[] = [];
      while (statement.step()) {
        rows.push(statement.getAsObject() as T);
      }
      return rows;
    } finally {
      statement.free();
    }
  }

  async run(sql: string, params: LocalDbValue[] = []): Promise<void> {
    const database = this.ensureDb();
    const statement = database.prepare(sql);
    try {
      const bindParams = params.map((value) =>
        this.normalizeValue(value)
      ) as SqlBindValue[];
      statement.bind(bindParams);
      statement.step();
    } finally {
      statement.free();
    }
  }

  async transaction<T>(callback: (db: Database) => T): Promise<T> {
    const database = this.ensureDb();
    database.run('BEGIN TRANSACTION');
    try {
      const result = callback(database);
      database.run('COMMIT');
      return result;
    } catch (error) {
      database.run('ROLLBACK');
      throw error;
    }
  }

  export(): Uint8Array {
    const database = this.ensureDb();
    return database.export();
  }

  private async runMigrations(extraMigrations: string[]): Promise<void> {
    const database = this.ensureDb();
    for (const statement of [...DEFAULT_MIGRATIONS, ...extraMigrations]) {
      database.run(statement);
    }
  }

  private normalizeValue(value: LocalDbValue): SqlBindValue {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value ?? null;
  }

  private ensureDb(): Database {
    if (!this.db) {
      throw new Error(
        'LocalDatabase not initialized. Call `await init()` before using it.'
      );
    }
    return this.db;
  }
}
