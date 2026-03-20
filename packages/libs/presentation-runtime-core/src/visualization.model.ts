import type { VisualizationSpec } from "@contractspec/lib.contracts-spec/visualizations";
import { resolveVisualizationRows } from "./visualization.utils";
import type { ContractVisualizationRenderModel } from "./visualization.types";
import {
  createVisualizationBaseModel,
  createVisualizationMaps,
} from "./visualization.model.helpers";
import {
  buildCartesianModel,
  buildDistributionModel,
  buildGeoModel,
  buildHeatmapModel,
  buildMetricModel,
} from "./visualization.model.builders";

export function createVisualizationModel(
  spec: VisualizationSpec,
  data: unknown
): ContractVisualizationRenderModel {
  const rows = resolveVisualizationRows(data, spec.source.resultPath);
  const maps = createVisualizationMaps(spec);
  const base = createVisualizationBaseModel(spec, rows, maps);

  switch (spec.visualization.kind) {
    case "metric":
      return buildMetricModel(base, spec.visualization, rows, maps);
    case "cartesian":
      return buildCartesianModel(base, spec.visualization, rows, maps);
    case "pie":
    case "funnel":
      return buildDistributionModel(base, spec.visualization, rows, maps);
    case "heatmap":
      return buildHeatmapModel(base, spec.visualization, rows, maps);
    case "geo":
      return buildGeoModel(base, spec.visualization, rows, maps);
  }
}
