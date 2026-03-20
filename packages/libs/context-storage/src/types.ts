export type ContextSourceKind =
	| 'docblock'
	| 'contract'
	| 'knowledge'
	| 'data-view'
	| 'schema'
	| 'migration'
	| 'external';

export interface ContextPackSourceRef {
	kind: ContextSourceKind;
	key: string;
	version?: string;
	required?: boolean;
	description?: string;
}

export interface ContextPackRecord {
	packKey: string;
	version: string;
	title: string;
	description?: string;
	owners?: string[];
	tags?: string[];
	sources?: ContextPackSourceRef[];
	createdAt: string;
	updatedAt?: string;
}

export interface ContextSnapshotRecord {
	snapshotId: string;
	packKey: string;
	packVersion: string;
	hash: string;
	itemCount?: number;
	createdAt: string;
	createdBy?: string;
	metadata?: Record<string, unknown>;
}

export interface ContextSnapshotItemInput {
	itemId: string;
	kind: string;
	sourceKey: string;
	sourceVersion?: string;
	content: Record<string, unknown> | string;
	textContent?: string;
	metadata?: Record<string, unknown>;
	createdAt?: string;
}

export interface ContextSnapshotItem extends ContextSnapshotItemInput {
	snapshotId: string;
	createdAt: string;
}

export interface ContextPackQuery {
	query?: string;
	tag?: string;
	owner?: string;
	limit?: number;
	offset?: number;
}

export interface ContextSnapshotQuery {
	packKey?: string;
	snapshotId?: string;
	limit?: number;
	offset?: number;
}

export interface ContextPackListResult {
	packs: ContextPackRecord[];
	total?: number;
	nextOffset?: number;
}

export interface ContextSnapshotListResult {
	snapshots: ContextSnapshotRecord[];
	total?: number;
	nextOffset?: number;
}
