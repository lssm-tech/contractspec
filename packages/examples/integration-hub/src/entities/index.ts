import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

// ============ Enums ============

export const IntegrationStatusEnum = defineEntityEnum({
  name: 'IntegrationStatus',
  values: ['DRAFT', 'ACTIVE', 'PAUSED', 'ERROR', 'ARCHIVED'] as const,
  schema: 'integration',
  description: 'Status of an integration.',
});

export const ConnectionStatusEnum = defineEntityEnum({
  name: 'ConnectionStatus',
  values: ['PENDING', 'CONNECTED', 'DISCONNECTED', 'ERROR', 'EXPIRED'] as const,
  schema: 'integration',
  description: 'Status of a connection.',
});

export const SyncDirectionEnum = defineEntityEnum({
  name: 'SyncDirection',
  values: ['INBOUND', 'OUTBOUND', 'BIDIRECTIONAL'] as const,
  schema: 'integration',
  description: 'Direction of data sync.',
});

export const SyncStatusEnum = defineEntityEnum({
  name: 'SyncStatus',
  values: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const,
  schema: 'integration',
  description: 'Status of a sync run.',
});

export const MappingTypeEnum = defineEntityEnum({
  name: 'MappingType',
  values: ['DIRECT', 'TRANSFORM', 'LOOKUP', 'CONSTANT', 'COMPUTED'] as const,
  schema: 'integration',
  description: 'Type of field mapping.',
});

// ============ Entities ============

/**
 * Integration - defines an integration with an external system.
 */
export const IntegrationEntity = defineEntity({
  name: 'Integration',
  description: 'An integration with an external system.',
  schema: 'integration',
  map: 'integration',
  fields: {
    id: field.id({ description: 'Unique integration ID' }),
    
    // Identity
    name: field.string({ description: 'Integration name' }),
    slug: field.string({ description: 'URL-friendly identifier' }),
    description: field.string({ isOptional: true }),
    
    // Provider
    provider: field.string({ description: 'Integration provider (e.g., "salesforce", "hubspot")' }),
    providerVersion: field.string({ isOptional: true }),
    
    // Status
    status: field.enum('IntegrationStatus', { default: 'DRAFT' }),
    
    // Feature flag
    featureFlagKey: field.string({ isOptional: true }),
    
    // Configuration
    config: field.json({ isOptional: true, description: 'Integration-specific configuration' }),
    
    // Ownership
    organizationId: field.foreignKey(),
    createdBy: field.foreignKey(),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    connections: field.hasMany('Connection'),
    syncConfigs: field.hasMany('SyncConfig'),
  },
  indexes: [
    index.on(['organizationId', 'slug']).unique(),
    index.on(['organizationId', 'status']),
    index.on(['provider']),
  ],
  enums: [IntegrationStatusEnum],
});

/**
 * Connection - an authenticated connection to an external system.
 */
