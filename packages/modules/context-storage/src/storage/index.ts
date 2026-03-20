import type {
	ContextPackListResult,
	ContextPackQuery,
	ContextPackRecord,
	ContextSnapshotItem,
	ContextSnapshotItemInput,
	ContextSnapshotListResult,
	ContextSnapshotQuery,
	ContextSnapshotRecord,
} from '@contractspec/lib.context-storage';
import type { ContextSnapshotStore } from '@contractspec/lib.context-storage/store';
import type {
	DatabaseProvider,
	DatabaseStatementParam,
} from '@contractspec/lib.contracts-integrations';

export interface PostgresContextStorageOptions {
	database: DatabaseProvider;
	schema?: string;
	createTablesIfMissing?: boolean;
}

export class PostgresContextStorage implements ContextSnapshotStore {
	private readonly database: DatabaseProvider;
	private readonly schema: string;
	private readonly createTablesIfMissing: boolean;
	private ensured = false;

	constructor(options: PostgresContextStorageOptions) {
		this.database = options.database;
		this.schema = options.schema ?? 'lssm_context';
		this.createTablesIfMissing = options.createTablesIfMissing ?? true;
	}

	async upsertPack(record: ContextPackRecord): Promise<ContextPackRecord> {
		await this.ensureTables();
		const packId = `${record.packKey}:${record.version}`;
		await this.database.execute(
			`INSERT INTO ${this.table('context_pack')}
        (id, pack_key, version, title, description, owners, tags, sources, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9, $10)
       ON CONFLICT (pack_key, version)
       DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         owners = EXCLUDED.owners,
         tags = EXCLUDED.tags,
         sources = EXCLUDED.sources,
         updated_at = EXCLUDED.updated_at;`,
			[
				packId,
				record.packKey,
				record.version,
				record.title,
				record.description ?? null,
				record.owners ? JSON.stringify(record.owners) : null,
				record.tags ? JSON.stringify(record.tags) : null,
				record.sources ? JSON.stringify(record.sources) : null,
				record.createdAt,
				record.updatedAt ?? record.createdAt,
			]
		);
		return record;
	}

