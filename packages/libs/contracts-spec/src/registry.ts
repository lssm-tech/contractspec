import { compareVersions } from 'compare-versions';
import { filterBy, getUniqueTags, groupBy } from './registry-utils';
import type { OwnerShipMeta } from './ownership';
import type { ContractSpecType } from './types';

export interface AnySpecContract {
  meta: OwnerShipMeta;
}

export const keyOfSpecContract = (spec: AnySpecContract) =>
  `${spec.meta.key}.v${spec.meta.version}`;

/** In-memory registry for PresentationSpec. */
export abstract class SpecContractRegistry<
  ContractType extends ContractSpecType,
  SpecContract extends AnySpecContract,
> {
  protected items = new Map<string, SpecContract>();

  protected constructor(
    protected readonly contractType: ContractType,
    items?: SpecContract[]
  ) {
    if (items) {
      items.forEach((p) => this.register(p));
    }
  }

  register(p: SpecContract): this {
    const key = keyOfSpecContract(p);
    if (this.items.has(key))
      throw new Error(`Duplicate contract \`${this.contractType}\` ${key}`);
    this.items.set(key, p);
    return this;
  }

  count(): number {
    return this.items.size;
  }

  list(): SpecContract[] {
    return [...this.items.values()];
  }

  get(key: string, version?: string): SpecContract | undefined {
    if (version != null) return this.items.get(`${key}.v${version}`);
    let candidate: SpecContract | undefined;
    for (const [k, p] of this.items.entries()) {
      if (!k.startsWith(`${key}.v`)) continue;
      if (
        !candidate ||
        compareVersions(p.meta.version, candidate.meta.version) > 0
      ) {
        candidate = p;
      }
    }
    return candidate;
  }

  has(key: string, version?: string): boolean {
    return !!this.get(key, version);
  }

  /** Filter presentations by criteria. */
  filter(criteria: import('./registry-utils').RegistryFilter): SpecContract[] {
    return filterBy(this.list(), criteria);
  }

  /** List presentations with specific tag. */
  listByTag(tag: string): SpecContract[] {
    return this.list().filter((p) => p.meta.tags?.includes(tag));
  }

  /** List presentations by owner. */
  listByOwner(owner: string): SpecContract[] {
    return this.list().filter((p) => p.meta.owners?.includes(owner));
  }

  /** Group presentations by key function. */
  groupBy(
    keyFn: import('./registry-utils').GroupKeyFn<SpecContract>
  ): Map<string, SpecContract[]> {
    return groupBy(this.list(), keyFn);
  }

  /** Get unique tags from all presentations. */
  getUniqueTags(): string[] {
    return getUniqueTags(this.list());
  }
}
