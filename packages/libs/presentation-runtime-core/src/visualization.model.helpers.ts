import type {
  VisualizationAnnotation,
  VisualizationDimension,
  VisualizationMeasure,
  VisualizationSpec,
} from "@contractspec/lib.contracts-spec/visualizations";
import { getAtPath, toNumber } from "./visualization.utils";
import type {
  ContractVisualizationAnnotationModel,
  ContractVisualizationAxisModel,
  ContractVisualizationRenderModel,
  ContractVisualizationSeriesModel,
  ContractVisualizationTableAlternative,
} from "./visualization.types";

export interface VisualizationModelMaps {
  dimensions: Map<string, VisualizationDimension>;
  measures: Map<string, VisualizationMeasure>;
}

export function createVisualizationMaps(
  spec: VisualizationSpec
): VisualizationModelMaps {
  return {
    dimensions: new Map(
      (spec.visualization.dimensions ?? []).map((dimension) => [
        dimension.key,
        dimension,
      ])
    ),
    measures: new Map(
      (spec.visualization.measures ?? []).map((measure) => [measure.key, measure])
    ),
  };
}

export function createVisualizationBaseModel(
  spec: VisualizationSpec,
  rows: Record<string, unknown>[],
  maps: VisualizationModelMaps
) {
  const config = spec.visualization;
  return {
    kind: config.kind,
    title: config.title ?? spec.meta.title,
    description: config.description ?? spec.meta.description,
    summary: `${spec.meta.title ?? spec.meta.key}: ${rows.length} row${rows.length === 1 ? "" : "s"}`,
    warnings: rows.length === 0 ? ["No visualization rows available."] : [],
    palette: config.palette,
    legend: config.legend,
    tooltip: config.tooltip,
    drilldown: config.drilldown,
    thresholds: config.thresholds ?? [],
    annotations: (config.annotations ?? []).map((annotation) =>
      resolveAnnotation(annotation, rows[0] ?? {})
    ),
    table: createTable(config.table?.caption, config, rows),
  } satisfies Omit<
    ContractVisualizationRenderModel,
    "series" | "metric" | "xAxis" | "yAxis" | "geo"
  >;
}

export function createMeasureSeries(
  measureKey: string,
  measures: Map<string, VisualizationMeasure>,
  rows: Record<string, unknown>[],
  dimension?: VisualizationDimension,
  config?: {
    key: string;
    label: string;
    type?: string;
    color?: string;
    stack?: string;
    smooth?: boolean;
  }
) {
  const measure = measures.get(measureKey);
  if (!measure) return null;
  return {
    key: config?.key ?? measure.key,
    label: config?.label ?? measure.label,
    type: config?.type,
    color: config?.color ?? measure.color,
    stack: config?.stack,
    smooth: config?.smooth,
    points: rows.map((row, index) => ({
      id: `${measure.key}-${index}`,
      raw: row,
      x: dimension ? readDimensionValue(row, dimension) : index,
      y: numericValue(row, measure),
      value: numericValue(row, measure),
    })),
  } satisfies ContractVisualizationSeriesModel;
}

export function defaultSeries(keys: string[]) {
  return keys.map((key) => ({ key, label: key, measure: key }));
}

export function createAxis(
  dimension?: VisualizationDimension
): ContractVisualizationAxisModel | undefined {
  if (!dimension) return undefined;
  return {
    key: dimension.key,
    label: dimension.label,
    type:
      dimension.type === "time"
        ? "time"
        : dimension.type === "number"
          ? "number"
          : "category",
    format: dimension.format,
  };
}

export function createValueAxis(
  key: string | undefined,
  measures: Map<string, VisualizationMeasure>
) {
  const measure = key ? measures.get(key) : undefined;
  if (!measure) return undefined;
  return {
    key: measure.key,
    label: measure.label,
    type: "number",
    format: measure.format,
  } satisfies ContractVisualizationAxisModel;
}

export function readValue(
  row: Record<string, unknown>,
  measure?: VisualizationMeasure
) {
  return measure ? getAtPath(row, measure.dataPath) : undefined;
}

export function readDimensionValue(
  row: Record<string, unknown>,
  dimension?: VisualizationDimension
) {
  return dimension ? getAtPath(row, dimension.dataPath) : undefined;
}

export function numericValue(
  row: Record<string, unknown>,
  measure?: VisualizationMeasure
) {
  return toNumber(readValue(row, measure));
}

export function numericPathValue(
  row: Record<string, unknown>,
  dimension?: VisualizationDimension
) {
  return toNumber(readDimensionValue(row, dimension));
}

export function stringValue(
  row: Record<string, unknown>,
  dimension?: VisualizationDimension
) {
  const value = readDimensionValue(row, dimension);
  return value == null ? undefined : String(value);
}

function createTable(
  caption: string | undefined,
  config: VisualizationSpec["visualization"],
  rows: Record<string, unknown>[]
): ContractVisualizationTableAlternative {
  const dimensions = config.dimensions ?? [];
  const measures = config.measures ?? [];
  return {
    caption,
    columns: [
      ...dimensions.map((dimension) => ({
        key: dimension.key,
        label: dimension.label,
      })),
      ...measures.map((measure) => ({ key: measure.key, label: measure.label })),
    ],
    rows: rows.map((row) => ({
      ...Object.fromEntries(
        dimensions.map((dimension) => [
          dimension.key,
          readDimensionValue(row, dimension),
        ])
      ),
      ...Object.fromEntries(
        measures.map((measure) => [measure.key, readValue(row, measure)])
      ),
    })),
  };
}

function resolveAnnotation(
  annotation: VisualizationAnnotation,
  row: Record<string, unknown>
): ContractVisualizationAnnotationModel {
  return {
    key: annotation.key,
    label: annotation.label,
    kind: annotation.kind,
    color: annotation.color,
    x: annotation.xDataPath ? getAtPath(row, annotation.xDataPath) : undefined,
    y: annotation.yDataPath ? toNumber(getAtPath(row, annotation.yDataPath)) : undefined,
    start: annotation.startDataPath
      ? getAtPath(row, annotation.startDataPath)
      : undefined,
    end: annotation.endDataPath ? getAtPath(row, annotation.endDataPath) : undefined,
  };
}
