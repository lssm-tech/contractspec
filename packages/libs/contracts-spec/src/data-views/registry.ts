import type { DataViewSpec } from './spec';
import { SpecContractRegistry } from '../registry';

/**
 * Generate a unique key for a data view spec.
 */
export function dataViewKey(spec: DataViewSpec): string {
  return `${spec.meta.key}.v${spec.meta.version}`;
}

/**
 * Registry for managing data view specifications.
 */
export class DataViewRegistry extends SpecContractRegistry<
  'data-view',
  DataViewSpec
> {
  public constructor(items?: DataViewSpec[]) {
    super('data-view', items);
  }
}