export const ConnectionEntity = defineEntity({
  name: 'Connection',
  description: 'An authenticated connection to an external system.',
  schema: 'integration',
  map: 'connection',
  fields: {
    id: field.id(),
    integrationId: field.foreignKey(),
    
    // Identity
    name: field.string({ description: 'Connection name' }),
    
    // Status
    status: field.enum('ConnectionStatus', { default: 'PENDING' }),
    
    // Authentication (encrypted)
    authType: field.string({ description: 'Auth type (oauth2, api_key, basic)' }),
    credentials: field.json({ isOptional: true, description: 'Encrypted credentials' }),
    
    // OAuth
    accessToken: field.string({ isOptional: true }),
    refreshToken: field.string({ isOptional: true }),
    tokenExpiresAt: field.dateTime({ isOptional: true }),
    
    // External reference
    externalAccountId: field.string({ isOptional: true }),
    externalAccountName: field.string({ isOptional: true }),
    
    // Health
    lastHealthCheck: field.dateTime({ isOptional: true }),
    healthStatus: field.string({ isOptional: true }),
    errorMessage: field.string({ isOptional: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    connectedAt: field.dateTime({ isOptional: true }),
    
    // Relations
    integration: field.belongsTo('Integration', ['integrationId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['integrationId', 'status']),
    index.on(['externalAccountId']),
  ],
  enums: [ConnectionStatusEnum],
});

/**
 * SyncConfig - configuration for data synchronization.
 */
export const SyncConfigEntity = defineEntity({
  name: 'SyncConfig',
  description: 'Configuration for data synchronization.',
  schema: 'integration',
  map: 'sync_config',
  fields: {
    id: field.id(),
    integrationId: field.foreignKey(),
    connectionId: field.foreignKey(),
    
    // Identity
    name: field.string({ description: 'Sync config name' }),
    
    // Sync settings
    direction: field.enum('SyncDirection', { default: 'BIDIRECTIONAL' }),
    
    // Object mapping
    sourceObject: field.string({ description: 'Source object type' }),
    targetObject: field.string({ description: 'Target object type' }),
    
    // Schedule
    scheduleEnabled: field.boolean({ default: false }),
    scheduleCron: field.string({ isOptional: true }),
    
    // Options
    createNew: field.boolean({ default: true }),
    updateExisting: field.boolean({ default: true }),
    deleteRemoved: field.boolean({ default: false }),
    
    // Filtering
    sourceFilter: field.json({ isOptional: true }),
    
    // Status
    isActive: field.boolean({ default: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    lastSyncAt: field.dateTime({ isOptional: true }),
    
    // Relations
    integration: field.belongsTo('Integration', ['integrationId'], ['id']),
    connection: field.belongsTo('Connection', ['connectionId'], ['id']),
    fieldMappings: field.hasMany('FieldMapping'),
    syncRuns: field.hasMany('SyncRun'),
  },
  indexes: [
    index.on(['integrationId', 'isActive']),
    index.on(['connectionId']),
    index.on(['scheduleEnabled', 'isActive']),
  ],
  enums: [SyncDirectionEnum],
});

/**
 * FieldMapping - maps fields between source and target objects.
 */
export const FieldMappingEntity = defineEntity({
  name: 'FieldMapping',
  description: 'Field mapping between source and target.',
  schema: 'integration',
  map: 'field_mapping',
  fields: {
    id: field.id(),
    syncConfigId: field.foreignKey(),
    
    // Source
    sourceField: field.string({ description: 'Source field path' }),
    
    // Target
    targetField: field.string({ description: 'Target field path' }),
    
    // Mapping type
    mappingType: field.enum('MappingType', { default: 'DIRECT' }),
    
    // Transform
    transformExpression: field.string({ isOptional: true, description: 'Transform expression for TRANSFORM type' }),
    lookupConfig: field.json({ isOptional: true, description: 'Lookup configuration for LOOKUP type' }),
    constantValue: field.json({ isOptional: true, description: 'Constant value for CONSTANT type' }),
    
    // Options
    isRequired: field.boolean({ default: false }),
    defaultValue: field.json({ isOptional: true }),
    
    // Position
    position: field.int({ default: 0 }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    syncConfig: field.belongsTo('SyncConfig', ['syncConfigId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['syncConfigId', 'position']),
    index.on(['syncConfigId', 'targetField']),
  ],
  enums: [MappingTypeEnum],
});

/**
 * SyncRun - a single execution of a sync.
 */
export const SyncRunEntity = defineEntity({
  name: 'SyncRun',
  description: 'A single sync execution.',
  schema: 'integration',
  map: 'sync_run',
  fields: {
    id: field.id(),
    syncConfigId: field.foreignKey(),
    
    // Status
    status: field.enum('SyncStatus', { default: 'PENDING' }),
    
    // Direction
    direction: field.enum('SyncDirection'),
    
    // Trigger
    trigger: field.string({ description: 'What triggered this run (schedule, manual, webhook)' }),
    triggeredBy: field.string({ isOptional: true }),
    
    // Stats
    recordsProcessed: field.int({ default: 0 }),
    recordsCreated: field.int({ default: 0 }),
    recordsUpdated: field.int({ default: 0 }),
    recordsDeleted: field.int({ default: 0 }),
    recordsFailed: field.int({ default: 0 }),
    recordsSkipped: field.int({ default: 0 }),
    
    // Error
    errorMessage: field.string({ isOptional: true }),
    errorDetails: field.json({ isOptional: true }),
    
    // Timing
    startedAt: field.dateTime({ isOptional: true }),
    completedAt: field.dateTime({ isOptional: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    
    // Relations
    syncConfig: field.belongsTo('SyncConfig', ['syncConfigId'], ['id']),
    logs: field.hasMany('SyncLog'),
  },
  indexes: [
    index.on(['syncConfigId', 'status']),
    index.on(['status', 'createdAt']),
    index.on(['createdAt']),
  ],
  enums: [SyncStatusEnum, SyncDirectionEnum],
});

/**
 * SyncLog - log entries for a sync run.
 */
export const SyncLogEntity = defineEntity({
  name: 'SyncLog',
  description: 'Log entry for a sync run.',
  schema: 'integration',
  map: 'sync_log',
  fields: {
    id: field.id(),
    syncRunId: field.foreignKey(),
    
    // Level
    level: field.string({ description: 'Log level (info, warn, error)' }),
    
    // Content
    message: field.string(),
    recordId: field.string({ isOptional: true, description: 'Related record ID' }),
    details: field.json({ isOptional: true }),
    
    // Timestamp
    createdAt: field.createdAt(),
    
    // Relations
    syncRun: field.belongsTo('SyncRun', ['syncRunId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['syncRunId', 'level']),
    index.on(['syncRunId', 'createdAt']),
  ],
});

/**
 * SyncRecord - tracks synced records for deduplication.
 */
export const SyncRecordEntity = defineEntity({
  name: 'SyncRecord',
  description: 'Tracks synced records.',
  schema: 'integration',
  map: 'sync_record',
  fields: {
    id: field.id(),
    syncConfigId: field.foreignKey(),
    
    // Record IDs
    sourceId: field.string({ description: 'ID in source system' }),
    targetId: field.string({ description: 'ID in target system' }),
    
    // Checksums for change detection
    sourceChecksum: field.string({ isOptional: true }),
    targetChecksum: field.string({ isOptional: true }),
    
    // Last sync
    lastSyncedAt: field.dateTime(),
    lastSyncRunId: field.string({ isOptional: true }),
    
    // Status
    syncStatus: field.string({ default: '"SYNCED"' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    syncConfig: field.belongsTo('SyncConfig', ['syncConfigId'], ['id']),
  },
  indexes: [
    index.on(['syncConfigId', 'sourceId']).unique(),
    index.on(['syncConfigId', 'targetId']),
    index.on(['lastSyncedAt']),
  ],
});

// ============ Schema Contribution ============

export const integrationHubEntities = [
  IntegrationEntity,
  ConnectionEntity,
  SyncConfigEntity,
  FieldMappingEntity,
  SyncRunEntity,
  SyncLogEntity,
  SyncRecordEntity,
];

export const integrationHubSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.integration-hub',
  entities: integrationHubEntities,
  enums: [
    IntegrationStatusEnum,
    ConnectionStatusEnum,
    SyncDirectionEnum,
    SyncStatusEnum,
    MappingTypeEnum,
  ],
};

