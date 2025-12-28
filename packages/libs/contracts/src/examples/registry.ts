import { filterBy, getUniqueTags, groupBy } from '../registry-utils';
import type { ExampleSpec, ExampleKind, ExampleVisibility } from './types';

function keyOf(spec: ExampleSpec): string {
  return spec.meta.key;
}

/**
 * In-memory registry for ExampleSpec.
 *
 * Provides methods for registering, querying, and filtering examples.
 *
 * @example
 * ```typescript
 * const registry = new ExampleRegistry();
 * registry.register(saasBoilerplateExample);
 * registry.register(workflowSystemExample);
 *
 * const templates = registry.listByKind('template');
 * const publicExamples = registry.listByVisibility('public');
 * ```
 */
export class ExampleRegistry {
  private items = new Map<string, ExampleSpec>();

  /** Register an example. Throws when the key already exists. */
  register(spec: ExampleSpec): this {
    const key = keyOf(spec);
    if (this.items.has(key)) {
      throw new Error(`Duplicate example: ${key}`);
    }
    this.items.set(key, spec);
    return this;
  }

  /** List all registered examples. */
  list(): ExampleSpec[] {
    return [...this.items.values()];
  }

  /** Get an example by its key. */
  get(key: string): ExampleSpec | undefined {
    return this.items.get(key);
  }

  /** Check if an example with the given key exists. */
  has(key: string): boolean {
    return this.items.has(key);
  }

  /** Get the number of registered examples. */
  get size(): number {
    return this.items.size;
  }

  /** Clear all registered examples. */
  clear(): void {
    this.items.clear();
  }

  /** Filter examples by criteria. */
  filter(
    criteria: import('../registry-utils').RegistryFilter
  ): ExampleSpec[] {
    return filterBy(this.list(), criteria);
  }

  /** List examples by kind. */
  listByKind(kind: ExampleKind): ExampleSpec[] {
    return this.list().filter((spec) => spec.meta.kind === kind);
  }

  /** List examples by visibility. */
  listByVisibility(visibility: ExampleVisibility): ExampleSpec[] {
    return this.list().filter((spec) => spec.meta.visibility === visibility);
  }

  /** List examples with specific tag. */
  listByTag(tag: string): ExampleSpec[] {
    return this.list().filter((spec) => spec.meta.tags.includes(tag));
  }

  /** List examples by owner. */
  listByOwner(owner: string): ExampleSpec[] {
    return this.list().filter((spec) => spec.meta.owners.includes(owner));
  }

  /** List examples by domain. */
  listByDomain(domain: string): ExampleSpec[] {
    return this.list().filter((spec) => spec.meta.domain === domain);
  }

  /** List examples that support a specific surface. */
  listBySurface(
    surface: 'templates' | 'sandbox' | 'studio' | 'mcp'
  ): ExampleSpec[] {
    return this.list().filter((spec) => {
      if (surface === 'templates') return spec.surfaces.templates;
      if (surface === 'sandbox') return spec.surfaces.sandbox.enabled;
      if (surface === 'studio') return spec.surfaces.studio.enabled;
      if (surface === 'mcp') return spec.surfaces.mcp.enabled;
      return false;
    });
  }

  /** List examples that are installable via Studio. */
  listInstallable(): ExampleSpec[] {
    return this.list().filter((spec) => spec.surfaces.studio.installable);
  }

  /** Group examples by key function. */
  groupBy(
    keyFn: import('../registry-utils').GroupKeyFn<ExampleSpec>
  ): Map<string, ExampleSpec[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Group examples by kind. */
  groupByKind(): Map<ExampleKind, ExampleSpec[]> {
    const result = new Map<ExampleKind, ExampleSpec[]>();
    for (const spec of this.list()) {
      const existing = result.get(spec.meta.kind) ?? [];
      existing.push(spec);
      result.set(spec.meta.kind, existing);
    }
    return result;
  }

  /** Get unique tags from all examples. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }

  /** Get unique kinds from all examples. */
  getUniqueKinds(): ExampleKind[] {
    const kinds = new Set<ExampleKind>();
    for (const spec of this.list()) {
      kinds.add(spec.meta.kind);
    }
    return [...kinds];
  }

  /** Get unique domains from all examples. */
  getUniqueDomains(): string[] {
    const domains = new Set<string>();
    for (const spec of this.list()) {
      if (spec.meta.domain) {
        domains.add(spec.meta.domain);
      }
    }
    return [...domains];
  }

  /** Search examples by query (matches key, title, description, tags). */
  search(query: string): ExampleSpec[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.list();
    return this.list().filter((spec) => {
      const hay = [
        spec.meta.key,
        spec.meta.title ?? '',
        spec.meta.description,
        spec.meta.summary ?? '',
        ...spec.meta.tags,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }
}
