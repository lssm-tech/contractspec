import type { ProductIntentSpec } from "./spec";

/**
 * A registry to store and retrieve ProductIntentSpecs. Registries
 * centralise definitions and allow runtime systems to enumerate
 * available intents. This pattern mirrors the existing registries in
 * ContractSpec (e.g. for operations and events) but is simplified for
 * the product intent use case. Consumers may extend this class to
 * implement persistence or additional lookup behaviour.
 */
export class ProductIntentRegistry {
  /** Internal map keyed by intent identifier. */
  private intents = new Map<string, ProductIntentSpec<any>>();

  /**
   * Register a new product intent spec. If a spec with the same id
   * already exists it will be overwritten.
   */
  register<Meta = unknown>(spec: ProductIntentSpec<Meta>): void {
    this.intents.set(spec.id, spec);
  }

  /**
   * Retrieve a product intent spec by id. Returns undefined if the
   * spec is not registered.
   */
  get<Meta = unknown>(id: string): ProductIntentSpec<Meta> | undefined {
    return this.intents.get(id) as ProductIntentSpec<Meta> | undefined;
  }

  /**
   * List all registered product intent specs. Useful for introspection
   * and debugging.
   */
  list(): ProductIntentSpec<any>[] {
    return Array.from(this.intents.values());
  }
}
