import type { ExperimentRef } from '../experiments/spec';
import type { DataViewRef } from '../features/types';
import type {
  DataViewConfig,
  DataViewMeta,
  DataViewSource,
  DataViewStates,
} from './types';

// Re-export for backwards compatibility
export type { DataViewRef };

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
 * Helper to define a data view spec with type safety.
 */
export function defineDataView(spec: DataViewSpec): DataViewSpec {
  return spec;
}
