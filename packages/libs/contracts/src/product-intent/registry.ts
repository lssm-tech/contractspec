import type { ProductIntentSpec } from './spec';

/**
 * In-memory registry for ProductIntentSpec documents keyed by id.
 */
export class ProductIntentRegistry {
  private intents = new Map<string, ProductIntentSpec<unknown>>();

  /**
   * Register a new product intent spec. Throws if the id already exists.
   */
  register<Meta = unknown>(spec: ProductIntentSpec<Meta>): this {
    if (this.intents.has(spec.id)) {
      throw new Error(`Duplicate product intent spec: ${spec.id}`);
    }
    this.intents.set(spec.id, spec as ProductIntentSpec<unknown>);
    return this;
  }

  /**
   * Add or replace a spec by id.
   */
  set<Meta = unknown>(spec: ProductIntentSpec<Meta>): this {
    this.intents.set(spec.id, spec as ProductIntentSpec<unknown>);
    return this;
  }

  /**
   * Retrieve a product intent spec by id.
   */
  get<Meta = unknown>(id: string): ProductIntentSpec<Meta> | undefined {
    return this.intents.get(id) as ProductIntentSpec<Meta> | undefined;
  }

  /**
   * Check whether a spec exists for an id.
   */
  has(id: string): boolean {
    return this.intents.has(id);
  }

  /**
   * List all registered product intent specs.
   */
  list(): ProductIntentSpec<unknown>[] {
    return [...this.intents.values()];
  }

  /**
   * Count registered specs.
   */
  count(): number {
    return this.intents.size;
  }

  /**
   * Remove a spec from the registry.
   */
  delete(id: string): boolean {
    return this.intents.delete(id);
  }

  /**
   * Clear all registered specs.
   */
  clear(): void {
    this.intents.clear();
  }
}
