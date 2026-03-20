import type { EChartsOption } from "echarts";
import type {
  ContractVisualizationAnnotationModel,
  ContractVisualizationRenderModel,
} from "./visualization.types";

export function buildVisualizationEChartsOption(
  model: ContractVisualizationRenderModel
): EChartsOption {
  const thresholdLines = model.thresholds.map((threshold) => ({
    yAxis: threshold.value,
    name: threshold.label,
    lineStyle: {
      color: threshold.color ?? "#ef4444",
      type: "dashed",
    },
  }));
  const annotationLines = model.annotations
    .filter((annotation) => annotation.kind === "line" && annotation.y != null)
    .map((annotation) => toMarkLine(annotation));

  switch (model.kind) {
    case "cartesian":
      const cartesianSeries = model.series.map((series) => ({
        name: series.label,
        type: resolveCartesianSeriesType(series.type),
        smooth: series.smooth,
        stack: series.stack,
        areaStyle: series.type === "area" ? {} : undefined,
        itemStyle: series.color ? { color: series.color } : undefined,
        lineStyle: series.color ? { color: series.color } : undefined,
        data: series.points
          .filter((point) => point.y != null)
          .map((point) => [point.x, point.y] as [unknown, number]),
        markLine:
          thresholdLines.length || annotationLines.length
            ? { data: [...thresholdLines, ...annotationLines] }
            : undefined,
      })) as NonNullable<EChartsOption["series"]>;
      return {
        color: model.palette,
        tooltip: model.tooltip === false ? undefined : { trigger: "axis" },
        legend: { show: model.legend ?? model.series.length > 1 },
        xAxis: { type: model.xAxis?.type === "time" ? "time" : "category" },
        yAxis: { type: "value", name: model.yAxis?.label },
        series: cartesianSeries,
      };
    case "pie":
      const pieSeries = [
        {
          type: "pie" as const,
          radius: ["0%", "70%"],
          data:
            model.series[0]?.points
              .filter((point) => point.value != null)
              .map((point) => ({
                name: point.name ?? "",
                value: point.value as number,
              })) ?? [],
        },
      ] as NonNullable<EChartsOption["series"]>;
      return {
        color: model.palette,
        tooltip: model.tooltip === false ? undefined : { trigger: "item" },
        series: pieSeries,
      };
    case "heatmap":
      const heatmapSeries = [
        {
          type: "heatmap" as const,
          data:
            model.series[0]?.points
              .filter((point) => point.value != null && point.name != null)
              .map((point) => [point.x, point.name, point.value as number]) ?? [],
        },
      ] as NonNullable<EChartsOption["series"]>;
      return {
        color: model.palette,
        tooltip: model.tooltip === false ? undefined : { position: "top" },
        xAxis: {
          type: "category",
          data: uniqueValues(model.series[0]?.points.map((point) => point.x)),
        },
        yAxis: {
          type: "category",
          data: uniqueValues(model.series[0]?.points.map((point) => point.name)),
        },
        visualMap: {
          min: 0,
          max: maxValue(model.series[0]?.points.map((point) => point.value)),
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: 0,
        },
        series: heatmapSeries,
      };
    case "funnel":
      const funnelSeries = [
        {
          type: "funnel" as const,
          data:
            model.series[0]?.points
              .filter((point) => point.value != null)
              .map((point) => ({
                name: point.name ?? "",
                value: point.value as number,
              })) ?? [],
        },
      ] as NonNullable<EChartsOption["series"]>;
      return {
        color: model.palette,
        tooltip: model.tooltip === false ? undefined : { trigger: "item" },
        series: funnelSeries,
      };
    case "geo":
      if (!model.geo || model.geo.mode === "slippy-map" || !model.geo.geoJson) {
        return {};
      }
      const geoSeries = [
        {
          type: model.geo.variant === "heatmap" ? "heatmap" : "scatter",
          coordinateSystem: "geo" as const,
          data:
            model.series[0]?.points
              .filter(
                (point) =>
                  point.longitude != null &&
                  point.latitude != null &&
                  point.value != null
              )
              .map((point) => ({
                name: point.name ?? "",
                value: [
                  point.longitude as number,
                  point.latitude as number,
                  point.value as number,
                ],
              })) ?? [],
        },
      ] as NonNullable<EChartsOption["series"]>;
      return {
        color: model.palette,
        tooltip: model.tooltip === false ? undefined : { trigger: "item" },
        geo: {
          map: "contractspec-visualization-geo",
          roam: true,
        },
        series: geoSeries,
      };
    default:
      return {};
  }
}

function uniqueValues(values: unknown[] | undefined) {
  return Array.from(
    new Set((values ?? []).filter((value) => value != null).map(String))
  );
}

function maxValue(values: Array<number | null | undefined> | undefined) {
  return Math.max(...(values ?? []).map((value) => value ?? 0), 1);
}

function toMarkLine(annotation: ContractVisualizationAnnotationModel) {
  return {
    yAxis: annotation.y,
    name: annotation.label,
    lineStyle: {
      color: annotation.color ?? "#2563eb",
      type: "solid",
    },
  };
}

function resolveCartesianSeriesType(type: string | undefined) {
  if (type === "bar") return "bar" as const;
  if (type === "scatter") return "scatter" as const;
  return "line" as const;
}
