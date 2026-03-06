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
import type { ContextSnapshotStore } from './store';

export class InMemoryContextSnapshotStore implements ContextSnapshotStore {
  private readonly packs = new Map<string, ContextPackRecord>();
  private readonly snapshots = new Map<string, ContextSnapshotRecord>();
  private readonly items = new Map<string, ContextSnapshotItem[]>();

  async upsertPack(record: ContextPackRecord): Promise<ContextPackRecord> {
    const key = `${record.packKey}.v${record.version}`;
    const updatedAt = record.updatedAt ?? new Date().toISOString();
    const next = { ...record, updatedAt };
    this.packs.set(key, next);
    return next;
  }

  async getPack(
    packKey: string,
    version?: string
  ): Promise<ContextPackRecord | null> {
    if (version) return this.packs.get(`${packKey}.v${version}`) ?? null;
    const matches = [...this.packs.values()].filter(
      (pack) => pack.packKey === packKey
    );
    if (matches.length === 0) return null;
    return (
      matches.sort((a, b) => b.version.localeCompare(a.version))[0] ?? null
    );
  }

  async listPacks(
    query: ContextPackQuery = {}
  ): Promise<ContextPackListResult> {
    const { query: q, tag, owner, limit = 50, offset = 0 } = query;
    let results = [...this.packs.values()];
    if (q) {
      const needle = q.toLowerCase();
      results = results.filter(
        (pack) =>
          pack.packKey.toLowerCase().includes(needle) ||
          pack.title.toLowerCase().includes(needle)
      );
    }
    if (tag) {
      results = results.filter((pack) => pack.tags?.includes(tag));
    }
    if (owner) {
      results = results.filter((pack) => pack.owners?.includes(owner));
    }
    const slice = results.slice(offset, offset + limit);
    return {
      packs: slice,
      total: results.length,
      nextOffset:
        offset + slice.length < results.length
          ? offset + slice.length
          : undefined,
    };
  }

  async createSnapshot(
    record: ContextSnapshotRecord
  ): Promise<ContextSnapshotRecord> {
    this.snapshots.set(record.snapshotId, record);
    return record;
  }

  async getSnapshot(snapshotId: string): Promise<ContextSnapshotRecord | null> {
    return this.snapshots.get(snapshotId) ?? null;
  }

  async listSnapshots(
    query: ContextSnapshotQuery = {}
  ): Promise<ContextSnapshotListResult> {
    const { packKey, snapshotId, limit = 50, offset = 0 } = query;
    let results = [...this.snapshots.values()];
    if (packKey) results = results.filter((snap) => snap.packKey === packKey);
    if (snapshotId)
      results = results.filter((snap) => snap.snapshotId === snapshotId);
    const slice = results.slice(offset, offset + limit);
    return {
      snapshots: slice,
      total: results.length,
      nextOffset:
        offset + slice.length < results.length
          ? offset + slice.length
          : undefined,
    };
  }

  async addSnapshotItems(
    snapshotId: string,
    items: ContextSnapshotItemInput[]
  ): Promise<ContextSnapshotItem[]> {
    const created = items.map((item) => ({
      ...item,
      snapshotId,
      createdAt: item.createdAt ?? new Date().toISOString(),
    }));
    const current = this.items.get(snapshotId) ?? [];
    this.items.set(snapshotId, [...current, ...created]);
    return created;
  }

  async listSnapshotItems(
    snapshotId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<ContextSnapshotItem[]> {
    const { limit = 100, offset = 0 } = options;
    const current = this.items.get(snapshotId) ?? [];
    return current.slice(offset, offset + limit);
  }
}
