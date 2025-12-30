/**
 * Runtime-local Integration Hub handlers
 *
 * Database-backed handlers for the integration-hub template.
 */
import type { DatabasePort, DbRow } from '@contractspec/lib.runtime-sandbox';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { generateId } from '../utils/id';

// ============ Types ============

export interface Integration {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'CRM' | 'MARKETING' | 'PAYMENT' | 'COMMUNICATION' | 'DATA' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE';
  iconUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Connection {
  id: string;
  integrationId: string;
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING';
  credentials?: Record<string, unknown>;
  config?: Record<string, unknown>;
  lastSyncAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncConfig {
  id: string;
  connectionId: string;
  name: string;
  sourceEntity: string;
  targetEntity: string;
  frequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MANUAL';
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  lastRunAt?: Date;
  lastRunStatus?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  recordsSynced: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldMapping {
  id: string;
  syncConfigId: string;
  sourceField: string;
  targetField: string;
  transformType?: 'DIRECT' | 'FORMAT' | 'LOOKUP' | 'CUSTOM';
  transformConfig?: Record<string, unknown>;
  createdAt: Date;
}

export interface CreateIntegrationInput {
  name: string;
  description?: string;
  type: Integration['type'];
  iconUrl?: string;
}

export interface ConnectServiceInput {
  integrationId: string;
  name: string;
  credentials?: Record<string, unknown>;
  config?: Record<string, unknown>;
}

export interface ConfigureSyncInput {
  connectionId: string;
  name: string;
  sourceEntity: string;
  targetEntity: string;
  frequency?: SyncConfig['frequency'];
}

export interface MapFieldsInput {
  syncConfigId: string;
  mappings: {
    sourceField: string;
    targetField: string;
    transformType?: FieldMapping['transformType'];
    transformConfig?: Record<string, unknown>;
  }[];
}

export interface ListIntegrationsInput {
  projectId: string;
  type?: Integration['type'] | 'all';
  status?: 'ACTIVE' | 'INACTIVE' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListIntegrationsOutput {
  integrations: Integration[];
  total: number;
}

export interface ListConnectionsInput {
  integrationId?: string;
  status?: Connection['status'] | 'all';
  limit?: number;
  offset?: number;
}

export interface ListConnectionsOutput {
  connections: Connection[];
  total: number;
}

export interface ListSyncConfigsInput {
  connectionId?: string;
  status?: SyncConfig['status'] | 'all';
  limit?: number;
  offset?: number;
}

export interface ListSyncConfigsOutput {
  configs: SyncConfig[];
  total: number;
}

// ============ Row Types ============

interface IntegrationRow {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  iconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ConnectionRow {
  id: string;
  integrationId: string;
  name: string;
  status: string;
  credentials: string | null;
  config: string | null;
  lastSyncAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SyncConfigRow {
  id: string;
  connectionId: string;
  name: string;
  sourceEntity: string;
  targetEntity: string;
  frequency: string;
  status: string;
  lastRunAt: string | null;
  lastRunStatus: string | null;
  recordsSynced: number;
  createdAt: string;
  updatedAt: string;
}

interface FieldMappingRow {
  id: string;
  syncConfigId: string;
  sourceField: string;
  targetField: string;
  transformType: string | null;
  transformConfig: string | null;
  createdAt: string;
}

function rowToIntegration(row: IntegrationRow): Integration {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    description: row.description ?? undefined,
    type: row.type as Integration['type'],
    status: row.status as Integration['status'],
    iconUrl: row.iconUrl ?? undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToConnection(row: ConnectionRow): Connection {
  return {
    id: row.id,
    integrationId: row.integrationId,
    name: row.name,
    status: row.status as Connection['status'],
    credentials: row.credentials ? JSON.parse(row.credentials) : undefined,
    config: row.config ? JSON.parse(row.config) : undefined,
    lastSyncAt: row.lastSyncAt ? new Date(row.lastSyncAt) : undefined,
    errorMessage: row.errorMessage ?? undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToSyncConfig(row: SyncConfigRow): SyncConfig {
  return {
    id: row.id,
    connectionId: row.connectionId,
    name: row.name,
    sourceEntity: row.sourceEntity,
    targetEntity: row.targetEntity,
    frequency: row.frequency as SyncConfig['frequency'],
    status: row.status as SyncConfig['status'],
    lastRunAt: row.lastRunAt ? new Date(row.lastRunAt) : undefined,
    lastRunStatus:
      (row.lastRunStatus as SyncConfig['lastRunStatus']) ?? undefined,
    recordsSynced: row.recordsSynced,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToFieldMapping(row: FieldMappingRow): FieldMapping {
  return {
    id: row.id,
    syncConfigId: row.syncConfigId,
    sourceField: row.sourceField,
    targetField: row.targetField,
    transformType:
      (row.transformType as FieldMapping['transformType']) ?? undefined,
    transformConfig: row.transformConfig
      ? JSON.parse(row.transformConfig)
      : undefined,
    createdAt: new Date(row.createdAt),
  };
}

// ============ Handler Factory ============

export function createIntegrationHandlers(db: DatabasePort) {
  /**
   * List integrations
   */
  async function listIntegrations(
    input: ListIntegrationsInput
  ): Promise<ListIntegrationsOutput> {
    const { projectId, type, status, search, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (type && type !== 'all') {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM integration ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM integration ${whereClause} ORDER BY name LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as IntegrationRow[];

    return {
      integrations: rows.map(rowToIntegration),
      total,
    };
  }

  /**
   * Create an integration
   */
  async function createIntegration(
    input: CreateIntegrationInput,
    context: { projectId: string; organizationId: string }
  ): Promise<Integration> {
    const id = generateId('integ');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO integration (id, projectId, organizationId, name, description, type, status, iconUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        context.organizationId,
        input.name,
        input.description ?? null,
        input.type,
        'INACTIVE',
        input.iconUrl ?? null,
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM integration WHERE id = ?`, [id])
    ).rows as unknown as IntegrationRow[];

    return rowToIntegration(rows[0]!);
  }

  /**
   * List connections
   */
  async function listConnections(
    input: ListConnectionsInput
  ): Promise<ListConnectionsOutput> {
    const { integrationId, status, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE 1=1';
    const params: (string | number)[] = [];

    if (integrationId) {
      whereClause += ' AND integrationId = ?';
      params.push(integrationId);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM integration_connection ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM integration_connection ${whereClause} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as ConnectionRow[];

    return {
      connections: rows.map(rowToConnection),
      total,
    };
  }

  /**
   * Connect a service
   */
  async function connectService(
    input: ConnectServiceInput
  ): Promise<Connection> {
    const id = generateId('conn');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO integration_connection (id, integrationId, name, status, credentials, config, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.integrationId,
        input.name,
        'PENDING',
        input.credentials ? JSON.stringify(input.credentials) : null,
        input.config ? JSON.stringify(input.config) : null,
        now,
        now,
      ]
    );

    // Simulate connection success
    await db.execute(
      `UPDATE integration_connection SET status = 'CONNECTED', updatedAt = ? WHERE id = ?`,
      [now, id]
    );

    // Activate integration
    await db.execute(
      `UPDATE integration SET status = 'ACTIVE', updatedAt = ? WHERE id = ?`,
      [now, input.integrationId]
    );

    const rows = (
      await db.query(`SELECT * FROM integration_connection WHERE id = ?`, [id])
    ).rows as unknown as ConnectionRow[];

    return rowToConnection(rows[0]!);
  }

  /**
   * Disconnect a service
   */
  async function disconnectService(connectionId: string): Promise<Connection> {
    const now = new Date().toISOString();

    await db.execute(
      `UPDATE integration_connection SET status = 'DISCONNECTED', updatedAt = ? WHERE id = ?`,
      [now, connectionId]
    );

    const rows = (
      await db.query(`SELECT * FROM integration_connection WHERE id = ?`, [
        connectionId,
      ])
    ).rows as unknown as ConnectionRow[];

    return rowToConnection(rows[0]!);
  }

  /**
   * List sync configs
   */
  async function listSyncConfigs(
    input: ListSyncConfigsInput
  ): Promise<ListSyncConfigsOutput> {
    const { connectionId, status, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE 1=1';
    const params: (string | number)[] = [];

    if (connectionId) {
      whereClause += ' AND connectionId = ?';
      params.push(connectionId);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const countResult = (
      await db.query(
        `SELECT COUNT(*) as count FROM integration_sync_config ${whereClause}`,
        params
      )
    ).rows as DbRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (
      await db.query(
        `SELECT * FROM integration_sync_config ${whereClause} ORDER BY updatedAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
    ).rows as unknown as SyncConfigRow[];

    return {
      configs: rows.map(rowToSyncConfig),
      total,
    };
  }

  /**
   * Configure a sync
   */
  async function configureSync(input: ConfigureSyncInput): Promise<SyncConfig> {
    const id = generateId('sync');
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO integration_sync_config (id, connectionId, name, sourceEntity, targetEntity, frequency, status, recordsSynced, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.connectionId,
        input.name,
        input.sourceEntity,
        input.targetEntity,
        input.frequency ?? 'DAILY',
        'ACTIVE',
        0,
        now,
        now,
      ]
    );

    const rows = (
      await db.query(`SELECT * FROM integration_sync_config WHERE id = ?`, [id])
    ).rows as unknown as SyncConfigRow[];

    return rowToSyncConfig(rows[0]!);
  }

  /**
   * Map fields for a sync
   */
  async function mapFields(input: MapFieldsInput): Promise<FieldMapping[]> {
    const now = new Date().toISOString();
    const mappings: FieldMapping[] = [];

    // Clear existing mappings
    await db.execute(
      `DELETE FROM integration_field_mapping WHERE syncConfigId = ?`,
      [input.syncConfigId]
    );

    for (const mapping of input.mappings) {
      const id = generateId('fmap');

      await db.execute(
        `INSERT INTO integration_field_mapping (id, syncConfigId, sourceField, targetField, transformType, transformConfig, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          input.syncConfigId,
          mapping.sourceField,
          mapping.targetField,
          mapping.transformType ?? null,
          mapping.transformConfig
            ? JSON.stringify(mapping.transformConfig)
            : null,
          now,
        ]
      );

      const rows = (
        await db.query(`SELECT * FROM integration_field_mapping WHERE id = ?`, [
          id,
        ])
      ).rows as unknown as FieldMappingRow[];

      mappings.push(rowToFieldMapping(rows[0]!));
    }

    return mappings;
  }

  /**
   * Get field mappings for a sync config
   */
  async function getFieldMappings(
    syncConfigId: string
  ): Promise<FieldMapping[]> {
    const rows = (
      await db.query(
        `SELECT * FROM integration_field_mapping WHERE syncConfigId = ?`,
        [syncConfigId]
      )
    ).rows as unknown as FieldMappingRow[];

    return rows.map(rowToFieldMapping);
  }

  /**
   * Run a sync (simulated)
   */
  async function runSync(syncConfigId: string): Promise<SyncConfig> {
    const now = new Date().toISOString();

    // Simulate sync execution
    const recordsSynced = Math.floor(Math.random() * 1000) + 50;

    await db.execute(
      `UPDATE integration_sync_config SET lastRunAt = ?, lastRunStatus = 'SUCCESS', recordsSynced = recordsSynced + ?, updatedAt = ? WHERE id = ?`,
      [now, recordsSynced, now, syncConfigId]
    );

    // Update connection lastSyncAt
    const config = (
      await db.query(`SELECT * FROM integration_sync_config WHERE id = ?`, [
        syncConfigId,
      ])
    ).rows as unknown as SyncConfigRow[];

    if (config[0]) {
      await db.execute(
        `UPDATE integration_connection SET lastSyncAt = ?, updatedAt = ? WHERE id = ?`,
        [now, now, config[0].connectionId]
      );
    }

    const rows = (
      await db.query(`SELECT * FROM integration_sync_config WHERE id = ?`, [
        syncConfigId,
      ])
    ).rows as unknown as SyncConfigRow[];

    return rowToSyncConfig(rows[0]!);
  }

  return {
    listIntegrations,
    createIntegration,
    listConnections,
    connectService,
    disconnectService,
    listSyncConfigs,
    configureSync,
    mapFields,
    getFieldMappings,
    runSync,
  };
}

export type IntegrationHandlers = ReturnType<typeof createIntegrationHandlers>;
