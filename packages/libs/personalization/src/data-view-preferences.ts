import type {
	DataViewCollectionMode,
	DataViewDataDepth,
	DataViewDensity,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import type { PreferenceDimensions } from './preference-dimensions';
import type { BehaviorInsights } from './types';

const ALL_COLLECTION_MODES: DataViewCollectionMode[] = [
	'list',
	'grid',
	'table',
];

export interface DataViewPreferenceRecord {
	dataViewKey: string;
	dataViewVersion?: string;
	viewMode?: DataViewCollectionMode;
	density?: DataViewDensity;
	dataDepth?: DataViewDataDepth;
	pageSize?: number;
	updatedAt?: string;
}

export interface DataViewPreferencePatch {
	dataViewKey: string;
	dataViewVersion?: string;
	viewMode?: DataViewCollectionMode;
	density?: DataViewDensity;
	dataDepth?: DataViewDataDepth;
	pageSize?: number;
}

export interface ResolvedDataViewPreferences {
	viewMode: DataViewCollectionMode;
	density: DataViewDensity;
	dataDepth: DataViewDataDepth;
	pageSize?: number;
	source: {
		viewMode: DataViewPreferenceSource;
		density: DataViewPreferenceSource;
		dataDepth: DataViewPreferenceSource;
		pageSize?: DataViewPreferenceSource;
	};
}

export type DataViewPreferenceSource =
	| 'record'
	| 'insights'
	| 'preferences'
	| 'contract'
	| 'fallback';

export interface ResolveDataViewPreferencesInput {
	spec: DataViewSpec;
	preferences?: PreferenceDimensions;
	insights?: BehaviorInsights;
	record?: DataViewPreferenceRecord;
}

export function resolveDataViewPreferences({
	spec,
	preferences,
	insights,
	record,
}: ResolveDataViewPreferencesInput): ResolvedDataViewPreferences {
	const allowedModes = resolveAllowedCollectionModes(spec);
	const contractMode = resolveContractCollectionMode(spec, allowedModes);
	const insightMode = resolveInsightMode(spec, insights, allowedModes);
	const recordMode = validMode(record?.viewMode, allowedModes);
	const contractDensity = resolveContractDensity(spec);
	const contractDataDepth = resolveContractDataDepth(spec);

	return {
		viewMode: recordMode ?? insightMode ?? contractMode ?? 'list',
		density:
			record?.density ??
			preferenceDimensionsToDataViewDensity(preferences) ??
			contractDensity ??
			'comfortable',
		dataDepth:
			record?.dataDepth ??
			preferences?.dataDepth ??
			contractDataDepth ??
			'standard',
		pageSize:
			record?.pageSize ?? getCollectionConfig(spec)?.pagination?.pageSize,
		source: {
			viewMode: recordMode
				? 'record'
				: insightMode
					? 'insights'
					: contractMode
						? 'contract'
						: 'fallback',
			density: record?.density
				? 'record'
				: preferences
					? 'preferences'
					: contractDensity
						? 'contract'
						: 'fallback',
			dataDepth: record?.dataDepth
				? 'record'
				: preferences?.dataDepth
					? 'preferences'
					: contractDataDepth
						? 'contract'
						: 'fallback',
			pageSize: record?.pageSize
				? 'record'
				: getCollectionConfig(spec)?.pagination?.pageSize
					? 'contract'
					: undefined,
		},
	};
}

export function preferenceDimensionsToDataViewDensity(
	preferences?: PreferenceDimensions
): DataViewDensity | undefined {
	if (!preferences) return undefined;
	if (
		preferences.density === 'minimal' ||
		preferences.density === 'compact' ||
		preferences.density === 'dense'
	) {
		return 'compact';
	}
	return 'comfortable';
}

export function dataViewDensityToPreferencePatch(
	density: DataViewDensity
): Partial<PreferenceDimensions> {
	return {
		density: density === 'compact' ? 'compact' : 'standard',
	};
}

export function dataViewModeToPreferencePatch(
	spec: DataViewSpec,
	viewMode: DataViewCollectionMode
): DataViewPreferencePatch {
	return {
		dataViewKey: spec.meta.key,
		dataViewVersion: spec.meta.version,
		viewMode,
	};
}

function resolveInsightMode(
	spec: DataViewSpec,
	insights: BehaviorInsights | undefined,
	allowedModes: DataViewCollectionMode[]
): DataViewCollectionMode | undefined {
	const scoped =
		insights?.dataViewPreferences?.[spec.meta.key]?.preferredViewMode;
	const layout = insights?.layoutPreference;
	return validMode(scoped, allowedModes) ?? validMode(layout, allowedModes);
}

function resolveContractCollectionMode(
	spec: DataViewSpec,
	allowedModes: DataViewCollectionMode[]
): DataViewCollectionMode | undefined {
	if (!isCollectionKind(spec.view.kind)) return undefined;
	const configured = getCollectionConfig(spec)?.viewModes?.defaultMode;
	return (
		validMode(configured, allowedModes) ??
		validMode(spec.view.kind, allowedModes)
	);
}

function resolveContractDensity(
	spec: DataViewSpec
): DataViewDensity | undefined {
	if (spec.view.kind === 'table' && spec.view.density) return spec.view.density;
	return getCollectionConfig(spec)?.density;
}

function resolveContractDataDepth(
	spec: DataViewSpec
): DataViewDataDepth | undefined {
	return getCollectionConfig(spec)?.dataDepth;
}

function resolveAllowedCollectionModes(
	spec: DataViewSpec
): DataViewCollectionMode[] {
	if (!isCollectionKind(spec.view.kind)) return [];
	const collection = getCollectionConfig(spec);
	const configured =
		collection?.viewModes?.allowedModes?.filter(isCollectionMode);
	if (configured?.length) return uniqueModes(configured);
	if (collection?.toolbar?.viewMode === true) return ALL_COLLECTION_MODES;
	return collection?.viewModes ? ALL_COLLECTION_MODES : [spec.view.kind];
}

function getCollectionConfig(spec: DataViewSpec) {
	if (spec.view.kind === 'detail') return undefined;
	return spec.view.collection;
}

function validMode(
	mode: unknown,
	allowedModes: DataViewCollectionMode[]
): DataViewCollectionMode | undefined {
	return isCollectionMode(mode) && allowedModes.includes(mode)
		? mode
		: undefined;
}

function uniqueModes(
	modes: DataViewCollectionMode[]
): DataViewCollectionMode[] {
	return ALL_COLLECTION_MODES.filter((mode) => modes.includes(mode));
}

function isCollectionKind(value: unknown): value is DataViewCollectionMode {
	return value === 'list' || value === 'grid' || value === 'table';
}

function isCollectionMode(value: unknown): value is DataViewCollectionMode {
	return isCollectionKind(value);
}
