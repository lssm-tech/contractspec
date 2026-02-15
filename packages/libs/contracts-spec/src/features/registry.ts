import { filterBy, getUniqueTags, groupBy } from '../registry-utils';
import type { FeatureModuleSpec } from './types';

function keyOf(f: FeatureModuleSpec) {
  return f.meta.key;
}

/** In-memory registry for FeatureModuleSpec. */
export class FeatureRegistry {
  private items = new Map<string, FeatureModuleSpec>();

  /** Register a feature module. Throws when the key already exists. */
  register(f: FeatureModuleSpec): this {
    const key = keyOf(f);
    if (this.items.has(key)) throw new Error(`Duplicate feature ${key}`);
    this.items.set(key, f);
    return this;
  }

  /** List all registered feature modules. */
  list(): FeatureModuleSpec[] {
    return [...this.items.values()];
  }

  /** Get a feature by its key (slug). */
  get(key: string): FeatureModuleSpec | undefined {
    return this.items.get(key);
  }

  /** Filter features by criteria. */
  filter(
    criteria: import('../registry-utils').RegistryFilter
  ): FeatureModuleSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List features with specific tag. */
  listByTag(tag: string): FeatureModuleSpec[] {
    return this.list().filter((f) => f.meta.tags?.includes(tag));
  }

  /** List features by owner. */
  listByOwner(owner: string): FeatureModuleSpec[] {
    return this.list().filter((f) => f.meta.owners?.includes(owner));
  }

  /** Group features by key function. */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<FeatureModuleSpec>
  ): Map<string, FeatureModuleSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all features. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}
