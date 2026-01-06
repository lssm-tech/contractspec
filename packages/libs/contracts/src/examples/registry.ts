import type { ExampleSpec, ExampleKind, ExampleVisibility } from './types';
import { SpecContractRegistry } from '../registry';

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
export class ExampleRegistry extends SpecContractRegistry<
  'example',
  ExampleSpec
> {
  public constructor(items?: ExampleSpec[]) {
    super('example', items);
  }

  /** List examples by kind. */
  listByKind(kind: ExampleKind): ExampleSpec[] {
    return this.list().filter((spec) => spec.meta.kind === kind);
  }

  /** List examples by visibility. */
  listByVisibility(visibility: ExampleVisibility): ExampleSpec[] {
    return this.list().filter((spec) => spec.meta.visibility === visibility);
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
