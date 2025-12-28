import { filterBy, getUniqueTags, groupBy } from '../registry-utils';
import type { RegistryFilter, GroupKeyFn } from '../registry-utils';
import type { DataViewSpec } from './spec';

/**
 * Generate a unique key for a data view spec.
 */
export function dataViewKey(spec: DataViewSpec): string {
  return `${spec.meta.key}.v${spec.meta.version}`;
}

/**
 * Registry for managing data view specifications.
 */
export class DataViewRegistry {
  private readonly items = new Map<string, DataViewSpec>();

  /**
   * Register a data view spec.
   * @throws Error if a spec with the same key already exists.
   */
  register(spec: DataViewSpec): this {
    const key = dataViewKey(spec);
    if (this.items.has(key)) {
      throw new Error(`Duplicate data view ${key}`);
    }
    this.items.set(key, spec);
    return this;
  }

  /**
   * List all registered data view specs.
   */
  list(): DataViewSpec[] {
    return [...this.items.values()];
  }

  /**
   * Get a data view by key and optional version.
   * If version is not specified, returns the latest version.
   */
  get(name: string, version?: number): DataViewSpec | undefined {
    if (version != null) {
      return this.items.get(`${name}.v${version}`);
    }
    let candidate: DataViewSpec | undefined;
    let max = -Infinity;
    for (const spec of this.items.values()) {
      if (spec.meta.key !== name) continue;
      if (spec.meta.version > max) {
        max = spec.meta.version;
        candidate = spec;
      }
    }
    return candidate;
  }

  /**
   * Filter data views by criteria.
   */
  filter(criteria: RegistryFilter): DataViewSpec[] {
    return filterBy(this.list(), criteria);
  }

  /**
   * List data views with specific tag.
   */
  listByTag(tag: string): DataViewSpec[] {
    return this.list().filter((d) => d.meta.tags?.includes(tag));
  }

  /**
   * List data views by owner.
   */
  listByOwner(owner: string): DataViewSpec[] {
    return this.list().filter((d) => d.meta.owners?.includes(owner));
  }

  /**
   * Group data views by key function.
   */
  groupBy(keyFn: GroupKeyFn<DataViewSpec>): Map<string, DataViewSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /**
   * Get unique tags from all data views.
   */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}
