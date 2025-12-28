import type { ExperimentRef } from '../experiments/spec';
import type {
  DataViewConfig,
  DataViewMeta,
  DataViewSource,
  DataViewStates,
} from './types';

/**
 * Complete specification for a data view.
 */
export interface DataViewSpec {
  meta: DataViewMeta;
  source: DataViewSource;
  view: DataViewConfig;
  states?: DataViewStates;
  policy?: { flags?: string[]; pii?: string[] };
  experiments?: ExperimentRef[];
}

/**
 * Reference to a data view spec.
 */
export interface DataViewRef {
  key: string;
  version: number;
}

/**
 * Helper to define a data view spec with type safety.
 */
export function defineDataView(spec: DataViewSpec): DataViewSpec {
  return spec;
}
