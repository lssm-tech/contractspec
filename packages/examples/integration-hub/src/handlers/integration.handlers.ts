/**
 * Runtime-local Integration Hub handlers
 *
 * Database-backed handlers for the integration-hub template.
 */
import type { DatabasePort, DbRow } from '@contractspec/lib.runtime-sandbox';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { web } from '@contractspec/lib.runtime-sandbox';

const { generateId } = web;

// ============ Types ============

export interface Integration {
	id: string;
	projectId: string;
	organizationId: string;
	name: string;
	description?: string;
	type:
		| 'CRM'
		| 'MARKETING'
		| 'PAYMENT'
		| 'COMMUNICATION'
		| 'DATA'
		| 'ANALYTICS'
		| 'CUSTOM';
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

export interface ValidateByokKeyInput {
	connectionId: string;
	providerKey: string;
}

export interface ValidateByokKeyOutput {
	valid: boolean;
	provider: string;
	keyPrefix: string;
	expiresAt?: string;
	error?: string;
}

export interface RefreshOAuth2TokenInput {
	connectionId: string;
}

export interface RefreshOAuth2TokenOutput {
	refreshed: boolean;
	expiresAt: string;
	tokenType: string;
	scopes: string[];
}

export interface TransportOption {
	transport: 'rest' | 'mcp' | 'webhook' | 'sdk';
	supported: boolean;
	defaultVersion?: string;
}

export interface GetTransportOptionsInput {
	integrationId: string;
}

export interface GetTransportOptionsOutput {
	integrationId: string;
	transports: TransportOption[];
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

		let whereClause = 'WHERE "projectId" = $1';
		const params: (string | number)[] = [projectId];

		if (type && type !== 'all') {
			whereClause += ` AND type = $${params.length + 1}`;
			params.push(type);
		}

		if (status && status !== 'all') {
			whereClause += ` AND status = $${params.length + 1}`;
			params.push(status);
		}

