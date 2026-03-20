"use client";

import * as React from "react";
import * as echarts from "echarts/core";
import {
  buildVisualizationEChartsOption,
  type ContractVisualizationRenderModel,
} from "@contractspec/lib.presentation-runtime-core";
import { AriaComponent, GeoComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { BarChart, FunnelChart, HeatmapChart, LineChart, MapChart, PieChart, ScatterChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { cn } from "@contractspec/lib.ui-kit-core/utils";
import { MapBase } from "../map/MapBase";
import { MapGeoJsonOverlay } from "../map/MapGeoJsonOverlay";
import { MapMarkers } from "../map/MapMarkers";
import { VisuallyHidden } from "../visually-hidden";
import {
  FallbackVisualization,
  MetricVisualization,
  TableAlternative,
  registerGeoMap,
  shouldRenderEChart,
} from "./Visualization.support";

echarts.use([
  AriaComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  GeoComponent,
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  HeatmapChart,
  FunnelChart,
  MapChart,
]);

export type VisualizationInteractionHandler = (params: unknown) => void;

export interface VisualizationProps {
  model: ContractVisualizationRenderModel;
  className?: string;
  height?: number;
  onDataPointPress?: VisualizationInteractionHandler;
}

export function Visualization({
  model,
  className,
  height = 280,
  onDataPointPress,
}: VisualizationProps) {
  const chartRef = React.useRef<HTMLDivElement | null>(null);
  const option = React.useMemo(
    () => buildVisualizationEChartsOption(model),
    [model]
  );

  React.useEffect(() => {
    if (!shouldRenderEChart(model) || !chartRef.current) return;

    registerGeoMap(model);

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "canvas",
    });
    chart.setOption(option);
    if (onDataPointPress) {
      chart.on("click", onDataPointPress);
    }

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartRef.current);

    return () => {
      observer.disconnect();
      if (onDataPointPress) {
        chart.off("click", onDataPointPress);
      }
      chart.dispose();
    };
  }, [model, onDataPointPress, option]);

  if (model.kind === "metric") {
    return <MetricVisualization className={className} model={model} />;
  }

  if (model.kind === "geo" && model.geo?.mode === "slippy-map") {
    return (
      <MapVisualization className={className} height={height} model={model} />
    );
  }

  if (model.kind === "geo" && model.geo?.geoJson?.type === "url") {
    return (
      <FallbackVisualization
        className={className}
        model={model}
        reason="Geo URL sources currently fall back to the summary table."
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <VisuallyHidden>{model.summary}</VisuallyHidden>
      <div
        ref={chartRef}
        aria-label={model.summary}
        className="w-full rounded-md"
        style={{ height }}
      />
      <TableAlternative model={model} />
    </div>
  );
}

function MapVisualization({
  className,
  height,
  model,
}: {
  className?: string;
  height: number;
  model: ContractVisualizationRenderModel;
}) {
  const markers = model.series.flatMap((series) =>
    series.points
      .filter((point) => point.latitude != null && point.longitude != null)
      .map((point) => ({
        id: point.id,
        lat: point.latitude as number,
        lng: point.longitude as number,
        ariaLabel: point.name,
      }))
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div style={{ height }}>
        <MapBase>
          {markers.length > 0 ? <MapMarkers points={markers} /> : null}
          {model.geo?.geoJson?.type === "inline" ? (
            <MapGeoJsonOverlay data={model.geo.geoJson.data as never} />
          ) : null}
        </MapBase>
      </div>
      <TableAlternative model={model} />
    </div>
  );
}
