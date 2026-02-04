import { keyOfSpecContract, SpecContractRegistry } from '../registry';
import type { ProductIntentSpec } from './spec';

/**
 * Registry for ProductIntentSpec contracts.
 */
export class ProductIntentRegistry extends SpecContractRegistry<
  'product-intent',
  ProductIntentSpec
> {
  constructor(items?: ProductIntentSpec[]) {
    super('product-intent', items);
  }

  /**
   * Add or replace a spec by meta key and version.
   */
  set(spec: ProductIntentSpec): this {
    const key = keyOfSpecContract(spec);
    this.items.set(key, spec);
    return this;
  }

  /**
   * Retrieve a product intent spec by runtime id.
   */
  getById<Context = unknown>(
    id: string
  ): ProductIntentSpec<Context> | undefined {
    return this.list().find((spec) => spec.id === id) as
      | ProductIntentSpec<Context>
      | undefined;
  }

  /**
   * Delete a spec by runtime id.
   */
  delete(id: string): boolean {
    const target = this.list().find((spec) => spec.id === id);
    if (!target) return false;
    const key = keyOfSpecContract(target);
    return this.items.delete(key);
  }

  /**
   * Delete a spec by contract key and version.
   */
  deleteByKey(key: string, version: string): boolean {
    return this.items.delete(`${key}.v${version}`);
  }

  /**
   * Clear all registered specs.
   */
  clear(): void {
    this.items.clear();
  }
}
