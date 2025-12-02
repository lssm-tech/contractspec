/**
 * Integration Hub Handlers
 */

export interface IntegrationHandlerContext {
  userId: string;
  userRoles: string[];
  organizationId: string;
}

// ============ Mock Data Store ============

export const mockIntegrationStore = {
  integrations: new Map<string, unknown>(),
  connections: new Map<string, unknown>(),
  syncConfigs: new Map<string, unknown>(),
  fieldMappings: new Map<string, unknown>(),
  syncRuns: new Map<string, unknown>(),
  syncRecords: new Map<string, unknown>(),
};

// ============ Handlers ============

export async function handleCreateIntegration(
  input: {
    name: string;
    slug: string;
    description?: string;
    provider: string;
    config?: unknown;
    featureFlagKey?: string;
  },
  context: IntegrationHandlerContext
): Promise<{
  id: string;
  name: string;
  slug: string;
  provider: string;
  status: string;
  createdAt: Date;
}> {
  const id = `int_${Date.now()}`;
  const now = new Date();

  const integration = {
    id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    provider: input.provider,
    status: 'DRAFT',
    featureFlagKey: input.featureFlagKey,
    config: input.config,
    organizationId: context.organizationId,
    createdBy: context.userId,
    createdAt: now,
    updatedAt: now,
  };

  mockIntegrationStore.integrations.set(id, integration);

  return {
    id,
    name: input.name,
    slug: input.slug,
    provider: input.provider,
    status: 'DRAFT',
    createdAt: now,
  };
}

export async function handleCreateConnection(
  input: {
    integrationId: string;
    name: string;
    authType: string;
    credentials?: unknown;
  },
  _context: IntegrationHandlerContext
): Promise<{
  id: string;
  integrationId: string;
  name: string;
  status: string;
  authType: string;
}> {
  const id = `conn_${Date.now()}`;
  const now = new Date();

  const connection = {
    id,
    integrationId: input.integrationId,
    name: input.name,
    status: 'PENDING',
    authType: input.authType,
    credentials: input.credentials,
    createdAt: now,
    updatedAt: now,
  };

  mockIntegrationStore.connections.set(id, connection);

  return {
    id,
    integrationId: input.integrationId,
    name: input.name,
    status: 'PENDING',
    authType: input.authType,
  };
}

export async function handleCreateSyncConfig(
  input: {
    integrationId: string;
    connectionId: string;
    name: string;
    direction: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
    sourceObject: string;
    targetObject: string;
    scheduleEnabled?: boolean;
    scheduleCron?: string;
  },
  _context: IntegrationHandlerContext
): Promise<{
  id: string;
  name: string;
  direction: string;
  sourceObject: string;
  targetObject: string;
  isActive: boolean;
}> {
  const id = `sync_${Date.now()}`;
  const now = new Date();

  const syncConfig = {
    id,
    integrationId: input.integrationId,
    connectionId: input.connectionId,
    name: input.name,
    direction: input.direction,
    sourceObject: input.sourceObject,
    targetObject: input.targetObject,
    scheduleEnabled: input.scheduleEnabled ?? false,
    scheduleCron: input.scheduleCron,
    createNew: true,
    updateExisting: true,
    deleteRemoved: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  mockIntegrationStore.syncConfigs.set(id, syncConfig);

  return {
    id,
    name: input.name,
    direction: input.direction,
    sourceObject: input.sourceObject,
    targetObject: input.targetObject,
    isActive: true,
  };
}

export async function handleAddFieldMapping(
  input: {
    syncConfigId: string;
    sourceField: string;
    targetField: string;
    mappingType: 'DIRECT' | 'TRANSFORM' | 'LOOKUP' | 'CONSTANT' | 'COMPUTED';
    transformExpression?: string;
    lookupConfig?: unknown;
    constantValue?: unknown;
    isRequired?: boolean;
    defaultValue?: unknown;
  },
  _context: IntegrationHandlerContext
): Promise<{
  id: string;
  sourceField: string;
  targetField: string;
  mappingType: string;
}> {
  const id = `map_${Date.now()}`;
  const now = new Date();

  // Get existing mappings count for position
  const existingMappings = Array.from(
    mockIntegrationStore.fieldMappings.values()
  ).filter(
    (m) => (m as { syncConfigId: string }).syncConfigId === input.syncConfigId
  );

  const mapping = {
    id,
    syncConfigId: input.syncConfigId,
    sourceField: input.sourceField,
    targetField: input.targetField,
    mappingType: input.mappingType,
    transformExpression: input.transformExpression,
    lookupConfig: input.lookupConfig,
    constantValue: input.constantValue,
    isRequired: input.isRequired ?? false,
    defaultValue: input.defaultValue,
    position: existingMappings.length,
    createdAt: now,
    updatedAt: now,
  };

  mockIntegrationStore.fieldMappings.set(id, mapping);

  return {
    id,
    sourceField: input.sourceField,
    targetField: input.targetField,
    mappingType: input.mappingType,
  };
}

export async function handleTriggerSync(
  input: {
    syncConfigId: string;
    direction?: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
    fullSync?: boolean;
  },
  context: IntegrationHandlerContext
): Promise<{
  id: string;
  syncConfigId: string;
  status: string;
  trigger: string;
  startedAt: Date;
  createdAt: Date;
}> {
  const id = `run_${Date.now()}`;
  const now = new Date();

  const syncConfig = mockIntegrationStore.syncConfigs.get(input.syncConfigId);
  const direction =
    input.direction ??
    (syncConfig as { direction: string } | undefined)?.direction ??
    'BIDIRECTIONAL';

  const syncRun = {
    id,
    syncConfigId: input.syncConfigId,
    status: 'RUNNING',
    direction,
    trigger: 'manual',
    triggeredBy: context.userId,
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsDeleted: 0,
    recordsFailed: 0,
    recordsSkipped: 0,
    startedAt: now,
    createdAt: now,
  };

  mockIntegrationStore.syncRuns.set(id, syncRun);

  return {
    id,
    syncConfigId: input.syncConfigId,
    status: 'RUNNING',
    trigger: 'manual',
    startedAt: now,
    createdAt: now,
  };
}

export async function handleListSyncRuns(
  input: {
    syncConfigId: string;
    status?: string;
    limit?: number;
    offset?: number;
  },
  _context: IntegrationHandlerContext
): Promise<{ runs: unknown[]; total: number }> {
  let runs = Array.from(mockIntegrationStore.syncRuns.values()).filter(
    (r) => (r as { syncConfigId: string }).syncConfigId === input.syncConfigId
  );

  if (input.status) {
    runs = runs.filter(
      (r) => (r as { status: string }).status === input.status
    );
  }

  const total = runs.length;
  const offset = input.offset ?? 0;
  const limit = input.limit ?? 20;

  runs = runs
    .sort((a, b) => {
      const aTime = (a as { createdAt: Date }).createdAt.getTime();
      const bTime = (b as { createdAt: Date }).createdAt.getTime();
      return bTime - aTime;
    })
    .slice(offset, offset + limit);

  return { runs, total };
}
