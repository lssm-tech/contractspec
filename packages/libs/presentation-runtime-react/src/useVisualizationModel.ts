import * as React from "react";
import type { VisualizationSpec } from "@contractspec/lib.contracts-spec/visualizations";
import {
  createVisualizationModel,
  type ContractVisualizationRenderModel,
} from "@contractspec/lib.presentation-runtime-core";

export interface UseVisualizationModelOptions {
  spec: VisualizationSpec;
  data: unknown;
}

export function useVisualizationModel({
  spec,
  data,
}: UseVisualizationModelOptions): ContractVisualizationRenderModel {
  return React.useMemo(() => createVisualizationModel(spec, data), [data, spec]);
}