	async getPack(
		packKey: string,
		version?: string
	): Promise<ContextPackRecord | null> {
		await this.ensureTables();
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('context_pack')}
       WHERE pack_key = $1
       ${version ? 'AND version = $2' : ''}
       ORDER BY version DESC
       LIMIT 1;`,
			version ? [packKey, version] : [packKey]
		);
		return rows.rows[0] ? this.mapPack(rows.rows[0]) : null;
	}

	async listPacks(
		query: ContextPackQuery = {}
	): Promise<ContextPackListResult> {
		await this.ensureTables();
		const { query: q, tag, owner, limit = 50, offset = 0 } = query;
		const filters: string[] = [];
		const params: DatabaseStatementParam[] = [];
		params.push(limit, offset);
		if (q) {
			params.push(`%${q}%`);
			filters.push(
				`(pack_key ILIKE $${params.length} OR title ILIKE $${params.length})`
			);
		}
		if (tag) {
			params.push(tag);
			filters.push(`tags @> to_jsonb(ARRAY[$${params.length}]::text[])`);
		}
		if (owner) {
			params.push(owner);
			filters.push(`owners @> to_jsonb(ARRAY[$${params.length}]::text[])`);
		}
		const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('context_pack')}
       ${where}
       ORDER BY updated_at DESC
       LIMIT $1 OFFSET $2;`,
			params
		);
		const packs = rows.rows.map((row) => this.mapPack(row));
		const total = rows.rowCount;
		return {
			packs,
			total,
			nextOffset:
				offset + packs.length < total ? offset + packs.length : undefined,
		};
	}

	async createSnapshot(
		record: ContextSnapshotRecord
	): Promise<ContextSnapshotRecord> {
		await this.ensureTables();
		await this.database.execute(
			`INSERT INTO ${this.table('context_snapshot')}
        (id, pack_key, pack_version, hash, item_count, created_by, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8);`,
			[
				record.snapshotId,
				record.packKey,
				record.packVersion,
				record.hash,
				record.itemCount ?? null,
				record.createdBy ?? null,
				record.metadata ? JSON.stringify(record.metadata) : null,
				record.createdAt,
			]
		);
		return record;
	}

	async getSnapshot(snapshotId: string): Promise<ContextSnapshotRecord | null> {
		await this.ensureTables();
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('context_snapshot')} WHERE id = $1;`,
			[snapshotId]
		);
		return rows.rows[0] ? this.mapSnapshot(rows.rows[0]) : null;
	}

	async listSnapshots(
		query: ContextSnapshotQuery = {}
	): Promise<ContextSnapshotListResult> {
		await this.ensureTables();
		const { packKey, snapshotId, limit = 50, offset = 0 } = query;
		const filters: string[] = [];
		const params: DatabaseStatementParam[] = [limit, offset];
		if (packKey) {
			params.push(packKey);
			filters.push(`pack_key = $${params.length}`);
		}
		if (snapshotId) {
			params.push(snapshotId);
			filters.push(`id = $${params.length}`);
		}
		const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('context_snapshot')}
       ${where}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2;`,
			params
		);
		const snapshots = rows.rows.map((row) => this.mapSnapshot(row));
		const total = rows.rowCount;
		return {
			snapshots,
			total,
			nextOffset:
				offset + snapshots.length < total
					? offset + snapshots.length
					: undefined,
		};
	}

	async addSnapshotItems(
		snapshotId: string,
		items: ContextSnapshotItemInput[]
	): Promise<ContextSnapshotItem[]> {
		await this.ensureTables();
		const created: ContextSnapshotItem[] = [];
		for (const item of items) {
			const createdAt = item.createdAt ?? new Date().toISOString();
			await this.database.execute(
				`INSERT INTO ${this.table('context_snapshot_item')}
          (id, snapshot_id, kind, source_key, source_version, content, text_content, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8::jsonb, $9);`,
				[
					item.itemId,
					snapshotId,
					item.kind,
					item.sourceKey,
					item.sourceVersion ?? null,
					JSON.stringify(item.content),
					item.textContent ?? null,
					item.metadata ? JSON.stringify(item.metadata) : null,
					createdAt,
				]
			);
			created.push({ ...item, snapshotId, createdAt });
		}
		return created;
	}

	async listSnapshotItems(
		snapshotId: string,
		options: { limit?: number; offset?: number } = {}
	): Promise<ContextSnapshotItem[]> {
		await this.ensureTables();
		const { limit = 100, offset = 0 } = options;
		const rows = await this.database.query(
			`SELECT * FROM ${this.table('context_snapshot_item')}
       WHERE snapshot_id = $1
       ORDER BY created_at ASC
       LIMIT $2 OFFSET $3;`,
			[snapshotId, limit, offset]
		);
		return rows.rows.map((row) => this.mapItem(row));
	}

	private async ensureTables(): Promise<void> {
		if (this.ensured || !this.createTablesIfMissing) return;
		await this.database.execute(`CREATE SCHEMA IF NOT EXISTS ${this.schema};`);
		await this.database.execute(
			`CREATE TABLE IF NOT EXISTS ${this.table('context_pack')} (
        id text PRIMARY KEY,
        pack_key text NOT NULL,
        version text NOT NULL,
        title text NOT NULL,
        description text,
        owners jsonb,
        tags jsonb,
        sources jsonb,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL,
        UNIQUE (pack_key, version)
      );`
		);
		await this.database.execute(
			`CREATE TABLE IF NOT EXISTS ${this.table('context_snapshot')} (
        id text PRIMARY KEY,
        pack_key text NOT NULL,
        pack_version text NOT NULL,
        hash text NOT NULL,
        item_count int,
        created_by text,
        metadata jsonb,
        created_at timestamptz NOT NULL
      );`
		);
		await this.database.execute(
			`CREATE TABLE IF NOT EXISTS ${this.table('context_snapshot_item')} (
        id text PRIMARY KEY,
        snapshot_id text NOT NULL,
        kind text NOT NULL,
        source_key text NOT NULL,
        source_version text,
        content jsonb NOT NULL,
        text_content text,
        metadata jsonb,
        created_at timestamptz NOT NULL
      );`
		);
		await this.database.execute(
			`CREATE INDEX IF NOT EXISTS context_snapshot_item_snapshot_idx
       ON ${this.table('context_snapshot_item')} (snapshot_id);`
		);
		this.ensured = true;
	}

	private table(name: string): string {
		return `${this.schema}.${name}`;
	}

	private mapPack(row: Record<string, unknown>): ContextPackRecord {
		return {
			packKey: String(row.pack_key),
			version: String(row.version),
			title: String(row.title),
			description: row.description ? String(row.description) : undefined,
			owners: arrayFromJson(row.owners),
			tags: arrayFromJson(row.tags),
			sources: arrayFromJson(row.sources) as ContextPackRecord['sources'],
			createdAt: String(row.created_at),
			updatedAt: row.updated_at ? String(row.updated_at) : undefined,
		};
	}

	private mapSnapshot(row: Record<string, unknown>): ContextSnapshotRecord {
		return {
			snapshotId: String(row.id),
			packKey: String(row.pack_key),
			packVersion: String(row.pack_version),
			hash: String(row.hash),
			itemCount: row.item_count != null ? Number(row.item_count) : undefined,
			createdBy: row.created_by ? String(row.created_by) : undefined,
			metadata: recordFromJson(row.metadata),
			createdAt: String(row.created_at),
		};
	}

	private mapItem(row: Record<string, unknown>): ContextSnapshotItem {
		return {
			itemId: String(row.id),
			snapshotId: String(row.snapshot_id),
			kind: String(row.kind),
			sourceKey: String(row.source_key),
			sourceVersion: row.source_version
				? String(row.source_version)
				: undefined,
			content: recordFromJson(row.content) ?? String(row.content ?? ''),
			textContent: row.text_content ? String(row.text_content) : undefined,
			metadata: recordFromJson(row.metadata),
			createdAt: String(row.created_at),
		};
	}
}

function arrayFromJson(value: unknown): string[] | undefined {
	if (!value) return undefined;
	if (Array.isArray(value)) return value.map(String);
	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) ? parsed.map(String) : undefined;
		} catch {
			return undefined;
		}
	}
	return undefined;
}

function recordFromJson(value: unknown): Record<string, unknown> | undefined {
	if (!value) return undefined;
	if (typeof value === 'object' && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value);
			return typeof parsed === 'object' && parsed
				? (parsed as Record<string, unknown>)
				: undefined;
		} catch {
			return undefined;
		}
	}
	return undefined;
}
