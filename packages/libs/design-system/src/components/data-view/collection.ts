import type {
	DataViewCollectionConfig,
	DataViewCollectionMode,
	DataViewCollectionViewModesConfig,
	DataViewConfig,
	DataViewDataDepth,
	DataViewDensity,
	DataViewField,
	DataViewGridConfig,
	DataViewListConfig,
	DataViewSpec,
	DataViewTableConfig,
} from '@contractspec/lib.contracts-spec/data-views';

const ALL_COLLECTION_MODES: DataViewCollectionMode[] = [
	'list',
	'grid',
	'table',
];

export const DATA_VIEW_DATA_DEPTHS: DataViewDataDepth[] = [
	'summary',
	'standard',
	'detailed',
	'exhaustive',
];

const DATA_VIEW_DATA_DEPTH_RANKS = new Map<DataViewDataDepth, number>(
	DATA_VIEW_DATA_DEPTHS.map((depth, index) => [depth, index])
);

export function formatDataViewDataDepth(dataDepth: DataViewDataDepth): string {
	if (dataDepth === 'summary') return 'Summary';
	if (dataDepth === 'detailed') return 'Detailed';
	if (dataDepth === 'exhaustive') return 'Exhaustive';
	return 'Standard';
}

export interface ResolvedCollectionView {
	spec: DataViewSpec;
	mode: DataViewCollectionMode;
	allowedModes: DataViewCollectionMode[];
}

export interface ResolveCollectionDensityInput {
	density?: DataViewDensity;
	defaultDensity?: DataViewDensity;
}

export interface ResolveCollectionDataDepthInput {
	dataDepth?: DataViewDataDepth;
	defaultDataDepth?: DataViewDataDepth;
}

type DataViewCollectionView =
	| DataViewListConfig
	| DataViewGridConfig
	| DataViewTableConfig;

export function isDataViewCollectionKind(
	kind: DataViewConfig['kind']
): kind is DataViewCollectionMode {
	return kind === 'list' || kind === 'grid' || kind === 'table';
}

export function resolveAllowedCollectionModes(
	view: DataViewConfig
): DataViewCollectionMode[] {
	const collection = getDataViewCollectionConfig(view);
	if (!collection || !isDataViewCollectionKind(view.kind)) {
		return isDataViewCollectionKind(view.kind) ? [view.kind] : [];
	}
	const viewModes = getDataViewCollectionViewModesConfig(view);
	const configured = viewModes?.allowedModes?.filter(isDataViewCollectionMode);
	if (configured?.length) return uniqueModes(configured);
	if (collection.toolbar?.viewMode === true) return ALL_COLLECTION_MODES;
	return viewModes ? ALL_COLLECTION_MODES : [view.kind];
}

export function getDataViewCollectionConfig(
	view: DataViewConfig
): DataViewCollectionConfig | undefined {
	if (!isDataViewCollectionKind(view.kind)) return undefined;
	return (view as DataViewCollectionView).collection;
}

export function getDataViewCollectionViewModesConfig(
	view: DataViewConfig
): DataViewCollectionViewModesConfig | undefined {
	const collection = getDataViewCollectionConfig(view);
	const toolbarViewMode = collection?.toolbar?.viewMode;
	if (collection?.viewModes) return collection.viewModes;
	return typeof toolbarViewMode === 'object' ? toolbarViewMode : undefined;
}

export function resolveCollectionView(
	spec: DataViewSpec,
	requestedMode?: DataViewCollectionMode
): ResolvedCollectionView {
	const allowedModes = resolveAllowedCollectionModes(spec.view);
	const fallbackMode = resolveDefaultCollectionMode(spec.view, allowedModes);
	const mode =
		requestedMode && allowedModes.includes(requestedMode)
			? requestedMode
			: fallbackMode;

	return {
		spec: {
			...spec,
			view: projectCollectionView(spec.view, mode),
		},
		mode,
		allowedModes,
	};
}

export function resolveCollectionDensity(
	spec: DataViewSpec,
	input: ResolveCollectionDensityInput = {}
): DataViewDensity {
	const tableDensity =
		spec.view.kind === 'table' ? spec.view.density : undefined;
	return (
		input.density ??
		input.defaultDensity ??
		tableDensity ??
		getDataViewCollectionConfig(spec.view)?.density ??
		'comfortable'
	);
}

