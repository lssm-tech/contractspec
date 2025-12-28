// Data Views Module
// Types, specifications, and registry for data view contracts

// Types
export type {
  DataViewKind,
  DataViewMeta,
  DataViewSource,
  DataViewFieldFormat,
  DataViewField,
  DataViewFilter,
  DataViewAction,
  DataViewSections,
  DataViewBaseConfig,
  DataViewListConfig,
  DataViewDetailConfig,
  DataViewTableColumn,
  DataViewTableConfig,
  DataViewGridConfig,
  DataViewConfig,
  DataViewStates,
} from './types';

// Spec
export type { DataViewSpec, DataViewRef } from './spec';
export { defineDataView } from './spec';

// Registry
export { DataViewRegistry, dataViewKey } from './registry';
