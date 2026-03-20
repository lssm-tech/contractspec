import type { EventRef, OpRef, PresentationRef } from '../features';
import type { OwnerShipMeta } from '../ownership';

export type VisualizationKind =
	| 'metric'
	| 'cartesian'
	| 'pie'
	| 'heatmap'
	| 'funnel'
	| 'geo';

export type VisualizationCartesianVariant = 'line' | 'bar' | 'area' | 'scatter';

export type VisualizationGeoVariant = 'scatter' | 'heatmap' | 'map';

export type VisualizationGeoMode = 'chart' | 'slippy-map';

export type VisualizationValueFormat =
	| 'text'
	| 'number'
	| 'currency'
	| 'percentage'
	| 'date'
	| 'dateTime'
	| 'boolean'
	| 'duration';

export interface VisualizationMeta extends OwnerShipMeta {
	goal: string;
	context: string;
	entity?: string;
}

export interface VisualizationSource {
	primary: OpRef;
	item?: OpRef;
	mutations?: {
		create?: OpRef;
		update?: OpRef;
		delete?: OpRef;
	};
	refreshEvents?: EventRef[];
	resultPath?: string;
}

export interface VisualizationDimension {
	key: string;
	label: string;
	dataPath: string;
	type?: 'category' | 'number' | 'time' | 'geo' | 'latitude' | 'longitude';
	description?: string;
	format?: VisualizationValueFormat;
}

export interface VisualizationMeasure {
	key: string;
	label: string;
	dataPath: string;
	description?: string;
	format?: VisualizationValueFormat;
	color?: string;
	aggregate?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'last';
}

export interface VisualizationSeries {
	key: string;
	label: string;
	measure: string;
	type?: VisualizationCartesianVariant;
	color?: string;
	stack?: string;
	smooth?: boolean;
}

export interface VisualizationThreshold {
	key: string;
	value: number;
	label?: string;
	operator?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
	color?: string;
}

export interface VisualizationAnnotation {
	key: string;
	label: string;
	kind: 'line' | 'point' | 'band';
	xDataPath?: string;
	yDataPath?: string;
	startDataPath?: string;
	endDataPath?: string;
	color?: string;
}

export interface VisualizationDrilldownMapping {
	from: string;
	to: string;
}

export interface VisualizationDrilldown {
	kind: 'navigation' | 'operation' | 'presentation' | 'data-view';
	targetKey: string;
	version?: string;
	mappings?: VisualizationDrilldownMapping[];
}

export interface VisualizationBaseConfig {
	kind: VisualizationKind;
	title?: string;
	description?: string;
	dimensions?: VisualizationDimension[];
	measures?: VisualizationMeasure[];
	series?: VisualizationSeries[];
	palette?: string[];
	legend?: boolean;
	tooltip?: boolean;
	annotations?: VisualizationAnnotation[];
	thresholds?: VisualizationThreshold[];
	drilldown?: VisualizationDrilldown;
	table?: {
		caption?: string;
	};
}

export interface MetricVisualizationConfig extends VisualizationBaseConfig {
	kind: 'metric';
	measure: string;
	comparisonMeasure?: string;
	sparkline?: {
		dimension: string;
		measure?: string;
	};
}

export interface CartesianVisualizationConfig extends VisualizationBaseConfig {
	kind: 'cartesian';
	variant: VisualizationCartesianVariant;
	xDimension: string;
	yMeasures?: string[];
}

export interface PieVisualizationConfig extends VisualizationBaseConfig {
	kind: 'pie';
	nameDimension: string;
	valueMeasure: string;
	donut?: boolean;
	rose?: boolean;
}

export interface HeatmapVisualizationConfig extends VisualizationBaseConfig {
	kind: 'heatmap';
	xDimension: string;
	yDimension: string;
	valueMeasure: string;
}

export interface FunnelVisualizationConfig extends VisualizationBaseConfig {
	kind: 'funnel';
	nameDimension: string;
	valueMeasure: string;
	sort?: 'ascending' | 'descending' | 'none';
}

export type VisualizationGeoJsonSource =
	| { type: 'inline'; data: unknown }
	| { type: 'url'; url: string }
	| { type: 'ref'; ref: string };

export interface GeoVisualizationConfig extends VisualizationBaseConfig {
	kind: 'geo';
	variant?: VisualizationGeoVariant;
	mode?: VisualizationGeoMode;
	nameDimension?: string;
	longitudeDimension?: string;
	latitudeDimension?: string;
	valueMeasure?: string;
	geoJson?: VisualizationGeoJsonSource;
}

export type VisualizationConfig =
	| MetricVisualizationConfig
	| CartesianVisualizationConfig
	| PieVisualizationConfig
	| HeatmapVisualizationConfig
	| FunnelVisualizationConfig
	| GeoVisualizationConfig;

export interface VisualizationStates {
	empty?: PresentationRef;
	error?: PresentationRef;
	loading?: PresentationRef;
}
