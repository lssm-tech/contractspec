import type {
	ContextPackListResult,
	ContextPackQuery,
	ContextPackRecord,
	ContextSnapshotItem,
	ContextSnapshotItemInput,
	ContextSnapshotListResult,
	ContextSnapshotQuery,
	ContextSnapshotRecord,
} from './types';

export interface ContextSnapshotStore {
	upsertPack(record: ContextPackRecord): Promise<ContextPackRecord>;
	getPack(packKey: string, version?: string): Promise<ContextPackRecord | null>;
	listPacks(query?: ContextPackQuery): Promise<ContextPackListResult>;
	createSnapshot(record: ContextSnapshotRecord): Promise<ContextSnapshotRecord>;
	getSnapshot(snapshotId: string): Promise<ContextSnapshotRecord | null>;
	listSnapshots(
		query?: ContextSnapshotQuery
	): Promise<ContextSnapshotListResult>;
	addSnapshotItems(
		snapshotId: string,
		items: ContextSnapshotItemInput[]
	): Promise<ContextSnapshotItem[]>;
	listSnapshotItems(
		snapshotId: string,
		options?: { limit?: number; offset?: number }
	): Promise<ContextSnapshotItem[]>;
}