		if (search) {
			whereClause += ` AND name LIKE $${params.length + 1}`;
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
				`SELECT * FROM integration ${whereClause} ORDER BY name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
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
			`INSERT INTO integration (id, "projectId", "organizationId", name, description, type, status, "iconUrl", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
			await db.query(`SELECT * FROM integration WHERE id = $1`, [id])
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
			whereClause += ` AND "integrationId" = $${params.length + 1}`;
			params.push(integrationId);
		}

		if (status && status !== 'all') {
			whereClause += ` AND status = $${params.length + 1}`;
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
				`SELECT * FROM integration_connection ${whereClause} ORDER BY "updatedAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
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
			`INSERT INTO integration_connection (id, "integrationId", name, status, credentials, config, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
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
			`UPDATE integration_connection SET status = 'CONNECTED', "updatedAt" = $1 WHERE id = $2`,
			[now, id]
		);

		// Activate integration
		await db.execute(
			`UPDATE integration SET status = 'ACTIVE', "updatedAt" = $1 WHERE id = $2`,
			[now, input.integrationId]
		);

		const rows = (
			await db.query(`SELECT * FROM integration_connection WHERE id = $1`, [id])
		).rows as unknown as ConnectionRow[];

		return rowToConnection(rows[0]!);
	}

	/**
	 * Disconnect a service
	 */
	async function disconnectService(connectionId: string): Promise<Connection> {
		const now = new Date().toISOString();

		await db.execute(
			`UPDATE integration_connection SET status = 'DISCONNECTED', "updatedAt" = $1 WHERE id = $2`,
			[now, connectionId]
		);

		const rows = (
			await db.query(`SELECT * FROM integration_connection WHERE id = $1`, [
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
			whereClause += ` AND "connectionId" = $${params.length + 1}`;
			params.push(connectionId);
		}

		if (status && status !== 'all') {
			whereClause += ` AND status = $${params.length + 1}`;
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
				`SELECT * FROM integration_sync_config ${whereClause} ORDER BY "updatedAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
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
			`INSERT INTO integration_sync_config (id, "connectionId", name, "sourceEntity", "targetEntity", frequency, status, "recordsSynced", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
			await db.query(`SELECT * FROM integration_sync_config WHERE id = $1`, [
				id,
			])
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
			`DELETE FROM integration_field_mapping WHERE "syncConfigId" = $1`,
			[input.syncConfigId]
		);

		for (const mapping of input.mappings) {
			const id = generateId('fmap');

			await db.execute(
				`INSERT INTO integration_field_mapping (id, "syncConfigId", "sourceField", "targetField", "transformType", "transformConfig", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
				await db.query(
					`SELECT * FROM integration_field_mapping WHERE id = $1`,
					[id]
				)
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
				`SELECT * FROM integration_field_mapping WHERE "syncConfigId" = $1`,
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
			`UPDATE integration_sync_config SET "lastRunAt" = $1, "lastRunStatus" = 'SUCCESS', "recordsSynced" = "recordsSynced" + $2, "updatedAt" = $3 WHERE id = $4`,
			[now, recordsSynced, now, syncConfigId]
		);

		// Update connection lastSyncAt
		const config = (
			await db.query(`SELECT * FROM integration_sync_config WHERE id = $1`, [
				syncConfigId,
			])
		).rows as unknown as SyncConfigRow[];

		if (config[0]) {
			await db.execute(
				`UPDATE integration_connection SET "lastSyncAt" = $1, "updatedAt" = $2 WHERE id = $3`,
				[now, now, config[0].connectionId]
			);
		}

		const rows = (
			await db.query(`SELECT * FROM integration_sync_config WHERE id = $1`, [
				syncConfigId,
			])
		).rows as unknown as SyncConfigRow[];

		return rowToSyncConfig(rows[0]!);
	}

	/**
	 * Validate a BYOK (Bring Your Own Key) key for a connection.
	 * Returns mock validation data to demonstrate the pattern.
	 */
	async function validateByokKey(
		input: ValidateByokKeyInput
	): Promise<ValidateByokKeyOutput> {
		const rows = (
			await db.query(`SELECT * FROM integration_connection WHERE id = $1`, [
				input.connectionId,
			])
		).rows as unknown as ConnectionRow[];

		if (!rows[0]) {
			return {
				valid: false,
				provider: 'unknown',
				keyPrefix: '',
				error: `Connection ${input.connectionId} not found`,
			};
		}

		const keyPrefix = input.providerKey.slice(0, 8);
		const looksValid = input.providerKey.length >= 16;

		return {
			valid: looksValid,
			provider: rows[0].name,
			keyPrefix: `${keyPrefix}...`,
			expiresAt: looksValid
				? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
				: undefined,
			error: looksValid ? undefined : 'Key must be at least 16 characters',
		};
	}

	/**
	 * Refresh an OAuth2 token for a connection.
	 * Returns mock token data to demonstrate the pattern.
	 */
	async function refreshOAuth2Token(
		input: RefreshOAuth2TokenInput
	): Promise<RefreshOAuth2TokenOutput> {
		const now = new Date().toISOString();

		await db.execute(
			`UPDATE integration_connection SET "updatedAt" = $1 WHERE id = $2`,
			[now, input.connectionId]
		);

		return {
			refreshed: true,
			expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
			tokenType: 'Bearer',
			scopes: ['read', 'write', 'sync'],
		};
	}

	/**
	 * List available transport options for an integration.
	 * Returns mock transport data to demonstrate the pattern.
	 */
	async function getTransportOptions(
		input: GetTransportOptionsInput
	): Promise<GetTransportOptionsOutput> {
		return {
			integrationId: input.integrationId,
			transports: [
				{ transport: 'rest', supported: true, defaultVersion: 'v2' },
				{ transport: 'mcp', supported: true, defaultVersion: 'v1' },
				{ transport: 'webhook', supported: true },
				{ transport: 'sdk', supported: false },
			],
		};
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
		validateByokKey,
		refreshOAuth2Token,
		getTransportOptions,
	};
}

export type IntegrationHandlers = ReturnType<typeof createIntegrationHandlers>;