export function resolveCollectionDataDepth(
	spec: DataViewSpec,
	input: ResolveCollectionDataDepthInput = {}
): DataViewDataDepth {
	return (
		input.dataDepth ??
		input.defaultDataDepth ??
		getDataViewCollectionConfig(spec.view)?.dataDepth ??
		'standard'
	);
}

export function projectCollectionDataDepth(
	spec: DataViewSpec,
	dataDepth: DataViewDataDepth
): DataViewSpec {
	if (!isDataViewCollectionKind(spec.view.kind)) return spec;
	const fields = spec.view.fields.filter((field) =>
		isFieldVisibleAtDepth(field, dataDepth)
	);
	const visibleFieldKeys = new Set(fields.map((field) => field.key));
	const primaryField = visibleFieldKeys.has(spec.view.primaryField ?? '')
		? spec.view.primaryField
		: fields[0]?.key;
	const secondaryFields = spec.view.secondaryFields?.filter((fieldKey) =>
		visibleFieldKeys.has(fieldKey)
	);

	if (spec.view.kind === 'table') {
		return {
			...spec,
			view: {
				...spec.view,
				fields,
				primaryField,
				secondaryFields,
				columns: spec.view.columns?.filter((column) =>
					visibleFieldKeys.has(column.field)
				),
				rowExpansion: spec.view.rowExpansion
					? {
							...spec.view.rowExpansion,
							fields: spec.view.rowExpansion.fields.filter((fieldKey) =>
								visibleFieldKeys.has(fieldKey)
							),
						}
					: undefined,
			},
		};
	}

	return {
		...spec,
		view: {
			...spec.view,
			fields,
			primaryField,
			secondaryFields,
		},
	};
}

function resolveDefaultCollectionMode(
	view: DataViewConfig,
	allowedModes: DataViewCollectionMode[]
): DataViewCollectionMode {
	const configured =
		isDataViewCollectionKind(view.kind) &&
		getDataViewCollectionViewModesConfig(view)?.defaultMode;
	if (configured && allowedModes.includes(configured)) return configured;
	if (isDataViewCollectionKind(view.kind) && allowedModes.includes(view.kind)) {
		return view.kind;
	}
	return allowedModes[0] ?? 'list';
}

function projectCollectionView(
	view: DataViewConfig,
	mode: DataViewCollectionMode
): DataViewListConfig | DataViewGridConfig | DataViewTableConfig {
	const collection = getDataViewCollectionConfig(view);
	const common = {
		fields: view.fields,
		primaryField: view.primaryField,
		secondaryFields: view.secondaryFields,
		filters: view.filters,
		filterScope: view.filterScope,
		actions: view.actions,
		collection,
	};

	if (mode === 'list') {
		return {
			...common,
			kind: 'list',
			layout: view.kind === 'list' ? view.layout : 'compact',
		};
	}

	if (mode === 'grid') {
		return {
			...common,
			kind: 'grid',
			columns: view.kind === 'grid' ? view.columns : undefined,
		};
	}

	if (view.kind === 'table') {
		return {
			...view,
			...common,
			kind: 'table',
		};
	}

	return {
		...common,
		kind: 'table',
		density: collection?.density,
	};
}

function isDataViewCollectionMode(
	value: unknown
): value is DataViewCollectionMode {
	return value === 'list' || value === 'grid' || value === 'table';
}

function uniqueModes(
	modes: DataViewCollectionMode[]
): DataViewCollectionMode[] {
	return ALL_COLLECTION_MODES.filter((mode) => modes.includes(mode));
}

function isFieldVisibleAtDepth(
	field: DataViewField,
	dataDepth: DataViewDataDepth
): boolean {
	const minDepth = field.visibility?.minDataDepth;
	if (!minDepth) return true;
	return dataDepthRank(dataDepth) >= dataDepthRank(minDepth);
}

function dataDepthRank(dataDepth: DataViewDataDepth): number {
	return DATA_VIEW_DATA_DEPTH_RANKS.get(dataDepth) ?? 0;
}
