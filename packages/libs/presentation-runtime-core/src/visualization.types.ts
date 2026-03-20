import type {
  VisualizationAnnotation,
  VisualizationDrilldown,
  VisualizationGeoJsonSource,
  VisualizationGeoMode,
  VisualizationGeoVariant,
  VisualizationKind,
  VisualizationThreshold,
  VisualizationValueFormat,
} from "@contractspec/lib.contracts-spec/visualizations";

export interface ContractVisualizationAxisModel {
  key: string;
  label: string;
  type: "category" | "number" | "time";
  format?: VisualizationValueFormat;
}

export interface ContractVisualizationPoint {
  id: string;
  raw: Record<string, unknown>;
  name?: string;
  x?: unknown;
  y?: number | null;
  value?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ContractVisualizationSeriesModel {
  key: string;
  label: string;
  type?: string;
  color?: string;
  stack?: string;
  smooth?: boolean;
  points: ContractVisualizationPoint[];
}

export interface ContractVisualizationMetricModel {
  label: string;
  value: unknown;
  comparisonValue?: unknown;
  format?: VisualizationValueFormat;
}

export interface ContractVisualizationTableAlternative {
  caption?: string;
  columns: { key: string; label: string }[];
  rows: Record<string, unknown>[];
}

export interface ContractVisualizationAnnotationModel {
  key: string;
  label: string;
  kind: VisualizationAnnotation["kind"];
  color?: string;
  x?: unknown;
  y?: number | null;
  start?: unknown;
  end?: unknown;
}

export interface ContractVisualizationGeoModel {
  mode: VisualizationGeoMode;
  variant: VisualizationGeoVariant;
  geoJson?: VisualizationGeoJsonSource;
}

export interface ContractVisualizationRenderModel {
  kind: VisualizationKind;
  title?: string;
  description?: string;
  summary: string;
  warnings: string[];
  palette?: string[];
  legend?: boolean;
  tooltip?: boolean;
  drilldown?: VisualizationDrilldown;
  series: ContractVisualizationSeriesModel[];
  thresholds: VisualizationThreshold[];
  annotations: ContractVisualizationAnnotationModel[];
  table: ContractVisualizationTableAlternative;
  metric?: ContractVisualizationMetricModel;
  xAxis?: ContractVisualizationAxisModel;
  yAxis?: ContractVisualizationAxisModel;
  geo?: ContractVisualizationGeoModel;
}
