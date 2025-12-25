import { filterBy, getUniqueTags, groupBy } from '../registry-utils';
import type { PresentationSpec } from './presentations';

function keyOf(p: PresentationSpec) {
  return `${p.meta.key}.v${p.meta.version}`;
}

/** In-memory registry for PresentationSpec. */
export class PresentationRegistry {
  private items = new Map<string, PresentationSpec>();

  constructor(items?: PresentationSpec[]) {
    if (items) {
      items.forEach((p) => this.register(p));
    }
  }

  register(p: PresentationSpec): this {
    const key = keyOf(p);
    if (this.items.has(key)) throw new Error(`Duplicate presentation ${key}`);
    this.items.set(key, p);
    return this;
  }

  list(): PresentationSpec[] {
    return [...this.items.values()];
  }

  get(key: string, version?: number): PresentationSpec | undefined {
    if (version != null) return this.items.get(`${key}.v${version}`);
    let candidate: PresentationSpec | undefined;
    let max = -Infinity;
    for (const [k, p] of this.items.entries()) {
      if (!k.startsWith(`${key}.v`)) continue;
      if (p.meta.version > max) {
        max = p.meta.version;
        candidate = p;
      }
    }
    return candidate;
  }

  /** Filter presentations by criteria. */
  filter(
    criteria: import('../registry-utils').RegistryFilter
  ): PresentationSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List presentations with specific tag. */
  listByTag(tag: string): PresentationSpec[] {
    return this.list().filter((p) => p.meta.tags?.includes(tag));
  }

  /** List presentations by owner. */
  listByOwner(owner: string): PresentationSpec[] {
    return this.list().filter((p) => p.meta.owners?.includes(owner));
  }

  /** Group presentations by key function. */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<PresentationSpec>
  ): Map<string, PresentationSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all presentations. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}
