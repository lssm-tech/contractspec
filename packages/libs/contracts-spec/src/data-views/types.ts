import type { EventRef, OpRef, PresentationRef } from '../features';
import type { OwnerShipMeta } from '../ownership';

/**
 * Supported data view kinds.
 */
export type DataViewKind = 'list' | 'detail' | 'table' | 'grid';

/**
 * Metadata for a data view spec.
 */
export interface DataViewMeta extends OwnerShipMeta {
	/** Canonical entity slug (e.g., "space", "resident"). */
	entity: string;
}

/**
 * Source configuration for fetching data in a data view.
 */
export interface DataViewSource {
	/** Primary query used to fetch items for this view. */
	primary: OpRef;
	/** Optional operation used to fetch a single item (detail views). */
	item?: OpRef;
	/** Optional record mutation operations (used for inline editing or actions). */
	mutations?: {
		create?: OpRef;
		update?: OpRef;
		delete?: OpRef;
	};
	/** Events that should trigger refresh when emitted. */
	refreshEvents?: EventRef[];
}

/**
 * Display formatting hints for data view fields.
 */
export type DataViewFieldFormat =
	| 'text'
	| 'number'
	| 'currency'
	| 'percentage'
	| 'date'
	| 'dateTime'
	| 'boolean'
	| 'markdown'
	| 'badge';

/**
 * Field definition within a data view.
 */
export interface DataViewField {
	/** Unique identifier for the field within the view. */
	key: string;
	/** Human-friendly label for headers/tooltips. */
	label: string;
	/** Dot-path into the data item (e.g., "address.city"). */
	dataPath: string;
	/** Optional description surfaced in tooltips or docs. */
	description?: string;
	/** Optional formatting hint for renderers. */
	format?: DataViewFieldFormat;
	/** When true, the field can be used for sorting. */
	sortable?: boolean;
	/** When true, the field can be used for filtering. */
	filterable?: boolean;
	/** Optional width hint for table layouts. */
	width?: 'auto' | 'xs' | 'sm' | 'md' | 'lg';
	/** Optional presentation override (e.g., card component). */
	presentation?: PresentationRef;
}

/**
 * Filter definition for a data view.
 */
export interface DataViewFilter {
	key: string;
	label: string;
	field: string;
	type: 'search' | 'enum' | 'number' | 'date' | 'boolean';
	options?: { value: string; label: string }[];
	operator?: DataViewFilterOperator;
	valueMode?: 'single' | 'multi' | 'range' | 'composite';
}

export type DataViewFilterScalar = string | number | boolean;

export type DataViewFilterComparable = string | number;

export type DataViewFilterOperator =
	| 'eq'
	| 'neq'
	| 'contains'
	| 'in'
	| 'notIn'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'between'
	| 'isNull'
	| 'isNotNull';

export type DataViewFilterValue =
	| { kind: 'single'; value: DataViewFilterScalar }
	| { kind: 'multi'; values: DataViewFilterScalar[] }
	| {
			kind: 'range';
			from?: DataViewFilterComparable;
			to?: DataViewFilterComparable;
			includeFrom?: boolean;
			includeTo?: boolean;
	  }
	| {
			kind: 'composite';
			mode: 'and' | 'or';
			clauses: DataViewFilterClause[];
	  };

export interface DataViewFilterClause {
	filterKey: string;
	field: string;
	operator: DataViewFilterOperator;
	value?: DataViewFilterValue;
}

export type DataViewFilterSet = Record<string, DataViewFilterValue | undefined>;

export interface DataViewFilterScope {
	initial?: DataViewFilterSet;
	locked?: DataViewFilterSet;
	lockedChips?: 'visible-disabled' | 'hidden';
}

/**
 * Action that can be triggered from a data view.
 */
export interface DataViewAction {
	key: string;
	label: string;
	kind: 'navigation' | 'operation';
	/** Operation invoked when kind === 'operation'. */
	operation?: OpRef;
	/** Optional feature flag gating the action. */
	requiresFlag?: string;
}

/**
 * Section configuration for detail views.
 */
export interface DataViewSections {
	title?: string;
	description?: string;
	fields: string[];
}

/**
 * Base configuration shared by all data view kinds.
 */
export interface DataViewBaseConfig {
	kind: DataViewKind;
	fields: DataViewField[];
	primaryField?: string;
	secondaryFields?: string[];
	filters?: DataViewFilter[];
	filterScope?: DataViewFilterScope;
	actions?: DataViewAction[];
}

/**
 * List view configuration.
 */
export interface DataViewListConfig extends DataViewBaseConfig {
	kind: 'list';
	layout?: 'card' | 'compact';
}

/**
 * Detail view configuration.
 */
export interface DataViewDetailConfig extends DataViewBaseConfig {
	kind: 'detail';
	sections?: DataViewSections[];
}

/**
 * Table column configuration.
 */
export interface DataViewTableColumn {
	field: string;
	label?: string;
	width?: 'auto' | 'xs' | 'sm' | 'md' | 'lg';
	align?: 'left' | 'center' | 'right';
	sortable?: boolean;
	hideable?: boolean;
	resizable?: boolean;
	pinned?: false | 'left' | 'right';
	defaultWidth?: number;
	minWidth?: number;
	maxWidth?: number;
}

export type DataViewTableExecutionMode = 'client' | 'server';

export type DataViewTableSelectionMode = 'none' | 'single' | 'multiple';

export interface DataViewTableExpansionConfig {
	fields: string[];
}

export interface DataViewTableSort {
	field: string;
	desc?: boolean;
}

export interface DataViewTablePinnedColumns {
	left?: string[];
	right?: string[];
}

export interface DataViewTableInitialState {
	sorting?: DataViewTableSort[];
	pageSize?: number;
	hiddenColumns?: string[];
	pinnedColumns?: DataViewTablePinnedColumns;
	expandedRowIds?: string[];
}

/**
 * Table view configuration.
 */
export interface DataViewTableConfig extends DataViewBaseConfig {
	kind: 'table';
	columns?: DataViewTableColumn[];
	executionMode?: DataViewTableExecutionMode;
	selection?: DataViewTableSelectionMode;
	columnVisibility?: boolean;
	columnResizing?: boolean;
	columnPinning?: boolean;
	rowExpansion?: DataViewTableExpansionConfig;
	initialState?: DataViewTableInitialState;
	rowSelectable?: boolean;
	density?: 'comfortable' | 'compact';
}

/**
 * Grid view configuration.
 */
export interface DataViewGridConfig extends DataViewBaseConfig {
	kind: 'grid';
	columns?: number;
}

/**
 * Union of all data view configurations.
 */
export type DataViewConfig =
	| DataViewListConfig
	| DataViewDetailConfig
	| DataViewTableConfig
	| DataViewGridConfig;

/**
 * Presentation references for different view states.
 */
export interface DataViewStates {
	empty?: PresentationRef;
	error?: PresentationRef;
	loading?: PresentationRef;
}
